import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarTutor from '../components/SidebarTutor';

const DashboardTutor = () => {
  const [activeMenu, setActiveMenu] = useState('Program Saya');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [students, setStudents] = useState([]);
  const [tutorProfile, setTutorProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({
    spesialisasi: '',
    bio: '',
    pengalaman: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    // Verifikasi apakah user sudah login dan adalah tutor
    const userData = JSON.parse(localStorage.getItem('user_data'));
    if (!userData || userData.role !== 'tutor') {
      navigate('/login');
      return;
    }

    if (activeMenu === 'Program Saya') {
      fetchProducts();
    } else if (activeMenu === 'Profil Tutor') {
      fetchTutorProfile();
    }
  }, [activeMenu]);

  // Fungsi untuk mengambil data produk/program yang diajar tutor
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/tutor/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mengambil daftar siswa pada produk tertentu
  const fetchStudentsByProduct = async (produkId) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`🔍 DEBUG: Memulai fetchStudentsByProduct untuk produkId: ${produkId}`);
      const token = localStorage.getItem('auth_token');
      console.log(`🔑 DEBUG: Token Auth (truncated): ${token ? token.substring(0, 15) + '...' : 'tidak ada token'}`);
      
      console.log(`🌐 DEBUG: Memanggil API: http://localhost:8000/api/tutor/products/${produkId}/students`);
      const response = await fetch(`http://localhost:8000/api/tutor/products/${produkId}/students`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      console.log(`📥 DEBUG: Response status: ${response.status}`);
      const data = await response.json();
      console.log('📦 DEBUG: Data response:', data);

      if (!response.ok) {
        console.error('❌ DEBUG: API Error:', data);
        throw new Error('Failed to fetch students');
      }

      setStudents(data.data || []);
      console.log(`✅ DEBUG: Data siswa berhasil diambil, jumlah: ${data.data ? data.data.length : 0}`);
      
      if (data.data && data.data.length > 0) {
        console.log('📋 DEBUG: Sampel data siswa pertama:', data.data[0]);
      }
      
      setSelectedProduct(products.find(product => product.produk_id === parseInt(produkId)));
    } catch (err) {
      console.error(`❌ DEBUG: Error di fetchStudentsByProduct:`, err);
      console.error('Stack trace:', err.stack);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mengambil profil tutor
  const fetchTutorProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/tutor/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tutor profile');
      }

      const data = await response.json();
      setTutorProfile(data.data || null);
      
      // Set form data from profile
      if (data.data) {
        setProfileForm({
          spesialisasi: data.data.spesialisasi || '',
          bio: data.data.bio || '',
          pengalaman: data.data.pengalaman || ''
        });
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tutor profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk memperbarui profil tutor
  const updateTutorProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/tutor/profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileForm)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setTutorProfile(data.data);
      setEditMode(false);
      alert('Profil berhasil diperbarui!');
    } catch (err) {
      setError(err.message);
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Component untuk menampilkan daftar program yang diajar
  const ProgramList = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Program Yang Anda Ajar</h2>
      
      {loading && <p className="text-gray-600">Loading programs...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      
      {!loading && !error && products.length === 0 && (
        <p className="text-gray-600">Anda belum ditugaskan mengajar program apapun.</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.produk_id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
            <div className="bg-gradient-to-r from-blue-500 to-red-500 p-4 text-white">
              <h3 className="font-bold text-xl">{product.nama_produk}</h3>
            </div>
            <div className="p-4">
              <p className="text-gray-600 mb-4 h-20 overflow-y-auto">{product.deskripsi_produk}</p>
              <p className="font-semibold mb-2">
                Harga: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.harga)}
              </p>
              <p className="text-sm mb-4">
                Status: <span className={`font-medium ${product.status ? 'text-green-600' : 'text-red-600'}`}>
                  {product.status ? 'Aktif' : 'Nonaktif'}
                </span>
              </p>
              <button
                onClick={() => {
                  setActiveMenu('Daftar Siswa');
                  fetchStudentsByProduct(product.produk_id);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full transition-colors"
              >
                Lihat Siswa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Component untuk menampilkan daftar siswa pada program tertentu
  const StudentList = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Daftar Siswa - {selectedProduct?.nama_produk}
        </h2>
        <button
          onClick={() => setActiveMenu('Program Saya')}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition-colors text-gray-700"
        >
          Kembali
        </button>
      </div>
      
      {loading && <p className="text-gray-600">Loading students...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      
      {!loading && !error && students.length === 0 && (
        <p className="text-gray-600">Belum ada siswa yang terdaftar pada program ini.</p>
      )}
      
      {students.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
            <thead className="bg-gradient-to-r from-blue-600 to-red-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">No</th>
                <th className="py-3 px-4 text-left">Nama</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Asal Sekolah</th>
                <th className="py-3 px-4 text-left">Tgl Bergabung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student, index) => (
                <tr key={student.pendaftaran_id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 font-medium">{student.nama}</td>
                  <td className="py-3 px-4">{student.email}</td>
                  <td className="py-3 px-4">{student.asal_sekolah}</td>
                  <td className="py-3 px-4">
                    {new Date(student.tanggal_bergabung).toLocaleDateString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // Component untuk menampilkan dan mengedit profil tutor
  const TutorProfileComponent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Profil Tutor</h2>
      
      {loading && <p className="text-gray-600">Loading profile...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      
      {!loading && !error && (
        <>
          {editMode ? (
            <form onSubmit={updateTutorProfile} className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Spesialisasi</label>
                <input
                  type="text"
                  name="spesialisasi"
                  value={profileForm.spesialisasi}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Matematika, Fisika, Biologi, dll"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Pengalaman (tahun)</label>
                <input
                  type="text"
                  name="pengalaman"
                  value={profileForm.pengalaman}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 5 tahun"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={profileForm.bio}
                  onChange={handleProfileChange}
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ceritakan tentang diri Anda..."
                ></textarea>
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Profil
                </button>
              </div>
              
              {tutorProfile ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-700">Spesialisasi</h3>
                    <p className="text-gray-600">{tutorProfile.spesialisasi || 'Belum diisi'}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-700">Pengalaman</h3>
                    <p className="text-gray-600">{tutorProfile.pengalaman || 'Belum diisi'}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-700">Bio</h3>
                    <p className="text-gray-600">{tutorProfile.bio || 'Belum diisi'}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Silakan lengkapi profil Anda sebagai tutor.</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeMenu) {
      case 'Program Saya':
        return <ProgramList />;
      case 'Daftar Siswa':
        return <StudentList />;
      case 'Profil Tutor':
        return <TutorProfileComponent />;
      default:
        return <ProgramList />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarTutor
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        isSidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col">
        {/* Header for mobile */}
        <header className="bg-white shadow-sm p-4 md:hidden">
          <button
            className="text-gray-500 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>
        
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardTutor;