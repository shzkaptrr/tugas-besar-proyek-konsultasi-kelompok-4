import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { TrendingUp, BookOpen, Award, Activity } from 'lucide-react';

export default function StatisticMonitoring() {
  const [materialsData, setMaterialsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overallStats, setOverallStats] = useState({
    totalMaterials: 0,
    averageProgress: 0,
    completedMaterials: 0,
    totalSubMaterials: 0
  });

  useEffect(() => {
    fetchAllMaterialsProgress();
  }, []);

  const fetchAllMaterialsProgress = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in.');
      }

      // Fetch user's enrolled products first
      const productsResponse = await fetch('http://localhost:8000/api/user/enrolled-products', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!productsResponse.ok) {
        throw new Error('Failed to fetch enrolled products');
      }

      const productsData = await productsResponse.json();
      const allMaterialsData = [];
      let totalMaterials = 0;
      let totalProgress = 0;
      let completedMaterials = 0;
      let totalSubMaterials = 0;

      // Fetch materials for each enrolled product
      for (const product of productsData.data) {
        try {
          const materialsResponse = await fetch(`http://localhost:8000/api/produk/${product.produk_id}/materis`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (materialsResponse.ok) {
            const materialsData = await materialsResponse.json();
            
            materialsData.data.forEach(materi => {
              // Calculate progress for each material
              let progress = 0;
              if (materi.sub_materis && materi.sub_materis.length > 0) {
                const jumlahDilihat = materi.sub_materis.filter(sub => sub.user_status?.status === 'lihat').length;
                progress = Math.round((jumlahDilihat / materi.sub_materis.length) * 100);
                totalSubMaterials += materi.sub_materis.length;
              }

              allMaterialsData.push({
                id: materi.materi_id,
                name: materi.nama_materi,
                progress: progress,
                productName: product.nama_produk,
                subMaterialsCount: materi.sub_materis ? materi.sub_materis.length : 0,
                completedSubMaterials: materi.sub_materis ? 
                  materi.sub_materis.filter(sub => sub.user_status?.status === 'lihat').length : 0
              });

              totalMaterials++;
              totalProgress += progress;
              if (progress === 100) completedMaterials++;
            });
          }
        } catch (err) {
          console.error(`Error fetching materials for product ${product.produk_id}:`, err);
        }
      }

      setMaterialsData(allMaterialsData);
      setOverallStats({
        totalMaterials,
        averageProgress: totalMaterials > 0 ? Math.round(totalProgress / totalMaterials) : 0,
        completedMaterials,
        totalSubMaterials
      });

    } catch (err) {
      console.error('Error fetching materials progress:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for different chart types
  const chartData = materialsData.map(material => ({
    name: material.name.length > 20 ? material.name.substring(0, 20) + '...' : material.name,
    fullName: material.name,
    progress: material.progress,
    completed: material.completedSubMaterials,
    total: material.subMaterialsCount,
    product: material.productName
  }));

  // Data for pie chart (progress distribution)
  const progressDistribution = [
    { name: 'Selesai (100%)', value: materialsData.filter(m => m.progress === 100).length, color: '#10B981' },
    { name: 'Hampir Selesai (75-99%)', value: materialsData.filter(m => m.progress >= 75 && m.progress < 100).length, color: '#F59E0B' },
    { name: 'Setengah Jalan (50-74%)', value: materialsData.filter(m => m.progress >= 50 && m.progress < 75).length, color: '#3B82F6' },
    { name: 'Baru Mulai (1-49%)', value: materialsData.filter(m => m.progress > 0 && m.progress < 50).length, color: '#EF4444' },
    { name: 'Belum Mulai (0%)', value: materialsData.filter(m => m.progress === 0).length, color: '#6B7280' }
  ].filter(item => item.value > 0);

  // Group by product for better visualization
  const productProgress = materialsData.reduce((acc, material) => {
    const product = material.productName;
    if (!acc[product]) {
      acc[product] = { totalProgress: 0, count: 0, materials: [] };
    }
    acc[product].totalProgress += material.progress;
    acc[product].count += 1;
    acc[product].materials.push(material);
    return acc;
  }, {});

  const productChartData = Object.entries(productProgress).map(([productName, data]) => ({
    product: productName.length > 15 ? productName.substring(0, 15) + '...' : productName,
    fullProduct: productName,
    averageProgress: Math.round(data.totalProgress / data.count),
    materialsCount: data.count,
    completedMaterials: data.materials.filter(m => m.progress === 100).length
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-semibold">{payload[0].payload.fullName || payload[0].payload.fullProduct || label}</p>
          <p className="text-blue-600">{`Progress: ${payload[0].value}%`}</p>
          {payload[0].payload.product && (
            <p className="text-gray-600 text-sm">{`Produk: ${payload[0].payload.product}`}</p>
          )}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-700">Memuat data statistik...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <div className="flex flex-col flex-1 p-6">
        {/* Page Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center">
          <TrendingUp className="mr-3" size={36} />
          Statistik & Monitoring Progress Belajar
        </h2>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 max-w-7xl mx-auto w-full">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Materi</p>
                <p className="text-3xl font-bold">{overallStats.totalMaterials}</p>
              </div>
              <BookOpen size={40} className="text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Rata-rata Progress</p>
                <p className="text-3xl font-bold">{overallStats.averageProgress}%</p>
              </div>
              <TrendingUp size={40} className="text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Materi Selesai</p>
                <p className="text-3xl font-bold">{overallStats.completedMaterials}</p>
              </div>
              <Award size={40} className="text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Total Sub-Materi</p>
                <p className="text-3xl font-bold">{overallStats.totalSubMaterials}</p>
              </div>
              <Activity size={40} className="text-orange-200" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="space-y-8 max-w-7xl mx-auto w-full">
          {/* Progress by Material Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Progress per Materi</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="progress" fill="#3B82F6" name="Progress (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Product Progress Chart */}
          {productChartData.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Rata-rata Progress per Produk</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={productChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="product" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="averageProgress" 
                      stroke="#10B981" 
                      fill="#10B981" 
                      fillOpacity={0.6}
                      name="Rata-rata Progress (%)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Progress Distribution Pie Chart */}
          {progressDistribution.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Distribusi Status Progress</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={progressDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {progressDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Detailed Progress Table */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Detail Progress Materi</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Nama Materi</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Produk</th>
                    <th className="px-4 py-2 text-center font-semibold text-gray-700">Progress</th>
                    <th className="px-4 py-2 text-center font-semibold text-gray-700">Sub-Materi Selesai</th>
                    <th className="px-4 py-2 text-center font-semibold text-gray-700">Total Sub-Materi</th>
                  </tr>
                </thead>
                <tbody>
                  {materialsData.map((material, index) => (
                    <tr key={material.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-4 py-2 text-gray-800">{material.name}</td>
                      <td className="px-4 py-2 text-gray-600">{material.productName}</td>
                      <td className="px-4 py-2 text-center">
                        <div className="flex items-center justify-center">
                          <div className="w-20 bg-gray-200 rounded-full h-2.5 mr-2">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${material.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-gray-700">{material.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center text-gray-700">{material.completedSubMaterials}</td>
                      <td className="px-4 py-2 text-center text-gray-700">{material.subMaterialsCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}