import React, { useState } from 'react';
import HeaderAdmin from '../components/HeaderAdminTutor';
import SidebarManager from '../components/SidebarManager';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const DashboardManager = () => {
  const [mentor, setMentor] = useState([
    { id: 1, nama: 'Shizuka', subject: 'Mentor Bahasa Inggris', rating: 4.8 },
    { id: 2, nama: 'Dina', subject: 'Mentor Matematika', rating: 4.9 },
  ]);

  const [rating, setRating] = useState([
    { id: 1, nama: 'Shizuka', feedback: 'Gurunya seru', rating: 4 },
    { id: 2, nama: 'Dina',  feedback: 'Gurunya baik', rating: 5 },
  ]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('Pendaftar Perprogram');

  const [showDetail, setShowDetail] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Data untuk grafik batang (status siswa)
  const program = [
    { name: 'Ucok', value: 140 },
    { name: 'Medu Course', value: 390 },
    { name: 'Private Class', value: 200 },
    { name: 'Lainnya', value: 300 },
  ];

  // Data untuk grafik batang (status siswa)
  const traffic = [
    { name: 'Iklan', value: 140 },
    { name: 'Media Sosial', value: 390 },
    { name: 'Referral', value: 200 },
    { name: 'Lainnya', value: 300 },
  ];

  return (
    <div className="flex flex-col h-screen">
      <HeaderAdmin toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-64 min-w-64 overflow-y-auto transition-all duration-300`}>
          <SidebarManager activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: '#FEF7FF' }}>
          <div className="p-6">
            {activeMenu === 'Pendaftar Perprogram' && (
              <>
                {/* Header Section */}
                <div className="flex justify-between items-center mx-14 my-">
                  <h1 className="text-2xl font-bold text-[#3B2E55]">Pendaftar Perprogram</h1>
                </div>
                <div className="w-full max-w-xl h-80 bg-white rounded-xl shadow m-12 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={program} barCategoryGap={25} margin={{ top: 36, right: 36, left: 42, bottom: 42 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" label={{ value: 'Program', position: 'insideBottom', offset: -25, style: { fontWeight: 'bold' } }}
                      />
                      <YAxis label={{ value: 'Jumlah Siswa', position: 'inside', angle: -90, dx: -30, style: { fontWeight: 'bold' } }}
                      />
                      <Tooltip />
                      <Bar dataKey="value" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={25} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}

            {activeMenu === 'Traffic Siswa' && (
              <>
                {/* Header Section */}
                <div className="flex justify-between items-center mx-14 my-">
                  <h1 className="text-2xl font-bold text-[#3B2E55]">Traffic Siswa</h1>
                </div>
                <div className="w-full max-w-xl h-80 bg-white rounded-xl shadow m-12 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={traffic} barCategoryGap={25} margin={{ top: 36, right: 36, left: 42, bottom: 42 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" label={{ value: 'Sumber Traffic Siswa', position: 'insideBottom', offset: -25, style: { fontWeight: 'bold' } }}
                      />
                      <YAxis label={{ value: 'Jumlah Siswa', position: 'inside', angle: -90, dx: -30, style: { fontWeight: 'bold' } }}
                      />
                      <Tooltip />
                      <Bar dataKey="value" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={25} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}

            {activeMenu === 'Kinerja Mentor' && (
              <>
                {showDetail ? (
                  <>
                    {/* Header Section */}
                    <div className="flex justify-between items-center mx-14 my-8">
                      <h1 className="text-2xl font-bold text-[#3B2E55]">Detail Kinerja Mentor</h1>
                      {/* Search Bar */}
                      <div className="relative w-96">
                        <input
                          type="text"
                          placeholder="Cari mentor..."
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
                    <div className="bg-white border border-[#D5CEE5] rounded-xl shadow p-6 w-full mb-5">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-800">{selectedMentor.nama}</span>
                        <span className="text-gray-800">{selectedMentor.subject}</span>
                      </div>
                    </div>
                    <div className="rounded-xl shadow-lg border border-[#D5CEE5] bg-blue-300">
                      <div className="max-h-[600px] overflow-y-auto">
                        <table className="w-full">
                          <thead className="bg-[#6D6DB0] sticky top-0">
                            <tr>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-white">No</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Nama</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Feedback</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Rating</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#D5CEE5]">
                            {rating.map((rate) => (
                              <tr key={rate.id} className="hover:bg-[#F5F3FF] transition-colors">
                                <td className="px-6 py-4 text-sm text-white">{rate.id}</td>
                                <td className="px-6 py-4 text-sm text-white font-medium">{rate.nama}</td>
                                <td className="px-6 py-4 text-sm text-white">{rate.feedback}</td>
                                <td className="px-6 py-4 text-sm text-white">{rate.rating}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div></>
                ) : (
                  <>
                    {/* Header Section */}
                    <div className="flex justify-between items-center mx-14 my-8">
                      <h1 className="text-2xl font-bold text-[#3B2E55]">Kinerja Mentor</h1>
                      {/* Search Bar */}
                      <div className="relative w-96">
                        <input
                          type="text"
                          placeholder="Cari mentor..."
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
                    <div className="rounded-xl shadow-lg border border-[#D5CEE5] bg-white">
                      <div className="max-h-[600px] overflow-y-auto">
                        <table className="w-full">
                          <thead className="bg-[#6D6DB0] sticky top-0">
                            <tr>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-white">No</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Nama</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Rating</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Feedback</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#D5CEE5]">
                            {mentor.map((m) => (
                              <tr key={m.id} className="hover:bg-[#F5F3FF] transition-colors">
                                <td className="px-6 py-4 text-sm text-white">{m.id}</td>
                                <td className="px-6 py-4 text-sm text-white font-medium">{m.nama}</td>
                                <td className="px-6 py-4 text-sm text-white">{m.rating}</td>
                                <td className="px-6 py-4">
                                  <button
                                    className="text-blue-500 hover:underline"
                                    onClick={() => {
                                      setSelectedMentor(m); // simpan mentor yang diklik
                                      setShowDetail(true);       // aktifkan tampilan detail
                                    }}
                                  >
                                    Detail
                                  </button>

                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardManager;