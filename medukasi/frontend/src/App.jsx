import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { useParams } from 'react-router-dom'; // <--- IMPORT INI

// Import komponen
import HomeBeforeLogin from './pages/HomeBeforeLogin';
import HomeAfterLogin from './pages/HomeAfterLogin';
import Login from './pages/Login';
import DashboardPimpinan from './pages/DashboardPimpinan';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardStudent from './pages/DashboardStudent';
import DashboardManager from './pages/DashboardManager';
import DashboardTutor from './pages/DashboardTutor'; // Import komponen DashboardTutor
import ClassAfterBuy from './pages/MyClassAfterBuy';
import ClassBeforeBuy from './pages/MyClassBeforeBuy';
import StaticMonitoring from './pages/StatisticMonitoring';
import DashboardMateri from './pages/DashboardMateri';
import DetailMateri from './pages/DetailMateri';
import Payment from './pages/Payment';
import PaymentSection from './pages/paymentSection';
import PaymentStatus from './pages/paymentStatus';
import UploadProof from './pages/UploadProof';
import Pendaftaran from './pages/Pendaftaran';
import Product from './pages/Product';
import Testimoni from './pages/Testimoni';
import Register from './pages/Register';
import RegisterAdminTutor from "./pages/RegisterAdminTutor";
 
import MaterisPage from './pages/MaterisPage';
import MyPurchasedProducts from './pages/MyPurchasedProducts';
import MaterisByProduct from './pages/MaterisByProduct';


// Komponen Wrapper untuk MaterisByProduct (mirip MateriPageWrapper sebelumnya)
const MaterisByProductWrapper = () => {
  const { produkId } = useParams();
  return (
    <ProtectedRoute>
      <MaterisByProduct produkId={produkId} />
    </ProtectedRoute>
  );
};

const App = () => {
  // Tambahkan ini untuk test koneksi
  useEffect(() => {
    const testBackendConnection = async () => {
      // Gunakan konstanta untuk base URL API
      const BACKEND_URL = 'http://localhost:8000';
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          console.log(`Mencoba koneksi ke backend (percobaan ke-${retryCount + 1})...`);
          
          const response = await fetch(`${BACKEND_URL}/api/test-connection`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(8000) // 8 detik timeout
          });
          
          console.log("Response status:", response.status, response.statusText);
          const data = await response.json();
          console.log('✅ Response dari Laravel:', data);
          
          // Jika berhasil, keluar dari loop
          return;
        } catch (error) {
          console.error(`Percobaan koneksi ke-${retryCount + 1} gagal:`, error);
          retryCount++;
          
          if (retryCount >= maxRetries) {
            console.error('❌ Gagal terhubung ke backend setelah beberapa percobaan:', error);
            break;
          }
          
          // Tunggu sebelum mencoba lagi
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }
    };
    
    testBackendConnection();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes untuk setiap komponen halaman yang TIDAK dilindungi */}
        <Route path="/" element={<HomeBeforeLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product" element={<Product />} />
        <Route path="/testimoni" element={<Testimoni />} />

        {/* --- Rute yang dilindungi token (menggunakan ProtectedRoute) --- */}
        {/* Kelompokkan semua rute yang dilindungi di dalam satu ProtectedRoute atau satu per satu */}
        {/* Saya akan buat satu per satu agar lebih jelas */}

        <Route path="/home-after-login" element={<ProtectedRoute><HomeAfterLogin /></ProtectedRoute>} />
        <Route path="/pendaftaran" element={<ProtectedRoute><Pendaftaran /></ProtectedRoute>} />

        <Route path="/class-before-buy" element={<ProtectedRoute><ClassBeforeBuy /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/payment-section" element={<ProtectedRoute><PaymentSection /></ProtectedRoute>} />
        <Route path="/upload-bukti-payment" element={<ProtectedRoute><UploadProof /></ProtectedRoute>} />
        <Route path="/class-after-buy" element={<ProtectedRoute><ClassAfterBuy /></ProtectedRoute>} />
        <Route path="/dashboard-materi" element={<ProtectedRoute><DashboardMateri /></ProtectedRoute>} />

        <Route path="/dashboard-pimpinan" element={<ProtectedRoute><DashboardPimpinan /></ProtectedRoute>} />
        <Route path="/dashboard-admin" element={<ProtectedRoute><DashboardAdmin /></ProtectedRoute>} />
        <Route path="/dashboard-manager" element={<ProtectedRoute><DashboardManager /></ProtectedRoute>} />
        <Route path="/dashboard-tutor" element={<ProtectedRoute><DashboardTutor /></ProtectedRoute>} /> {/* Tambah route untuk dashboard tutor */}
        <Route path="/dashboard-student" element={<ProtectedRoute><DashboardStudent /></ProtectedRoute>} />
        <Route path="/payment-status" element={<ProtectedRoute><PaymentStatus /></ProtectedRoute>} />
        {/* Hapus path="/pendaftaran" jika sudah ada di atas */}
        <Route path="/detail-materi" element={<ProtectedRoute><DetailMateri /></ProtectedRoute>} /> {/* Jika DetailMateri ini berbeda dengan MateriDetailPage */}
        <Route path="/statistic-monitoring" element={<ProtectedRoute><StaticMonitoring /></ProtectedRoute>} />
        <Route path="/register-admin-tutor" element={<ProtectedRoute><RegisterAdminTutor /></ProtectedRoute>} />


        
        <Route path="/materis" element={<ProtectedRoute><MaterisPage /></ProtectedRoute>} />
        <Route path="/my-products" element={<ProtectedRoute><MyPurchasedProducts /></ProtectedRoute>} /> {/* <--- Rute untuk daftar produk dibeli */}
        <Route path="/my-products/:produkId/materials" element={<MaterisByProductWrapper />} /> {/* <--- Rute untuk materi produk spesifik */}


      </Routes>
    </BrowserRouter>
  );
};

export default App;