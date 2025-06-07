import React from 'react';
import Header from '../components/HeaderHome';
import Footer from '../components/Footer';

import heroImage from '../assets/hero.png';

export default function HomeBeforeLogin() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-white">

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="p-8 flex flex-col lg:flex-row items-center justify-between flex-grow">
        {/* Kiri: Gambar */}
        <div className="w-full lg:w-1/2 flex justify-center items-center mb-6 lg:mb-0">
          <img src={heroImage} alt="Illustration" className="w-full max-w-md" />
        </div>

        {/* Kanan: Teks, Statistik, dan Info */}
        <div className="w-full lg:w-1/2 flex flex-col items-center text-center lg:px-10">
          <h1 className="text-2xl lg:text-3xl font-bold text-black">PT MANDIRI EDUKASI INDONESIA</h1>
          <p className="italic text-gray-700 mt-2 text-sm max-w-md font-bold">
            "National Edustartup to help young learner achieving their great potentials"
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {[{ label: 'Lolos OSN', value: 445 }, { label: 'Medali OSN', value: 232 }, { label: 'Persiapan Kampus', value: 50 }]
              .map((item, idx) => (
                <div key={idx} className="bg-gradient-to-r from-red-400 to-indigo-900 text-white px-6 py-4 rounded-xl shadow text-center w-36">
                  <p className="text-2xl font-bold">{item.value}</p>
                  <p className="text-sm">{item.label}</p>
                </div>
              ))}
          </div>

          <div className="bg-gradient-to-r from-red-400 to-indigo-900 text-white px-6 py-4 rounded-xl shadow mt-6 max-w-md">
            <h2 className="text-lg font-semibold">LEBIH DARI 35 SEKOLAH</h2>
            <p className="text-sm mt-1 leading-relaxed">
              Bermitra jangka panjang dengan kami dalam memberikan kelas persiapan untuk siswa siswi dalam menghadapi berbagai kompetisi akademik bergengsi baik nasional maupun internasional.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
}
