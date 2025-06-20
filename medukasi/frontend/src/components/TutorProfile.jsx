import React, { useState, useEffect } from 'react';
import { User, Edit3, Save, X, Award, Calendar, BookOpen, Mail, Phone, MapPin } from 'lucide-react';

const TutorProfile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tutorProfile, setTutorProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({
    spesialisasi: '',
    bio: '',
    pengalaman: ''
  });

  useEffect(() => {
    fetchTutorProfile();
  }, []);

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
      console.log('API Response:', data); // Debug log
      setTutorProfile(data.data || null);
      
      // Set form data from profile
      if (data.data && (data.data.tutor_id || data.data.spesialisasi || data.data.bio || data.data.pengalaman)) {
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
  const updateTutorProfile = async () => {
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
      // Success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
      notification.textContent = 'Profil berhasil diperbarui!';
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.remove();
      }, 3000);
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

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditMode(false);
    // Reset form to original data
    if (tutorProfile && (tutorProfile.tutor_id || tutorProfile.spesialisasi || tutorProfile.bio || tutorProfile.pengalaman)) {
      setProfileForm({
        spesialisasi: tutorProfile.spesialisasi || '',
        bio: tutorProfile.bio || '',
        pengalaman: tutorProfile.pengalaman || ''
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <div className="text-red-600 mb-2">
          <X className="w-8 h-8 mx-auto" />
        </div>
        <p className="text-red-700 font-medium">Error: {error}</p>
        <button 
          onClick={fetchTutorProfile}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-4 rounded-full">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Profil Tutor</h1>
              <p className="text-blue-100 mt-1">Kelola informasi profil Anda sebagai tutor</p>
            </div>
          </div>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl transition-all duration-200 flex items-center space-x-2 backdrop-blur-sm"
            >
              <Edit3 className="w-5 h-5" />
              <span>Edit Profil</span>
            </button>
          )}
        </div>
      </div>

      {editMode ? (
        /* Edit Mode */
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <Edit3 className="w-6 h-6 mr-3 text-blue-600" />
                Edit Profil
              </h2>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  onClick={updateTutorProfile}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-md disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  <span>{loading ? 'Menyimpan...' : 'Simpan'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 flex items-center space-x-2"
                >
                  <X className="w-5 h-5" />
                  <span>Batal</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-3 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                  Spesialisasi
                </label>
                <input
                  type="text"
                  name="spesialisasi"
                  value={profileForm.spesialisasi}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Contoh: Matematika, Fisika, Biologi"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-3 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-blue-600" />
                  Pengalaman
                </label>
                <input
                  type="text"
                  name="pengalaman"
                  value={profileForm.pengalaman}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Contoh: 5 tahun mengajar"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-3 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Bio
              </label>
              <textarea
                name="bio"
                value={profileForm.bio}
                onChange={handleProfileChange}
                rows="5"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors resize-none"
                placeholder="Ceritakan tentang diri Anda, metodologi mengajar, pencapaian, dll..."
              ></textarea>
            </div>
          </div>
        </div>
      ) : (
        /* View Mode */
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {tutorProfile && (tutorProfile.tutor_id || tutorProfile.spesialisasi || tutorProfile.bio || tutorProfile.pengalaman) ? (
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 text-center">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {tutorProfile.user?.nama_lengkap || tutorProfile.nama_lengkap || 'Tutor'}
                    </h3>
                  </div>

                  {/* User Information Card - Read Only */}
                  <div className="mt-6 bg-gray-50 rounded-2xl p-6">
                    <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      Informasi Pengguna
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-gray-600">
                          {tutorProfile.user?.email || tutorProfile.email || 'Belum diisi'}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-gray-600">
                          {tutorProfile.user?.no_hp || tutorProfile.no_hp || 'Belum diisi'}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4 italic">
                      *Informasi ini dapat diubah di pengaturan akun
                    </p>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
                        <h4 className="font-semibold text-gray-700">Spesialisasi</h4>
                      </div>
                      <p className="text-gray-600">{tutorProfile.spesialisasi || 'Belum diisi'}</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <Award className="w-5 h-5 text-blue-600 mr-2" />
                        <h4 className="font-semibold text-gray-700">Pengalaman</h4>
                      </div>
                      <p className="text-gray-600">{tutorProfile.pengalaman || 'Belum diisi'}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center mb-3">
                      <User className="w-5 h-5 text-blue-600 mr-2" />
                      <h4 className="font-semibold text-gray-700">Bio</h4>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {tutorProfile.bio || 'Belum ada bio. Silakan tambahkan informasi tentang diri Anda, metodologi mengajar, dan pencapaian.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">Profil Belum Lengkap</h3>
              <p className="text-gray-500 mb-4">Silakan lengkapi profil Anda sebagai tutor untuk memberikan informasi yang lebih detail kepada siswa.</p>
              
              {/* Debug Info */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-semibold text-yellow-800 mb-2">Debug Info:</h4>
                <pre className="text-sm text-yellow-700 whitespace-pre-wrap">
                  {JSON.stringify(tutorProfile, null, 2)}
                </pre>
              </div>
              
              <button
                onClick={() => setEditMode(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Edit3 className="w-5 h-5" />
                <span>Lengkapi Profil</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TutorProfile;