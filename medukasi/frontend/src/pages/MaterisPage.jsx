import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

const MaterisPage = [
  {
    id: 1,
    judul: 'Struktur Data',
    subMateri: ['Array', 'Linked List', 'Stack', 'Queue', 'Tree'],
  },
  {
    id: 2,
    judul: 'Algoritma',
    subMateri: ['Sorting', 'Searching', 'Greedy Algorithm', 'Dynamic Programming'],
  },
  {
    id: 3,
    judul: 'Basis Data',
    subMateri: ['Relasi', 'ERD', 'SQL Dasar', 'Normalisasi'],
  },
  {
    id: 4,
    judul: 'Pemrograman Web',
    subMateri: ['HTML & CSS', 'JavaScript', 'React', 'Laravel'],
  },
];

export default function MateriPage() {
  const [openStates, setOpenStates] = useState({});

  const toggleOpen = (id) => {
    setOpenStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">📚 Daftar Materi</h1>
      <div className="space-y-6">
        {MaterisPage.map((materi) => (
          <div
            key={materi.id}
            className="bg-white border border-gray-300 rounded-xl shadow-md"
          >
            {/* Materi Card */}
            <button
              onClick={() => toggleOpen(materi.id)}
              className="flex items-center justify-between w-full px-6 py-4 text-left"
            >
              <span className="text-xl font-semibold text-gray-800">
                📦 {materi.judul}
              </span>
              {openStates[materi.id] ? <ChevronUp /> : <ChevronDown />}
            </button>

            {/* Submateri Card (memanjang ke bawah) */}
            {openStates[materi.id] && (
              <div className="px-6 pb-4 space-y-3">
                {materi.subMateri.map((sub, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 border border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 cursor-pointer transition"
                  >
                    <BookOpen className="text-blue-700" size={20} />
                    <span className="text-blue-800 font-medium">{sub}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
