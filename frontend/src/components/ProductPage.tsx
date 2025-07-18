import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios'; // Menggunakan library axios yang asli

// Tipe data untuk produk
interface Product {
    id: number;
    nama_produk: string;
    harga: number;
    stok: number;
}

function ProductPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // State untuk form tambah produk
    const [newProductName, setNewProductName] = useState('');
    const [newProductPrice, setNewProductPrice] = useState('');
    const [newProductStock, setNewProductStock] = useState('');

    // State untuk modal edit
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Fungsi untuk mengambil data dari backend
    const fetchProducts = async () => {
        try {
            // URL ini akan memanggil backend Anda yang sebenarnya
            const response = await axios.get('http://localhost:5000/api/produk');
            setProducts(response.data);
        } catch (error) {
            console.error("Gagal mengambil data produk:", error);
            alert("Tidak dapat terhubung ke server backend. Pastikan server sudah berjalan.");
        } finally {
            setLoading(false);
        }
    };

    // Mengambil data saat komponen pertama kali dimuat
    useEffect(() => {
        fetchProducts();
    }, []);

    // Fungsi untuk membuat produk baru
    const handleCreateProduct = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post('http://localhost:5000/api/produk', {
                nama_produk: newProductName,
                harga: parseFloat(newProductPrice),
                stok: parseInt(newProductStock, 10)
            });
            setNewProductName('');
            setNewProductPrice('');
            setNewProductStock('');
            await fetchProducts(); // Ambil data terbaru setelah berhasil
        } catch (error) {
            console.error("Gagal menambahkan produk:", error);
        } finally {
            setSubmitting(false);
        }
    };

    // Fungsi untuk menghapus produk
    const handleDeleteProduct = async (id: number) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
            try {
                await axios.delete(`http://localhost:5000/api/produk/${id}`);
                await fetchProducts(); // Ambil data terbaru
            } catch (error) {
                console.error("Gagal menghapus produk:", error);
            }
        }
    };

    // Fungsi untuk membuka modal edit
    const handleOpenEditModal = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    // Fungsi untuk menutup modal edit
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    // Fungsi untuk memperbarui produk
    const handleUpdateProduct = async (e: FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;
        setSubmitting(true);
        try {
            await axios.put(`http://localhost:5000/api/produk/${editingProduct.id}`, editingProduct);
            handleCloseModal();
            await fetchProducts(); // Ambil data terbaru
        } catch (error) {
            console.error("Gagal memperbarui produk:", error);
        } finally {
            setSubmitting(false);
        }
    };

    // Tampilan saat loading
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Menghubungkan ke server...</p>
                </div>
            </div>
        );
    }

    // Tampilan utama
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        📦 Manajemen Produk
                    </h1>
                    <p className="text-gray-600">Kelola inventory produk dengan mudah dan efisien</p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Card Tambah Produk */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
                    <div className="flex items-center mb-6">
                        <div className="bg-blue-100 rounded-full p-3 mr-4">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Tambah Produk Baru</h2>
                    </div>

                    <form onSubmit={handleCreateProduct}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Produk</label>
                                <input type="text" value={newProductName} onChange={(e) => setNewProductName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                                    placeholder="Masukkan nama produk" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Harga</label>
                                <input type="number" value={newProductPrice} onChange={(e) => setNewProductPrice(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                                    placeholder="0" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Stok</label>
                                <input type="number" value={newProductStock} onChange={(e) => setNewProductStock(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                                    placeholder="0" required />
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button type="submit" disabled={submitting}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                {submitting ? 'Menambahkan...' : 'Tambah Produk'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Card Daftar Produk */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-2xl font-bold text-gray-900">Daftar Produk</h3>
                        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                            {products.length} Produk
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="text-sm font-medium text-gray-900">{product.nama_produk}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="text-sm font-bold text-gray-900">Rp {new Intl.NumberFormat('id-ID').format(product.harga)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${product.stok > 10 ? 'bg-green-100 text-green-800' : product.stok > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                {product.stok} unit
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button onClick={() => handleOpenEditModal(product)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg" title="Edit produk">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg" title="Hapus produk">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Modal Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <form onSubmit={handleUpdateProduct} className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Edit Produk</h3>
                                <button type="button" onClick={handleCloseModal} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Produk</label>
                                    <input type="text" value={editingProduct?.nama_produk || ''} onChange={(e) => setEditingProduct(prev => prev ? { ...prev, nama_produk: e.target.value } : null)} className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Harga</label>
                                    <input type="number" value={editingProduct?.harga || ''} onChange={(e) => setEditingProduct(prev => prev ? { ...prev, harga: parseFloat(e.target.value) } : null)} className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Stok</label>
                                    <input type="number" value={editingProduct?.stok || ''} onChange={(e) => setEditingProduct(prev => prev ? { ...prev, stok: parseInt(e.target.value, 10) } : null)} className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-6">
                                <button type="button" onClick={handleCloseModal} className="px-6 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50">Batal</button>
                                <button type="submit" disabled={submitting} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl disabled:opacity-50">
                                    {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductPage;