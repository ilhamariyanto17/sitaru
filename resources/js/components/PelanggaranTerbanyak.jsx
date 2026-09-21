import { pelanggaranTerbanyak } from '../data/dummyData';

export default function PelanggaranTerbanyak() {
  return (
    <div className="p-4 space-y-2.5">
      {pelanggaranTerbanyak.map((p, i) => (
        <div key={p.label} className="flex items-center justify-between text-[13px]">
          <div className="flex items-center gap-2.5 text-cink">
            <span className="text-csub w-4">{i + 1}.</span>
            {p.label}
          </div>
          <span className="text-bad font-semibold">{p.value.toLocaleString('id-ID')}</span>
        </div>
      ))}
    </div>
  );
}