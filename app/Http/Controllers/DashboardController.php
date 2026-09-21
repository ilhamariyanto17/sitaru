<?php

namespace App\Http\Controllers;

class DashboardController extends Controller
{
    /**
     * Menyajikan shell aplikasi React (SPA).
     * Routing antar halaman ditangani oleh React Router di sisi client.
     */
    public function index()
    {
        return view('app');
    }

    /**
     * Contoh endpoint data ringkasan untuk Beranda.
     * Saat ini frontend masih memakai dummy data di
     * resources/js/data/dummyData.js — arahkan fetch ke sini
     * ketika data asli (mis. dari PostGIS) sudah siap.
     */
    public function ringkasan()
    {
        return response()->json([
            'total_persil' => 12458,
            'total_bangunan' => 9842,
            'persil_sesuai' => 7243,
            'persil_tidak_sesuai' => 4215,
            'persil_perlu_verifikasi' => 1000,
            'rata_rata_klb' => 1.42,
        ]);
    }
}
