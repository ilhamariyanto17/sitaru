import { Home, Building2, Leaf, Fence, Waves, Ruler, CheckCircle2, AlertTriangle, XCircle, MinusCircle } from 'lucide-react';

const ICONS = { home: Home, building: Building2, leaf: Leaf, fence: Fence, waves: Waves, ruler: Ruler };

const STATUS = {
  sesuai: { label: 'Sesuai', badge: 'bg-good/15 text-good', icon: CheckCircle2 },
  verifikasi: { label: 'Perlu Verifikasi', badge: 'bg-warn/15 text-warn', icon: AlertTriangle },
  tidak_sesuai: { label: 'Tidak Sesuai', badge: 'bg-bad/15 text-bad', icon: XCircle },
  kosong: { label: 'Belum Dipilih', badge: 'bg-card2 text-csub', icon: MinusCircle },
};

/* ---------------------------------------------------------------------- */
/* Ilustrasi mini per-parameter (SVG flat, mengikuti palet tema terang).  */
/* ---------------------------------------------------------------------- */

function IllustKDB({ ok }) {
  const fill = ok ? '#22c55e' : '#ef4444';
  return (
    <svg viewBox="0 0 140 84" className="w-full h-[74px]">
      <rect x="4" y="4" width="132" height="76" rx="8" fill="#f1f4f9" stroke="#e3e7ee" />
      {/* garis kavling */}
      <rect x="16" y="14" width="108" height="56" rx="3" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />
      {/* footprint bangunan (hijau/merah = sesuai/tidak) */}
      <path d="M28 24 H92 V44 H108 V60 H28 Z" fill={fill} fillOpacity="0.22" stroke={fill} strokeWidth="1.6" />
      <path d="M28 24 H92 V44 H108 V60 H28 Z" fill="url(#hatchKDB)" />
      <defs>
        <pattern id="hatchKDB" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="6" stroke={fill} strokeOpacity="0.35" strokeWidth="1.4" />
        </pattern>
      </defs>
    </svg>
  );
}

function IllustKLB({ ok }) {
  const fill = ok ? '#3b82f6' : '#ef4444';
  const floors = [0, 1, 2, 3];
  return (
    <svg viewBox="0 0 140 84" className="w-full h-[74px]">
      <rect x="4" y="4" width="132" height="76" rx="8" fill="#f1f4f9" stroke="#e3e7ee" />
      {floors.map((i) => {
        const y = 60 - i * 12;
        return (
          <polygon
            key={i}
            points={`${34},${y} ${106},${y} ${94},${y - 9} ${22},${y - 9}`}
            fill={fill}
            fillOpacity={0.16 + i * 0.1}
            stroke={fill}
            strokeWidth="1.3"
          />
        );
      })}
    </svg>
  );
}

function IllustKDH({ ok }) {
  const fill = ok ? '#22c55e' : '#ef4444';
  return (
    <svg viewBox="0 0 140 84" className="w-full h-[74px]">
      <rect x="4" y="4" width="132" height="76" rx="8" fill="#f1f4f9" stroke="#e3e7ee" />
      <rect x="16" y="14" width="108" height="56" rx="3" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />
      {/* area hijau (RTH) mendominasi kavling */}
      <rect x="16" y="14" width="108" height="56" rx="3" fill={fill} fillOpacity="0.18" />
      <rect x="16" y="14" width="108" height="56" rx="3" fill="url(#hatchKDH)" />
      {/* footprint bangunan kecil di sudut */}
      <rect x="82" y="42" width="34" height="22" fill="#94a3b8" fillOpacity="0.5" stroke="#64748b" strokeWidth="1.2" />
      <defs>
        <pattern id="hatchKDH" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="6" stroke={fill} strokeOpacity="0.4" strokeWidth="1.4" />
        </pattern>
      </defs>
    </svg>
  );
}

function IllustGSB({ ok }) {
  const fill = ok ? '#22c55e' : '#ef4444';
  return (
    <svg viewBox="0 0 140 84" className="w-full h-[84px]">
      <rect x="4" y="4" width="132" height="76" rx="8" fill="#f1f4f9" stroke="#e3e7ee" />
      {/* jalan */}
      <rect x="10" y="60" width="120" height="14" fill="#cbd5e1" />
      <line x1="10" y1="67" x2="130" y2="67" stroke="#f1f4f9" strokeWidth="1.5" strokeDasharray="4 4" />
      {/* garis sempadan */}
      <line x1="10" y1="46" x2="130" y2="46" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="3 3" />
      {/* massa bangunan */}
      <rect x="34" y="18" width="72" height="28" fill={fill} fillOpacity="0.2" stroke={fill} strokeWidth="1.6" />
      {/* panah jarak GSB */}
      <line x1="70" y1="46" x2="70" y2="60" stroke="#64748b" strokeWidth="1.3" markerEnd="url(#arrGSB)" markerStart="url(#arrGSB)" />
      <defs>
        <marker id="arrGSB" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
        </marker>
      </defs>
    </svg>
  );
}

