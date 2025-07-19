const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username dan password harus diisi." });
    try {
        const [userExists] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
        if (userExists.length > 0) return res.status(409).json({ message: "Username sudah digunakan." });
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).json({ message: "Registrasi berhasil! Silakan login." });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username dan password harus diisi." });
    try {
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) return res.status(401).json({ message: "Username atau password salah." });
        const user = users[0];
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) return res.status(401).json({ message: "Username atau password salah." });
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '8h' });
        res.json({ message: "Login berhasil!", token: token });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
});

module.exports = router;