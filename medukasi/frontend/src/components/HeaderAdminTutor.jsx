// Header.jsx - Debug Version
import React, { useEffect, useState } from 'react';
import logo from '../assets/logo_medukasi.png';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Load user data dengan error handling
    useEffect(() => {
        try {
            const userData = localStorage.getItem("user_data");
            const token = localStorage.getItem("auth_token");
            
            console.log('--- Header Debug ---');
            console.log('Raw user data:', userData);
            console.log('Token exists:', !!token);
            
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                console.log('✅ User loaded:', parsedUser.email, 'Role:', parsedUser.role);
            } else {
                console.log('❌ No user data found');
                setUser(null);
            }
        } catch (error) {
            console.error('❌ Error parsing user data:', error);
            localStorage.removeItem("user_data");
            localStorage.removeItem("auth_token");
            setUser(null);
        }
    }, []);

    const getInitial = (email) => {
        return email ? email.charAt(0).toUpperCase() : "👤";
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("auth_token");
            
            if (token) {
                await fetch("http://localhost:8000/api/logout", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/json"
                    }
                });
            }

            localStorage.removeItem("auth_token");
            localStorage.removeItem("user_data");
            setUser(null);
            
            console.log('✅ Logout successful');
            navigate("/login");
        } catch (error) {
            console.error("❌ Logout error:", error);
            // Tetap hapus data lokal meski API gagal
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user_data");
            setUser(null);
            navigate("/login");
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Search query:', searchQuery);
    };

    const handleProfileClick = () => {
        console.log('Profile clicked - navigating to /profile-admin');
        console.log('Current user:', user);
    };

    return (
        <header className="flex justify-between items-center px-8 py-4 bg-gradient-to-r from-red-400 via-purple-500 to-indigo-900 text-white shadow-lg">
            {/* Logo Section */}
            <div className="flex items-center">
                <img src={logo} alt="FME Logo" className="h-10 w-auto" />
            </div>

            {/* Search Bar Section */}
            <div className="flex-1 max-w-2xl mx-8">
                <form onSubmit={handleSearch} className="relative">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg 
                                className="h-5 w-5 text-gray-400" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                                />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white/90 backdrop-blur-sm border-0 rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white shadow-sm transition-all duration-200"
                        />
                    </div>
                </form>
            </div>

            {/* User Section */}
            <div className="flex items-center gap-6">
                {/* Notification Icon */}
                <button className="relative p-2 hover:bg-white/10 rounded-full transition-colors duration-200">
                    <svg 
                        className="h-6 w-6 text-white" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                        />
                    </svg>
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        3
                    </span>
                </button>

                {/* User Profile */}
                {user ? (
                    <div className="relative group">
                        <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full w-10 h-10 flex items-center justify-center text-sm font-semibold cursor-pointer hover:bg-white/30 transition-all duration-200">
                            {getInitial(user.email)}
                        </div>
                        <div className="absolute right-0 mt-2 bg-white text-black rounded-xl shadow-xl p-2 hidden group-hover:block z-20 min-w-48 border border-gray-200">
                            <hr className="my-1" />
                            <button 
                                onClick={handleLogout} 
                                className="block px-4 py-2 text-left w-full text-sm hover:bg-red-50 hover:text-red-600 rounded-lg mx-1 my-1 transition-colors duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <Link 
                        to="/login" 
                        className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full w-10 h-10 flex items-center justify-center text-sm font-semibold hover:bg-white/30 transition-all duration-200"
                    >
                        👤
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;