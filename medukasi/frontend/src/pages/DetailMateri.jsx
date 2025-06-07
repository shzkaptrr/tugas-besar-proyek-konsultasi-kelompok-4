import React from 'react';
import Header from '../components/Header';
import materi1 from '../assets/class/materi1.png'; 
import materi2 from '../assets/class/materi2.png'; 
import materi3 from '../assets/class/materi3.png'; 
import { Link } from 'react-router-dom';

export default function DetailMateri() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="p-8 flex flex-col mx-auto w-full max-w-5xl">
        {/* Back button with title */}
        <div className="mb-12 mt-4">
          <h2 className="text-xl font-bold text-black flex items-center">
            <span className="mr-2"></span> Medu Course
          </h2>
        </div>

        {/* 3 Fitur Pembelajaran */}
        <div className="grid grid-cols-3 gap-6 mb-6">

          {/* Video Pembelajaran */}
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <img
                src={materi1}
                alt="Video Materi Icon"
                className="w-32 h-32 object-contain"
              />
            </div>
            <div className="w-full bg-gradient-to-r from-red-400 to-indigo-800 rounded-lg shadow-md p-4 text-white text-center">
              <h3 className="text-xl font-semibold mb-2">Video Materi</h3>
              <p className="text-sm mb-4">---</p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md text-sm font-medium">
                Lanjutkan..
              </button>
            </div>
          </div>

          {/* Materi Pembelajaran */}
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <img
                src={materi2}
                alt="Materi Pembelajaran Icon"
                className="w-32 h-32 object-contain"
              />
            </div>
            <div className="w-full bg-gradient-to-r from-red-400 to-indigo-800 rounded-lg shadow-md p-4 text-white text-center">
              <h3 className="text-xl font-semibold mb-2">Materi Pembelajaran</h3>
              <p className="text-sm mb-4">---</p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md text-sm font-medium">
                Lanjutkan..
              </button>
            </div>
          </div>

          {/* hasil Pembelajaran */}
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <img
                src={materi3}
                alt="Hasil Pembelajaran Icon"
                className="w-32 h-32 object-contain"
              />
            </div>
            <div className="w-full bg-gradient-to-r from-red-400 to-indigo-800 rounded-lg shadow-md p-4 text-white text-center">
              <h3 className="text-xl font-semibold mb-2">Hasil Pembelajaran</h3>
              <p className="text-sm mb-4">---</p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md text-sm font-medium">
                Lanjutkan..
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}