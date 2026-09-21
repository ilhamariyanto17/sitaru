import { kesesuaianPerKelurahan } from '../data/dummyData';

function fmt(n) {
  return n.toString().replace('.', ',') + '%';
}

export default function KelurahanTable() {
  return (
    <div className="flex flex-col h-full">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="text-csub text-left border-b border-cborder">
              <th className="py-2 px-4 font-medium">Kelurahan</th>
              <th className="py-2 px-2 font-medium text-right">Sesuai</th>
              <th className="py-2 px-2 font-medium text-right">Tidak Sesuai</th>
              <th className="py-2 px-4 font-medium text-right">Perlu Verifikasi</th>
            </tr>
          </thead>
          <tbody>
            {kesesuaianPerKelurahan.map((row) => (
              <tr key={row.kelurahan} className="border-b border-cborder/60 last:border-0">
                <td className="py-2.5 px-4 text-cink">{row.kelurahan}</td>
                <td className="py-2.5 px-2 text-right text-good font-medium">{fmt(row.sesuai)}</td>
                <td className="py-2.5 px-2 text-right text-bad font-medium">{fmt(row.tidakSesuai)}</td>
                <td className="py-2.5 px-4 text-right text-warn font-medium">{fmt(row.verifikasi)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2.5 border-t border-cborder">
        <button className="text-[12px] text-accent hover:underline">Lihat Semua</button>
      </div>
    </div>
  );
}