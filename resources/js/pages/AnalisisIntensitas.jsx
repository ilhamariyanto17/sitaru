import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FileText, Info, MapPin, X, MousePointerClick } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/Card';
import MapView from '../components/MapView';
import IntensitasCard from '../components/IntensitasCard';
import IntensitasRincianCard from '../components/IntensitasRincianCard';
import { kawasan } from '../data/dummyData';
import { generateBuildingFeatures, buildPersilAnalysis } from '../data/generateBuildings';

const PERSIL_STATUS_BADGE = {
  Sesuai: 'bg-good/15 text-good',
  'Tidak Sesuai': 'bg-bad/15 text-bad',
  'Perlu Verifikasi': 'bg-warn/15 text-warn',
  'Belum Dipilih': 'bg-card2 text-csub',
};

// Meta (label/ikon/urutan) parameter — dipakai untuk membangun kartu kosong
// ketika belum ada persil yang dipilih dari peta.
const PARAM_META = [
  { key: 'kdb', no: 1, label: 'KDB', deskripsi: 'Koefisien Dasar Bangunan', icon: 'home' },
  { key: 'klb', no: 2, label: 'KLB', deskripsi: 'Koefisien Lantai Bangunan', icon: 'building' },
  { key: 'kdh', no: 3, label: 'KDH', deskripsi: 'Koefisien Dasar Hijau', icon: 'leaf' },
  { key: 'gsb', no: 4, label: 'GSB', deskripsi: 'Garis Sempadan Bangunan', icon: 'fence' },
  { key: 'gss', no: 5, label: 'GSS', deskripsi: 'Garis Sempadan Sungai/Saluran', icon: 'waves' },
  { key: 'tinggi', no: 6, label: 'Tinggi Bangunan', deskripsi: 'Tinggi Bangunan', icon: 'ruler' },
];

const EMPTY_PERSIL = {
  id: '–',
  alamat: '–',
  kelurahan: '–',
  luas: '–',
  zona: '–',
  gsbDepanRDTR: '–',
  gssTerdekatRDTR: '–',
  status: 'Belum Dipilih',
};

const EMPTY_PARAMETERS = PARAM_META.map((p) => ({ ...p, status: 'kosong' }));

export default function AnalisisIntensitas() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const idParam = searchParams.get('id');
  const selectedId = idParam !== null && idParam !== '' ? Number(idParam) : null;

  // Jika ada persil yang dipilih dari peta (query ?id=...), bangkitkan data
  // analisis intensitas berdasarkan bangunan tersebut. Jika tidak ada yang
  // dipilih, data dikosongkan (bukan menampilkan contoh dummy).
  const selectedAnalysis = useMemo(() => {
    if (selectedId === null || Number.isNaN(selectedId)) return null;
    const data = generateBuildingFeatures(kawasan.center);
    const feature = data.features.find((f) => f.id === selectedId);
    return feature ? buildPersilAnalysis(feature) : null;
  }, [selectedId]);

  const hasSelection = Boolean(selectedAnalysis);
  const { persil, parameters } = selectedAnalysis || { persil: EMPTY_PERSIL, parameters: EMPTY_PARAMETERS };
  const badgeClass = PERSIL_STATUS_BADGE[persil.status] || 'bg-good/15 text-good';

  return (
    <MainLayout
      title="Analisis Intensitas Pemanfaatan Ruang"
      subtitle="Kawasan Jetis, Kota Yogyakarta"
    >
      <div className="flex flex-col gap-4">
        {/* Header halaman */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-[15px] font-semibold text-cink flex items-center gap-1.5">
              Analisis Intensitas Pemanfaatan Ruang
              <Info size={14} className="text-csub" />
            </h2>
            <p className="text-[12.5px] text-csub mt-0.5">
              Hitung dan evaluasi parameter intensitas pemanfaatan ruang berdasarkan peraturan RDTR Kota
              Yogyakarta.
            </p>
          </div>
          <button
            disabled={!hasSelection}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-accent text-white text-[12.5px] font-medium hover:bg-accent/90 disabled:bg-card2 disabled:text-csub disabled:cursor-not-allowed shrink-0"
          >
            <FileText size={14} />
            Unduh Laporan
          </button>
        </div>

        {/* Banner highlight: data sesuai persil yang dipilih dari peta */}
        {hasSelection ? (
          <div className="flex items-center justify-between gap-3 flex-wrap px-3.5 py-2.5 rounded-lg bg-accent/10 border border-accent/30">
            <div className="flex items-center gap-2 text-[12.5px] text-cink">
              <MapPin size={14} className="text-accent shrink-0" />
              Menampilkan data analisis untuk persil yang dipilih dari peta:{' '}
              <span className="font-semibold">{persil.alamat}</span>
            </div>
            <button
              onClick={() => navigate('/analisis-intensitas')}
              className="flex items-center gap-1 text-[11.5px] text-csub hover:text-cink shrink-0"
            >
              <X size={12} />
              Hapus pilihan
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-card2 border border-cborder text-[12.5px] text-csub">
            <MousePointerClick size={14} className="text-csub shrink-0" />
            Belum ada persil yang dipilih. Klik salah satu bangunan pada peta untuk melihat analisis intensitasnya.
          </div>
        )}

        {/* 6 kartu ringkasan parameter */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          {parameters.map((p) => (
            <IntensitasCard key={p.key} param={p} />
          ))}
        </div>

        {/* Peta + panel detail persil */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <div className="xl:col-span-8 h-[480px]">
            <MapView selectedId={selectedId} clickMode="direct" />
          </div>

          <div className="xl:col-span-4">
            <Card
              className="h-full"
              title="Detail Persil Terpilih"
              action={
                <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-medium ${badgeClass}`}>
                  {persil.status}
                </span>
              }
            >
              <div className="h-full p-4 flex flex-col">
                <div className="space-y-3 text-[12.5px]">
                  {[
                    ['ID Persil', persil.id],
                    ['Alamat', persil.alamat],
                    ['Kelurahan', persil.kelurahan],
                    ['Luas Persil', persil.luas],
                    ['Zona RDTR', persil.zona],
                    ['GSB Depan (RDTR)', persil.gsbDepanRDTR],
                    ['GSS Terdekat (RDTR)', persil.gssTerdekatRDTR],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between gap-3 border-b border-cborder/60 pb-2 last:border-0 last:pb-0">
                      <span className="text-csub">{label}</span>
                      <span className="text-cink font-medium text-right">{value}</span>
                    </div>
                  ))}
                </div>

                <button
                  disabled={!hasSelection}
                  className="w-full mt-auto pt-3 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg bg-accent text-white text-[12.5px] font-medium hover:bg-accent/90 disabled:bg-card2 disabled:text-csub disabled:cursor-not-allowed"
                >
                  <FileText size={14} />
                  Lihat Dokumen Pendukung
                </button>
              </div>
            </Card>
          </div>
        </div>

        {/* Rincian analisis per parameter */}
        <div>
          <h3 className="text-[13px] font-semibold text-cink mb-2.5">Rincian Analisis per Parameter</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-3">
            {parameters.map((p) => (
              <IntensitasRincianCard key={p.key} param={p} />
            ))}
          </div>
        </div>

        <p className="text-[11px] text-csub text-center pb-2">
          Catatan: Hasil analisis bersifat indikatif berdasarkan data spasial dan peraturan RDTR Kota
          Yogyakarta. Bukan merupakan penetapan resmi.
        </p>
      </div>
    </MainLayout>
  );
}