import { LayoutGrid, Building2, CheckCircle2, XCircle, AlertTriangle, TrendingUp } from 'lucide-react';

const ICONS = {
  grid: LayoutGrid,
  building: Building2,
  check: CheckCircle2,
  x: XCircle,
  alert: AlertTriangle,
  trend: TrendingUp,
};

const TONES = {
  good: { bg: 'bg-good/15', ring: 'text-good' },
  bad: { bg: 'bg-bad/15', ring: 'text-bad' },
  warn: { bg: 'bg-warn/15', ring: 'text-warn' },
  accent: { bg: 'bg-accent/15', ring: 'text-accent' },
};

export default function StatCard({ label, value, unit, extra, icon, tone }) {
  const Icon = ICONS[icon] || LayoutGrid;
  const t = TONES[tone] || TONES.accent;

  return (
    <div className="bg-card border border-cborder rounded-xl px-4 py-3 flex items-center gap-3 shadow-card min-w-0">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${t.bg} ${t.ring}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <div className="text-[12px] text-csub truncate">{label}</div>
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-lg font-bold text-cink">{value}</span>
          {unit && <span className="text-[11px] text-csub">{unit}</span>}
          {extra && <span className={`text-[12px] font-medium ${t.ring}`}>{extra}</span>}
        </div>
      </div>
    </div>
  );
}