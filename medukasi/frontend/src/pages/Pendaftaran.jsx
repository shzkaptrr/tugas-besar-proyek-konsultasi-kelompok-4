import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import image from '../assets/image.jpg';
import Footer from '../components/Footer'; // Jika ingin menambahkan footer  

const Pendaftaran = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [asalSekolah, setAsalSekolah] = useState('');
  const [noTelpOrtu, setNoTelpOrtu] = useState('');
  const [sumberInformasi, setSumberInformasi] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  // Ambil produk_id dari query param URL
  const queryParams = new URLSearchParams(location.search);
  const produk_id = queryParams.get("produk_id");

  // Ambil user_data sekali saat komponen mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user_data"));
    setUser(storedUser);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    if (!user) {
      alert("User tidak ditemukan, silakan login ulang.");
      setIsSubmitting(false);
      return;
    }
  
    const token = localStorage.getItem("auth_token");
    const payload = {
      user_id: user.id,
      produk_id,
      asal_sekolah: asalSekolah,
      no_telp_ortu: noTelpOrtu,
      sumber_informasi: sumberInformasi,
    };
  
    try {
      const response = await fetch("http://localhost:8000/api/pendaftaran", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      console.log("Response pendaftaran:", data); // Debug log
  
      if (!response.ok) {
        throw new Error(data.message || "Pendaftaran gagal");
      }
  
      // alert("Pendaftaran berhasil!");
  
      // PERBAIKAN: Ambil ID dari response yang sudah diperbaiki
      const pendaftaranId = data.id || data.data?.pendaftaran_id;
      
      if (!pendaftaranId) {
        throw new Error("ID Pendaftaran tidak ditemukan dalam response");
      }
  
      console.log("Navigating to payment with ID:", pendaftaranId); // Debug log
      
      // Navigasi ke halaman payment dengan pendaftaranId
      navigate(`/payment?pendaftaranId=${pendaftaranId}`);
        
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      alert(error.message || "Terjadi kesalahan saat mengirim data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
  
      <div className="flex flex-1 justify-center items-center p-6 md:p-20">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          {/* Images Section */}
          <div className="flex flex-col gap-8 items-center">
            <img src={image} alt="Penghargaan" className="rounded-xl shadow-lg w-[300px] md:w-[500px]" />
            <img src={image} alt="Penghargaan" className="rounded-xl shadow-lg w-[300px] md:w-[500px]" />
          </div>
  
          {/* Form Section */}
          <form
            onSubmit={handleSubmit}
            className="bg-gray-100 rounded-2xl p-6 md:p-10 w-full max-w-md shadow-xl space-y-6"
          >
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Asal Sekolah</label>
              <input
                type="text"
                value={asalSekolah}
                onChange={(e) => setAsalSekolah(e.target.value)}
                placeholder="Masukkan asal sekolah"
                required
                className="bg-white border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
  
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Nomor Handphone (WA) Orang Tua</label>
              <div className="flex items-center gap-2">
                <span className="bg-white border border-gray-300 p-3 rounded-lg">+62</span>
                <input
                  type="tel"
                  value={noTelpOrtu}
                  onChange={(e) => setNoTelpOrtu(e.target.value)}
                  placeholder="Contoh: 89567843212"
                  required
                  className="bg-white border border-gray-300 p-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
  
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Sumber Informasi</label>
              <input
                type="text"
                value={sumberInformasi}
                onChange={(e) => setSumberInformasi(e.target.value)}
                placeholder="Contoh: Instagram, Teman, Brosur"
                required
                className="bg-white border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
  
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center 
                           bg-gradient-to-r from-blue-600 to-red-600
                           text-white text-base font-semibold py-3 
                           rounded-full
                           border-2 border-white
                           hover:from-blue-700 hover:to-red-700
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                           transition-all duration-300 shadow-lg"
            >
              {isSubmitting ? "Mendaftar..." : "Daftar Sekarang"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
  
};

export default Pendaftaran;