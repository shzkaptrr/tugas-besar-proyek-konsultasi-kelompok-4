import React, { useState } from 'react';
import HeaderAdmin from '../components/HeaderAdminTutor';
import SidebarAdmin from '../components/SidebarAdmin';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardAdmin = () => {
  const [activeMenu, setActiveMenu] = useState('Jumlah Pendaftar');
  const [searchQuery, setSearchQuery] = useState('');

  // Data contoh untuk grafik dan tabel
  const monthlyData = [
    { month: 'Jan', pendaftar: 45 },
    { month: 'Feb', pendaftar: 32 },
    { month: 'Mar', pendaftar: 67 },
    { month: 'Apr', pendaftar: 23 },
    { month: 'May', pendaftar: 89 },
    { month: 'Jun', pendaftar: 54 },
    { month: 'Jul', pendaftar: 76 },
    { month: 'Aug', pendaftar: 45 },
    { month: 'Sep', pendaftar: 32 },
    { month: 'Oct', pendaftar: 67 },
    { month: 'Nov', pendaftar: 23 },
    { month: 'Dec', pendaftar: 89 }
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
              </div>

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
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* TABEL PEMBAYARAN */}
          {activeMenu === 'Pembayaran' && (
            <>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-[#4A3A6A]">Konfirmasi Pembayaran</h1>
                <div className="relative w-96">
                  <input
                    type="text"
                    placeholder="Cari peserta..."
                    className="w-full px-4 py-2 rounded-lg border border-[#D5CEE5] focus:outline-none focus:ring-2 focus:ring-[#6D6DB0]"
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
              <div className="rounded-xl shadow-lg border border-indigo-200 bg-white">
                <div className="max-h-[600px] overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-indigo-500 sticky top-0">
                      <tr className="divide-x divide-white">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Nama</th>
                        <th className="px-6 py-4 text-left textsm font-semibold text-white">Email</th>
                        <th className="px-6 py-4 text-left textsm font-semibold text-white">Nama Produk</th>
                        <th className="px-6 py-4 text-left textsm font-semibold text-white">Metode Pembayaran</th>
                        <th className="px-6 py-4 text-left textsm font-semibold text-white">Jumlah</th>
                        <th className="px-6 py-4 text-left textsm font-semibold text-white">Tanggal</th>
                        <th className="px-6 py-4 text-left textsm font-semibold text-white">Bukti</th>
                        <th className="px-6 py-4 text-left textsm font-semibold text-white">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pembayaran.map((bayar, idx) => {
                        const produk = produkList.find(p => p.produk_id === bayar.produk_id);
                        return (
                          <tr
                            key={bayar.pembayaran_id}
                            className={idx % 2 === 0 ? "bg-gray-100 divide-x divide-indigo-200" : "bg-indigo-50 divide-x divide-indigo-200"}
                          >
                            <td className="px-6 py-4 text-sm text-[#3B2E55]">{bayar.nama_lengkap}</td>
                            <td className="px-6 py-4 text-sm text-[#3B2E55]">{bayar.email}</td>
                            <td className="px-6 py-4 text-sm text-[#3B2E55]">{produk?.nama_produk || '-'}</td>
                            <td className="px-6 py-4 text-sm text-[#3B2E55]">{bayar.metode_pembayaran}</td>
                            <td className="px-6 py-4 text-sm text-[#3B2E55]">
                              {bayar.jumlah_pembayaran?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                            </td>
                            <td className="px-6 py-4 text-sm text-[#3B2E55]">{bayar.tanggal_pembayaran}</td>
                            <td className="px-6 py-4">
                              {bayar.bukti_pembayaran ? (
                                <a
                                  href={`/${bayar.bukti_pembayaran}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-600 underline hover:text-indigo-800"
                                >
                                  Lihat Bukti
                                </a>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-[#3B2E55] capitalize">{bayar.status_konfirmasi}</td>
                            <td className="px-6 py-4">
                              <button className="px-3 py-1 text-xs bg-blue-500 text-white rounded-md mr-2">Terima</button>
                              <button className="px-3 py-1 text-xs bg-red-500 text-white rounded-md">Tolak</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* TABEL PRODUK */}
          {activeMenu === 'Produk' && (
            <>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-[#3B2E55]">Daftar Produk</h1>
                <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">Tambah Produk</button>
              </div>
              <div className="rounded-xl shadow-lg border border-indigo-200 bg-white">
                <div className="max-h-[600px] overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-indigo-500 sticky top-0 divide-x divide-white">
                      <tr className="divide-x divide-white">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">ID</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Nama Produk</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Harga</th>
                        <th className="px-6 py-4 text-left textsm font-semibold text-white">Deskripsi</th>
                        <th className="px-6 py-4 text-left textsm font-semibold text-white">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {produkList.map((produk, idx) => (
                        <tr
                          key={produk.produk_id}
                          className={idx % 2 === 0 ? "bg-gray-100 divide-x divide-indigo-200" : "bg-indigo-50 divide-x divide-indigo-200"}
                        >
                          <td className="px-6 py-4 text-sm text-[#3B2E55]">{produk.produk_id}</td>
                          <td className="px-6 py-4 text-sm text-[#3B2E55]">{produk.nama_produk}</td>
                          <td className="px-6 py-4 text-sm text-[#3B2E55]">
                            {produk.harga?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                          </td>
                          <td className="px-6 py-4 text-sm text-[#3B2E55]">{produk.deskripsi}</td>
                          <td className="px-6 py-4">
                            <button className="px-3 py-1 text-xs bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600">Edit</button>
                            <button className="px-3 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600">Hapus</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ...existing menu... */}
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;
