// Data contoh (dummy) — nantinya diganti dengan data dari API Laravel
// (mis. /api/dashboard/ringkasan) sesuai kawasan & filter yang dipilih.

export const kawasan = {
  kecamatan: 'Jetis',
  kelurahan: 'Semua',
  nama: 'Kawasan Jetis',
  center: [110.3645, -7.7789],
};

export const statCards = [
  { key: 'persil', label: 'Total Persil', value: '12.458', unit: 'persil', icon: 'grid', tone: 'good' },
  { key: 'bangunan', label: 'Total Bangunan', value: '9.842', unit: 'bangunan', icon: 'building', tone: 'accent' },
  { key: 'sesuai', label: 'Persil Sesuai', value: '7.243', extra: '(58,1%)', icon: 'check', tone: 'good' },
  { key: 'tidak_sesuai', label: 'Persil Tidak Sesuai', value: '4.215', extra: '(33,8%)', icon: 'x', tone: 'bad' },
  { key: 'verifikasi', label: 'Persil Perlu Verifikasi', value: '1.000', extra: '(8,0%)', icon: 'alert', tone: 'warn' },
  { key: 'klb', label: 'Rata-rata KLB Aktual', value: '1,42', icon: 'trend', tone: 'accent' },
];

export const ringkasanKesesuaian = [
  { name: 'Sesuai', value: 58.1, count: '7.243', color: '#22c55e' },
  { name: 'Tidak Sesuai', value: 33.8, count: '4.215', color: '#ef4444' },
  { name: 'Perlu Verifikasi', value: 8.0, count: '1.000', color: '#f2b90c' },
];

export const kesesuaianPerParameter = [
  { parameter: 'KDB', sesuai: 68, verifikasi: 12, tidakSesuai: 20 },
  { parameter: 'KLB', sesuai: 55, verifikasi: 15, tidakSesuai: 30 },
  { parameter: 'KDH', sesuai: 42, verifikasi: 10, tidakSesuai: 48 },
  { parameter: 'GSB', sesuai: 70, verifikasi: 8, tidakSesuai: 22 },
  { parameter: 'GSS', sesuai: 74, verifikasi: 8, tidakSesuai: 18 },
  { parameter: 'Ketinggian', sesuai: 72, verifikasi: 9, tidakSesuai: 19 },
];

export const pelanggaranTerbanyak = [
  { label: 'KDH', value: 2312 },
  { label: 'KLB', value: 1856 },
  { label: 'KDB', value: 1342 },
  { label: 'Ketinggian', value: 987 },
  { label: 'GSB', value: 642 },
  { label: 'GSS', value: 518 },
];

export const pelanggaranTerbaru = [
  { id: 1, tipe: 'KLB Melebihi Batas', alamat: 'Jl. Magelang No. 123', kelurahan: 'Demangan', waktu: '23/05/2025 09:15', severity: 'bad' },
  { id: 2, tipe: 'KDH Kurang', alamat: 'Jl. Laksda Adisucipto No. 56', kelurahan: 'Gowongan', waktu: '23/05/2025 09:05', severity: 'warn' },
  { id: 3, tipe: 'GSB Tidak Sesuai', alamat: 'Jl. Bhayangkara No. 78', kelurahan: 'Cokrodiningratan', waktu: '23/05/2025 08:50', severity: 'bad' },
];

export const indikatorAktual = [
  { key: 'kdb', label: 'KDB', value: '61,3%', max: 'Maks. 70%', icon: 'home' },
  { key: 'klb', label: 'KLB', value: '1,42', max: 'Maks. 2,4', icon: 'building' },
  { key: 'kdh', label: 'KDH', value: '16,8%', max: 'Min. 20%', icon: 'leaf' },
  { key: 'tinggi', label: 'Tinggi Bangunan', value: '12,7 m', max: 'Maks. 16 m', icon: 'ruler' },
];

export const trenKesesuaian = [
  { bulan: 'Des 2024', sesuai: 59, tidakSesuai: 33, verifikasi: 8 },
  { bulan: 'Jan 2025', sesuai: 60, tidakSesuai: 32, verifikasi: 8 },
  { bulan: 'Feb 2025', sesuai: 59, tidakSesuai: 33, verifikasi: 8 },
  { bulan: 'Mar 2025', sesuai: 58, tidakSesuai: 34, verifikasi: 8 },
  { bulan: 'Apr 2025', sesuai: 58, tidakSesuai: 34, verifikasi: 9 },
  { bulan: 'Mei 2025', sesuai: 58, tidakSesuai: 34, verifikasi: 9 },
];

export const kesesuaianPerKelurahan = [
  { kelurahan: 'Cokrodiningratan', sesuai: 62.4, tidakSesuai: 30.1, verifikasi: 7.5 },
  { kelurahan: 'Gowongan', sesuai: 58.7, tidakSesuai: 33.8, verifikasi: 7.5 },
  { kelurahan: 'Demangan', sesuai: 56.3, tidakSesuai: 34.9, verifikasi: 8.8 },
  { kelurahan: 'Bumijo', sesuai: 57.9, tidakSesuai: 31.6, verifikasi: 10.5 },
];

