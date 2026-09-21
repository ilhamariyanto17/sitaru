import { useEffect, useState } from 'react';
import { CloudSun, User } from 'lucide-react';

const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

function formatTanggal(d) {
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}
function formatJam(d) {
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m} WIB`;
}

export default function Topbar({ title, subtitle }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="h-14 shrink-0 border-b border-border bg-panel flex items-center px-4 gap-4">
      <div className="flex items-center gap-2.5 pr-4 border-r border-border h-full shrink-0">
        <div className="w-8 h-8 rounded-full bg-good/20 border border-good/40 flex items-center justify-center text-good font-bold text-xs">
          KY
        </div>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold text-ink">Kota Yogyakarta</div>
          <div className="text-[11px] text-muted">Dashboard Pemanfaatan Ruang</div>
        </div>
      </div>

      <div className="flex-1 min-w-0 px-1">
        <div className="text-[15px] font-semibold text-ink truncate">{title}</div>
        {subtitle && <div className="text-[11px] text-muted truncate">{subtitle}</div>}
      </div>

      <div className="flex items-center gap-4 shrink-0 text-[12px]">
        <div className="text-right leading-tight text-muted hidden sm:block">
          <div>{formatTanggal(now)}</div>
          <div>{formatJam(now)}</div>
        </div>

        <div className="flex items-center gap-2 pl-4 border-l border-border h-8 hidden md:flex">
          <CloudSun size={20} className="text-warn" />
          <div className="leading-tight">
            <div className="font-semibold text-ink">30°C</div>
            <div className="text-muted text-[11px]">Cerah Berawan</div>
          </div>
        </div>

        <div className="flex items-center gap-2 pl-4 border-l border-border h-8">
          <div className="w-8 h-8 rounded-full bg-panel2 border border-border flex items-center justify-center">
            <User size={16} className="text-muted" />
          </div>
          <div className="leading-tight hidden sm:block">
            <div className="font-medium text-ink text-[12px]">Admin</div>
            <div className="text-muted text-[11px]">Dinas Tata Ruang</div>
          </div>
        </div>
      </div>
    </header>
  );
}
