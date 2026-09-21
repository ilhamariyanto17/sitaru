// Menghasilkan data bangunan dummy (GeoJSON) untuk divisualisasikan di peta.
// Di implementasi nyata, ini diganti dengan hasil fetch ke endpoint Laravel,
// misalnya /api/bangunan?kawasan=jetis yang mengembalikan geometri LOD2
// (atau minimal footprint + tinggi) dari database (PostGIS).

const STATUS = ['sesuai', 'tidak_sesuai', 'perlu_verifikasi', 'tidak_ada'];
const STATUS_WEIGHT = [0.58, 0.34, 0.08, 0.0];

function pickStatus(rand) {
  const noBuildingChance = 0.12; // sebagian kavling tanpa bangunan (abu-abu)
  if (rand() < noBuildingChance) return 'tidak_ada';
  const r = rand();
  let acc = 0;
  for (let i = 0; i < 3; i++) {
    acc += STATUS_WEIGHT[i];
    if (r <= acc) return STATUS[i];
  }
  return 'sesuai';
}

// PRNG sederhana & deterministik agar tampilan konsisten setiap render
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateBuildingFeatures(center, { rows = 22, cols = 30, seed = 42 } = {}) {
  const rand = mulberry32(seed);
  const features = [];

  const spacingLng = 0.00085;
  const spacingLat = 0.00072;
  const startLng = center[0] - (cols * spacingLng) / 2;
  const startLat = center[1] - (rows * spacingLat) / 2;

  let id = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Lewati beberapa sel untuk membuat "jalan" grid setiap 6 baris/kolom
      if (r % 6 === 0 || c % 8 === 0) continue;
      if (rand() < 0.08) continue; // lahan kosong acak

      const jitterLng = (rand() - 0.5) * spacingLng * 0.15;
      const jitterLat = (rand() - 0.5) * spacingLat * 0.15;
      const lng = startLng + c * spacingLng + jitterLng;
      const lat = startLat + r * spacingLat + jitterLat;

      const w = spacingLng * (0.45 + rand() * 0.35);
      const h = spacingLat * (0.45 + rand() * 0.35);

      const status = pickStatus(rand);
      const height = status === 'tidak_ada' ? 0 : 4 + Math.round(rand() * 11) * 3; // 4 - ~37m
      const klb = (0.6 + rand() * 1.8).toFixed(2);

      features.push({
        type: 'Feature',
        id: id++,
        properties: {
          status,
          height,
          klb,
          kdb: Math.round(30 + rand() * 50),
          alamat: `Blok ${String.fromCharCode(65 + (r % 6))}-${c}`,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [lng - w / 2, lat - h / 2],
              [lng + w / 2, lat - h / 2],
              [lng + w / 2, lat + h / 2],
              [lng - w / 2, lat + h / 2],
              [lng - w / 2, lat - h / 2],
            ],
          ],
        },
      });
    }
  }

  return { type: 'FeatureCollection', features };
}

export const STATUS_COLORS = {
  sesuai: '#22c55e',
  tidak_sesuai: '#ef4444',
  perlu_verifikasi: '#f2b90c',
  tidak_ada: '#6b7385',
};

// Warna khusus untuk menandai bangunan/persil yang sedang dipilih dari peta
export const HIGHLIGHT_COLOR = '#38bdf8';

// ============================================================
// ANALISIS PERSIL (DUMMY) — dibangkitkan dari properti bangunan
// yang diklik di peta, agar data di halaman "Analisis Intensitas"
// konsisten dengan bangunan yang dipilih pengguna.
// Di implementasi nyata, ini diganti dengan fetch ke endpoint
// Laravel, misalnya /api/persil/{id}/analisis-intensitas.
// ============================================================

const KELURAHAN_POOL = ['Cokrodiningratan', 'Gowongan', 'Demangan', 'Bumijo'];

const ZONA_POOL = [
  'K-2 (Perdagangan & Jasa)',
  'R-2 (Perumahan Kepadatan Sedang)',
  'R-3 (Perumahan Kepadatan Tinggi)',
  'K-1 (Perdagangan & Jasa Skala Kecil)',
];

