import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Shield, CheckCircle, AlertCircle, Package, Clock } from 'lucide-react';
import Header from '../components/Header';

// Import logo pembayaran
import briLogo from '../assets/payment/bri.png';
import mandiriLogo from '../assets/payment/mandiri.png';
import bcaLogo from '../assets/payment/bca.png';
import bniLogo from '../assets/payment/bni.png';
import danaLogo from '../assets/payment/dana.png';
import gopayLogo from '../assets/payment/gopay.png';
import visaLogo from '../assets/payment/visa.png';
import mastercardLogo from '../assets/payment/mastercard.png';
import jcbLogo from '../assets/payment/jcb.png';
import qrisLogo from '../assets/payment/qris.png';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const pendaftaranId = queryParams.get('pendaftaranId');

  console.log('ID Pendaftaran dari URL:', pendaftaranId);
  
  const [metodePembayaran, setMetodePembayaran] = useState('');
  const [jumlahPembayaran, setJumlahPembayaran] = useState(0);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [dataPendaftaran, setDataPendaftaran] = useState(null);

  const paymentMethods = [
    { name: 'BRI', value: 'transfer_bri', logo: briLogo, category: 'bank' },
    { name: 'BCA', value: 'transfer_bca', logo: bcaLogo, category: 'bank' },
    { name: 'DANA', value: 'ewallet_dana', logo: danaLogo, category: 'ewallet' },
    { name: 'QRIS', value: 'qris', logo: qrisLogo, category: 'qris' }
  ];

  // Ambil harga produk dari pendaftaran
  useEffect(() => {
    const fetchHargaProduk = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`http://localhost:8000/api/pendaftaran/${pendaftaranId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        const data = await response.json();
        console.log('Response dari /pendaftaran/{id}:', data);
        
        if (response.ok && data.produk) {
          setDataPendaftaran(data);
          setJumlahPembayaran(data.produk.harga);
        } else {
          setErrorMessage('Data pendaftaran atau harga produk tidak ditemukan.');
        }
      } catch (error) {
        console.error('Error fetching pendaftaran:', error);
        setErrorMessage('Gagal mengambil data pendaftaran.');
      }
    };

    if (pendaftaranId) {
      fetchHargaProduk();
    } else {
      setErrorMessage('ID Pendaftaran tidak ditemukan dalam URL');
    }
  }, [pendaftaranId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!metodePembayaran) {
      setErrorMessage('Silakan pilih metode pembayaran');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const API_URL = "http://localhost:8000/api";

      console.log('Sending payment data:', {
        pendaftaran_id: pendaftaranId,
        metode_pembayaran: metodePembayaran,
      });

      const response = await fetch(`${API_URL}/pembayaran`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          pendaftaran_id: pendaftaranId,
          metode_pembayaran: metodePembayaran,
        }),
      });

      const data = await response.json();
      console.log('Response pembayaran:', data);

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Gagal membuat pembayaran');
      }

      setSuccessMessage('Pembayaran berhasil dibuat! Silakan lakukan pembayaran sesuai metode yang dipilih.');
      
      // Redirect ke halaman upload bukti pembayaran atau status pembayaran
      setTimeout(() => {
        navigate(`/payment-section?pembayaranId=${data.data.pembayaran_id}`);
      }, 2000);
      
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!pendaftaranId) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Terjadi Kesalahan</h2>
            <p className="text-gray-600 mb-6">ID Pendaftaran tidak ditemukan. Silakan kembali ke halaman pendaftaran dan coba lagi.</p>
            <button 
              onClick={() => navigate('/registration')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Kembali ke Pendaftaran
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Ringkasan Pembelian Produk</h3>
                </div>
                
                {dataPendaftaran && (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-800">Produk</span>
                        <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Kelas</span>
                      </div>
                      <p className="text-gray-600 mb-3 font-semibold">{dataPendaftaran.produk?.nama_produk}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Harga</span>
                        <span className="font-semibold text-gray-800">
                          Rp {dataPendaftaran.produk?.harga?.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Subtotal</span>
                        <span>Rp {jumlahPembayaran.toLocaleString('id-ID')}</span>
                      </div>
                     
                      <div className="flex justify-between items-center text-lg font-bold text-gray-800 pt-2 border-t">
                        <span>Total Pembayaran</span>
                        <span className="text-blue-600">Rp {jumlahPembayaran.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Steps */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Langkah Pembayaran
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>Pilih metode pembayaran</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>Lakukan pembayaran</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>Upload bukti pembayaran</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Payment Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Pilih Metode Pembayaran</h2>
                    <p className="text-gray-600">Pilih metode pembayaran yang Anda inginkan</p>
                  </div>
                </div>

                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-xl mb-6 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}
                
                {successMessage && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-xl mb-6 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Pilih Metode Pembayaran</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {paymentMethods.map((method) => (
                        <label 
                          key={method.value} 
                          className={`group border-2 rounded-xl p-4 flex flex-col items-center gap-3 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
                            metodePembayaran === method.value 
                              ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="metode_pembayaran"
                            value={method.value}
                            checked={metodePembayaran === method.value}
                            onChange={(e) => setMetodePembayaran(e.target.value)}
                            className="hidden"
                          />
                          <div className="relative">
                            <img src={method.logo} alt={method.name} className="h-8 object-contain" />
                            {metodePembayaran === method.value && (
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="text-center">
                            <span className="font-semibold text-gray-800">{method.name}</span>
                            <p className="text-xs text-gray-500 mt-1">
                              {method.category === 'bank' ? 'Transfer Bank' : 
                               method.category === 'ewallet' ? 'E-Wallet' : 'Scan QR Code'}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
  <h4 className="font-semibold text-gray-800 mb-1">Metode Pembayaran yang Mudah dan Cepat</h4>
  <p className="text-sm text-gray-600">
    Pilih metode pembayaran yang paling nyaman untuk Anda dengan proses yang cepat dan aman.
  </p>
</div>

                  </div>

                  <button
                    type="submit"
                    disabled={loading || !metodePembayaran}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                      loading || !metodePembayaran
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        Memproses Pembayaran...
                      </div>
                    ) : (
                      'Lanjutkan Pembayaran'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;