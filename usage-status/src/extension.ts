import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

interface Sample {
  t: number;
  org: string;
  u: { fh: number; sd: number };
}

interface HistoryFile {
  version: number;
  samples: Sample[];
}

const USAGE_FILE = path.join(
  os.homedir(),
  'Library',
  'Application Support',
  'Claude',
  'plan-usage-history.json'
);

const FIVE_HOURS_MS = 5 * 60 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const POLL_FALLBACK_MS = 30_000;

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

/** Green at 0%, amber at 50%, red at 100% — hue sweeps 120° (green) down to 0° (red). */
function pctToColor(pct: number): string {
  const hue = 120 - (clamp(pct, 0, 100) / 100) * 120;
  return `hsl(${hue.toFixed(0)}, 80%, 45%)`;
}

function downsample<T>(items: T[], maxPoints: number): T[] {
  if (items.length <= maxPoints) {
    return items;
  }
  const step = items.length / maxPoints;
  const out: T[] = [];
  for (let i = 0; i < maxPoints; i++) {
    out.push(items[Math.floor(i * step)]);
  }
  return out;
}

function readHistory(): HistoryFile | undefined {
  try {
    const raw = fs.readFileSync(USAGE_FILE, 'utf8');
    return JSON.parse(raw) as HistoryFile;
  } catch {
    return undefined;
  }
}

function samplesSince(samples: Sample[], sinceMs: number): Sample[] {
  return samples.filter((s) => s.t >= sinceMs);
}

/**
 * Estimates when the current window started by scanning backward for the most
 * recent 0 -> nonzero transition, then returns that start time + windowMs.
 * Undefined if the window is currently at 0 (nothing counting down yet) or no
 * transition is found in the available history.
 */
function estimateWindowClose(
  samples: Sample[],
  key: 'fh' | 'sd',
  windowMs: number
): number | undefined {
  if (samples.length === 0) {
    return undefined;
  }
  const latest = samples[samples.length - 1];
  if (latest.u[key] === 0) {
    return undefined;
  }
  for (let i = samples.length - 2; i >= 0; i--) {
    if (samples[i].u[key] === 0 && samples[i + 1].u[key] > 0) {
      const startEstimate = (samples[i].t + samples[i + 1].t) / 2;
      return startEstimate + windowMs;
    }
  }
  return undefined;
}

function formatCountdown(remainingMs: number | undefined): string {
  if (remainingMs === undefined) {
    return '';
  }
  if (remainingMs <= 0) {
    return ' est. due now';
  }
  const totalMinutes = Math.round(remainingMs / 60_000);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  const parts: string[] = [];
  if (days > 0) {
    parts.push(`${days}d`);
  }
  if (days > 0 || hours > 0) {
    parts.push(`${hours}hr`);
  }
  parts.push(`${minutes}min`);
  return ` est. ${parts.join(' ')}`;
}

class UsageController {
  private sessionItem: vscode.StatusBarItem;
  private weeklyItem: vscode.StatusBarItem;
  private fsWatcher: fs.FSWatcher | undefined;
  private pollHandle: NodeJS.Timeout | undefined;
  private latest: HistoryFile | undefined;

