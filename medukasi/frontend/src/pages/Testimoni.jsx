import React from 'react';
import Header from '../components/HeaderHome';

const SuccessStory = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-white">
      <Header />
      <h2 className="text-4xl font-bold text-blue-500 mb-8 text-center">Success Story</h2>

        <div className="flex justify-center items-center w-full py-10">
            <div className="relative w-[700px]">
                {/* Tombol Kiri */}
                <button className="absolute left-[-20px] top-1/2 transform -translate-y-1/2 bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 z-10">
                ❮
                </button>

                {/* Card */}
                <div className="bg-white border border-red-400 rounded-xl shadow-lg">
                <div className="bg-red-600 text-white font-semibold text-center py-4 text-lg rounded-t-xl">
                    Arya Naufal Sihaloho
                </div>
                <div className="p-6 text-justify text-black">
                    <p className="mb-4 font-semibold">
                    Medali perak Kimia tahun 2022 dan Pelatnas II IChO tahun 2023
                    </p>
                    <p className="mb-4">
                    Salah satu faktor penting untuk kita terus konsisten dan pantang menyerah dalam mencapai tujuan itu mempunyai circle yang baik...
                    </p>
                    <p>
                    Aku sudah join komunitas OSN sejak tahun 2021...
                    </p>
                </div>
                </div>

                {/* Tombol Kanan */}
                <button className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 z-10">
                ❯
                </button>
            </div>
        </div>
    </div>
  );
};

export default SuccessStory;
