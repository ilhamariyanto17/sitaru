import { Home, Building2, Leaf, Fence, Waves, Ruler, CheckCircle2, AlertTriangle, XCircle, MinusCircle } from 'lucide-react';

const ICONS = { home: Home, building: Building2, leaf: Leaf, fence: Fence, waves: Waves, ruler: Ruler };

const STATUS = {
  sesuai: { label: 'Sesuai', badge: 'bg-good/15 text-good', bar: 'bg-good', icon: CheckCircle2 },
  verifikasi: { label: 'Perlu Verifikasi', badge: 'bg-warn/15 text-warn', bar: 'bg-warn', icon: AlertTriangle },
  tidak_sesuai: { label: 'Tidak Sesuai', badge: 'bg-bad/15 text-bad', bar: 'bg-bad', icon: XCircle },
  kosong: { label: 'Belum Dipilih', badge: 'bg-card2 text-csub', bar: 'bg-card2', icon: MinusCircle },
};

export default function IntensitasCard({ param }) {
  const Icon = ICONS[param.icon] || Home;
  const s = STATUS[param.status] || STATUS.sesuai;
  const StatusIcon = s.icon;
  const isEmpty = param.status === 'kosong';

  return (
    <div className={`bg-card border border-cborder rounded-xl px-4 py-3.5 shadow-card flex flex-col gap-2.5 min-w-0 ${isEmpty ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[11.5px] text-csub truncate">
            {param.no}. {param.label}
          </div>
          <div className="text-[11px] text-csub/70 truncate">{param.deskripsi}</div>
        </div>
        <div className="w-8 h-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0">
          <Icon size={16} />
        </div>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold text-cink">
          {isEmpty ? '–' : param.valueLabel ?? `${param.value}`.replace('.', ',')}
        </span>
        {!isEmpty && param.unit && <span className="text-[12px] text-csub">{param.unit}</span>}
      </div>
      <div className="text-[11px] text-csub -mt-1.5">{isEmpty ? 'Belum ada data' : param.batasLabel}</div>

      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-medium shrink-0 ${s.badge}`}>
          <StatusIcon size={11} />
          {s.label}
        </span>
        <div className="flex-1 h-1.5 rounded-full bg-card2 overflow-hidden">
          <div
            className={`h-full rounded-full ${s.bar}`}
            style={{ width: `${isEmpty ? 0 : Math.min(100, Math.round(param.progress * 100))}%` }}
          />
        </div>
      </div>
    </div>
  );
}