  constructor(private context: vscode.ExtensionContext) {
    this.sessionItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    this.weeklyItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99);
    this.sessionItem.command = 'claudeUsageStatus.openDetail';
    this.weeklyItem.command = 'claudeUsageStatus.openDetail';
    context.subscriptions.push(this.sessionItem, this.weeklyItem);
  }

  start(): void {
    this.refresh();
    this.watch();
    this.sessionItem.show();
    this.weeklyItem.show();
  }

  private watch(): void {
    const dir = path.dirname(USAGE_FILE);
    try {
      this.fsWatcher = fs.watch(dir, (_event, filename) => {
        if (filename === path.basename(USAGE_FILE)) {
          this.refresh();
        }
      });
    } catch {
      // Directory may not exist yet (Claude desktop app never installed/run) —
      // fall back to polling only, refresh() already handles a missing file.
    }
    this.pollHandle = setInterval(() => this.refresh(), POLL_FALLBACK_MS);
  }

  private refresh(): void {
    const history = readHistory();
    this.latest = history;
    const samples = history?.samples ?? [];

    if (samples.length === 0) {
      this.sessionItem.text = '✳ H: no data';
      this.sessionItem.tooltip = `Waiting for ${USAGE_FILE}\n(Open the Claude desktop app at least once.)`;
      this.sessionItem.color = undefined;
      this.weeklyItem.text = '';
      this.weeklyItem.color = undefined;
      return;
    }

    const now = Date.now();
    const latest = samples[samples.length - 1];

    const sessionClose = estimateWindowClose(samples, 'fh', FIVE_HOURS_MS);
    const weeklyClose = estimateWindowClose(samples, 'sd', SEVEN_DAYS_MS);
    const sessionCountdown = formatCountdown(sessionClose === undefined ? undefined : sessionClose - now);
    const weeklyCountdown = formatCountdown(weeklyClose === undefined ? undefined : weeklyClose - now);

    this.sessionItem.text = `✳ H ${latest.u.fh}%${sessionCountdown}`;
    this.weeklyItem.text = `✳ W ${latest.u.sd}%${weeklyCountdown}`;
    this.sessionItem.color = pctToColor(latest.u.fh);
    this.weeklyItem.color = pctToColor(latest.u.sd);

    const updated = new Date(latest.t).toLocaleTimeString();
    this.sessionItem.tooltip = new vscode.MarkdownString(
      `**Session window (rolling 5h)**\n\n${latest.u.fh}% used\n\nEstimated reset:${sessionCountdown || ' unknown'}\n\n*(estimated from usage history, not Anthropic's own reset clock)*\n\nLast updated: ${updated}`
    );
    this.weeklyItem.tooltip = new vscode.MarkdownString(
      `**Weekly window (rolling 7d)**\n\n${latest.u.sd}% used\n\nEstimated reset:${weeklyCountdown || ' unknown'}\n\n*(estimated from usage history, not Anthropic's own reset clock)*\n\nLast updated: ${updated}`
    );
  }

  getLatestHistory(): HistoryFile | undefined {
    return this.latest ?? readHistory();
  }

  dispose(): void {
    this.fsWatcher?.close();
    if (this.pollHandle) {
      clearInterval(this.pollHandle);
    }
  }
}

function renderSvgChart(
  samples: Sample[],
  key: 'fh' | 'sd',
  sinceMs: number,
  title: string
): string {
  const points = downsample(samplesSince(samples, sinceMs), 80);
  const width = 640;
  const height = 160;
  const pad = 24;

  if (points.length < 2) {
    return `<h3>${title}</h3><p>Not enough data yet.</p>`;
  }

  const tMin = points[0].t;
  const tMax = points[points.length - 1].t;
  const tSpan = Math.max(1, tMax - tMin);

  const coords = points.map((s) => {
    const x = pad + ((s.t - tMin) / tSpan) * (width - 2 * pad);
    const y = height - pad - (clamp(s.u[key], 0, 100) / 100) * (height - 2 * pad);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const polyline = coords.join(' ');
  const areaPoints = `${pad},${height - pad} ${polyline} ${width - pad},${height - pad}`;
  const gradientId = `usageGradient-${key}`;

  return `
    <h3>${title}</h3>
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="${gradientId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f85149" />
          <stop offset="50%" stop-color="#e3b341" />
          <stop offset="100%" stop-color="#3fb950" />
        </linearGradient>
      </defs>
      <line x1="${pad}" y1="${height - pad}" x2="${width - pad}" y2="${height - pad}" stroke="var(--vscode-panel-border)" />
      <line x1="${pad}" y1="${pad}" x2="${width - pad}" y2="${pad}" stroke="var(--vscode-panel-border)" stroke-dasharray="2,4" />
      <polygon points="${areaPoints}" fill="url(#${gradientId})" fill-opacity="0.18" stroke="none" />
      <polyline points="${polyline}" fill="none" stroke="url(#${gradientId})" stroke-width="2.5" />
    </svg>
  `;
}

function openDetailPanel(controller: UsageController): void {
  const panel = vscode.window.createWebviewPanel(
    'claudeUsageDetail',
    'Claude Usage Detail',
    vscode.ViewColumn.Beside,
    {}
  );

  const history = controller.getLatestHistory();
  const samples = history?.samples ?? [];
  const now = Date.now();

  const sessionChart = renderSvgChart(samples, 'fh', now - FIVE_HOURS_MS, 'Session window (trailing 5h)');
  const weeklyChart = renderSvgChart(samples, 'sd', now - SEVEN_DAYS_MS, 'Weekly window (trailing 7d)');

  panel.webview.html = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: var(--vscode-font-family); color: var(--vscode-foreground); padding: 1rem;">
        ${sessionChart}
        ${weeklyChart}
      </body>
    </html>
  `;
}

export function activate(context: vscode.ExtensionContext): void {
  const controller = new UsageController(context);
  controller.start();
  context.subscriptions.push({ dispose: () => controller.dispose() });

  context.subscriptions.push(
    vscode.commands.registerCommand('claudeUsageStatus.openDetail', () =>
      openDetailPanel(controller)
    )
  );
}

export function deactivate(): void {
  // Cleanup handled via context.subscriptions in activate().
}
