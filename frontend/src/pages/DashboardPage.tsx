import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { IndianRupee, ShoppingBag, Star, Inbox } from 'lucide-react';

// Tipe data (tidak berubah)
interface Stats { totalPendapatan: number; totalTransaksi: number; produkTerlaris: { nama_produk: string; totalTerjual: number; }; }
interface TransactionItem { nama_produk: string; jumlah: number; }
interface TransactionHistory { id: number; total_harga: number; tanggal_transaksi: string; items: TransactionItem[]; }

function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [history, setHistory] = useState<TransactionHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [statsRes, historyRes] = await Promise.all([
                    api.get('/dashboard/stats'),
                    api.get('/dashboard/history')
                ]);
                setStats(statsRes.data);
                setHistory(historyRes.data);
            } catch (error) {
                toast.error("Gagal memuat data dashboard.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-full"><p className="text-text-secondary">Memuat data dashboard...</p></div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-display font-bold text-text-primary mb-8">Dashboard</h1>
            
            {/* Kartu Statistik dengan Glassmorphism */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-surface/50 backdrop-blur-sm border border-border-color p-6 rounded-lg">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-secondary/10 rounded-full"><IndianRupee className="text-secondary" /></div>
                        <div>
                            <h3 className="text-text-secondary text-sm font-medium">Total Pendapatan</h3>
                            <p className="text-3xl font-bold text-text-primary mt-1">Rp {new Intl.NumberFormat('id-ID').format(stats?.totalPendapatan || 0)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface/50 backdrop-blur-sm border border-border-color p-6 rounded-lg">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-full"><ShoppingBag className="text-blue-500" /></div>
                        <div>
                            <h3 className="text-text-secondary text-sm font-medium">Total Transaksi</h3>
                            <p className="text-3xl font-bold text-text-primary mt-1">{stats?.totalTransaksi || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface/50 backdrop-blur-sm border border-border-color p-6 rounded-lg">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-full"><Star className="text-primary" /></div>
                        <div>
                            <h3 className="text-text-secondary text-sm font-medium">Produk Terlaris</h3>
                            <p className="text-xl font-bold text-text-primary mt-1">{stats?.produkTerlaris.nama_produk || '-'}</p>
                            <p className="text-sm text-text-secondary">{stats?.produkTerlaris.totalTerjual || 0} unit terjual</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Riwayat Transaksi */}
            <div className="bg-surface rounded-lg border border-border-color overflow-hidden">
                <div className="p-6">
                    <h2 className="text-xl font-display font-semibold text-text-primary">Riwayat Transaksi</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Item</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-color">
                            {history.length > 0 ? history.map(trx => (
                                <tr key={trx.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-primary">#{trx.id}</td>
                                    <td className="px-6 py-4 text-text-secondary">{new Date(trx.tanggal_transaksi).toLocaleString('id-ID')}</td>
                                    <td className="px-6 py-4 text-text-secondary">
                                        <ul className="list-disc list-inside">
                                            {trx.items.map((item, index) => (
                                                <li key={index}>{item.nama_produk} (x{item.jumlah})</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="px-6 py-4 text-right font-semibold text-text-primary">Rp {new Intl.NumberFormat('id-ID').format(trx.total_harga)}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-16">
                                        <div className="flex flex-col items-center">
                                            <Inbox className="w-12 h-12 text-text-secondary/50 mb-2" />
                                            <p className="text-text-secondary">Belum ada riwayat transaksi.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;