// Sidebar navigasi. Untuk sementara hanya "Beranda" dan "Analisis Intensitas"
// yang ditampilkan. Menu lain di-nonaktifkan (comment) dulu sampai halamannya
// siap — tinggal uncomment blok di bawah untuk memunculkannya lagi.
export const navItems = [
  { key: 'beranda', label: 'Beranda', icon: 'home', path: '/' },
  { key: 'analisis-intensitas', label: 'Analisis Intensitas', icon: 'gauge', path: '/analisis-intensitas' },
  { key: 'peta3d', label: 'Peta 3D', icon: 'box', path: '/peta-3d' },
  { key: 'bangunan', label: 'Bangunan', icon: 'building-2', path: '/bangunan' },
  { key: 'persil', label: 'Persil', icon: 'layout-grid', path: '/persil' },
  {
    key: 'kesesuaian',
    label: 'Kesesuaian',
    icon: 'check-square',
    children: [
      { key: 'kdb', label: 'KDB', path: '/kesesuaian/kdb' },
      { key: 'klb', label: 'KLB', path: '/kesesuaian/klb' },
      { key: 'kdh', label: 'KDH', path: '/kesesuaian/kdh' },
      { key: 'gsb', label: 'GSB', path: '/kesesuaian/gsb' },
      { key: 'gss', label: 'GSS', path: '/kesesuaian/gss' },
      { key: 'ketinggian', label: 'Ketinggian', path: '/kesesuaian/ketinggian' },
    ],
  },
  { key: 'dashboard', label: 'Dashboard', icon: 'layout-grid', path: '/dashboard' },
  { key: 'laporan', label: 'Laporan', icon: 'file-text', path: '/laporan' },
  { key: 'pengaturan', label: 'Pengaturan', icon: 'settings', path: '/pengaturan' },
];

// Data contoh untuk halaman Analisis Intensitas Pemanfaatan Ruang.
export const analisisIntensitas = {
  persil: {
    id: '347105.0012.0456',
    alamat: 'Jl. Laksda Adisucipto No. 45',
    kelurahan: 'Cokrodiningratan',
    luas: '582,00 m²',
    zona: 'K-2 (Perdagangan & Jasa)',
    gsbDepanRDTR: '3,0 m',
    gssTerdekatRDTR: '6,0 m',
    status: 'Sesuai',
  },
  parameters: [
    {
      key: 'kdb',
      no: 1,
      label: 'KDB',
      deskripsi: 'Koefisien Dasar Bangunan',
      icon: 'home',
      value: 68.4,
      unit: '%',
      batasLabel: 'Maks. 70%',
      progress: 0.85,
      status: 'sesuai',
      rincian: [
        { label: 'Luas Dasar Bangunan', value: '397,63 m²' },
        { label: 'Luas Persil', value: '582,00 m²' },
      ],
      formula: 'KDB = 397,63 / 582,00 × 100% = 68,4%',
    },
    {
      key: 'klb',
      no: 2,
      label: 'KLB',
      deskripsi: 'Koefisien Lantai Bangunan',
      icon: 'building',
      value: 1.82,
      unit: '',
      valueLabel: '1,82',
      batasLabel: 'Maks. 2,40',
      progress: 0.76,
      status: 'sesuai',
      rincian: [
        { label: 'Total Luas Lantai (GFA)', value: '1.059,24 m²' },
        { label: 'Luas Persil', value: '582,00 m²' },
      ],
      formula: 'KLB = 1.059,24 / 582,00 = 1,82',
    },
    {
      key: 'kdh',
      no: 3,
      label: 'KDH',
      deskripsi: 'Koefisien Dasar Hijau',
      icon: 'leaf',
      value: 22.7,
      unit: '%',
      batasLabel: 'Min. 20%',
      progress: 0.9,
      status: 'sesuai',
      rincian: [
        { label: 'Luas Hijau', value: '132,10 m²' },
        { label: 'Luas Persil', value: '582,00 m²' },
      ],
      formula: 'KDH = 132,10 / 582,00 × 100% = 22,7%',
    },
    {
      key: 'gsb',
      no: 4,
      label: 'GSB',
      deskripsi: 'Garis Sempadan Bangunan',
      icon: 'fence',
      value: 3.2,
      unit: 'm',
      batasLabel: 'Min. 3,0 m',
      progress: 0.8,
      status: 'sesuai',
      rincian: [
        { label: 'GSB Depan Aktual', value: '3,2 m' },
        { label: 'GSB Depan (RDTR)', value: '3,0 m' },
      ],
      formula: 'Selisih = 3,2 − 3,0 = +0,2 m',
    },
    {
      key: 'gss',
      no: 5,
      label: 'GSS',
      deskripsi: 'Garis Sempadan Sungai/Saluran',
      icon: 'waves',
      value: 8.6,
      unit: 'm',
      batasLabel: 'Min. 6,0 m',
      progress: 0.85,
      status: 'sesuai',
      rincian: [
        { label: 'GSS Aktual', value: '8,6 m' },
        { label: 'GSS (RDTR)', value: '6,0 m' },
      ],
      formula: 'Selisih = 8,6 − 6,0 = +2,6 m',
    },
    {
      key: 'tinggi',
      no: 6,
      label: 'Tinggi Bangunan',
      deskripsi: 'Tinggi Bangunan',
      icon: 'ruler',
      value: 14.2,
      unit: 'm',
      batasLabel: 'Maks. 15,0 m',
      progress: 0.95,
      status: 'sesuai',
      rincian: [
        { label: 'Tinggi Aktual', value: '14,2 m' },
        { label: 'Tinggi Maks. (RDTR)', value: '15,0 m' },
      ],
      formula: 'Selisih = 14,2 − 15,0 = −0,8 m',
    },
  ],
};