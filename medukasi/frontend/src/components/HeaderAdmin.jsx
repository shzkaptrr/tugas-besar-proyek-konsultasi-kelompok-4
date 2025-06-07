// HeaderAdmin.jsx
import React from 'react';
import logo from '../assets/logo_medukasi.png';
const HeaderAdmin = ({ toggleSidebar }) => {
  return (
    <div className="flex justify-between items-center px-10 py-5 bg-gradient-to-r from-red-400 to-indigo-900 text-white">
      {/* Logo dan Menu Button - Dipindah ke kiri */}
      <div className="flex items-center w-56"> {/* Lebar sama dengan sidebar */}
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-white/10 transition-colors mr-4"
        >
         
        </button>
        <div className="flex items-center">
                <img src={logo} alt="FME Logo" className="h-9 w-auto" />
              </div>
      </div>
      
      {/* Search Bar - Diposisikan sejajar dengan konten utama */}
      <div className="flex-1 ml-6"> {/* Margin kiri disesuaikan */}
        <div className="relative max-w-2xl">
          <input
            type="text"
            placeholder="Search..."
            className="w-full py-2 px-4 pl-10 rounded-lg bg-white/70 text-white placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/30 transition-all"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-black/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      {/* Icons and User Profile */}
      <div className="flex items-center gap-5">
        <button className="p-1 relative hover:bg-white/10 rounded-full p-2 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-400"></span>
        </button>
        
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="h-9 w-9 rounded-full bg-white overflow-hidden border-2 border-white/30 group-hover:border-white/50 transition-colors">
            <img src={logo} alt="User" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderAdmin;
