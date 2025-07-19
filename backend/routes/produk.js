const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// GET produk (dengan logika filter yang sudah diverifikasi)
router.get('/', async (req, res) => {
    try {
        const searchTerm = req.query.search || '';
        const kategoriId = req.query.kategori || '';

        let query = `
            SELECT p.*, k.nama_kategori 
            FROM produk p 
            LEFT JOIN kategori k ON p.id_kategori = k.id
        `;
        
        const params = [];
        const whereClauses = [];

        if (searchTerm) {
            whereClauses.push(`p.nama_produk LIKE ?`);
            params.push(`%${searchTerm}%`);
        }
        
        // Logika filter yang krusial
        if (kategoriId && kategoriId !== 'semua') {
            whereClauses.push(`p.id_kategori = ?`);
            params.push(kategoriId);
        }

        if (whereClauses.length > 0) {
            query += ` WHERE ${whereClauses.join(' AND ')}`;
        }
        
        query += ' ORDER BY p.id DESC';
        
        const [rows] = await db.query(query, params);
        res.json(rows);

    } catch (error) {
        console.error("Error fetching produk:", error);
        res.status(500).json({ message: "Gagal mengambil data produk" });
    }
});

// ... (Rute POST, PUT, DELETE tidak berubah, biarkan seperti yang sudah ada) ...
router.post('/', async (req, res) => { /* ... */ });
router.put('/:id', async (req, res) => { /* ... */ });
router.delete('/:id', async (req, res) => { /* ... */ });

module.exports = router;