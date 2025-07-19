const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/stats', async (req, res) => {
    try {
        const [[pendapatanResult]] = await db.query('SELECT SUM(total_harga) as totalPendapatan FROM transaksi');
        const [[transaksiResult]] = await db.query('SELECT COUNT(id) as totalTransaksi FROM transaksi');
        
        const [produkTerlarisResult] = await db.query(`
            SELECT p.nama_produk, SUM(dt.jumlah) as totalTerjual
            FROM detail_transaksi dt 
            JOIN produk p ON dt.id_produk = p.id
            GROUP BY p.nama_produk
            ORDER BY totalTerjual DESC
            LIMIT 1;
        `);

        res.json({
            totalPendapatan: pendapatanResult.totalPendapatan || 0,
            totalTransaksi: transaksiResult.totalTransaksi || 0,
            produkTerlaris: produkTerlarisResult[0] || { nama_produk: '-', totalTerjual: 0 },
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: "Gagal mengambil data statistik." });
    }
});

router.get('/history', async (req, res) => {
    try {
        const query = `
            SELECT t.id as id_transaksi, t.total_harga, t.tanggal_transaksi, dt.jumlah, p.nama_produk
            FROM transaksi t JOIN detail_transaksi dt ON t.id = dt.id_transaksi JOIN produk p ON dt.id_produk = p.id
            ORDER BY t.tanggal_transaksi DESC;
        `;
        const [rows] = await db.query(query);
        const transactions = {};
        rows.forEach(row => {
            if (!transactions[row.id_transaksi]) {
                transactions[row.id_transaksi] = {
                    id: row.id_transaksi,
                    total_harga: row.total_harga,
                    tanggal_transaksi: row.tanggal_transaksi,
                    items: []
                };
            }
            transactions[row.id_transaksi].items.push({ nama_produk: row.nama_produk, jumlah: row.jumlah });
        });
        res.json(Object.values(transactions));
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil riwayat transaksi." });
    }
});

module.exports = router;