const PERSIL_STATUS_LABEL = {
  sesuai: 'Sesuai',
  tidak_sesuai: 'Tidak Sesuai',
  perlu_verifikasi: 'Perlu Verifikasi',
  tidak_ada: 'Perlu Verifikasi',
};

// Namespace status pada IntensitasCard berbeda sedikit dari status bangunan
const PARAM_STATUS = {
  sesuai: 'sesuai',
  tidak_sesuai: 'tidak_sesuai',
  perlu_verifikasi: 'verifikasi',
  tidak_ada: 'verifikasi',
};

function formatID(number, decimals = 2) {
  return Number(number).toLocaleString('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function clampProgress(value, max) {
  if (!max) return 0.5;
  return Math.min(1, Math.max(0.05, value / max));
}

// Membangun data analisis intensitas (KDB, KLB, KDH, GSB, GSS, Tinggi)
// untuk satu feature/persil hasil klik di peta.
export function buildPersilAnalysis(feature) {
  if (!feature) return null;

  const id = feature.id ?? 0;
  const p = feature.properties || {};
  const rand = mulberry32(id * 7919 + 13);

  const luasPersil = Math.round(180 + rand() * 650);
  const kdbPercent = Number(p.kdb ?? Math.round(40 + rand() * 30));
  const luasDasar = Math.round((luasPersil * kdbPercent) / 100);

  const klbValue = Number(p.klb ?? (1 + rand() * 1.5));
  const totalLantai = Math.round(luasPersil * klbValue);

  const kdhPercent = Math.max(5, Math.round(35 - kdbPercent * 0.25 + rand() * 10));
  const luasHijau = Math.round((luasPersil * kdhPercent) / 100);

  const gsbActual = Number((2 + rand() * 3.5).toFixed(1));
  const gsbRdtr = 3.0;

  const gssActual = Number((5 + rand() * 6).toFixed(1));
  const gssRdtr = 6.0;

  const tinggiActual = p.height || Math.round(4 + rand() * 20);
  const tinggiMax = 15;

  const bangunanStatus = p.status || 'perlu_verifikasi';
  const paramStatus = PARAM_STATUS[bangunanStatus] || 'verifikasi';

  const kelurahan = KELURAHAN_POOL[id % KELURAHAN_POOL.length];
  const zona = ZONA_POOL[id % ZONA_POOL.length];

  return {
    persil: {
      id: `347105.${String(id % 9999).padStart(4, '0')}.${String(1000 + (id % 8999)).padStart(4, '0')}`,
      alamat: p.alamat || `Bangunan #${id}`,
      kelurahan,
      luas: `${formatID(luasPersil, 2)} m²`,
      zona,
      gsbDepanRDTR: `${formatID(gsbRdtr, 1)} m`,
      gssTerdekatRDTR: `${formatID(gssRdtr, 1)} m`,
      status: PERSIL_STATUS_LABEL[bangunanStatus] || 'Perlu Verifikasi',
    },

    parameters: [
      {
        key: 'kdb',
        no: 1,
        label: 'KDB',
        deskripsi: 'Koefisien Dasar Bangunan',
        icon: 'home',
        value: kdbPercent,
        unit: '%',
        batasLabel: 'Maks. 70%',
        progress: clampProgress(kdbPercent, 70),
        status: paramStatus,
        rincian: [
          { label: 'Luas Dasar Bangunan', value: `${formatID(luasDasar, 2)} m²` },
          { label: 'Luas Persil', value: `${formatID(luasPersil, 2)} m²` },
        ],
        formula: `KDB = ${formatID(luasDasar, 2)} / ${formatID(luasPersil, 2)} × 100% = ${formatID(kdbPercent, 1)}%`,
      },
      {
        key: 'klb',
        no: 2,
        label: 'KLB',
        deskripsi: 'Koefisien Lantai Bangunan',
        icon: 'building',
        value: klbValue,
        valueLabel: formatID(klbValue, 2),
        unit: '',
        batasLabel: 'Maks. 2,40',
        progress: clampProgress(klbValue, 2.4),
        status: paramStatus,
        rincian: [
          { label: 'Total Luas Lantai (GFA)', value: `${formatID(totalLantai, 2)} m²` },
          { label: 'Luas Persil', value: `${formatID(luasPersil, 2)} m²` },
        ],
        formula: `KLB = ${formatID(totalLantai, 2)} / ${formatID(luasPersil, 2)} = ${formatID(klbValue, 2)}`,
      },
      {
        key: 'kdh',
        no: 3,
        label: 'KDH',
        deskripsi: 'Koefisien Dasar Hijau',
        icon: 'leaf',
        value: kdhPercent,
        unit: '%',
        batasLabel: 'Min. 20%',
        progress: clampProgress(kdhPercent, 30),
        status: kdhPercent >= 20 ? 'sesuai' : 'tidak_sesuai',
        rincian: [
          { label: 'Luas Hijau', value: `${formatID(luasHijau, 2)} m²` },
          { label: 'Luas Persil', value: `${formatID(luasPersil, 2)} m²` },
        ],
        formula: `KDH = ${formatID(luasHijau, 2)} / ${formatID(luasPersil, 2)} × 100% = ${formatID(kdhPercent, 1)}%`,
      },
      {
        key: 'gsb',
        no: 4,
        label: 'GSB',
        deskripsi: 'Garis Sempadan Bangunan',
        icon: 'fence',
        value: gsbActual,
        unit: 'm',
        batasLabel: 'Min. 3,0 m',
        progress: clampProgress(gsbActual, 5),
        status: gsbActual >= gsbRdtr ? 'sesuai' : 'tidak_sesuai',
        rincian: [
          { label: 'GSB Depan Aktual', value: `${formatID(gsbActual, 1)} m` },
          { label: 'GSB Depan (RDTR)', value: `${formatID(gsbRdtr, 1)} m` },
        ],
        formula: `Selisih = ${formatID(gsbActual, 1)} − ${formatID(gsbRdtr, 1)} = ${gsbActual - gsbRdtr >= 0 ? '+' : ''}${formatID(gsbActual - gsbRdtr, 1)} m`,
      },
      {
        key: 'gss',
        no: 5,
        label: 'GSS',
        deskripsi: 'Garis Sempadan Sungai/Saluran',
        icon: 'waves',
        value: gssActual,
        unit: 'm',
        batasLabel: 'Min. 6,0 m',
        progress: clampProgress(gssActual, 11),
        status: gssActual >= gssRdtr ? 'sesuai' : 'tidak_sesuai',
        rincian: [
          { label: 'GSS Aktual', value: `${formatID(gssActual, 1)} m` },
          { label: 'GSS (RDTR)', value: `${formatID(gssRdtr, 1)} m` },
        ],
        formula: `Selisih = ${formatID(gssActual, 1)} − ${formatID(gssRdtr, 1)} = ${gssActual - gssRdtr >= 0 ? '+' : ''}${formatID(gssActual - gssRdtr, 1)} m`,
      },
      {
        key: 'tinggi',
        no: 6,
        label: 'Tinggi Bangunan',
        deskripsi: 'Tinggi Bangunan',
        icon: 'ruler',
        value: tinggiActual,
        unit: 'm',
        batasLabel: 'Maks. 15,0 m',
        progress: clampProgress(tinggiActual, tinggiMax),
        status: tinggiActual <= tinggiMax ? 'sesuai' : 'tidak_sesuai',
        rincian: [
          { label: 'Tinggi Aktual', value: `${formatID(tinggiActual, 1)} m` },
          { label: 'Tinggi Maks. (RDTR)', value: `${formatID(tinggiMax, 1)} m` },
        ],
        formula: `Selisih = ${formatID(tinggiActual, 1)} − ${formatID(tinggiMax, 1)} = ${tinggiActual - tinggiMax >= 0 ? '+' : ''}${formatID(tinggiActual - tinggiMax, 1)} m`,
      },
    ],
  };
}