import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarTutor from '../components/SidebarTutor';
import HeaderTutor from '../components/HeaderAdminTutor';
import TutorProfile from '../components/TutorProfile';

const DashboardTutor = () => {
  const [activeMenu, setActiveMenu] = useState('Profil Tutor');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [students, setStudents] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Verifikasi apakah user sudah login dan adalah tutor
    const userData = JSON.parse(localStorage.getItem('user_data'));
    if (!userData || userData.role !== 'tutor') {
      navigate('/login');
      return;
    }

    if (activeMenu === 'Profil Tutor') {
      fetchProducts();
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

  const renderContent = () => {
    switch (activeMenu) {
      case 'Profil Tutor':
        return <TutorProfile />;
      case 'Program Saya':
        return <ProgramList />;
      case 'Daftar Siswa':
        return <StudentList />;
      default:
        return <TutorProfile />;
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
        {/* Header */}
        <HeaderTutor 
          setSidebarOpen={setSidebarOpen}
        />
        
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardTutor;