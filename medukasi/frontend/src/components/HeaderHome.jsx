import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo_medukasi.png';

const Header = () => {
  return (
    <header className="flex justify-between items-center px-10 py-5 bg-gradient-to-r from-red-400 to-indigo-900 text-white rounded-t-xl ">
      <div className="flex items-center">
        <img src={logo} alt="FME Logo" className="h-9 w-auto" />
      </div>

      <nav className="flex items-center gap-6 text-sm">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/login" className="hover:underline">Product</Link>
        <Link to="#" className="hover:underline">Testimoni</Link>
        <Link to="/register">
        <button
  className="
    bg-gradient-to-r from-blue-600 to-red-600   /* Gradien Biru ke Merah */
    text-white text-base font-semibold py-3          /* Warna teks putih, ukuran dan ketebalan */
    px-6 py-2.5                                  /* Padding disesuaikan agar lebih proporsional dengan rounded-full */
    rounded-full                                 /* Sangat bulat */                      /* Border putih 2px */
    hover:from-blue-700 hover:to-red-700         /* Efek hover pada gradien */
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    transition-all duration-300 shadow-lg        /* Transisi dan shadow */
  "
>
  Sign Up
</button>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
