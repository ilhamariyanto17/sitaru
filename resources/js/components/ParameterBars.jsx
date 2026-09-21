import { kesesuaianPerParameter } from '../data/dummyData';

export default function ParameterBars() {
  return (
    <div className="p-4 space-y-2.5">
      {kesesuaianPerParameter.map((row) => (
        <div key={row.parameter} className="flex items-center gap-3">
          <div className="w-[64px] text-[12px] text-csub shrink-0">{row.parameter}</div>
          <div className="flex-1 h-3.5 rounded-full overflow-hidden flex bg-card2">
            <div style={{ width: `${row.sesuai}%` }} className="bg-good h-full" />
            <div style={{ width: `${row.verifikasi}%` }} className="bg-warn h-full" />
            <div style={{ width: `${row.tidakSesuai}%` }} className="bg-bad h-full" />
          </div>
        </div>
      ))}
      <div className="flex justify-between text-[10px] text-csub pt-1 pl-[76px]">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
    </div>
  );
}