function IllustGSS({ ok }) {
  const fill = ok ? '#22c55e' : '#ef4444';
  return (
    <svg viewBox="0 0 140 84" className="w-full h-[84px]">
      <rect x="4" y="4" width="132" height="76" rx="8" fill="#f1f4f9" stroke="#e3e7ee" />
      {/* sungai/saluran */}
      <path d="M10 74 Q30 58 55 66 T110 60 Q120 58 130 62 V80 H10 Z" fill="#60a5fa" fillOpacity="0.35" />
      <path d="M10 74 Q30 58 55 66 T110 60 Q120 58 130 62" fill="none" stroke="#3b82f6" strokeWidth="1.4" />
      {/* garis sempadan */}
      <line x1="10" y1="42" x2="130" y2="42" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="3 3" />
      {/* massa bangunan */}
      <rect x="34" y="12" width="72" height="26" fill={fill} fillOpacity="0.2" stroke={fill} strokeWidth="1.6" />
      {/* panah jarak GSS */}
      <line x1="70" y1="42" x2="70" y2="58" stroke="#64748b" strokeWidth="1.3" markerEnd="url(#arrGSS)" markerStart="url(#arrGSS)" />
      <defs>
        <marker id="arrGSS" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
        </marker>
      </defs>
    </svg>
  );
}

function IllustTinggi({ ok }) {
  const fill = ok ? '#f59e0b' : '#ef4444';
  const rows = [0, 1, 2, 3, 4];
  return (
    <svg viewBox="0 0 140 84" className="w-full h-[84px]">
      <rect x="4" y="4" width="132" height="76" rx="8" fill="#f1f4f9" stroke="#e3e7ee" />
      {/* tanah */}
      <rect x="10" y="72" width="90" height="4" fill="#cbd5e1" />
      {/* gedung */}
      <rect x="24" y="14" width="62" height="58" fill={fill} fillOpacity="0.18" stroke={fill} strokeWidth="1.6" />
      {rows.map((i) => (
        <line key={i} x1="24" y1={14 + (i + 1) * 9.6} x2="86" y2={14 + (i + 1) * 9.6} stroke={fill} strokeOpacity="0.35" strokeWidth="1" />
      ))}
      {/* garis tinggi dimensi */}
      <line x1="104" y1="14" x2="104" y2="72" stroke="#64748b" strokeWidth="1.3" markerEnd="url(#arrT)" markerStart="url(#arrT)" />
      <line x1="99" y1="14" x2="109" y2="14" stroke="#64748b" strokeWidth="1.2" />
      <line x1="99" y1="72" x2="109" y2="72" stroke="#64748b" strokeWidth="1.2" />
      <defs>
        <marker id="arrT" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
        </marker>
      </defs>
    </svg>
  );
}

const ILLUSTRATIONS = {
  kdb: IllustKDB,
  klb: IllustKLB,
  kdh: IllustKDH,
  gsb: IllustGSB,
  gss: IllustGSS,
  tinggi: IllustTinggi,
};

export default function IntensitasRincianCard({ param }) {
  const Icon = ICONS[param.icon] || Home;
  const s = STATUS[param.status] || STATUS.sesuai;
  const StatusIcon = s.icon;
  const Illust = ILLUSTRATIONS[param.key];
  const isOk = param.status === 'sesuai';
  const isEmpty = param.status === 'kosong';

  return (
    <div className={`bg-card border border-cborder rounded-xl px-3.5 py-3 shadow-card flex flex-col gap-2.5 min-w-0 h-full ${isEmpty ? 'opacity-60' : ''}`}>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0">
          <Icon size={14} />
        </div>
        <div className="min-w-0">
          <div className="text-[12px] font-semibold text-cink truncate">
            {param.no}. {param.label}
          </div>
          <div className="text-[10.5px] text-csub truncate">{param.deskripsi}</div>
        </div>
      </div>

      {Illust && !isEmpty && (
        <div className="rounded-lg overflow-hidden border border-cborder/60">
          <Illust ok={isOk} />
        </div>
      )}
      {isEmpty && (
        <div className="rounded-lg border border-dashed border-cborder h-[74px] flex items-center justify-center text-[10.5px] text-csub">
          Belum ada data
        </div>
      )}

      <div className="space-y-1">
        {(isEmpty ? [] : param.rincian).map((r) => (
          <div key={r.label} className="flex items-center justify-between text-[11px] gap-2">
            <span className="text-csub truncate">{r.label}</span>
            <span className="text-cink font-medium shrink-0">{r.value}</span>
          </div>
        ))}
      </div>

      <div className="text-[10.5px] text-csub/80 leading-snug border-t border-cborder pt-2 mt-auto">
        {isEmpty ? '—' : param.formula}
      </div>

      <span className={`inline-flex self-start items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-medium ${s.badge}`}>
        <StatusIcon size={11} />
        {s.label}
      </span>
    </div>
  );
}