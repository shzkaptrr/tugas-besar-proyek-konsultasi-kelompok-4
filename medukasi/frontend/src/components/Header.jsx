// Header.jsx
import React, { useEffect } from 'react'; // <--- Tambahkan useEffect
import logo from '../assets/logo_medukasi.png';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user_data")); // User data dari localStorage

    // --- Debugging Console Log: User yang sedang login ---
    useEffect(() => {
        if (user) {
            console.log('--- Header Debugging ---');
            console.log(`User saat ini login: ID ${user.user_id}, Email: ${user.email}, Role: ${user.role}`);
        } else {
            console.log('--- Header Debugging ---');
            console.log('Tidak ada user yang login.');
        }
    }, [user]); // Jalankan efek ini setiap kali user (dari localStorage) berubah
    // --- End Debugging Console Log ---

    const getInitial = (email) => {
        return email ? email.charAt(0).toUpperCase() : "👤";
    };

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:8000/api/logout", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
                    "Accept": "application/json"
                }
            });

            localStorage.removeItem("auth_token");
            localStorage.removeItem("user_data");

            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <header className="flex justify-between items-center px-10 py-5 bg-gradient-to-r from-red-400 to-indigo-900 text-white ">
            <div className="flex items-center">
                <img src={logo} alt="FME Logo" className="h-9 w-auto" />
            </div>

            <nav className="flex items-center gap-6">
                <Link to="/home-after-login" className="hover:underline">Home</Link>
                <Link to="/class-before-buy" className="hover:underline">Class</Link>
               
                {/* --- Perubahan Link "My Class" --- */}
                <Link to="/my-products" className="hover:underline">My Class</Link>
                <Link to="#" className="hover:underline">Contacts</Link>
                {/* --- End Perubahan --- */}

                {user ? (
                    <div className="relative group">
                        <div className="bg-white text-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold cursor-pointer">
                            {getInitial(user.email)}
                        </div>
                        <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg p-2 hidden group-hover:block z-10">
                            <Link to="/dashboard-student" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
                            <button onClick={handleLogout} className="block px-4 py-2 text-left w-full hover:bg-gray-100">Logout</button>
                        </div>
                    </div>
                ) : (
                    <Link to="/login" className="bg-white text-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">👤</Link>
                )}
            </nav>
        </header>
    );
};

export default Header;