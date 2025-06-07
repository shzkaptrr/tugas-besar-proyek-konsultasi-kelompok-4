import React from 'react';
import Header from '../components/Header';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function StaticMonitoring() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-col flex-1 p-6">
        {/* Judul Halaman */}
        <h2 className="text-2xl font-bold text-black mb-8 text-center">
          Statistik & Monitoring
        </h2>

        {/* Semua Card dibungkus satu container */}
        <div className="space-y-6 max-w-7xl mx-auto w-full">
          {/* Card: Activity */}
          <div className="w-full px-6 py-8 bg-gradient-to-r from-red-400 to-indigo-900 rounded-xl shadow-md flex justify-between items-center">
            <div className="text-white">
              <p className="text-xl font-bold mb-2">Activity</p>
              <p className="text-sm">Seluruh aktivitas terselesaikan 70%...</p>
            </div>
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Zr9XNziQY7/1d16xkfw_expires_30_days.png"
              alt="Activity"
              className="w-[300px] h-[100px] rounded-xl object-contain"
            />
          </div>

          {/* Card: Score */}
          <div className="w-full px-6 py-8 bg-gradient-to-r from-red-400 to-indigo-900 rounded-xl shadow-md flex justify-between items-center">
            <div className="text-white">
              <p className="text-xl font-bold mb-2">Score</p>
              <p className="text-sm">Rata-rata nilai seluruh class 92/100</p>
            </div>
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Zr9XNziQY7/fab4yuus_expires_30_days.png"
              alt="Score"
              className="w-[300px] h-[100px] rounded-xl object-contain"
            />
          </div>

          {/* Card: Achievement */}
          <div className="w-full px-6 py-8 bg-gradient-to-r from-red-400 to-indigo-900 rounded-xl shadow-md flex justify-between items-center">
            <div className="text-white">
              <p className="text-xl font-bold mb-2">Achievement Progress</p>
              <p className="text-sm">Kehadiran bla bla bla</p>
            </div>
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Zr9XNziQY7/l68g8qb4_expires_30_days.png"
              alt="Achievement"
              className="w-[300px] h-[100px] rounded-xl object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
