import React, { useState } from 'react';
import HeaderAdmin from '../components/HeaderAdmin';
import SidebarPimpinan from '../components/SidebarPimpinan';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const DashboardPimpinan = () => {
  const [students, setStudents] = useState([
    { id: 1, nama: 'Shizuka', program: 'Medu Course', status: 'Aktif' },
    { id: 2, nama: 'Dina', program: 'Ucok', status: 'Tidak Aktif' },
    { id: 3, nama: 'Naeya', program: 'Private Class', status: 'Aktif' },
    { id: 4, nama: 'Siti', program: 'Medu Course', status: 'Aktif' }
  ]);
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('Siswa Terdaftar');
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Data untuk grafik garis (pendaftaran per bulan)
  const monthlyData = [
    { name: 'Jan', students: 400 },
    { name: 'Feb', students: 300 },
    { name: 'Mar', students: 200 },
    { name: 'Apr', students: 100 },
    { name: 'May', students: 0 },
    { name: 'Jun', students: 150 },
    { name: 'Jul', students: 250 },
    { name: 'Aug', students: 350 },
    { name: 'Sep', students: 200 },
    { name: 'Oct', students: 100 },
    { name: 'Nov', students: 50 },
    { name: 'Dec', students: 300 },
  ];

  // Data untuk grafik batang (status siswa)
  const statusData = [
    { name: 'Aktif', value: 40 },
    { name: 'Non-Aktif', value: 20 },
  ];


  return (
    <div className="flex flex-col min-h-screen bg-purple-50">
      <HeaderAdmin toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-64 min-w-64 overflow-hidden transition-all duration-300`}>
          <SidebarPimpinan activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#FEF7FF] p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-[#3B2E55]">
              {activeMenu === 'Siswa Terdaftar' && 'Jumlah Pendaftar'}
              {activeMenu === 'Siswa Aktif' && 'Jumlah Siswa Aktif'}
              {activeMenu === 'Grafik' && 'Statistik Pendaftaran'}
            </h1>
            
            {/* Search Bar */}
            <div className="relative w-96">
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
          </div>

          {activeMenu === 'Siswa Terdaftar' && (
            <div className="rounded-xl shadow-lg border border-indigo-200 bg-white">
  <div className="max-h-[500px] min-h-[200px] overflow-y-auto">
    <table className="w-full">
      <thead className="bg-indigo-500 sticky top-0">
        <tr className="divide-x divide-white">
          <th className="px-6 py-4 text-left text-sm font-semibold text-white">No</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-white">Nama</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-white">Program Belajar</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/80 bg-gradient-to-r from-gray-300 to-indigo-400">
        {students.map((student) => (
          <tr key={student.id} className="hover:bg-violet-100 transition-colors divide-x divide-white">
            <td className="px-6 py-4 text-sm text-white">{student.id}</td>
            <td className="px-6 py-4 text-sm text-white font-medium">{student.nama}</td>
            <td className="px-6 py-4 text-sm text-white">{student.program}</td>
            <td className="px-6 py-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                student.status === 'Aktif' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {student.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

          )}
          {/* Siswa Aktif */}
          {activeMenu === 'Siswa Aktif' && (
            <div className="rounded-xl shadow-lg border border-indigo-200 bg-white">
  <div className="max-h-[500px] min-h-[200px] overflow-y-auto">
    <table className="w-full">
      <thead className="bg-indigo-500 sticky top-0">
        <tr className="divide-x divide-white">
          <th className="px-6 py-4 text-left text-sm font-semibold text-white">No</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-white">Nama</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-white">Program Belajar</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/80 bg-gradient-to-r from-gray-300 to-indigo-400">
        {students
          .filter((student) => student.status === 'Aktif')
          .map((student) => (
            <tr key={student.id} className="hover:bg-violet-100 transition-colors divide-x divide-white">
              <td className="px-6 py-4 text-sm text-white">{student.id}</td>
              <td className="px-6 py-4 text-sm text-white font-medium">{student.nama}</td>
              <td className="px-6 py-4 text-sm text-white">{student.program}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  student.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {student.status}
                </span>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
</div>

          )}

          {activeMenu === 'Grafik' && (
            <div className="space-y-8">
              {/* Grafik Batang */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={statusData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fill: '#4A3A6A' }} />
                      <YAxis tick={{ fill: '#4A3A6A' }} />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="value" 
                        fill="#6D6DB0" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Grafik Garis */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fill: '#4A3A6A' }} />
                      <YAxis tick={{ fill: '#4A3A6A' }} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="students" 
                        stroke="#6D6DB0" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPimpinan;
