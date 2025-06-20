import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/HeaderHome";
import logo from "../assets/logo_medukasi.png";
import logo2 from "../assets/image.png"; // Ilustrasi yang sama dengan register
import emailIcon from "../assets/login/email.png";
import keyIcon from "../assets/login/key.png";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // State untuk Remember Me
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi client-side sederhana
    if (!formData.email || !formData.password) {
      alert('Email dan password harus diisi');
      return;
    }
  
    setIsLoading(true);
    
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(), // Trim whitespace
          password: formData.password
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        // Handle error response dari Laravel
        throw new Error(
          data.message || 
          data.errors?.email?.[0] || 
          'Login gagal. Silakan coba lagi.'
        );
      }
  
      // Jika login berhasil
      if (data.token) {
        // Simpan token dan user data ke localStorage
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        
        // BARU: Simpan kredensial jika user menyetujui "remember me"
        if (rememberMe) {
          const credentials = JSON.stringify({
            email: formData.email.trim(),
            password: formData.password
          });
          localStorage.setItem('user_credentials', credentials);
          console.log('✅ Kredensial login disimpan untuk login otomatis.');
        } else {
          // Hapus kredensial jika tidak ingin diingat
          localStorage.removeItem('user_credentials');
        }
        
        alert("Login berhasil!");
      
        const role = data.user.role;
      
        if (role === 'siswa') navigate("/home-after-login");
        else if (role === 'tutor') navigate("/dashboard-tutor");
        else if (role === 'admin') navigate("/dashboard-admin");
      }
      
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message || 'Terjadi kesalahan saat login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div
        className="min-h-screen flex flex-col lg:flex-row bg-gray-50"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {/* Left Side - Illustration and Branding */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 lg:p-12 relative">
          <div className="text-center w-full">
            {/* Logo Medukasi - Tetap di atas */}
            <img src={logo} alt="Logo Medukasi" className="h-20 mx-auto mb-8 object-contain" />

            {/* Ilustrasi Utama - logo2, ini yang diperbesar dan diletakkan di atas teks */}
            <img src={logo2} alt="Ilustrasi Medukasi" className="h-64 md:h-80 mx-auto mb-6 object-contain" />

            <h3 className="text-3xl font-bold text-gray-800 mb-3">
              Selamat Datang Kembali!
            </h3>
            <p className="text-gray-600 max-w-sm mx-auto">
              Masuk ke akun Anda dan lanjutkan perjalanan belajar yang menakjubkan bersama kami.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white shadow-xl lg:rounded-3xl">
          <div className="w-full max-w-md">
            {/* Logo for Mobile (shown only on smaller screens) */}
            <div className="lg:hidden flex justify-center mb-8">
              <img src={logo} alt="Logo Medukasi" className="h-16 object-contain" />
            </div>

            {/* Title and Subtitle */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Masuk Akun
              </h2>
              <p className="text-gray-600">
                Silakan masuk untuk melanjutkan pembelajaran Anda.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
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
                  autoComplete="off" // <-- Tambahkan ini
                />
              </div>

              {/* Input Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <img src={keyIcon} alt="Password" className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="pl-10 pr-3 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 outline-none"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  autoComplete="new-password" // <-- Tambahkan ini
                />
              </div>

              {/* Remember Me Checkbox - Baru ditambahkan */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-gray-800"
                >
                  Ingat saya
                </label>
              </div>

              {/* Tombol Login */}
              <button
                type="submit"
                className="w-full flex justify-center items-center 
                           bg-gradient-to-r from-blue-600 to-red-600
                           text-white text-base font-semibold py-3 
                           rounded-full
                           border-2 border-white
                           hover:from-blue-700 hover:to-red-700
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
                  "Login"
                )}
              </button>
            </form>

            {/* Link Register */}
            <p className="mt-6 text-center text-sm text-gray-600">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-semibold hover:underline hover:text-blue-700 transition duration-200"
              >
                Register di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}