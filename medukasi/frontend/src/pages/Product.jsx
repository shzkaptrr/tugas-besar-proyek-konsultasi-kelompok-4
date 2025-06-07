import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from '../components/Footer';

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ganti URL sesuai URL backend kamu
  const API_URL = "http://localhost:8000/api/produk";

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        // Karena response langsung array produk, langsung set data
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Gagal ambil data produk:", err);
        setLoading(false);
      });
  }, []);
  

  return (
    <div className="min-h-screen" >
      <Header />
      <main className="px-24 py-10">
        <h1 className="text-2xl font-bold mb-8">Kategori Produk</h1>

        {loading ? (
          <p>Loading produk...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-36">
            {products.map((product, idx) => (
              <div
                key={product.produk_id}
                className="bg-gradient-to-r from-red-400 to-indigo-900 rounded-2xl px-6 py-16 shadow-lg text-center flex flex-col justify-between"
              >
                {/* Gambar opsional jika tersedia */}
                {/* <img src={product.image_url} alt={product.nama_produk} className="mx-auto mb-4 w-20 h-20 object-contain" /> */}

                <h2 className="text-white text-lg font-bold mb-2">
                  {product.nama_produk}
                </h2>
                <p className="text-white mb-4 text-sm">
                  {product.deskripsi_produk}
                </p>
               
                <div className="flex justify-center gap-4">
                  <Link to="#" className="bg-blue-600 text-white px-6 py-1 rounded-full shadow text-center">
                    Detail
                  </Link>
                  <Link
                    to={`/pendaftaran?produk_id=${product.produk_id}`}
                    className="bg-blue-600 text-white px-6 py-1 rounded-full shadow text-center"
                  >
                    Daftar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
