import React from 'react';
import { Link } from "react-router-dom";
import Header from '../components/Header';
import kelas from '../assets/class/kelas.png';
import Footer from '../components/Footer';

export default function ClassBeforeBuy() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-white text-black">
      {/* Header */}
      <Header />

      {/* Main Content - Centered and Spaced */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">

        {/* Greeting with improved typography and animation */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-6 animate-fade-in-down">
          Selamat Datang, <span className="text-indigo-700">User!</span>
        </h2>

        {/* Illustration + Description - Enhanced Visuals */}
        <div className="flex flex-col items-center mb-10 sm:mb-16">
          <img
            src={kelas}
            alt="Ilustrasi Kelas"
            className="w-56 h-56 sm:w-72 sm:h-72 object-contain animate-scale-up"
          />
          <p className="text-lg sm:text-xl font-semibold text-center mt-6 leading-relaxed">
            Mari pantau progres belajarmu<br />dan raih potensi terbaikmu!
          </p>
        </div>

        {/* Status Box - Modernized Design with subtle shadow and dynamic button */}
        <div className="w-full max-w-md bg-gradient-to-br from-red-500 to-indigo-900 rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col items-center text-center">
          <p className="text-2xl font-bold text-white mb-3">Status Kelas Anda</p>
          <p className="text-white text-base sm:text-lg mb-6 opacity-90">
            Anda belum memiliki kelas apapun.
            <br />
            Ayo tingkatkan kemampuan bersama kami!
          </p>
          <Link
            to='/product'
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
          >
            Pilih Kelas Sekarang!
          </Link>
        </div>
      </div>

       <Footer />
      
    </div>
  );
}