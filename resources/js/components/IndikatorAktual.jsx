import { Home, Building2, Leaf, Ruler } from 'lucide-react';
import { indikatorAktual } from '../data/dummyData';

const ICONS = { home: Home, building: Building2, leaf: Leaf, ruler: Ruler };
const TONES = ['text-accent bg-accent/15', 'text-good bg-good/15', 'text-warn bg-warn/15', 'text-bad bg-bad/15'];

export default function IndikatorAktual() {
  return (
    <div className="p-4 space-y-3">
      {indikatorAktual.map((it, i) => {
        const Icon = ICONS[it.icon];
        return (
          <div key={it.key} className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${TONES[i % TONES.length]}`}>
              <Icon size={17} />
            </div>
            <div className="flex-1 text-[12.5px] text-csub">{it.label}</div>
            <div className="text-right">
              <div className="text-[14px] font-semibold text-cink leading-tight">{it.value}</div>
              <div className="text-[10.5px] text-csub leading-tight">{it.max}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}