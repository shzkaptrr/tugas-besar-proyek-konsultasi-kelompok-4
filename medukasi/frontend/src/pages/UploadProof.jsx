import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

export default function UploadProof() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const navigate = useNavigate();

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

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert('Silakan pilih file terlebih dahulu!');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      console.log('Uploading:', selectedFile);

      // Simulasi proses upload (contohnya bisa diganti dengan fungsi upload asli)
      setTimeout(() => {
        setIsUploading(false);
        alert('Bukti Pembayaran Berhasil Diunggah!');
        setSelectedFile(null); // Reset setelah upload
      }, 2000);
    } catch (error) {
      setIsUploading(false);
      setUploadError('Terjadi kesalahan saat mengunggah file. Silakan coba lagi!');
    }
  };

  return (
    <div className="bg-purple-50 min-h-screen">
      <Header />

      <main className="flex justify-center items-start mt-10 py-20 px-4 md:px-2 max-w-screen-md mx-auto">
        <div className="bg-white shadow-xl rounded-xl p-20 w-full max-w-[500px]">
          <h2 className="text-center text-lg font-bold mb-6">
            UPLOAD BUKTI PEMBAYARAN
          </h2>

          <div className="mb-4">
            <p className="font-semibold mb-1 text-left">Media Upload</p>
            <p className="text-sm text-gray-600 mb-3 text-left">
              Tambahkan file dokumen Anda di sini (PDF, JPG, PNG), maksimal 10MB
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-md mt-6 p-10 text-center bg-gray-100">
              <UploadCloud className="mx-auto mb-2 text-gray-400" size={36} />
              <p className="text-sm text-gray-600 mb-3">
                Drag file Anda ke sini atau klik tombol di bawah
              </p>

              <label className="inline-block bg-blue-600 text-white px-4 py-1 rounded cursor-pointer">
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
            <p className="text-sm text-red-600 mt-2">{uploadError}</p>
          )}

          <div className="flex justify-end mt-6">
            <button
              onClick={() => navigate('/class-after-buy')}
              className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition ${isUploading ? 'bg-blue-400 cursor-not-allowed' : ''
                }`}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Next'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
