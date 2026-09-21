import MainLayout from '../layouts/MainLayout';
import StatCard from '../components/StatCard';
import Card from '../components/Card';
import MapView from '../components/MapView';
import RingkasanDonut from '../components/RingkasanDonut';
import ParameterBars from '../components/ParameterBars';
import PelanggaranTerbanyak from '../components/PelanggaranTerbanyak';
import PelanggaranTerbaru from '../components/PelanggaranTerbaru';
import IndikatorAktual from '../components/IndikatorAktual';
import TrenChart from '../components/TrenChart';
import KelurahanTable from '../components/KelurahanTable';
import { statCards } from '../data/dummyData';

export default function Beranda() {
  return (
    <MainLayout
      title="Monitoring Kesesuaian Tata Bangunan dan Pemanfaatan Ruang"
      subtitle="Kawasan Jetis"
    >
      <div className="flex flex-col gap-3">
        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          {statCards.map(({ key, ...s }) => (
            <StatCard key={key} {...s} />
          ))}
        </div>

        {/* Peta + panel kanan — sekarang tanpa scroll di panel kanan.
            Tinggi kolom peta mengikuti tinggi natural panel kanan (grid
            stretch bawaan CSS), bukan angka fix + overflow-auto seperti
            sebelumnya. MapView sendiri sudah punya batas minimum 480px di
            komponennya, jadi tetap enak dilihat walau kontennya sedikit. */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3">
          <div className="xl:col-span-8 h-[360px] xl:h-auto">
            <MapView />
          </div>

          <div className="xl:col-span-4 flex flex-col gap-3">
            <Card title="Ringkasan Kesesuaian (Persentase)">
              <RingkasanDonut />
            </Card>
            <Card title="Kesesuaian per Parameter">
              <ParameterBars />
            </Card>
            <div className="grid grid-cols-2 gap-3">
              <Card title="Pelanggaran Terbanyak">
                <PelanggaranTerbanyak />
              </Card>
              <Card title="Pelanggaran Terbaru">
                <PelanggaranTerbaru />
              </Card>
            </div>
          </div>
        </div>

        {/* Detail Indikator, Tren & Kesesuaian per Kelurahan — selalu
            tampil langsung, tidak pakai tombol buka/tutup lagi. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pb-2">
          <Card title="Indikator Rata-rata Aktual" className="lg:col-span-3">
            <IndikatorAktual />
          </Card>
          <Card title="Tren Kesesuaian (6 Bulan Terakhir)" className="lg:col-span-5 h-[300px]">
            <TrenChart />
          </Card>
          <Card title="Kesesuaian per Kelurahan" className="lg:col-span-4 h-[300px]">
            <KelurahanTable />
          </Card>
        </div>

        <p className="text-[11px] text-csub text-center pb-2">
          Data bersifat indikatif berdasarkan hasil analisis geospasial. Untuk kepastian hukum, mengacu
          pada ketentuan RDTR Kota Yogyakarta dan peraturan perundang-undangan yang berlaku.
        </p>
      </div>
    </MainLayout>
  );
}