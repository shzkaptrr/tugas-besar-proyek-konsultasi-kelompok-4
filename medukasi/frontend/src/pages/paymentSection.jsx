import { useState, useEffect } from 'react';
import { UploadCloud } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer'; // Jika ingin menambahkan footer
import { Link, useLocation, useNavigate } from 'react-router-dom';
import qrisLogo from '../assets/payment/qris.png';
import qrImage from '../assets/payment/qr-code.png';
import briLogo from '../assets/payment/bri.png';
import mandiriLogo from '../assets/payment/mandiri.png';
import bcaLogo from '../assets/payment/bca.png';
import bniLogo from '../assets/payment/bni.png';
import danaLogo from '../assets/payment/dana.png';
import gopayLogo from '../assets/payment/gopay.png';

export default function PaymentSection() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });
  const [pembayaranId, setPembayaranId] = useState(null);
  const [metodePembayaran, setMetodePembayaran] = useState('');
  const [jumlahPembayaran, setJumlahPembayaran] = useState(0);
  const [nomorVA, setNomorRekening] = useState('');
  const [dataPembayaran, setDataPembayaran] = useState(null);
  
  // State untuk upload bukti
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Mendapatkan data dari state navigasi atau URL parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idFromParam = params.get('pembayaranId');
    
    if (location.state?.pembayaranId || idFromParam) {
      const id = location.state?.pembayaranId || idFromParam;
      setPembayaranId(id);
      
      // Selalu ambil data dari API untuk memastikan data terbaru
      fetchPembayaranData(id);
    } else {
      setError('ID pembayaran tidak ditemukan');
      return;
    }
    
    // Setup countdown timer
    const timer = setInterval(() => {
      setCountdown(prevTime => {
        const newTime = { ...prevTime };
        
        if (newTime.seconds > 0) {
          newTime.seconds--;
        } else {
          newTime.seconds = 59;
          
          if (newTime.minutes > 0) {
            newTime.minutes--;
          } else {
            newTime.minutes = 59;
            
            if (newTime.hours > 0) {
              newTime.hours--;
            } else {
              clearInterval(timer);
            }
          }
        }
        
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [location]);

  // Fungsi untuk mengambil data pembayaran dari API
  const fetchPembayaranData = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`http://localhost:8000/api/pembayaran/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Gagal mengambil data pembayaran');
      }

      const data = result.data;
      console.log('Data pembayaran:', data);
      
      setDataPembayaran(data);
      setPembayaranId(data.pembayaran_id);
      setMetodePembayaran(data.metode_pembayaran);
      setJumlahPembayaran(data.jumlah_pembayaran);
      
      // Generate nomor VA random untuk simulasi
      generateRekening(data.metode_pembayaran);
      
      // Cek apakah sudah ada bukti pembayaran
      if (data.bukti_pembayaran) {
        setUploadSuccess(true);
      }
      
    } catch (err) {
      console.error('Error fetching pembayaran:', err);
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // fungsi untuk generate nomor rekening berdasarkan metode pembayaran
  const generateRekening = (metode) => {
    const rekeningBank = {
      'transfer_bri': '1234-01-567890-53-1',
      'transfer_bca': '234-567-8901',
      'transfer_mandiri': '112-000-9876543',
      'transfer_bni': '9876-5432-1098-7654'
    };
  
    setNomorRekening(rekeningBank[metode] || '000-000-0000');
  };
  

  // Fungsi untuk handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validasi ukuran maksimal 10MB
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Ukuran file melebihi 10MB!');
      setSelectedFile(null);
      return;
    }

    // Validasi tipe file
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Jenis file tidak didukung. Gunakan PDF, JPG, atau PNG.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setUploadError(null);
  };

  // Fungsi untuk upload bukti pembayaran
  const handleUploadBukti = async () => {
    if (!selectedFile) {
      setUploadError('Silakan pilih file terlebih dahulu!');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const token = localStorage.getItem('auth_token');
      const formData = new FormData();
      formData.append('bukti_pembayaran', selectedFile);

      const response = await fetch(`http://localhost:8000/api/pembayaran/${pembayaranId}/upload-bukti`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Gagal upload bukti pembayaran');
      }

      setUploadSuccess(true);
      setShowUploadForm(false);
      setSelectedFile(null);
      alert('Bukti pembayaran berhasil diunggah! Pembayaran Anda sedang diverifikasi.');
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Terjadi kesalahan saat mengunggah file');
    } finally {
      setIsUploading(false);
    }
  };

  // Fungsi untuk mendapatkan logo berdasarkan metode pembayaran
  const getPaymentLogo = () => {
    const logos = {
      'transfer_bri': briLogo,
      'transfer_mandiri': mandiriLogo,
      'transfer_bca': bcaLogo,
      'transfer_bni': bniLogo,
      'ewallet_dana': danaLogo,
      'ewallet_gopay': gopayLogo,
      'qris': qrisLogo
    };
    return logos[metodePembayaran] || null;
  };

  // Fungsi untuk mendapatkan nama metode pembayaran yang readable
  const getPaymentMethodName = () => {
    const names = {
      'transfer_bri': 'Transfer BRI',
      'transfer_mandiri': 'Transfer Mandiri',
      'transfer_bca': 'Transfer BCA',
      'transfer_bni': 'Transfer BNI',
      'ewallet_dana': 'DANA',
      'ewallet_gopay': 'GoPay',
      'qris': 'QRIS'
    };
    return names[metodePembayaran] || metodePembayaran;
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);

  // Fungsi untuk menampilkan instruksi pembayaran berdasarkan metode
  const renderPaymentInstructions = () => {
    const isVA = ['transfer_bri', 'transfer_mandiri', 'transfer_bca', 'transfer_bni'].includes(metodePembayaran);
    const isEwallet = ['ewallet_dana', 'ewallet_gopay'].includes(metodePembayaran);
    const isQRIS = metodePembayaran === 'qris';

    if (isVA) {
      const bankName = metodePembayaran.replace('transfer_', '').toUpperCase();
      
      return (
        <>
          <img src={getPaymentLogo()} alt={bankName} className="mx-auto h-6 mb-4" />
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <p className="font-medium mb-2">Nomor Rekening:</p>
            <p className="text-xl font-bold mb-2">{nomorVA}</p> {/* Digunakan untuk menyimpan nomor rekening */}
            <p className="text-sm mb-4">Atas Nama: PT MANDIRI EDUKASI INDONESIA</p>

            <p className="font-medium mb-2">Cara Pembayaran:</p>
            <ol className="list-decimal list-inside text-sm text-left">
              <li className="mb-1">Buka aplikasi mobile banking {bankName} atau kunjungi ATM {bankName}</li>
              <li className="mb-1">Pilih menu Transfer ke Rekening Bank</li>
              <li className="mb-1">Masukkan nomor rekening tujuan: {nomorVA}</li>
              <li className="mb-1">Masukkan nominal pembayaran: {formatCurrency(jumlahPembayaran)}</li>
              <li className="mb-1">Konfirmasi nama penerima dan jumlah</li>
              <li className="mb-1">Masukkan PIN Anda dan selesaikan transaksi</li>
              <li className="mb-1">Simpan bukti pembayaran untuk diunggah</li>
            </ol>
          </div>
        </>
      );
    } else if (isEwallet) {
      const walletName = metodePembayaran.replace('ewallet_', '').toUpperCase();
      
      return (
        <>
          <img src={getPaymentLogo()} alt={walletName} className="mx-auto h-6 mb-4" />
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <p className="font-medium mb-2">Pembayaran via {walletName}:</p>
            <ol className="list-decimal list-inside text-sm text-left">
              <li className="mb-1">Buka aplikasi {walletName} di smartphone Anda</li>
              <li className="mb-1">Pilih metode scan & pay</li>
              <li className="mb-1">Scan kode QR berikut:</li>
            </ol>
            <img src={qrImage} alt="QR Code" className="mx-auto w-32 h-32 my-4" />
            <p className="text-sm mb-2">atau</p>
            <p className="font-medium mb-2">ID Merchant: MEI12345</p>
            <p className="text-xl font-bold mb-4">{formatCurrency(jumlahPembayaran)}</p>
          </div>
        </>
      );
    } else if (isQRIS) {
      return (
        <>
          <img src={qrisLogo} alt="QRIS" className="mx-auto h-6 mb-4" />
          <p className="m-3">Scan kode QR di bawah ini</p>
          <img src={qrImage} alt="QR Code" className="mx-auto w-32 h-32 mb-3" />
          <p className="text-sm font-semibold">PT MANDIRI EDUKASI INDONESIA</p>
          <p className="text-sm text-gray-600 mb-3">NMID: ID12345567893546</p>
          <button className="bg-gray-200 hover:bg-gray-300 text-black font-medium px-4 p-2 rounded-full mb-4">
            Download Kode QR
          </button>
        </>
      );
    } else {
      return (
        <p className="text-red-600">Metode pembayaran tidak dikenali: {metodePembayaran}</p>
      );
    }
  };

  // Fungsi untuk render form upload
  const renderUploadForm = () => {
    if (!showUploadForm) return null;

    return (
      <div className="mt-6 border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Upload Bukti Pembayaran</h3>
        
        <div className="mb-4">
          <p className="font-medium mb-1 text-left">Media Upload</p>
          <p className="text-sm text-gray-600 mb-3 text-left">
            Tambahkan file dokumen Anda di sini (PDF, JPG, PNG), maksimal 10MB
          </p>

          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center bg-gray-50">
            <UploadCloud className="mx-auto mb-2 text-gray-400" size={36} />
            <p className="text-sm text-gray-600 mb-3">
              Drag file Anda ke sini atau klik tombol di bawah
            </p>

            <label className="inline-block bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
              Browse Files
              <input
                type="file"
                accept=".pdf, .jpg, .jpeg, .png"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {selectedFile && (
              <>
                <p className="text-sm mt-3 text-green-700 font-medium">
                  {selectedFile.name}
                </p>
                {selectedFile.type.startsWith('image/') && (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="mt-4 w-32 h-auto mx-auto rounded"
                  />
                )}
              </>
            )}
          </div>
        </div>

        {uploadError && (
          <p className="text-sm text-red-600 mb-4">{uploadError}</p>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={() => {
              setShowUploadForm(false);
              setSelectedFile(null);
              setUploadError(null);
            }}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            onClick={handleUploadBukti}
            className={`px-6 py-2 rounded text-white ${
              isUploading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={isUploading}
          >
            {isUploading ? 'Mengupload...' : 'Kirim Bukti'}
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-purple-50 min-h-screen">
        <Header />
        <main className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Memuat data pembayaran...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <main className="flex justify-center py-12">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
          <h2 className="text-lg font-bold mb-4">
            {getPaymentMethodName()}
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {uploadSuccess && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
              ✅ Bukti pembayaran berhasil diunggah! Pembayaran sedang diverifikasi.
            </div>
          )}

          <div className="text-left border-t border-b py-3 mb-6">
            <p className="text-black">Total: <strong>{formatCurrency(jumlahPembayaran)}</strong></p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-green-600 text-xl">🕒</span>
              <p className="text-sm font-medium">Segera Lakukan Pembayaran Dalam</p>
            </div>
            <p className="text-red-600 font-semibold mt-1">
              {countdown.hours} Jam : {countdown.minutes} Menit : {countdown.seconds} Detik
            </p>
          </div>

          {/* Instruksi pembayaran */}
          {renderPaymentInstructions()}

          {/* Form upload bukti */}
          {renderUploadForm()}

          <hr className="my-4" />
          
          {!uploadSuccess && (
            <button 
              onClick={() => setShowUploadForm(!showUploadForm)}
              className={`font-medium px-4 py-2 rounded-lg w-full mb-3 ${
                showUploadForm 
                  ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {showUploadForm ? 'Tutup Form Upload' : 'Upload Bukti Pembayaran'}
            </button>
          )}

          {uploadSuccess && (
            
           <button
           onClick={() => navigate('/my-products')} 
           className="w-full flex justify-center items-center 
                           bg-gradient-to-r from-blue-600 to-red-600
                           text-white text-base font-semibold py-3 
                           rounded-full
                           border-2 border-white
                           hover:from-blue-700 hover:to-red-700
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                           transition-all duration-300 shadow-lg"
            >
            Lanjut ke Kelas
            </button>
      
      )}
        </div>
      </main>
      <Footer />
    </div>
  );
}