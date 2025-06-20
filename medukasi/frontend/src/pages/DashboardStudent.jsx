// DashboardStudent.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import profileImg from '../assets/login/avatar.jpg';
import searchIcon from '../assets/class/search.png';

export default function DashboardStudent() {
  const [searchInput, setSearchInput] = useState('');
  const [user, setUser] = useState(null);
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user_data"));
    if (!storedUser) {
      navigate("/login"); // redirect kalau belum login
    } else {
      setUser(storedUser);
      // Fetch produk yang sudah dibeli
      fetchPurchasedProducts();
    }
  }, []);

  // Fungsi untuk mengambil daftar produk yang telah dibeli
  const fetchPurchasedProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Token not found");
      }

      console.log('🔍 Fetching purchased products...');
      
      const response = await fetch("http://localhost:8000/api/my-products", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch purchased products");
      }

      const result = await response.json();
      console.log('✅ Purchased products fetched successfully:', result);
      
      // Ekstrak array pendaftaran dari respons API
      if (result.data && Array.isArray(result.data)) {
        console.log('📋 Found', result.data.length, 'purchased products');
        setPurchasedProducts(result.data);
      } else {
        console.warn('⚠️ Unexpected API response structure:', result);
        setPurchasedProducts([]);
      }
    } catch (err) {
      console.error('❌ Error fetching purchased products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk memformat harga
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Fungsi untuk mengarahkan ke halaman materi
  const navigateToMaterials = (productId) => {
    navigate(`/my-products/${productId}/materials`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1 p-8">
        
          {/* Profile Card */}
          <section className="bg-gradient-to-b from-red-400 to-indigo-900 rounded-xl p-5 mb-8 mx-8 text-white">
            <div className="flex items-center">
              <img src={profileImg} alt="Profile" className="w-20 h-20 rounded-2xl object-cover mr-6" />
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{user?.name || user?.email || "Nama Pengguna"}</h2>
                <div className="flex justify-between">
                  <div>
                    <p className="text-base">Bergabung sejak 2025</p>
                    <p className="text-base">Kota Bandung</p>
                  </div>
                  <Link to="/statistic-monitoring" className="self-end hover:underline">
                    Statistik & Monitoring
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Search Section */}
          <section className="flex justify-between items-center mb-8 px-6">
            <h3 className="text-2xl font-bold text-gray-900">Daftar Kelas</h3>
            <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
              <img src={searchIcon} alt="Cari" className="w-4 h-4 mr-2" />
              <input
                type="text"
                placeholder="Cari kelas"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="bg-transparent text-sm w-24 focus:outline-none"
              />
            </div>
          </section>

          {/* Loading dan Error States */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="spinner w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 mx-6 rounded">
              <p>{error}</p>
              <button 
                className="text-blue-600 underline mt-2"
                onClick={fetchPurchasedProducts}
              >
                Coba lagi
              </button>
            </div>
          )}

          {/* Class Cards - Purchased Products */}
          {!loading && !error && (
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
              {purchasedProducts.length === 0 ? (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-600 mb-4">Belum ada kelas yang dibeli</p>
                  <Link 
                    to="/products" 
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-xl transition-colors"
                  >
                    Jelajahi Kelas
                  </Link>
                </div>
              ) : (
                purchasedProducts
                  .filter(pendaftaran => 
                    pendaftaran.produk && pendaftaran.produk.nama_produk &&
                    pendaftaran.produk.nama_produk.toLowerCase().includes(searchInput.toLowerCase())
                  )
                  .map((pendaftaran) => {
                    // Pastikan produk tersedia
                    if (!pendaftaran.produk) return null;
                    
                    const product = pendaftaran.produk;
                    
                    return (
                      <div
                        key={pendaftaran.pendaftaran_id}
                        className="bg-gradient-to-b from-red-400 to-indigo-900 rounded-xl p-6 text-white"
                      >
                        <div className="flex flex-col items-center mb-4">
                         
                          <h4 className="text-lg font-bold">{product.nama_produk}</h4>
                        </div>
                        <div className="text-center mb-3">
                          <span className="bg-blue-700 text-white text-xs px-2 py-1 rounded-full">
                            {formatPrice(product.harga)}
                          </span>
                        </div>
                        <p className="text-center mb-6 h-12 overflow-hidden">
                          {product.deskripsi_produk || product.deskripsi || "Kelas ini mencakup berbagai materi pembelajaran yang komprehensif"}
                        </p>
                        <button
                          onClick={() => navigateToMaterials(product.produk_id)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl cursor-pointer transition-colors"
                        >
                          Lihat Materi
                        </button>
                      </div>
                    );
                  })
              )}
            </section>
          )}
      </main>
    </div>
  );
}
