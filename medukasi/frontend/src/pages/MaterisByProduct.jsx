// src/pages/MaterisByProduct.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Play, FileText, Download, Clock, ChevronRight, CheckCircle, XCircle, Users } from 'lucide-react';
import Header from '../components/Header';
import AuthContext from '../components/AuthContext';

const MaterisByProduct = () => {
    const { produkId } = useParams(); // Ambil produkId dari URL
    const [materis, setMateris] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { refreshAuth } = useContext(AuthContext);
    const [retryAttempts, setRetryAttempts] = useState(0); // Counter untuk retry

    useEffect(() => {
        console.log('🔍 DEBUG MaterisByProduct: Component loaded with produkId:', produkId);
        
        if (produkId) { // Hanya fetch jika produkId ada
            fetchMaterisForProduct();
        } else {
            setError("Produk ID tidak ditemukan di URL.");
            setLoading(false);
        }
    }, [produkId]); // Re-fetch jika produkId di URL berubah

    const fetchMaterisForProduct = async () => {
        if (retryAttempts > 3) {
            console.error('❌ DEBUG MaterisByProduct: Terlalu banyak percobaan gagal');
            setError('Terlalu banyak percobaan gagal. Silakan coba login kembali.');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            console.log('🔄 DEBUG MaterisByProduct: Fetching materials for produkId:', produkId);
            
            // Dapatkan token terbaru
            const token = localStorage.getItem('auth_token');
            if (!token) {
                console.error('❌ DEBUG MaterisByProduct: Token tidak ditemukan');
                navigate('/login', { replace: true });
                return;
            }

            // Mencoba endpoint untuk mengambil materi (PERBAIKAN: Gunakan format parameter yang konsisten)
            // Menggunakan 'produk_id' yang sama dengan yang didefinisikan di backend route
            let url = `http://localhost:8000/api/produk/${produkId}/materis`;
            console.log('🔑 DEBUG MaterisByProduct: Mencoba endpoint:', url);
            
            let response = await fetch(url, {
                method: 'GET', // Pastikan metode GET
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Cache-Control': 'no-cache', // Pastikan tidak menggunakan cache
                },
            });
            
            console.log('📡 DEBUG MaterisByProduct: API Response Status:', response.status, response.statusText);

            // Handle different response statuses
            if (response.status === 401) {
                console.error('🔒 DEBUG MaterisByProduct: Authentication failed - token may be expired');
                
                // PERBAIKAN: Coba refresh token dengan cepat
                try {
                    // Lakukan request ke backend untuk validasi token
                    const checkResponse = await fetch('http://localhost:8000/api/auth/check', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    });

                    // Jika validasi berhasil tapi endpoint materis gagal, ini masalah permission
                    if (checkResponse.ok) {
                        console.log('✅ DEBUG MaterisByProduct: Token valid, tapi endpoint /materis menolak');
                        throw new Error('Anda tidak memiliki izin untuk mengakses materi produk ini');
                    }
                    
                    // Token tidak valid, coba login otomatis
                    const savedCredentials = localStorage.getItem('user_credentials');
                    if (savedCredentials) {
                        console.log('🔄 DEBUG MaterisByProduct: Mencoba login otomatis');
                        const { email, password } = JSON.parse(savedCredentials);
                        const loginResponse = await fetch('http://localhost:8000/api/login', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ email, password }),
                        });

                        if (loginResponse.ok) {
                            const loginData = await loginResponse.json();
                            localStorage.setItem('auth_token', loginData.token);
                            
                            if (loginData.user) {
                                localStorage.setItem('user_data', JSON.stringify(loginData.user));
                            }
                            
                            console.log('✅ DEBUG MaterisByProduct: Login otomatis berhasil');
                            
                            // PERBAIKAN: Gunakan setRetryAttempts untuk melacak upaya
                            setRetryAttempts(prevAttempts => prevAttempts + 1);
                            fetchMaterisForProduct(); // Recursive call setelah login otomatis
                            return;
                        }
                    }
                } catch (retryError) {
                    console.error('❌ DEBUG MaterisByProduct: Error saat mencoba login otomatis:', retryError);
                }
                
                // Jika tidak berhasil, arahkan ke login
                localStorage.removeItem('auth_token');
                navigate('/login', { 
                    replace: true, 
                    state: { 
                        from: `/my-products/${produkId}/materials`,
                        message: 'Sesi Anda telah berakhir. Silakan login kembali.' 
                    } 
                });
                return;
            }

            if (!response.ok) {
                let errorMessage = 'Failed to fetch materials for this product';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    // Jika response bukan JSON valid, gunakan pesan default
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('✅ DEBUG MaterisByProduct: Materials fetched successfully:', data);
            
            // Reset retry counter setelah berhasil
            setRetryAttempts(0);
            
            // Hitung progress di sini:
            const materisWithProgress = data.data.map(materi => {
              if (!materi.sub_materis || materi.sub_materis.length === 0) {
                return { ...materi, progress: 0 };
              }
              const jumlahDilihat = materi.sub_materis.filter(sub => sub.user_status?.status === 'lihat').length;
              const progress = Math.round((jumlahDilihat / materi.sub_materis.length) * 100);
              console.log(`📊 DEBUG MaterisByProduct: Progress for "${materi.nama_materi}": ${progress}% (${jumlahDilihat}/${materi.sub_materis.length} viewed)`);
              return { ...materi, progress };
            });
            
            setMateris(materisWithProgress);
        } catch (err) {
            console.error('❌ DEBUG MaterisByProduct: Error fetching materials:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubMateriClick = async (subMateri) => {
        const yourAuthToken = localStorage.getItem('auth_token');

        const url = subMateri.konten_path.startsWith('/storage')
          ? `http://localhost:8000${subMateri.konten_path}`
          : subMateri.konten_path;

        try {
          // Membuka konten di tab baru tanpa menunggu API
          window.open(url, '_blank');

          console.log('🔄 Update status untuk sub-materi:', subMateri.judul_sub_materi);

          // Update UI terlebih dahulu (optimistic update)
          setMateris(prevMateris => {
            return prevMateris.map(materi => {
              // Jika materi ini mengandung subMateri yang diklik
              if (materi.sub_materis && materi.sub_materis.some(sm => sm.sub_materi_id === subMateri.sub_materi_id)) {
                // Salin materi dan perbarui sub_materis di dalamnya
                return {
                  ...materi,
                  sub_materis: materi.sub_materis.map(sm => {
                    // Update status subMateri yang diklik
                    if (sm.sub_materi_id === subMateri.sub_materi_id) {
                      return {
                        ...sm,
                        user_status: { ...sm.user_status, status: 'lihat' }
                      };
                    }
                    return sm;
                  }),
                  // Hitung ulang progress
                  progress: calculateProgress(materi, subMateri.sub_materi_id)
                };
              }
              return materi;
            });
          });

          // Lalu kirim request API di background
          const response = await fetch(`http://localhost:8000/api/sub-materi/${subMateri.sub_materi_id}/lihat`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${yourAuthToken}`,
            },
          });

          if (response.ok) {
            console.log('✅ Status berhasil diperbarui di server');
            // Tidak perlu fetch ulang karena UI sudah diupdate secara optimistic
          } else {
            console.error('❌ Gagal memperbarui status di server');
            // Opsional: Rollback optimistic update jika server error
            // fetchMaterisForProduct();
          }
        } catch (error) {
          console.error('❌ Error saat update status:', error);
        }
      };

      // Helper untuk menghitung progress setelah update status
      const calculateProgress = (materi, updatedSubMateriId) => {
        if (!materi.sub_materis || materi.sub_materis.length === 0) return 0;
        
        const total = materi.sub_materis.length;
        const seenCount = materi.sub_materis.filter(sub => 
          sub.user_status?.status === 'lihat' || sub.sub_materi_id === updatedSubMateriId
        ).length;
        
        return Math.round((seenCount / total) * 100);
      };

    const getIconForTipeMateri = (tipe) => {
        switch (tipe) {
            case 'video': return <Play size={20} className="text-red-500" />;
            case 'teks': return <FileText size={20} className="text-blue-500" />;
            case 'pdf': return <Download size={20} className="text-purple-500" />;
            case 'kuis': return <CheckCircle size={20} className="text-green-500" />;
            case 'latihan': return <Users size={20} className="text-yellow-500" />;
            case 'dokumen_eksternal': return <BookOpen size={20} className="text-orange-500" />;
            default: return <BookOpen size={20} className="text-gray-500" />;
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <p className="text-lg text-gray-700">Loading materials...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md flex items-center text-center">
                <XCircle size={24} className="mr-3" />
                <strong className="font-bold">Akses Ditolak:</strong>
                <span className="ml-2">{error}</span>
            </div>
        </div>
    );

    if (!materis.length && !loading && !error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <p className="text-lg text-gray-600">Tidak ada materi ditemukan untuk produk ini.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <h1 className="max-w-4xl mx-auto mt-10 mb-12 text-5xl font-extrabold text-center text-black font-sans drop-shadow-md">
              <BookOpen className="inline-block mr-3" size={48} />
              Materi Kursus
            </h1>


            {/* List materi */}
            {materis.map((materi) => (
              <div
                key={materi.materi_id}
                className="max-w-4xl mx-auto bg-gradient-to-br from-red-500 to-indigo-900 p-1 rounded-xl shadow-2xl mb-10"
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8">
                  
                  {/* Isi materi */}
                  <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xl font-semibold text-white flex items-center">
                        <BookOpen size={28} className="mr-3 text-white" />
                        Materi {materi.urutan}: {materi.nama_materi}
                      </h3>
                      <div className="text-sm text-white/80 bg-white/10 px-3 py-1 rounded-full border border-white/30 shadow-sm">
                        Progress: {materi.progress ?? 0}%
                      </div>
                    </div>
                    <p className="text-white/80 text-base mb-4 italic">
                      {materi.deskripsi || 'Tidak ada deskripsi untuk materi ini.'}
                    </p>

                    <h4 className="text-lg font-semibold text-white/90 mb-3 border-b border-white/30 pb-2">
                      Sub-Materi:
                    </h4>
                    {materi.sub_materis && materi.sub_materis.length > 0 ? (
                      <div className="space-y-3 pl-4 border-l-2 border-indigo-200/50">
                        {materi.sub_materis
                          .sort((a, b) => a.urutan - b.urutan)
                          .map((subMateri) => (
                            <div
                              key={subMateri.sub_materi_id}
                              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex items-start space-x-3 hover:shadow-md transition-shadow duration-200"
                            >
                              <div className="flex-shrink-0 mt-1 text-indigo-600">
                                {getIconForTipeMateri(subMateri.tipe_materi)}
                              </div>
                              <div className="flex-grow text-gray-800">
                                <div className="flex justify-between items-start">
                                  <h5 className="text-md font-medium flex items-center">
                                    {subMateri.judul_sub_materi}
                                    <span className="ml-2 px-2 py-0.5 text-xs font-medium text-purple-700 bg-purple-100 rounded-full capitalize">
                                      {subMateri.tipe_materi.replace('_', ' ')}
                                    </span>
                                  </h5>
                                  {subMateri.konten_path ? (
                                    <button
                                      onClick={() => handleSubMateriClick(subMateri)}
                                      className={`text-xs font-semibold px-3 py-1 rounded-full cursor-pointer transition-colors duration-200 ${
                                        subMateri.user_status?.status === 'lihat'
                                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                          : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                      }`}
                                    >
                                      {subMateri.user_status?.status ?? 'belum'}
                                    </button>
                                  ) : (
                                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                                      Tidak Ada Path
                                    </span>
                                  )}
                                </div>
                                {subMateri.durasi && subMateri.tipe_materi === 'video' && (
                                  <p className="text-gray-500 text-xs flex items-center mb-1">
                                    <Clock size={14} className="mr-1" />
                                    Durasi: {subMateri.durasi} menit
                                  </p>
                                )}

                                {subMateri.konten_teks && subMateri.tipe_materi === 'teks' && (
                                  <div className="text-gray-700 text-sm mt-2 p-3 bg-gray-100 rounded-md border border-gray-200 max-h-24 overflow-y-auto">
                                    {subMateri.konten_teks}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-white/70 italic pl-4">Belum ada sub-materi untuk modul ini.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
    );
};

export default MaterisByProduct;