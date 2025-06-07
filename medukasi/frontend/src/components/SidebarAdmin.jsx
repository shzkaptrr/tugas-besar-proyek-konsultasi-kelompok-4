import React from 'react';
import logo from '../assets/logo_medukasi.png';


const SidebarAdmin = ({ activeMenu, setActiveMenu }) => {
  // Daftar menu dengan ikon sesuai desain awal
  const menuItems = [
    {
      name: 'Jumlah Pendaftar',
      icon: (
        <svg className="w-5 h-5 text-[#6B5B8E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      name: 'Konfirmasi Pembayaran',
      icon: (
        <svg className="w-5 h-5 text-[#6B5B8E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ];
  
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
                activeMenu === item.name ? 'bg-[#E7DEEE]' : 'hover:bg-[#E7DEEE]'
              }`}
              onClick={() => setActiveMenu(item.name)}
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
