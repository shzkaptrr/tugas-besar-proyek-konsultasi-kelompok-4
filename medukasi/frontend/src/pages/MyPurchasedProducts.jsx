// src/pages/MyPurchasedProducts.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import Header from '../components/Header'; 
import Footer from '../components/Footer';




const MyPurchasedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        const userDataString = localStorage.getItem('user_data');

        if (!token || !userDataString) {
            setError('Authentication token or user data not found. Please log in.');
            setLoading(false);
            console.log('--- MyPurchasedProducts Debugging ---');
            console.log('Error: Token or user data not found in localStorage during initial load.');
            return;
        }

        fetchMyProducts(token, userDataString);
    }, []);

    const fetchMyProducts = async (token, userDataString) => {
        setLoading(true);
        setError(null);
        try {
            const userData = JSON.parse(userDataString);

            if (userData && userData.user_id) { // Menggunakan user_id
                console.log('--- MyPurchasedProducts Debugging ---');
                console.log(`User ID yang sedang login: ${userData.user_id}`);
            } else {
                console.log('--- MyPurchasedProducts Debugging ---');
                console.log('Warning: User data found, but user ID (user_id) is missing from it.');
            }

            const response = await fetch('http://localhost:8000/api/my-products', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch purchased products');
            }

            const data = await response.json();
            setProducts(data.data);

            // --- CONSOLE LOG: Data Pendaftaran dan Produk + Detail Pembayaran ---
            console.log('Data yang diterima dari /api/my-products:', data);
            if (data.data && data.data.length > 0) {
                console.log('Detail Pendaftaran dan Produk yang Ditemukan:');
                data.data.forEach((pendaftaran, index) => {
                    console.log(`Pendaftaran #${index + 1}:`);
                    console.log(`  ID Pendaftaran: ${pendaftaran.pendaftaran_id}`);
                    console.log(`  Produk ID: ${pendaftaran.produk_id} (Produk: ${pendaftaran.produk ? pendaftaran.produk.nama_produk : 'N/A'})`);

                    // <--- TAMBAHKAN BAGIAN INI UNTUK DETAIL PEMBAYARAN
                    console.log(`  Detail Pembayaran:`);
                    if (pendaftaran.pembayaran && pendaftaran.pembayaran.length > 0) {
                        pendaftaran.pembayaran.forEach((p, idx) => {
                            console.log(`    Pembayaran #${idx + 1} ID: ${p.pembayaran_id}, Status: ${p.status_konfirmasi}, Jumlah: ${p.jumlah_pembayaran}`);
                        });
                    } else {
                        console.log(`    Tidak ada detail pembayaran yang diload untuk pendaftaran ini.`);
                    }
                    // --- END TAMBAHAN ---
                    
                    console.log('---');
                });
            } else {
                console.log('Tidak ada produk yang dibeli atau data kosong.');
            }
            // --- END CONSOLE LOG ---

        } catch (err) {
            setError(err.message);
            console.error('Error fetching purchased products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewMaterials = (produkId) => {
        navigate(`/my-products/${produkId}/materials`);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <p className="text-lg text-gray-700">Loading your products...</p>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <p className="text-red-600 font-semibold">Error: {error}</p>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-white">
          <Header />
      
          <div className="mt-8 max-w-4xl flex-1 mx-auto pb-20">
            <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-8 flex items-center justify-center">
              <ShoppingBag className="inline-block mr-3" size={32} />
              Produk Saya
            </h1>
      
            {products.length === 0 ? (
              <div className="text-center py-16 text-gray-700">
                <p className="text-lg mb-6">Anda belum memiliki produk yang dibeli.</p>
                <button
                  onClick={() => navigate('/product')}
                  className="w-full flex justify-center items-center 
                           bg-gradient-to-r from-blue-600 to-red-600
                           text-white text-base font-semibold py-3 
                           rounded-full
                           border-2 border-white
                           hover:from-blue-700 hover:to-red-700
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                           transition-all duration-300 shadow-lg"
                >
                  <ArrowRight className="mr-2" size={20} />
                  Lihat Semua Produk
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {products.map((pendaftaran) => (
                  <div
                    key={pendaftaran.produk.produk_id}
                    className="bg-gradient-to-br from-red-500 to-indigo-900 p-1 rounded-2xl shadow-2xl"
                  >
                    {/* Inner glass-style card */}
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 sm:p-8 border border-white/10">
                      <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 sm:p-8">
                        <h2 className="text-2xl font-bold text-white mb-2">
                          {pendaftaran.produk.nama_produk}
                        </h2>
                        <p className="text-white/80 text-base leading-relaxed">
                          {pendaftaran.produk.deskripsi}
                        </p>
      
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4 border-t border-white/20 mt-4">
                          <div>
                            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-2">
                              Status Produk
                            </h3>
                            <p className="text-white">Aktif</p>
                          </div>
                         
                        </div>
      
                        <div className="flex flex-col pt-4 border-t border-white/20 gap-3">
  <div className="text-white/70 text-sm">
    Klik tombol di samping untuk mengakses materi pembelajaran
  </div>
  <button
    onClick={() => handleViewMaterials(pendaftaran.produk.produk_id)}
    className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-lg text-white bg-white/20 backdrop-blur-sm hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transform transition-all duration-200 hover:scale-105"
  >
    Lihat Materi
    <ArrowRight className="ml-2 -mr-1" size={16} />
  </button>
</div>


                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Footer />
        </div>
      );
     
      
};

export default MyPurchasedProducts;