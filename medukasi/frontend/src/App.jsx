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
    fetch('http://127.0.0.1:8000/api/test-connection')
      .then(response => response.json())
      .then(data => console.log('✅ Response dari Laravel:', data))
      .catch(error => console.error('❌ Gagal terhubung:', error));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes untuk setiap komponen halaman yang TIDAK dilindungi */}
        <Route path="/" element={<HomeBeforeLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product" element={<Product />} />

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
        <Route path="/dashboard-student" element={<ProtectedRoute><DashboardStudent /></ProtectedRoute>} />
        <Route path="/payment-status" element={<ProtectedRoute><PaymentStatus /></ProtectedRoute>} />
        {/* Hapus path="/pendaftaran" jika sudah ada di atas */}
        {/* <Route path="/pendaftaran" element={<ProtectedRoute><Pendaftaran /></ProtectedRoute>} /> */}
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