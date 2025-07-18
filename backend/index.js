require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const produkRoutes = require('./routes/produk'); // <-- BARIS BARU

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Route pengetesan
app.get('/', (req, res) => {
    res.json({ message: "Backend API is working!" });
});

// Gunakan Rute
app.use('/api/produk', produkRoutes); // <-- BARIS BARU

// Jalankan server
app.listen(PORT, async () => {
    try {
        await db.getConnection();
        console.log("Successfully connected to the database.");
    } catch (error) {
        console.error("Failed to connect to the database:", error);
    }
    console.log(`Server is running on port ${PORT}`);
});