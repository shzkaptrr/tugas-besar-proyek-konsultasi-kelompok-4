import React from 'react';
import { useNavigate } from 'react-router-dom';

const SidebarTutor = ({ activeMenu, setActiveMenu, isSidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: 'Profil Tutor',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      name: 'Program Saya',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      name: 'Daftar Siswa',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
  ];

  // Function to handle menu item click
  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName);
    if (menuName === 'Proifl Tutor') {
      // Handle logout
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      navigate('/login');
    }
  };

  return (
    <aside
      className={`bg-gradient-to-b from-blue-600 to-red-600 text-white w-64 min-h-screen transition-all duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 fixed md:static z-40`}
    >
      {/* Close button for mobile */}
      <button
        className="absolute top-4 right-4 md:hidden"
        onClick={() => setSidebarOpen(false)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Logo */}
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold">Dashboard Tutor</h2>
        <p className="text-sm mt-2">Medukasi Indonesia</p>
      </div>

      {/* Menu Items */}
      <nav className="mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <button
                className={`flex items-center space-x-3 px-6 py-3 w-full hover:bg-white hover:text-blue-600 transition-colors ${
                  activeMenu === item.name ? 'bg-white text-blue-600' : ''
                }`}
                onClick={() => handleMenuClick(item.name)}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarTutor;