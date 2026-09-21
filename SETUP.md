# Setup — Dashboard Monitoring Kesesuaian Tata Bangunan & Pemanfaatan Ruang

Ini **satu project Laravel yang sudah digabung dengan React** (bukan dua folder terpisah).
Struktur `app/`, `bootstrap/`, `config/`, `public/`, `routes/`, dll adalah skeleton **Laravel 13**
resmi (saya ambil langsung dari repo GitHub `laravel/laravel`), dan bagian React-nya sudah
ditempel langsung ke dalam `resources/js/` project ini, dipanggil dari `resources/views/app.blade.php`
lewat `@vite(...)`, dan di-routing lewat `routes/web.php`.

Yang **belum** ada di dalam folder ini hanyalah:
- `vendor/` (dependency PHP Laravel) — didapat dari `composer install`
- `node_modules/` (dependency React/Vite) — didapat dari `npm install`

Sandbox tempat saya bekerja tidak punya akses ke Packagist (repo Composer), jadi saya tidak bisa
menjalankan `composer install` di sini untuk mengunduh `vendor/`. Karena itu, dua langkah instalasi
di bawah **wajib dijalankan di komputer Anda sendiri** — setelah itu project langsung jalan sebagai
satu kesatuan Laravel + React, tidak ada lagi penggabungan manual.

## Menjalankan

Prasyarat: PHP ≥ 8.3, Composer, Node.js ≥ 18.

```bash
cd dashboard-tata-ruang

# 1. Install dependency PHP (Laravel framework, dst)
composer install

# 2. Siapkan file environment
cp .env.example .env
php artisan key generate

# 3. Install dependency JS (React, MapLibre, Recharts, Tailwind, dst)
npm install

# 4. Jalankan (2 terminal terpisah)
php artisan serve       # backend Laravel → http://127.0.0.1:8000
npm run dev              # Vite dev server (hot reload untuk React)
```

Buka `http://127.0.0.1:8000` → halaman **Beranda** langsung tampil. Klik menu lain di sidebar
(Peta 3D, Kesesuaian, Bangunan, dst) → tampil halaman **"Sedang Dalam Pengerjaan"**, sesuai
permintaan.

Untuk production: `npm run build` (menghasilkan `public/build/...`), lalu deploy seperti project
Laravel biasa (PHP-FPM + Nginx/Apache, `php artisan serve`, dst). Tidak perlu `npm run dev` di
production karena Blade sudah otomatis memakai file hasil build lewat `@vite`.

## Apa yang sudah jadi

- **`resources/js/app.jsx`** — entry point React, di-mount ke `<div id="app">` di
  `resources/views/app.blade.php`.
- **`resources/js/AppRouter.jsx`** — routing client-side (React Router). `/` → Beranda, semua path
  lain → halaman "Sedang Dalam Pengerjaan".
- **`resources/js/pages/Beranda.jsx`** — halaman utama sesuai referensi: 6 kartu statistik, peta
  2D/3D, donut ringkasan kesesuaian, bar per parameter, pelanggaran terbanyak/terbaru, indikator
  rata-rata aktual, tren 6 bulan, tabel per kelurahan, dan filter kawasan.
- **`resources/js/components/MapView.jsx`** — peta pakai **MapLibre GL JS**, bangunan digambar
  sebagai `fill-extrusion` (ekstrusi 3D) berwarna sesuai status, dengan tombol toggle 2D⇄3D.
- **`resources/js/data/`** — data dummy (`dummyData.js`, `generateBuildings.js`). Ganti dengan
  `fetch()` ke endpoint Laravel ketika data asli (idealnya dari PostGIS) sudah siap — contoh
  endpoint sudah disiapkan di `DashboardController::ringkasan()`, tinggal didaftarkan di
  `routes/api.php`.
- **`app/Http/Controllers/DashboardController.php`** — saat ini hanya menyajikan shell SPA
  (`index()`), plus satu contoh method `ringkasan()` untuk endpoint JSON di masa depan.
- **`routes/web.php`** — satu route catch-all (`/{any}`) yang menyajikan `app.blade.php`; semua
  navigasi antar "halaman" ditangani React Router di client, bukan reload dari server.

## Soal peta & rencana LOD2

Peta sekarang pakai basemap raster gelap gratis (CARTO Dark, tanpa API key) + bangunan hasil
generate (dummy) yang diekstrusi sesuai ketinggian — ini setara **LOD1**. Untuk **LOD2** sungguhan
(atap & detail massing dari CityGML/3D Tiles), MapLibre GL JS tetap bisa dipakai dengan menambah
layer 3D Tiles (mis. lewat `deck.gl` `Tile3DLayer` + `MapboxOverlay`), atau — kalau volumenya besar
— pertimbangkan **CesiumJS** yang memang dibangun untuk 3D Tiles/CityGML dan sudah punya mode
2D/3D/Columbus bawaan. `MapView.jsx` sengaja dipisah dari halaman lain supaya sumber data
bangunannya (`map.addSource('bangunan', ...)`) tinggal diarahkan ke endpoint 3D Tiles nanti tanpa
mengubah komponen lain.
