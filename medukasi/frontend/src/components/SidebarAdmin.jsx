import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo_medukasi.png';


const SidebarAdmin = ({ activeMenu, setActiveMenu }) => {
  const navigate = useNavigate();
  
  // Daftar menu dengan ikon sesuai desain awal
  const menuItems = [
    {
      name: 'Jumlah Pendaftar',
      icon: (
        <svg className="w-5 h-5 text-[#6B5B8E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6M3 20h5v-2a4 4 0 00-3-3.87M16 4a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ), // Ikon user-group
      type: 'menu'
    },
    {
      name: 'Konfirmasi Pembayaran',
      icon: (
        <svg className="w-5 h-5 text-[#6B5B8E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ), // Ikon check-circle / verifikasi
      type: 'menu'
    },
    {
      name: 'Register Admin Tutor',
      icon: (
        <svg className="w-5 h-5 text-[#6B5B8E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-1.414 1.414a2 2 0 01-2.828 0l-1.414-1.414m5.656 0a2 2 0 010 2.828L12 14l-4 1 1-4 6.364-6.364a2 2 0 012.828 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11l4 4m-6 2H5a2 2 0 01-2-2V5a2 2 0 012-2h7" />
        </svg>
      ), // Ikon edit-user / tambah admin
      type: 'link',
      path: '/register-admin-tutor'
    }
    
  ];
  
  // Function to handle menu item click
  const handleMenuItemClick = (item) => {
    if (item.type === 'menu') {
      setActiveMenu(item.name);
    } else if (item.type === 'link') {
      navigate(item.path);
    }
  };
  
  return (
<div className="h-full bg-gradient-to-b from-pink-100 to-indigo-100 p-4 shadow-xl flex flex-col">

{/* Header Section */}
      <div className="flex items-center">
                      <img src={logo} alt="FME Logo" className="h-9 w-auto" />
                    </div>

      {/* Menu Section */}
      <div className="flex-1 overflow-auto">
        <h2 className="text-sm font-semibold text-[#5A4A75] uppercase mb-4 tracking-wide">MENU</h2>
        
        <div className="space-y-2 pr-2">
          {menuItems.map((item) => (
            <div 
              key={item.name}
              className={`group transition-colors cursor-pointer rounded-lg ${
                item.type === 'menu' && activeMenu === item.name ? 'bg-[#E7DEEE]' : 'hover:bg-[#E7DEEE]'
              }`}
              onClick={() => handleMenuItemClick(item)}
            >
              <div className="flex items-center gap-3 p-3">
                {item.icon}
                <span className="text-[#4A3A6A] text-sm font-medium">{item.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarAdmin;
