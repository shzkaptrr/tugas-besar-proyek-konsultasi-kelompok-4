import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

export default function DashboardMateri() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="p-8 flex flex-col gap-6 mx-auto w-full max-w-4xl">
        {/* Greeting */}
        <div className="mt-2">
          <h2 className="text-2xl font-bold text-black">Hi, User!</h2>
          <p className="italic text-black mt-1">
            Apakah kau sudah siap untuk masa depan..
          </p>
        </div>

        {/* Aktivitas Pembelajaran */}
        <div className="bg-gradient-to-r from-red-400 to-indigo-800 rounded-lg shadow-md p-6 text-white w-full">
          <h3 className="text-lg font-semibold">Aktivitas Pembelajaran</h3>
          
          <div className="flex flex-col items-center text-center mt-2">
            <h4 className="text-lg font-bold">Medu Course</h4>
            <p className="text-sm mt-1">
              Materi terakhir Tes Penalaran Umum
            </p>
            <p className="text-sm">
              telah diselesaikan 35%
            </p>
            <div className="mt-4">
              <Link to="/detail-materi"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 text-sm rounded-md font-medium"
              >
                Ayo Lanjut...
              </Link>
            </div>
          </div>
        </div>

        {/* Dua Box Bawah */}
        <div className="flex flex-row gap-6 w-full">
          {/* Hasil Pembelajaran */}
          <div className="bg-gradient-to-r from-red-400 to-indigo-800 rounded-lg shadow-md p-6 text-white flex-1">
            <h3 className="text-lg font-semibold">Hasil Pembelajaran</h3>
            <div className="flex flex-col items-center text-center mt-2">
              <h4 className="text-lg font-bold">Medu Course</h4>
              <p className="text-sm mt-1 mb-4">
                Seluruh aktivitas belum terselesaikan
              </p>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 text-sm rounded-md font-medium"
              >
                Cek kemajuan kamu..
              </button>
            </div>
          </div>

          {/* Aktivitas Lainnya */}
          <div className="bg-gradient-to-r from-red-400 to-indigo-800 rounded-lg shadow-md p-6 text-white flex-1">
            <h3 className="text-lg font-semibold">Aktivitas lainnya</h3>
            <div className="flex flex-col items-center text-center mt-2">
              <h4 className="text-lg font-bold">Seminar Umum</h4>
              <p className="text-sm mt-1 mb-4">
                Membahas tips dan trik belajar efektif
              </p>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 text-sm rounded-md font-medium"
              >
                Cek jadwal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}