import { Building } from 'lucide-react';
import { pelanggaranTerbaru } from '../data/dummyData';

export default function PelanggaranTerbaru() {
  return (
    <div className="p-4 space-y-3">
      {pelanggaranTerbaru.map((p) => (
        <div key={p.id} className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-lg bg-card2 border border-cborder flex items-center justify-center shrink-0 text-csub">
            <Building size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[13px] font-medium text-cink">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${p.severity === 'bad' ? 'bg-bad' : 'bg-warn'}`} />
              <span className="truncate">{p.tipe}</span>
            </div>
            <div className="text-[11.5px] text-csub truncate">{p.alamat}</div>
            <div className="text-[11.5px] text-csub truncate">{p.kelurahan}</div>
          </div>
          <span className="text-[10.5px] text-csub whitespace-nowrap shrink-0">{p.waktu}</span>
        </div>
      ))}
      <button className="text-[12px] text-accent hover:underline pt-1">Lihat Semua Pelanggaran</button>
    </div>
  );
}