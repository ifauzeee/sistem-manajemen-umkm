const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', async (req, res) => {
    const { cart } = req.body;
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
        return res.status(400).json({ message: "Keranjang belanja kosong." });
    }
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const totalHarga = cart.reduce((total, item) => total + (item.harga * item.quantity), 0);
        const [transaksiResult] = await connection.query('INSERT INTO transaksi (total_harga) VALUES (?)', [totalHarga]);
        const transaksiId = transaksiResult.insertId;
        const detailTransaksiValues = cart.map(item => [transaksiId, item.id, item.quantity, item.harga * item.quantity]);
        await connection.query('INSERT INTO detail_transaksi (id_transaksi, id_produk, jumlah, subtotal) VALUES ?', [detailTransaksiValues]);
        const updateStokPromises = cart.map(item => connection.query('UPDATE produk SET stok = stok - ? WHERE id = ?', [item.quantity, item.id]));
        await Promise.all(updateStokPromises);
        await connection.commit();
        res.status(201).json({ message: "Transaksi berhasil dibuat!", transaksiId });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    } finally {
        connection.release();
    }
});

module.exports = router;