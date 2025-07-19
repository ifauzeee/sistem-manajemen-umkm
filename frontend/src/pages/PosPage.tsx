import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { Plus, Minus, Search, Package, ShoppingCart, XCircle } from 'lucide-react';

// Tipe data
interface Kategori { id: number; nama_kategori: string; }
interface Product { id: number; nama_produk: string; harga: number; stok: number; }
interface CartItem extends Product { quantity: number; }

function PosPage() {
    // State
    const [products, setProducts] = useState<Product[]>([]);
    const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedKategori, setSelectedKategori] = useState('semua');

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
        }, 300); // Debounce

        return () => clearTimeout(timer);
    }, [searchTerm, selectedKategori]);

    // Fungsi Keranjang (Lengkap)
    const addToCart = (product: Product) => {
        if (product.stok <= 0) {
            toast.error("Stok produk habis!");
            return;
        }
        toast.success(`${product.nama_produk} ditambahkan!`);
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };
    
    const decreaseQuantity = (productId: number) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === productId);
            if (existingItem && existingItem.quantity > 1) {
                return prevCart.map(item =>
                    item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
                );
            }
            return prevCart.filter(item => item.id !== productId);
        });
    };

    const handleClearCart = () => {
        setCart([]);
        toast.success("Keranjang dikosongkan.");
    }

    const totalHarga = cart.reduce((total, item) => total + (item.harga * item.quantity), 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return toast.error("Keranjang belanja kosong!");
        setSubmitting(true);
        await toast.promise(
            api.post('/transaksi', { cart }),
            { loading: 'Memproses...', success: <b>Transaksi berhasil!</b>, error: <b>Gagal memproses transaksi.</b> }
        );
        setCart([]);
        setSubmitting(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            <div className="lg:col-span-2 bg-surface rounded-lg border border-border-color p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                    <h1 className="text-2xl font-display font-bold text-text-primary">Pilih Produk</h1>
                    <div className="relative w-full sm:w-72">
                         <input type="text" placeholder="Cari produk..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-background pl-10 pr-4 py-2 border border-border-color rounded-md"/>
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-text-secondary" /></div>
                    </div>
                </div>
                <div className="flex items-center gap-2 border-b border-border-color pb-4 mb-4 overflow-x-auto">
                    <button onClick={() => setSelectedKategori('semua')} className={`flex-shrink-0 px-3 py-1 text-sm rounded-full ${selectedKategori === 'semua' ? 'bg-primary text-background font-semibold' : 'bg-background hover:bg-white/10'}`}>Semua</button>
                    {kategoriList.map(k => (
                        <button key={k.id} onClick={() => setSelectedKategori(String(k.id))} className={`flex-shrink-0 px-3 py-1 text-sm rounded-full ${selectedKategori === String(k.id) ? 'bg-primary text-background font-semibold' : 'bg-background hover:bg-white/10'}`}>{k.nama_kategori}</button>
                    ))}
                </div>
                {loading ? <p className="text-center text-text-secondary mt-10">Memuat produk...</p> : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                        {products.length > 0 ? products.map(product => (
                            <div key={product.id} className="bg-background border border-border-color rounded-lg p-3 flex flex-col items-center justify-between cursor-pointer hover:border-primary transition-colors group" onClick={() => addToCart(product)}>
                                <Package className="w-16 h-16 text-text-secondary mb-2 group-hover:text-primary transition-colors" />
                                <div className="text-center mt-2">
                                    <p className="font-bold text-center text-sm flex-grow text-text-primary">{product.nama_produk}</p>
                                    <p className="text-xs text-text-secondary">Rp {new Intl.NumberFormat('id-ID').format(product.harga)}</p>
                                    <p className={`text-xs ${product.stok > 0 ? 'text-gray-500' : 'text-danger'}`}>Stok: {product.stok}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full text-center py-16"><p className="text-text-secondary">Produk tidak ditemukan.</p></div>
                        )}
                    </div>
                )}
            </div>
            <div className="lg:col-span-1">
                <div className="bg-surface rounded-lg border border-border-color p-6 sticky top-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-display font-bold text-text-primary">Keranjang</h1>
                        {cart.length > 0 && (<button onClick={handleClearCart} className="text-xs text-danger hover:underline">Kosongkan</button>)}
                    </div>
                    <div className="space-y-4 max-h-[calc(100vh-320px)] overflow-y-auto pr-2">
                        {cart.length === 0 ? (
                            <div className="text-center py-16"><ShoppingCart className="w-16 h-16 text-text-secondary/30 mx-auto mb-2" /><p className="text-text-secondary">Keranjang masih kosong.</p></div>
                        ) :
                            cart.map(item => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <div className="flex-grow">
                                        <p className="font-semibold text-sm text-text-primary">{item.nama_produk}</p>
                                        <p className="text-xs text-text-secondary">Rp {new Intl.NumberFormat('id-ID').format(item.harga)} x {item.quantity}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => decreaseQuantity(item.id)} className="w-7 h-7 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"><Minus size={14} /></button>
                                        <button onClick={() => addToCart(item)} className="w-7 h-7 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"><Plus size={14} /></button>
                                    </div>
                                    <p className="font-semibold text-sm w-20 text-right">Rp {new Intl.NumberFormat('id-ID').format(item.harga * item.quantity)}</p>
                                </div>
                            ))
                        }
                    </div>
                    <div className="border-t border-border-color mt-6 pt-4">
                        <div className="flex justify-between font-bold text-lg mb-4 text-text-primary"><span>Total:</span><span>Rp {new Intl.NumberFormat('id-ID').format(totalHarga)}</span></div>
                        <button onClick={handleCheckout} disabled={submitting || cart.length === 0}
                            className="w-full py-3 bg-secondary text-white font-bold rounded-lg shadow-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                            {submitting ? "Memproses..." : "Bayar Sekarang"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default PosPage;