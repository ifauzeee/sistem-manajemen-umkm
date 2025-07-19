import React, { useState, useEffect, FormEvent } from 'react';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Search, PlusCircle } from 'lucide-react';

// Tipe Data
interface Kategori { id: number; nama_kategori: string; }
interface Product { id: number; nama_produk: string; harga: number; stok: number; id_kategori: number | null; nama_kategori: string | null; }

function ProductPage() {
    // State
    const [products, setProducts] = useState<Product[]>([]);
    const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedKategori, setSelectedKategori] = useState('semua');
    const [newProductName, setNewProductName] = useState('');
    const [newProductKategori, setNewProductKategori] = useState('');
    const [newProductPrice, setNewProductPrice] = useState('');
    const [newProductStock, setNewProductStock] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const navigate = useNavigate();

    // useEffect HANYA untuk mengambil daftar kategori (berjalan sekali)
    useEffect(() => {
        const fetchKategori = async () => {
             try {
                const kategoriRes = await api.get('/kategori');
                setKategoriList(kategoriRes.data);
            } catch (error) {
                toast.error("Gagal memuat kategori.");
            }
        }
        fetchKategori();
    }, []);

    // useEffect untuk mengambil PRODUK setiap kali filter berubah
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const produkRes = await api.get(`/produk?search=${searchTerm}&kategori=${selectedKategori}`);
                setProducts(produkRes.data);
            } catch (error) {
                toast.error("Gagal memuat produk.");
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchProducts();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, selectedKategori]);

    const resetForm = () => { setNewProductName(''); setNewProductKategori(''); setNewProductPrice(''); setNewProductStock(''); }

    const handleCreateProduct = async (e: FormEvent) => {
        e.preventDefault(); setSubmitting(true);
        await toast.promise(
            api.post('/produk', { nama_produk: newProductName, id_kategori: newProductKategori, harga: parseFloat(newProductPrice), stok: parseInt(newProductStock, 10) }),
            { loading: 'Menambahkan...', success: <b>Berhasil!</b>, error: <b>Gagal.</b> }
        );
        resetForm(); await fetchProducts(); setSubmitting(false);
    };

    const fetchProducts = async () => {
        // Dummy function to avoid error, main logic is in useEffect
    };
    
    const handleDeleteProduct = (id: number) => {
        toast((t) => (<span>Yakin hapus? <button className="ml-2 px-3 py-1 bg-secondary text-white rounded text-sm" onClick={() => { deleteAction(id); toast.dismiss(t.id); }}>Ya</button> <button className="ml-2 px-3 py-1 bg-danger text-white rounded text-sm" onClick={() => toast.dismiss(t.id)}>Tidak</button></span>));
    };
    
    const deleteAction = async (id: number) => {
        await toast.promise(api.delete(`/produk/${id}`), { loading: 'Menghapus...', success: <b>Berhasil!</b>, error: <b>Gagal.</b> });
        await fetchProducts();
    };

    const handleOpenEditModal = (product: Product) => { setEditingProduct(product); setIsModalOpen(true); };
    const handleCloseModal = () => { setIsModalOpen(false); setEditingProduct(null); };

    const handleUpdateProduct = async (e: FormEvent) => {
        e.preventDefault(); if (!editingProduct) return; setSubmitting(true);
        await toast.promise(api.put(`/produk/${editingProduct.id}`, editingProduct), { loading: 'Menyimpan...', success: <b>Berhasil!</b>, error: <b>Gagal.</b> });
        handleCloseModal(); await fetchProducts(); setSubmitting(false);
    };
    
    return (
        <div>
            <h1 className="text-3xl font-display font-bold text-text-primary mb-8">Manajemen Produk</h1>
            <div className="bg-surface rounded-lg border border-border-color p-6 mb-8">
                <h2 className="text-xl font-display font-semibold text-text-primary mb-4">Tambah Produk Baru</h2>
                <form onSubmit={handleCreateProduct}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <input type="text" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} className="md:col-span-2 w-full bg-background px-4 py-2 border border-border-color rounded-md focus:ring-1 focus:ring-primary focus:border-primary" placeholder="Nama Produk" required />
                        <select value={newProductKategori} onChange={(e) => setNewProductKategori(e.target.value)} className="w-full bg-background px-4 py-2 border border-border-color rounded-md focus:ring-1 focus:ring-primary focus:border-primary" required>
                            <option value="" disabled>Pilih Kategori</option>
                            {kategoriList.map(k => <option key={k.id} value={k.id}>{k.nama_kategori}</option>)}
                        </select>
                        <input type="number" value={newProductPrice} onChange={(e) => setNewProductPrice(e.target.value)} className="w-full bg-background px-4 py-2 border border-border-color rounded-md focus:ring-1 focus:ring-primary focus:border-primary" placeholder="Harga" required />
                        <input type="number" value={newProductStock} onChange={(e) => setNewProductStock(e.target.value)} className="w-full bg-background px-4 py-2 border border-border-color rounded-md focus:ring-1 focus:ring-primary focus:border-primary" placeholder="Stok" required />
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" disabled={submitting} className="py-2 px-6 bg-primary text-background font-bold rounded-md disabled:opacity-50 hover:bg-primary-hover transition-colors flex items-center justify-center gap-2">
                            <PlusCircle size={18}/> {submitting ? 'Menyimpan...' : 'Tambah Produk'}
                        </button>
                    </div>
                </form>
            </div>
            <div className="bg-surface rounded-lg border border-border-color overflow-hidden">
                <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="text-xl font-display font-semibold text-text-primary">Daftar Produk</h2>
                    <div className="relative w-full md:w-1/3">
                        <input type="text" placeholder="Cari produk..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-background pl-10 pr-4 py-2 border border-border-color rounded-md focus:ring-1 focus:ring-primary focus:border-primary" />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-text-secondary" /></div>
                    </div>
                </div>
                <div className="px-6 pb-4 flex items-center gap-2 border-b border-border-color overflow-x-auto">
                    <button onClick={() => setSelectedKategori('semua')} className={`flex-shrink-0 px-3 py-1 text-sm rounded-full transition-colors ${selectedKategori === 'semua' ? 'bg-primary text-background font-semibold' : 'bg-background hover:bg-white/10'}`}>Semua</button>
                    {kategoriList.map(k => (
                        <button key={k.id} onClick={() => setSelectedKategori(String(k.id))} className={`flex-shrink-0 px-3 py-1 text-sm rounded-full transition-colors ${selectedKategori === String(k.id) ? 'bg-primary text-background font-semibold' : 'bg-background hover:bg-white/10'}`}>{k.nama_kategori}</button>
                    ))}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-text-secondary uppercase">Produk</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-text-secondary uppercase">Kategori</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-text-secondary uppercase">Harga</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-text-secondary uppercase">Stok</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-text-secondary uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-color">
                            {loading ? ( <tr><td colSpan={5} className="text-center py-10 text-text-secondary">Memuat...</td></tr> ) 
                             : products.map((product) => (
                                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-text-primary">{product.nama_produk}</td>
                                    <td className="px-6 py-4 text-text-secondary">{product.nama_kategori || '-'}</td>
                                    <td className="px-6 py-4 text-right">Rp {new Intl.NumberFormat('id-ID').format(product.harga)}</td>
                                    <td className="px-6 py-4 text-center"><span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${product.stok > 10 ? 'bg-green-500/10 text-green-400' : product.stok > 0 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}`}>{product.stok} unit</span></td>
                                    <td className="px-6 py-4 text-center space-x-2"><button onClick={() => handleOpenEditModal(product)} className="p-2 text-primary hover:bg-white/10 rounded-full" title="Edit"><Edit size={18} /></button><button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-danger hover:bg-white/10 rounded-full" title="Hapus"><Trash2 size={18} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && editingProduct && (
                 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-surface rounded-lg border border-border-color shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-display font-semibold text-text-primary mb-4">Edit Produk</h2>
                        <form onSubmit={handleUpdateProduct}>
                            <div className="space-y-4">
                                <input type="text" value={editingProduct.nama_produk} onChange={(e) => setEditingProduct({ ...editingProduct, nama_produk: e.target.value })} className="w-full bg-background px-4 py-2 border border-border-color rounded-md" />
                                <select value={editingProduct.id_kategori || ''} onChange={(e) => setEditingProduct({ ...editingProduct, id_kategori: parseInt(e.target.value) })} className="w-full bg-background px-4 py-2 border border-border-color rounded-md">
                                    <option value="" disabled>Pilih Kategori</option>
                                    {kategoriList.map(k => <option key={k.id} value={k.id}>{k.nama_kategori}</option>)}
                                </select>
                                <input type="number" value={editingProduct.harga} onChange={(e) => setEditingProduct({ ...editingProduct, harga: parseFloat(e.target.value) })} className="w-full bg-background px-4 py-2 border border-border-color rounded-md" />
                                <input type="number" value={editingProduct.stok} onChange={(e) => setEditingProduct({ ...editingProduct, stok: parseInt(e.target.value, 10) })} className="w-full bg-background px-4 py-2 border border-border-color rounded-md" />
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-white/10 text-text-primary rounded-md">Batal</button>
                                <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary text-background font-semibold rounded-md">{submitting ? '...' : 'Simpan'}</button>
                            </div>
                        </form>
                    </div>
                 </div>
            )}
        </div>
    );
}
export default ProductPage;