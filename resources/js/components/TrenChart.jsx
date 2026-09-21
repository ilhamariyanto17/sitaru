import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { trenKesesuaian } from '../data/dummyData';

function TooltipBox({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-cborder rounded-md px-3 py-2 text-[11.5px] shadow-card">
      <div className="text-csub mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-1.5" style={{ color: p.color }}>
          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: p.color }} />
          {p.value}%
        </div>
      ))}
    </div>
  );
}

export default function TrenChart() {
  return (
    <div className="p-3 h-full min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trenKesesuaian} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e3e7ee" vertical={false} />
          <XAxis dataKey="bulan" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#e3e7ee' }} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
          <Tooltip content={<TooltipBox />} />
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: 12, color: '#64748b' }}
            formatter={(v) => ({ sesuai: 'Sesuai', tidakSesuai: 'Tidak Sesuai', verifikasi: 'Perlu Verifikasi' }[v] || v)}
          />
          <Line type="monotone" dataKey="sesuai" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="tidakSesuai" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="verifikasi" stroke="#f2b90c" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}