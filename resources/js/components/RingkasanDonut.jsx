import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ringkasanKesesuaian } from '../data/dummyData';

export default function RingkasanDonut() {
  const total = ringkasanKesesuaian.reduce((s, d) => s + Number(d.count.replace('.', '')), 0);

  return (
    <div className="p-4">
      <div className="flex items-center gap-4">
        <div className="w-[110px] h-[110px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ringkasanKesesuaian}
                dataKey="value"
                innerRadius={34}
                outerRadius={52}
                paddingAngle={2}
                stroke="none"
              >
                {ringkasanKesesuaian.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-2 text-[12px]">
          {ringkasanKesesuaian.map((d) => (
            <div key={d.name} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-csub">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: d.color }} />
                {d.name}
              </div>
              <div className="text-right shrink-0">
                <span className="font-semibold text-cink">{d.value.toString().replace('.', ',')}%</span>
                <span className="text-csub ml-1">({d.count})</span>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between pt-2 mt-1 border-t border-cborder">
            <span className="text-csub">Total</span>
            <span className="font-semibold text-cink">100% ({total.toLocaleString('id-ID')})</span>
          </div>
        </div>
      </div>
    </div>
  );
}