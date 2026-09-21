<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Semua rute halaman diarahkan ke satu view (app.blade.php) yang memuat
| aplikasi React. Navigasi antar "halaman" (Beranda, Peta 3D, Kesesuaian,
| dst) ditangani di sisi client oleh React Router — lihat
| resources/js/AppRouter.jsx.
|
| Endpoint data (untuk menggantikan dummy data di resources/js/data/)
| sebaiknya ditambahkan di routes/api.php, contoh:
|   Route::get('/api/dashboard/ringkasan', [DashboardController::class, 'ringkasan']);
|
*/

Route::get('/{any}', [DashboardController::class, 'index'])
    ->where('any', '^(?!api).*$')
    ->name('spa');
