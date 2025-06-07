import React, { useState } from 'react';
import HeaderAdmin from '../components/HeaderAdmin';
import SidebarAdmin from '../components/SidebarAdmin';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardAdmin = () => {
  const [activeMenu, setActiveMenu] = useState('Jumlah Pendaftar');
  const [searchQuery, setSearchQuery] = useState('');

  // Data contoh untuk grafik dan tabel
  const monthlyData = [
    { month: 'Jan', pendaftar: 45 },
    { month: 'Feb', pendaftar: 32 },
    { month: 'Mar', pendaftar: 67 },
    { month: 'Apr', pendaftar: 23 },
    { month: 'May', pendaftar: 89 },
    { month: 'Jun', pendaftar: 54 },
    { month: 'Jul', pendaftar: 76 },
    { month: 'Aug', pendaftar: 45 },
    { month: 'Sep', pendaftar: 32 },
    { month: 'Oct', pendaftar: 67 },
    { month: 'Nov', pendaftar: 23 },
    { month: 'Dec', pendaftar: 89 }
  ];

  const [students] = useState([
    {
      id: 'I001',
      name: 'Nisoyu Alcainti',
      program: 'Media Course',
      bukti: 'bukti_001.pdf',
      status: 'Aktif'
    },
    {
        id: 'I001',
        name: 'Nisoyu Alcainti',
        program: 'Media Course',
        bukti: 'bukti_001.pdf',
        status: 'Aktif'
      },
      {
        id: 'I001',
        name: 'Nisoyu Alcainti',
        program: 'Media Course',
        bukti: 'bukti_001.pdf',
        status: 'Aktif'
      },
    {
      id: 'I002',
      name: 'Mbwar Li alahi',
      program: 'Private Class',
      bukti: 'bukti_002.pdf',
      status: 'Pending'
    },
    {
      id: 'I003',
      name: 'Pifuku Hassam',
      program: 'UX Research',
      bukti: 'bukti_003.jpg',
      status: 'Tidak Aktif'
    },
    
  ]);

  const [paymentConfirmations] = useState([
    {
      id: '001',
      name: 'Naeya Adeani',
      metode: 'Transfer Bank Mandiri',
    },
    {
      id: '002',
      name: 'Mawar Lestari', 
      metode: 'Transfer Bank BCA',
    },
    // ... tambahkan data lainnya
  ]);
// Di bawah state
const visibleStudents = students.slice(0, 10); // Potong array siswa hanya 10 baris
  return (
    <div className="flex flex-col min-h-screen bg-purple-50">
      <HeaderAdmin />
      <div className="flex flex-1 overflow-auto">
        <div className="w-64 min-w-64 overflow-auto">
          <SidebarAdmin activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        </div>

        <main className="flex-1 flex flex-col overflow-hidden bg-[#F8F9FC] p-6">
          {activeMenu === 'Jumlah Pendaftar' && (
            <>
              {/* Header Section */}
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-[#3B2E55]">Jumlah Pendaftar</h1>
              </div>

              {/* Grafik Pendaftaran */}
              <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
                <h2 className="text-xl font-semibold mb-4 text-[#2E2344]">Statistik Pendaftaran Bulanan</h2>
                <div className="h-64">
                  <ResponsiveContainer width="90%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fill: '#2E2344' }}
                      />
                      <YAxis 
                        tick={{ fill: '#2E2344' }}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="pendaftar" 
                        name="2020"
                        fill="#9E92FE" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {/* cari nama */}
              <div className="relative w-96 mb-6">
                  <input
                    type="text"
                    placeholder="Cari nama..."
                    className="w-full px-4 py-2 rounded-lg border border-[#D5CEE5] focus:outline-none focus:ring-2 focus:ring-[#6D6DB0]"
                  />
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 absolute right-3 top-2.5 text-[#6D6DB0]" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              {/* Tabel Data */}
              <div className="rounded-xl shadow-lg border border-indigo-200 bg-white">
  <div className="max-h-[500px] min-h-[200px] overflow-y-auto">
    <table className="w-full">
      <thead className="bg-indigo-500 sticky top-0">
        <tr className="divide-x divide-white">
          <th className="px-6 py-4 text-left text-sm font-semibold text-white">ID</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-white">Nama</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-white">Program</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-white">Aksi</th>
        </tr>
      </thead>
      <tbody className="divide-y bg-gradient-to-r from-gray-300 to-indigo-400">
        {visibleStudents.map((student) => (
          <tr key={student.id} className="divide-x divide-white">
            <td className="px-6 py-4 text-sm text-white">{student.id}</td>
            <td className="px-6 py-4 text-sm text-white">{student.name}</td>
            <td className="px-6 py-4 text-sm text-white">{student.program}</td>
            <td className="px-6 py-4 text-sm text-white">
              <span>{student.status}</span>
            </td>
            <td className="px-6 py-4">
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-indigo-600">
                  Edit
                </button>
                <button className="px-3 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600">
                  Hapus
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>  
</div>

            </>
          )}

{/* side keedua */}
         {activeMenu === 'Konfirmasi Pembayaran' && (
  <>
    {/* Header Section */}
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold text-[#4A3A6A]">Konfirmasi Pembayaran</h1>
      
      {/* Search Bar */}
      <div className="relative w-96">
        <input
          type="text"
          placeholder="Cari peserta..."
          className="w-full px-4 py-2 rounded-lg border border-[#D5CEE5] focus:outline-none focus:ring-2 focus:ring-[#6D6DB0]"
        />
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 absolute right-3 top-2.5 text-[#6D6DB0]" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    {/* Tabel Konfirmasi */}
    <div className="rounded-xl shadow-lg border border-indigo-200 bg-white">
  <div className="max-h-[600px] overflow-y-auto">
    <table className="w-full">
      <thead className="bg-indigo-500 sticky top-0">
        <tr className="divide-x divide-white">
          <th className="px-6 py-4 text-left text-sm font-semibold text-white">ID</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-white">Nama Peserta</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-white">Metode Pembayaran</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-white">Bukti Pembayaran</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-white/80 bg-gradient-to-r from-gray-300 to-indigo-400">
        {paymentConfirmations.slice(0, 20).map((confirmation) => (
          <tr key={confirmation.id} className="divide-x divide-white">
            <td className="px-6 py-4 text-sm text-white">{confirmation.id}</td>
            <td className="px-6 py-4 text-sm text-white">{confirmation.name}</td>
            <td className="px-6 py-4 text-sm text-white">{confirmation.metode}</td>
            <td className="px-6 py-4">
              <button className="text-white hover:text-indigo-300 text-sm underline">
                Lihat Bukti Pembayaran
              </button>
            </td>
            <td className="px-6 py-4">
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-green-600">
                  Terima
                </button>
                <button className="px-3 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600">
                  Tolak
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  </>
)}
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;
