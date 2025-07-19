require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const authRoutes = require('./routes/auth');
const produkRoutes = require('./routes/produk');
const transaksiRoutes = require('./routes/transaksi');
const dashboardRoutes = require('./routes/dashboard');
const kategoriRoutes = require('./routes/kategori'); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/produk', produkRoutes);
app.use('/api/transaksi', transaksiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/kategori', kategoriRoutes); // 

app.listen(PORT, async () => {
    try {
        await db.getConnection();
        console.log("Successfully connected to the database.");
    } catch (error) {
        console.error("Failed to connect to the database:", error);
    }
    console.log(`Server is running on port ${PORT}`);
});