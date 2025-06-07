import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/HeaderHome";
import logo from "../assets/logo_medukasi.png";
import logo2 from "../assets/image.png"; // Ini adalah ilustrasi yang Anda maksud
import emailIcon from "../assets/login/email.png";
import keyIcon from "../assets/login/key.png";
import userIcon from "../assets/login/user.png";

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    no_hp: "",
    email: "",
    qpassword: "",
    password_confirmation: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.qpassword !== formData.password_confirmation) {
      alert("Password dan konfirmasi tidak cocok!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          nama_lengkap: formData.nama_lengkap,
          no_hp: formData.no_hp,
          email: formData.email,
          password: formData.qpassword,
          password_confirmation: formData.password_confirmation,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join("\n");
          alert(`Registrasi gagal:\n${errorMessages}`);
        } else {
          alert(result.message || "Registrasi gagal");
        }
        return;
      }

      if (result.token && result.user) {
        localStorage.setItem("auth_token", result.token);
        localStorage.setItem("user_data", JSON.stringify(result.user));
        alert("Registrasi berhasil! Kamu langsung login.");
        navigate("/home-after-login");
      } else {
        alert("Registrasi berhasil! Silakan login.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan jaringan saat registrasi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div
        className="min-h-screen flex flex-col lg:flex-row bg-gray-50" // Background halaman utama
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {/* Left Side - Illustration and Branding */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 lg:p-12 relative">
          <div className="text-center w-full"> {/* Pastikan container teks mengambil lebar penuh untuk alignment */}
            {/* Logo Medukasi - Tetap di atas */}
            <img src={logo} alt="Logo Medukasi" className="h-20 mx-auto mb-8 object-contain" />

            {/* Ilustrasi Utama - logo2, ini yang diperbesar dan diletakkan di atas teks */}
            <img src={logo2} alt="Ilustrasi Medukasi" className="h-64 md:h-80 mx-auto mb-6 object-contain" /> {/* Ukuran ilustrasi lebih besar */}

            <h3 className="text-3xl font-bold text-gray-800 mb-3">
              Mulai Petualangan Belajarmu!
            </h3>
            <p className="text-gray-600 max-w-sm mx-auto">
              Akses materi berkualitas, interaksi real-time, dan komunitas suportif yang akan membimbing Anda.
            </p>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white shadow-xl lg:rounded-3xl"> {/* shadow dan rounded di sisi kiri untuk transisi ke background */}
          <div className="w-full max-w-md">
            {/* Logo for Mobile (shown only on smaller screens) */}
            <div className="lg:hidden flex justify-center mb-8">
              <img src={logo} alt="Logo Medukasi" className="h-16 object-contain" />
            </div>

            {/* Title and Subtitle */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Daftar Akun Baru
              </h2>
              <p className="text-gray-600">
                Bergabunglah dengan platform belajar terbaik Anda.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Input Nama Lengkap */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <img src={userIcon} alt="User" className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="nama_lengkap"
                  placeholder="Nama Lengkap"
                  className="pl-10 pr-3 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 outline-none"
                  value={formData.nama_lengkap}
                  onChange={handleChange}
                  required
                  autoComplete="name" // <-- Tambahkan ini
                />
              </div>

              {/* Input Nomor Handphone */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <span className="text-gray-500 mr-2">+62</span>
                </div>
                <input
                  type="tel"
                  name="no_hp"
                  placeholder="Nomor Handphone"
                  className="pl-16 pr-3 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 outline-none"
                  value={formData.no_hp}
                  onChange={handleChange}
                  required
                  autoComplete="tel" // <-- Tambahkan ini
                />
              </div>

              {/* Input Email */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <img src={emailIcon} alt="Email" className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="pl-10 pr-3 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 outline-none"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email" // <-- Tambahkan ini
                />
              </div>

              {/* Input Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <img src={keyIcon} alt="Password" className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="qpassword"
                  placeholder="Password"
                  className="pl-10 pr-3 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 outline-none"
                  value={formData.qpassword}
                  onChange={handleChange}
                  required
                  minLength="6"
                  autoComplete="new-password" // <-- Tambahkan ini
                />
              </div>

              {/* Input Konfirmasi Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <img src={keyIcon} alt="Confirm Password" className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password_confirmation"
                  placeholder="Konfirmasi Password"
                  className="pl-10 pr-3 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 outline-none"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                  minLength="6"
                  autoComplete="new-password" // <-- Tambahkan ini
                />
              </div>

              {/* Tombol Register */}
              <button
                type="submit"
                className="w-full flex justify-center items-center 
                           bg-gradient-to-r from-blue-600 to-red-600 {/* Gradien Biru ke Merah */}
                           text-white text-base font-semibold py-3 
                           rounded-full {/* Sangat bulat */}
                           border-2 border-white {/* Border putih 2px */}
                           hover:from-blue-700 hover:to-red-700 {/* Efek hover pada gradien */}
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                           transition-all duration-300 shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  "Register"
                )}
              </button>
            </form>

            {/* Link Login */}
            <p className="mt-6 text-center text-sm text-gray-600">
              Sudah punya akun?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline hover:text-blue-700 transition duration-200"
              >
                Login di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}