// backend/routes/kategori.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// GET semua kategori
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM kategori ORDER BY nama_kategori ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data kategori." });
    }
});

// POST kategori baru
router.post('/', async (req, res) => {
    const { nama_kategori } = req.body;
    if (!nama_kategori) return res.status(400).json({ message: "Nama kategori harus diisi." });
    try {
        const [result] = await db.query('INSERT INTO kategori (nama_kategori) VALUES (?)', [nama_kategori]);
        res.status(201).json({ id: result.insertId, message: "Kategori berhasil ditambahkan." });
    } catch (error) {
        res.status(500).json({ message: "Gagal menambahkan kategori." });
    }
});

module.exports = router;