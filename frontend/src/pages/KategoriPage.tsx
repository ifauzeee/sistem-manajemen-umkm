// frontend/src/pages/KategoriPage.tsx
import React, { useState, useEffect, FormEvent } from 'react';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { Layers } from 'lucide-react';

interface Kategori { id: number; nama_kategori: string; }

function KategoriPage() {
    const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
    const [namaKategori, setNamaKategori] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchKategori = async () => {
        try {
            const response = await api.get('/kategori');
            setKategoriList(response.data);
        } catch (error) {
            toast.error("Gagal memuat kategori.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKategori();
    }, []);

    const handleAddKategori = async (e: FormEvent) => {
        e.preventDefault();
        await toast.promise(
            api.post('/kategori', { nama_kategori: namaKategori }),
            { loading: 'Menyimpan...', success: <b>Kategori ditambahkan!</b>, error: <b>Gagal.</b> }
        );
        setNamaKategori('');
        await fetchKategori();
    };

    return (
        <div>
            <h1 className="text-3xl font-display font-bold text-text-primary mb-8">Manajemen Kategori</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 bg-surface rounded-lg border border-border-color p-6">
                    <h2 className="text-xl font-display font-semibold text-text-primary mb-4">Tambah Kategori</h2>
                    <form onSubmit={handleAddKategori}>
                        <input type="text" value={namaKategori} onChange={(e) => setNamaKategori(e.target.value)}
                            className="w-full bg-background px-4 py-2 border border-border-color rounded-md"
                            placeholder="cth: Makanan, Minuman" required />
                        <button type="submit" className="mt-4 w-full py-2 bg-primary text-background font-bold rounded-md hover:bg-primary-hover">
                            Tambah
                        </button>
                    </form>
                </div>
                <div className="md:col-span-2 bg-surface rounded-lg border border-border-color p-6">
                    <h2 className="text-xl font-display font-semibold text-text-primary mb-4">Daftar Kategori</h2>
                    <ul className="space-y-2">
                        {loading ? <p>Memuat...</p> : kategoriList.map(k => (
                            <li key={k.id} className="bg-background p-3 rounded-md flex items-center">
                                <Layers size={16} className="text-text-secondary mr-3" />
                                {k.nama_kategori}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
export default KategoriPage;