// DashboardStudent.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import profileImg from '../assets/login/avatar.jpg';
import searchIcon from '../assets/class/search.png';
import class1 from '../assets/class/kelas1.png';
import class2 from '../assets/class/kelas2.png';
import class3 from '../assets/class/kelas3.png';

export default function DashboardStudent() {
  const [searchInput, setSearchInput] = useState('');
  const [viewInputs, setViewInputs] = useState(['', '', '']);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user_data"));
    if (!storedUser) {
      navigate("/login"); // redirect kalau belum login
    } else {
      setUser(storedUser);
    }
  }, []);

  const classData = [
    {
      id: 1,
      title: "Private Class",
      description: "Layanan bimbingan personal untuk pembelajaran intensif",
      image: class1
    },
    {
      id: 2,
      title: "Group Class",
      description: "Belajar bersama dalam kelompok kecil yang interaktif",
      image: class2
    },
    {
      id: 3,
      title: "Premium Class",
      description: "Pengalaman belajar eksklusif dengan fasilitas terbaik",
      image: class3
    }
  ];

  const handleViewInput = (index, value) => {
    const newInputs = [...viewInputs];
    newInputs[index] = value;
    setViewInputs(newInputs);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1 p-8">
        
          {/* Profile Card */}
          <section className="bg-gradient-to-b from-red-400 to-indigo-900 rounded-xl p-5 mb-8 mx-8 text-white">
            <div className="flex items-center">
              <img src={profileImg} alt="Profile" className="w-20 h-20 rounded-2xl object-cover mr-6" />
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{user?.name || user?.email || "Nama Pengguna"}</h2>
                <div className="flex justify-between">
                  <div>
                    <p className="text-base">Bergabung sejak 2025</p>
                    <p className="text-base">Kota Bandung</p>
                  </div>
                  <Link to="/statistic-monitoring" className="self-end hover:underline">
                    Statistik & Monitoring
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Search Section */}
          <section className="flex justify-between items-center mb-8 px-6">
            <h3 className="text-2xl font-bold text-gray-900">Status Kelas</h3>
            <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
              <img src={searchIcon} alt="Cari" className="w-4 h-4 mr-2" />
              <input
                type="text"
                placeholder="Cari kelas"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="bg-transparent text-sm w-24 focus:outline-none"
              />
            </div>
          </section>

          {/* Class Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
            {classData.map((classItem, index) => (
              <div
                key={classItem.id}
                className="bg-gradient-to-b from-red-400 to-indigo-900 rounded-xl p-6 text-white"
              >
                <div className="flex flex-col items-center mb-4">
                  <div className="bg-white p-1 rounded-md w-full mb-3">
                    <img src={classItem.image} alt={classItem.title} className="w-full h-14 object-contain" />
                  </div>
                  <h4 className="text-lg font-bold">{classItem.title}</h4>
                </div>
                <p className="text-center mb-6">{classItem.description}</p>
                <input
                  type="button"
                  value={viewInputs[index] || "Lihat"}
                  onChange={(e) => handleViewInput(index, e.target.value)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl cursor-pointer transition-colors"
                />
              </div>
            ))}
          </section>
        
      </main>
    </div>
  );
}
