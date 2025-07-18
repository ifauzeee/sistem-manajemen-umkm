const express = require('express');
const router = express.Router();
const db = require('../db'); // Impor koneksi database

// --- RUTE UNTUK MENGAMBIL SEMUA PRODUK (READ) ---
// Endpoint: GET /api/produk/
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM produk ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        console.error("Error fetching produk:", error);
        res.status(500).json({ message: "Gagal mengambil data produk" });
    }
});

// --- RUTE UNTUK MENAMBAH PRODUK BARU (CREATE) ---
// Endpoint: POST /api/produk/
router.post('/', async (req, res) => {
    const { nama_produk, harga, stok } = req.body;

    if (!nama_produk || !harga || stok === undefined) {
        return res.status(400).json({ message: "Nama, harga, dan stok harus diisi" });
    }

    try {
        const query = 'INSERT INTO produk (nama_produk, harga, stok) VALUES (?, ?, ?)';
        const [result] = await db.query(query, [nama_produk, harga, stok]);
        res.status(201).json({ id: result.insertId, message: "Produk berhasil ditambahkan" });
    } catch (error) {
        console.error("Error adding produk:", error);
        res.status(500).json({ message: "Gagal menambahkan produk" });
    }
});

// --- RUTE UNTUK MENGUBAH PRODUK (UPDATE) ---
// Endpoint: PUT /api/produk/:id
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nama_produk, harga, stok } = req.body;

    if (!nama_produk || !harga || stok === undefined) {
        return res.status(400).json({ message: "Nama, harga, dan stok harus diisi" });
    }

    try {
        const query = 'UPDATE produk SET nama_produk = ?, harga = ?, stok = ? WHERE id = ?';
        const [result] = await db.query(query, [nama_produk, harga, stok, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Produk tidak ditemukan" });
        }

        res.json({ message: "Produk berhasil diperbarui" });
    } catch (error) {
        console.error("Error updating produk:", error);
        res.status(500).json({ message: "Gagal memperbarui produk" });
    }
});

// --- RUTE UNTUK MENGHAPUS PRODUK (DELETE) ---
// Endpoint: DELETE /api/produk/:id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM produk WHERE id = ?';
        const [result] = await db.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Produk tidak ditemukan" });
        }

        res.json({ message: "Produk berhasil dihapus" });
    } catch (error) {
        console.error("Error deleting produk:", error);
        res.status(500).json({ message: "Gagal menghapus produk" });
    }
});

module.exports = router;
