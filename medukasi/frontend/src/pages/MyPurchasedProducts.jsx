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
    const [debugInfo, setDebugInfo] = useState(null); // New state for debug info
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
                
                // Add detailed user info logging
                console.log('User data details:', {
                    user_id: userData.user_id,
                    id: userData.id,  // Check if both ID fields exist
                    email: userData.email,
                    role: userData.role
                });
            } else {
                console.log('--- MyPurchasedProducts Debugging ---');
                console.log('Warning: User data found, but user ID (user_id) is missing from it.');
                console.log('Full user data object:', userData);
            }

            // Implementasi retry mechanism
            let retryCount = 0;
            const maxRetries = 3;
            let response;

            // Gunakan konstanta untuk base URL API
            const BACKEND_URL = 'http://localhost:8000';

            while (retryCount < maxRetries) {
                try {
                    console.log(`Mencoba fetch data (percobaan ke-${retryCount + 1})...`);
                    
                    console.log(`🔍 Calling API endpoint: ${BACKEND_URL}/api/my-products with auth token`);
                    
                    response = await fetch(`${BACKEND_URL}/api/my-products`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        // Menambahkan timeout untuk mencegah fetch tergantung terlalu lama
                        signal: AbortSignal.timeout(10000) // 10 detik timeout
                    });
                    
                    console.log("Response status:", response.status, response.statusText);
                    
                    // Jika berhasil, keluar dari loop
                    break;
                } catch (retryError) {
                    console.error(`Percobaan ${retryCount + 1} gagal:`, retryError);
                    retryCount++;
                    
                    // Jika sudah mencapai batas maksimum percobaan, lempar error
                    if (retryCount >= maxRetries) {
                        throw new Error(`Gagal terhubung ke server setelah ${maxRetries} kali percobaan. Server mungkin sedang down atau ada masalah koneksi.`);
                    }
                    
                    // Tunggu sebelum mencoba lagi (backoff eksponensial)
                    await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
                }
            }

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage;
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || `Server merespon dengan status: ${response.status} ${response.statusText}`;
                } catch (e) {
                    errorMessage = `Server merespon dengan status: ${response.status} ${response.statusText}\nResponse: ${errorText}`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            setProducts(data.data);
            
            // Store debug info
            setDebugInfo({
                responseData: data,
                timestamp: new Date().toISOString()
            });

            // --- CONSOLE LOG: Data Pendaftaran dan Produk + Detail Pembayaran ---
            console.log('Data yang diterima dari /api/my-products:', data);
            
            // Log the SQL query used (not actual SQL, just for debugging purposes)
            console.log("🔍 DEBUG SQL Query (pseudo): SELECT * FROM pendaftaran WHERE user_id = " + userData.user_id + 
                        " AND EXISTS (SELECT * FROM pembayaran WHERE pembayaran.pendaftaran_id = pendaftaran.pendaftaran_id AND pembayaran.status_konfirmasi = 'sukses')");
            
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
                console.log('Pastikan pembayaran sudah dikonfirmasi dengan status "sukses" di database.');
                
                // Check if user ID might be different between frontend and backend
                console.log('⚠️ HINT: Periksa apakah user_id di frontend (' + userData.user_id + ') sama dengan ID user di backend.');
            }
            // --- END CONSOLE LOG ---

        } catch (err) {
            setError(err.message || "Terjadi kesalahan saat mengambil data produk Anda");
            console.error('Error fetching purchased products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewMaterials = (produkId) => {
        navigate(`/my-products/${produkId}/materials`);
    };

    // Function to show debug info
    const showDebugModal = () => {
        if (debugInfo) {
            console.log("Full API Response:", debugInfo.responseData);
            alert(`Debug info has been logged to console. Check browser developer tools.`);
        } else {
            alert("No debug info available");
        }
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
                <p className="mb-6 text-sm text-gray-500">
                  Pastikan pembayaran Anda sudah dikonfirmasi dengan status "sukses" oleh admin.
                </p>
                <div className="flex flex-col gap-3 max-w-sm mx-auto">
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
                  
                  {/* Debug button for developers */}
                  <button
                    onClick={showDebugModal}
                    className="text-sm text-gray-500 underline mt-4"
                  >
                    Debug Info (For Developers)
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {products.map((pendaftaran) => (
                  <div
                    key={pendaftaran.pendaftaran_id} // Change from produk.produk_id to pendaftaran_id to avoid duplicate keys
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