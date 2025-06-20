import React, { useState, useEffect } from 'react';
import HeaderAdmin from '../components/HeaderAdmin';
import SidebarAdmin from '../components/SidebarAdmin';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardAdmin = () => {
  const [activeMenu, setActiveMenu] = useState('Jumlah Pendaftar');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentSearchQuery, setPaymentSearchQuery] = useState(''); // New state for payment search
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false); // New state for payment loading
  const [error, setError] = useState(null);
  const [paymentError, setPaymentError] = useState(null); // New state for payment errors
  
  // State untuk menyimpan data pendaftar dari API
  const [pendaftarData, setPendaftarData] = useState([]);
  const [filteredYear, setFilteredYear] = useState(new Date().getFullYear()); // Default ke tahun sekarang
  const [availableYears, setAvailableYears] = useState([]);
  
  // Data untuk chart yang sudah difilter berdasarkan tahun
  const [chartData, setChartData] = useState([]);
  
  // Data fallback untuk grafik ketika chartData kosong
  const defaultMonthlyData = [
    { month: 'Jan', pendaftar: 0 },
    { month: 'Feb', pendaftar: 0 },
    { month: 'Mar', pendaftar: 0 },
    { month: 'Apr', pendaftar: 0 },
    { month: 'May', pendaftar: 0 },
    { month: 'Jun', pendaftar: 0 },
    { month: 'Jul', pendaftar: 0 },
    { month: 'Aug', pendaftar: 0 },
    { month: 'Sep', pendaftar: 0 },
    { month: 'Oct', pendaftar: 0 },
    { month: 'Nov', pendaftar: 0 },
    { month: 'Dec', pendaftar: 0 }
  ];

  const [students, setStudents] = useState([]);
  const [paymentConfirmations, setPaymentConfirmations] = useState([]); // Changed to use setState
  
  // State variables for all payments section
  const [allPayments, setAllPayments] = useState([]);
  const [allPaymentsLoading, setAllPaymentsLoading] = useState(false);
  const [allPaymentsError, setAllPaymentsError] = useState(null);
  const [allPaymentsSearchQuery, setAllPaymentsSearchQuery] = useState('');
  
  // Modal untuk melihat bukti pembayaran
  const [showProofModal, setShowProofModal] = useState(false);
  const [currentProofUrl, setCurrentProofUrl] = useState('');
  const [processingPaymentId, setProcessingPaymentId] = useState(null);
  
  // Fungsi untuk mengambil data pendaftar dari API
  const fetchPendaftarData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Token not found. Please login again.");
      }
      
      console.log("🔑 Using token:", token.substring(0, 10) + "...");
      console.log("📡 Fetching from URL:", "http://localhost:8000/api/admin/pendaftaran");

      const response = await fetch("http://localhost:8000/api/admin/pendaftaran", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });

      console.log("🔄 Response status:", response.status, response.statusText);
      
      if (!response.ok) {
        // Mencoba mendapatkan error message dari response body
        let errorMessage;
        try {
          const errorData = await response.json();
          console.error("📛 Error response body:", errorData);
          errorMessage = errorData.message || `Error ${response.status}: ${response.statusText}`;
        } catch (e) {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("✅ Pendaftar data received:", data);
      
      if (!data.data || !Array.isArray(data.data)) {
        console.warn("⚠️ Unexpected data structure:", data);
        throw new Error("Invalid data format received from server");
      }
      
      // Menyimpan data mentah
      setPendaftarData(data.data || []);
      
      // Menentukan tahun-tahun yang tersedia dari data
      const years = extractYearsFromData(data.data || []);
      setAvailableYears(years);
      
      // Memperbarui tabel siswa dengan data dari API
      updateStudentsTable(data.data || []);
      
      // Memperbarui data chart berdasarkan tahun yang dipilih
      updateChartData(data.data || [], filteredYear);
      
    } catch (err) {
      console.error('❌ Error fetching pendaftar data:', err);
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };
  
  // Fungsi untuk mengambil data pembayaran dari API
  const fetchPaymentData = async () => {
    setPaymentLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Token not found. Please login again.");
      }
      
      console.log("🔑 Using token:", token.substring(0, 10) + "...");
      console.log("📡 Fetching payment data from URL:", "http://localhost:8000/api/pembayaran");
      
      const response = await fetch("http://localhost:8000/api/pembayaran", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });

      console.log("🔄 Response status:", response.status, response.statusText);
      
      if (!response.ok) {
        const errorMessage = `Error ${response.status}: ${response.statusText}`;
        console.error("❌ Failed to fetch payment data:", errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("✅ Payment data received:", data);
      
      // Format data pembayaran untuk tampilan tabel
      const formattedPayments = Array.isArray(data) ? data.map(payment => ({
        id: payment.pembayaran_id,
        pendaftaran_id: payment.pendaftaran_id,
        name: payment.pendaftaran?.user?.nama_lengkap || 'Unknown',
        metode: payment.metode_pembayaran,
        jumlah: payment.jumlah_pembayaran,
        tanggal: payment.tanggal_pembayaran,
        bukti: payment.bukti_pembayaran,
        status: payment.status_konfirmasi,
        tanggal_konfirmasi: payment.tanggal_konfirmasi,
        catatan: payment.catatan
      })) : [];
      
      // Debug log untuk melihat semua pembayaran
      console.log("🔍 All payments:", formattedPayments);
      
      // Count payments by status for debugging
      const statusCounts = formattedPayments.reduce((acc, payment) => {
        acc[payment.status] = (acc[payment.status] || 0) + 1;
        return acc;
      }, {});
      console.log("📊 Payments by status:", statusCounts);
      
      // Count payments with proof
      const withProofCount = formattedPayments.filter(p => p.bukti !== null && p.bukti !== undefined).length;
      console.log("🧾 Payments with proof:", withProofCount);
      
      // Set all payments data
      setAllPayments(formattedPayments);
      
      // FIXED: Include all payments with 'menunggu' status, even if bukti is null
      // This will show all pending payments in the admin dashboard
      const pendingPayments = formattedPayments.filter(payment => 
        payment.status === 'menunggu'
      );
      
      // Debug log untuk melihat pembayaran yang difilter
      console.log("⏳ Pending payments for confirmation:", pendingPayments);
      
      setPaymentConfirmations(pendingPayments);
    } catch (err) {
      console.error('❌ Error fetching payment data:', err);
      setPaymentError(err.message || "Failed to fetch payment data");
      setAllPaymentsError(err.message || "Failed to fetch payment data");
    } finally {
      setPaymentLoading(false);
      setAllPaymentsLoading(false);
    }
  };
  
  // Fungsi untuk mengambil semua data pembayaran dari API
  const fetchAllPaymentsData = async () => {
    setAllPaymentsLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Token not found. Please login again.");
      }
      
      console.log("🔑 Using token for all payments:", token.substring(0, 10) + "...");
      console.log("📡 Fetching all payment data from URL:", "http://localhost:8000/api/pembayaran");
      
      const response = await fetch("http://localhost:8000/api/pembayaran", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });

      console.log("🔄 All payments response status:", response.status, response.statusText);
      
      if (!response.ok) {
        const errorMessage = `Error ${response.status}: ${response.statusText}`;
        console.error("❌ Failed to fetch all payment data:", errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("✅ All payment data received:", data);
      
      // Format data pembayaran untuk tampilan tabel
      const formattedPayments = Array.isArray(data) ? data.map(payment => ({
        id: payment.pembayaran_id,
        pendaftaran_id: payment.pendaftaran_id,
        name: payment.pendaftaran?.user?.nama_lengkap || 'Unknown',
        metode: payment.metode_pembayaran,
        jumlah: payment.jumlah_pembayaran,
        tanggal: payment.tanggal_pembayaran,
        bukti: payment.bukti_pembayaran,
        status: payment.status_konfirmasi,
        tanggal_konfirmasi: payment.tanggal_konfirmasi,
        catatan: payment.catatan
      })) : [];
      
      console.log("🔍 All formatted payments:", formattedPayments);
      
      setAllPayments(formattedPayments);
    } catch (err) {
      console.error('❌ Error fetching all payment data:', err);
      setAllPaymentsError(err.message || "Failed to fetch all payment data");
    } finally {
      setAllPaymentsLoading(false);
    }
  };

  // Fungsi untuk mengonfirmasi pembayaran
  const handleConfirmPayment = async (id, status) => {
    setProcessingPaymentId(id);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Token not found. Please login again.");
      }
      
      // Dapatkan tanggal hari ini untuk tanggal_konfirmasi
      const today = new Date().toISOString().split('T')[0];

      const response = await fetch(`http://localhost:8000/api/pembayaran/${id}/konfirmasi`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status_konfirmasi: status,
          tanggal_konfirmasi: today,
          catatan: status === 'sukses' ? 'Pembayaran diterima' : 'Pembayaran ditolak'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("✅ Payment confirmation result:", result);

      // Refresh data pembayaran setelah konfirmasi
      fetchPaymentData();
      
      alert(`Pembayaran telah ${status === 'sukses' ? 'diterima' : 'ditolak'}`);
      
    } catch (err) {
      console.error('❌ Error confirming payment:', err);
      alert(`Gagal ${status === 'sukses' ? 'menerima' : 'menolak'} pembayaran: ${err.message}`);
    } finally {
      setProcessingPaymentId(null);
    }
  };

  // Fungsi untuk menampilkan bukti pembayaran
  const handleViewProof = (proofUrl) => {
    if (!proofUrl) {
      alert('Bukti pembayaran tidak tersedia');
      return;
    }
    
    // Tambahkan base URL jika perlu
    const fullUrl = proofUrl.startsWith('http') 
      ? proofUrl 
      : `http://localhost:8000/storage/${proofUrl}`;
      
    setCurrentProofUrl(fullUrl);
    setShowProofModal(true);
  };
  
  // Ekstrak tahun-tahun yang tersedia dari data pendaftar
  const extractYearsFromData = (data) => {
    const yearsSet = new Set();
    
    data.forEach(item => {
      const date = new Date(item.tanggal_pendaftaran);
      yearsSet.add(date.getFullYear());
    });
    
    return Array.from(yearsSet).sort((a, b) => b - a); // Sort in descending order (newest first)
  };
  
  // Update data siswa untuk tabel
  const updateStudentsTable = (data) => {
    // Debug log untuk melihat format tanggal yang diterima
    console.log("Format tanggal pendaftaran dari API:", data.length > 0 ? data[0].tanggal_pendaftaran : "No data");
    
    const formattedStudents = data.map(item => {
      // Validasi tanggal pendaftaran
      let formattedDate = null;
      if (item.tanggal_pendaftaran) {
        try {
          const date = new Date(item.tanggal_pendaftaran);
          // Validasi apakah tanggal valid
          formattedDate = isNaN(date) ? item.tanggal_pendaftaran : date.toISOString();
        } catch (e) {
          console.error("Error parsing date:", e);
          formattedDate = item.tanggal_pendaftaran;
        }
      }
      
      return {
        id: item.pendaftaran_id,
        name: item.user ? item.user.nama_lengkap : 'Unknown',
        program: item.produk ? item.produk.nama_produk : 'Unknown',
        tanggal_pendaftaran: formattedDate,
        bukti: '',
        status: item.status || 'Unknown'
      };
    });
    
    setStudents(formattedStudents);
  };
  
  // Update data chart berdasarkan tahun
  const updateChartData = (data, year) => {
    // Inisialisasi array dengan 12 bulan
    const monthsData = Array(12).fill().map((_, i) => ({
      month: new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(0, i)),
      pendaftar: 0
    }));
    
    // Filter data berdasarkan tahun dan hitung jumlah pendaftar per bulan
    data.forEach(item => {
      const date = new Date(item.tanggal_pendaftaran);
      if (date.getFullYear() === year) {
        const month = date.getMonth(); // 0-11
        monthsData[month].pendaftar += 1;
      }
    });
    
    setChartData(monthsData);
  };
  
  // Handler untuk perubahan tahun
  const handleYearChange = (e) => {
    const year = parseInt(e.target.value, 10);
    setFilteredYear(year);
    updateChartData(pendaftarData, year);
  };

  useEffect(() => {
    fetchPendaftarData();
    
    // Load payment data when component mounts or when activeMenu changes to relevant sections
    if (activeMenu === 'Konfirmasi Pembayaran') {
      fetchPaymentData();
      fetchAllPaymentsData(); // Fetch all payments data
    } else if (activeMenu === 'Semua Pembayaran') {
      fetchAllPaymentsData(); // Fetch all payments data for the All Payments section
    }
  }, [activeMenu]); // Fetch data when component mounts or activeMenu changes

  // Di bawah state
  const visibleStudents = students.slice(0, 10); // Potong array siswa hanya 10 baris
  
  // Filter students based on search query
  const filteredStudents = visibleStudents.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.program.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter payment confirmations based on search query
  const filteredPaymentConfirmations = paymentConfirmations.filter(payment =>
    payment.name.toLowerCase().includes(paymentSearchQuery.toLowerCase()) ||
    payment.metode.toLowerCase().includes(paymentSearchQuery.toLowerCase()) ||
    payment.id.toString().includes(paymentSearchQuery.toLowerCase())
  );
  
  // Filter all payments based on search query
  const filteredAllPayments = allPayments.filter(payment =>
    payment.name.toLowerCase().includes(allPaymentsSearchQuery.toLowerCase()) ||
    payment.metode.toLowerCase().includes(allPaymentsSearchQuery.toLowerCase()) ||
    payment.id.toString().includes(allPaymentsSearchQuery.toLowerCase())
  );
  
  // Format metode pembayaran untuk tampilan
  const formatPaymentMethod = (method) => {
    const methodMap = {
      'transfer_bri': 'Transfer Bank BRI',
      'transfer_bca': 'Transfer Bank BCA',
      'transfer_mandiri': 'Transfer Bank Mandiri',
      'transfer_bni': 'Transfer Bank BNI',
      'ewallet_dana': 'DANA',
      'ewallet_gopay': 'GoPay',
      'qris': 'QRIS'
    };
    
    return methodMap[method] || method;
  };

  return (
    <div className="flex flex-col min-h-screen bg-purple-50">
      <HeaderAdmin />
      <div className="flex flex-1 overflow-auto">
        <div className="w-64 min-w-64 overflow-auto">
          <SidebarAdmin activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        </div>

        <main className="flex-1 flex flex-col overflow-hidden bg-[#F8F9FC] p-6">
          {activeMenu === 'Jumlah Pendaftar' && (
            <>
              {/* Header Section */}
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-[#3B2E55]">Jumlah Pendaftar</h1>
                
                {/* Year Filter */}
                <div className="flex items-center">
                  <label htmlFor="yearFilter" className="mr-2 text-[#3B2E55] font-medium">Filter Tahun:</label>
                  <select 
                    id="yearFilter"
                    value={filteredYear}
                    onChange={handleYearChange}
                    className="px-3 py-1 border border-[#D5CEE5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D6DB0]"
                  >
                    {availableYears.length > 0 ? (
                      availableYears.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))
                    ) : (
                      <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Loading state */}
              {loading && (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              )}

              {/* Error state */}
              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                  <p>{error}</p>
                  <button 
                    className="text-blue-600 underline mt-2"
                    onClick={fetchPendaftarData}
                  >
                    Coba lagi
                  </button>
                </div>
              )}

              {/* Grafik Pendaftaran */}
              {!loading && !error && (
                <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
                  <h2 className="text-xl font-semibold mb-4 text-[#2E2344]">Statistik Pendaftaran Bulanan {filteredYear}</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="90%" height="100%">
                      <BarChart data={chartData.length > 0 ? chartData : defaultMonthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="month" 
                          tick={{ fill: '#2E2344' }}
                        />
                        <YAxis 
                          tick={{ fill: '#2E2344' }}
                        />
                        <Tooltip />
                        <Legend />
                        <Bar 
                          dataKey="pendaftar" 
                          name={`Pendaftar ${filteredYear}`}
                          fill="#9E92FE" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
              
              {/* Search Bar */}
                      <div className="relative w-96 mb-6">
                      <input
                        type="text"
                        placeholder="Cari nama..."
                        className="w-full px-4 py-2 rounded-lg border border-[#D5CEE5] focus:outline-none focus:ring-2 focus:ring-[#6D6DB0]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 absolute right-3 top-2.5 text-[#6D6DB0]" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      </div>
                      
                      {/* Tabel Data */}
                      <div className="rounded-xl shadow-lg border border-indigo-200 bg-white">
                      <div className="max-h-[500px] min-h-[200px] overflow-y-auto">
                        {loading ? (
                        <div className="flex justify-center items-center h-40">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                        </div>
                        ) : (
                        <table className="w-full">
                          <thead className="bg-blue-600 sticky top-0">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">No</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">Nama</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">Program</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">Tanggal Pendaftaran</th>
                          </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white text-gray-800">
                          {filteredStudents.length > 0 ? (
                            filteredStudents.map((student, index) => (
                            <tr key={student.id} className="divide-x divide-white">
                              <td className="px-6 py-4 text-sm">{index + 1}</td>
                              <td className="px-6 py-4 text-sm">{student.name}</td>
                              <td className="px-6 py-4 text-sm">{student.program}</td>
                              <td className="px-6 py-4 text-sm">
                                {student.tanggal_pendaftaran ? new Date(student.tanggal_pendaftaran).toLocaleDateString('id-ID') : '-'}
                              </td>
                            </tr>
                            ))
                          ) : (
                            <tr>
                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                              {searchQuery ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data pendaftar'}
                            </td>
                            </tr>
                          )}
                          </tbody>
                        </table>
                        )}
                      </div>  
                      </div>
                    </>
                    )}

                    {activeMenu === 'Konfirmasi Pembayaran' && (
                <>
                {/* Header Section */}
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold text-[#4A3A6A]">Konfirmasi Pembayaran</h1>
      
      {/* Search Bar */}
      <div className="relative w-96">
        <input
          type="text"
          placeholder="Cari peserta..."
          className="w-full px-4 py-2 rounded-lg border border-[#D5CEE5] focus:outline-none focus:ring-2 focus:ring-[#6D6DB0]"
          value={paymentSearchQuery}
          onChange={(e) => setPaymentSearchQuery(e.target.value)}
        />
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 absolute right-3 top-2.5 text-[#6D6DB0]" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    {/* Error state */}
    {paymentError && (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
        <p>{paymentError}</p>
        <button 
          className="text-blue-600 underline mt-2"
          onClick={fetchPaymentData}
        >
          Coba lagi
        </button>
      </div>
    )}

    {/* Tabel Konfirmasi */}
    {/* Tabel Semua Pembayaran */}
<div className="rounded-xl shadow-lg border border-indigo-200 bg-white">
  <div className="max-h-[600px] overflow-y-auto">
    {allPaymentsLoading ? (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="ml-2 text-indigo-500">Memuat data pembayaran...</p>
      </div>
    ) : (
      <table className="w-full">
        <thead className="bg-blue-600">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-white">No</th> {/* Ubah dari ID ke No */}
            <th className="px-6 py-4 text-left text-sm font-semibold text-white">Nama Peserta</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-white">Metode Pembayaran</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-white">Bukti Pembayaran</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white text-gray-800">
          {filteredPaymentConfirmations.length > 0 ? (
            filteredPaymentConfirmations.map((payment, index) => (  // <-- tambahkan index di sini
              <tr key={payment.id} >
                <td className="px-6 py-4 text-sm">{index + 1}</td> {/* Nomor urut */}
                <td className="px-6 py-4 text-sm">{payment.name}</td>
                <td className="px-6 py-4 text-sm">{formatPaymentMethod(payment.metode)}</td>
                <td className="px-6 py-4">
                  <button
                    className="text-indigo-600 hover:text-indigo-800 text-sm underline"
                    onClick={() => handleViewProof(payment.bukti)}
                  >
                    Lihat Bukti
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      className={`px-3 py-1 text-xs rounded-md ${
                        processingPaymentId === payment.id
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-300 text-white'
                      }`}
                      onClick={() => handleConfirmPayment(payment.id, 'sukses')}
                      disabled={processingPaymentId === payment.id}
                    >
                      {processingPaymentId === payment.id ? 'Proses...' : 'Terima'}
                    </button>
                    <button
                      className={`px-3 py-1 text-xs rounded-md ${
                        processingPaymentId === payment.id
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-300 text-white'
                      }`}
                      onClick={() => handleConfirmPayment(payment.id, 'gagal')}
                      disabled={processingPaymentId === payment.id}
                    >
                      {processingPaymentId === payment.id ? 'Proses...' : 'Tolak'}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                {paymentSearchQuery
                  ? 'Tidak ada data yang sesuai dengan pencarian'
                  : 'Tidak ada pembayaran yang menunggu konfirmasi'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    )}
  </div>
</div>


    {/* Modal untuk melihat bukti pembayaran */}
    {showProofModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold">Bukti Pembayaran</h3>
            <button 
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setShowProofModal(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4">
            {currentProofUrl && (
              currentProofUrl.toLowerCase().endsWith('.pdf') ? (
                <div className="text-center">
                  <p className="mb-4">Dokumen PDF tidak dapat ditampilkan disini. Silakan buka di tab baru.</p>
                  <a 
                    href={currentProofUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Buka PDF
                  </a>
                </div>
              ) : (
                <img 
                  src={currentProofUrl} 
                  alt="Bukti Pembayaran" 
                  className="max-w-full h-auto mx-auto"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src="https://via.placeholder.com/300x400?text=Gambar+Tidak+Tersedia";
                  }}
                />
              )
            )}
          </div>
          <div className="p-4 border-t flex justify-end">
            <button 
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
              onClick={() => setShowProofModal(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Semua Pembayaran Section */}
    <div className="mt-10">
      <h1 className="text-2xl font-bold text-[#4A3A6A] mb-8">Semua Pembayaran</h1>
      
      {/* Search Bar for All Payments */}
      <div className="relative w-96 mb-8">
        <input
          type="text"
          placeholder="Cari semua pembayaran..."
          className="w-full px-4 py-2 rounded-lg border border-[#D5CEE5] focus:outline-none focus:ring-2 focus:ring-[#6D6DB0]"
          value={allPaymentsSearchQuery}
          onChange={(e) => setAllPaymentsSearchQuery(e.target.value)}
        />
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 absolute right-3 top-2.5 text-[#6D6DB0]" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Error state for All Payments */}
      {allPaymentsError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{allPaymentsError}</p>
          <button 
            className="text-blue-600 underline mt-2"
            onClick={fetchAllPaymentsData}
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Tabel Semua Pembayaran */}
<div className="rounded-xl shadow-lg border border-indigo-200 bg-white">
  <div className="max-h-[600px] overflow-y-auto">
    {allPaymentsLoading ? (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="ml-2 text-indigo-500">Memuat data pembayaran...</p>
      </div>
    ) : (
      <table className="w-full">
        <thead className="bg-blue-600 sticky top-0 z-10">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-white">No</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-white">Nama Peserta</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-white">Metode Pembayaran</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-white">Jumlah</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-white">Tanggal</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-white">Bukti</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white text-gray-800">
          {filteredAllPayments.length > 0 ? (
            filteredAllPayments.map((payment, index) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 text-sm">{index + 1}</td>
                <td className="px-6 py-4 text-sm">{payment.name}</td>
                <td className="px-6 py-4 text-sm">{formatPaymentMethod(payment.metode)}</td>
                <td className="px-6 py-4 text-sm">
                  Rp {payment.jumlah?.toLocaleString('id-ID') || '0'}
                </td>
                <td className="px-6 py-4 text-sm">
                  {payment.tanggal ? new Date(payment.tanggal).toLocaleDateString('id-ID') : '-'}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    payment.status === 'sukses' ? 'bg-blue-600 text-white' :
                    payment.status === 'menunggu' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {payment.status === 'sukses' ? 'Sukses' : 
                     payment.status === 'menunggu' ? 'Menunggu' : 
                     payment.status === 'gagal' ? 'Gagal' : 
                     payment.status || 'Unknown'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {payment.bukti ? (
                    <button 
                      className="text-indigo-600 hover:text-indigo-800 text-sm underline"
                      onClick={() => handleViewProof(payment.bukti)}
                    >
                      Lihat Bukti
                    </button>
                  ) : (
                    <span className="text-gray-500 text-sm">Tidak ada bukti</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                {allPaymentsSearchQuery 
                  ? 'Tidak ada data yang sesuai dengan pencarian' 
                  : 'Tidak ada data pembayaran'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    )}
  </div>
</div>

    </div>
  </>
)}
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;
