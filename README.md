# 📦 Sistem Manajemen UMKM (Simple POS)

Aplikasi web full-stack untuk manajemen produk dan sistem kasir sederhana (Point of Sale) yang cocok untuk UMKM. Proyek ini merupakan studi kasus membangun aplikasi modern dari awal hingga akhir menggunakan React (TypeScript) di frontend dan Node.js (Express & MySQL) di backend.

---

## ✨ Fitur Utama

- **Manajemen Produk (CRUD)**: Tambah, lihat, edit, dan hapus produk.
- **Manajemen Kategori**: Kelola kategori produk.
- **Transaksi POS**: Proses penjualan dengan pencatatan transaksi.
- **Autentikasi**: Registrasi & login user, proteksi halaman.
- **Dashboard**: Statistik penjualan dan produk.
- **Antarmuka Modern**: UI responsif & menarik dengan Tailwind CSS.
- **API RESTful**: Backend menyediakan API terstruktur untuk frontend.
- **Feedback Visual**: Loading & notifikasi interaktif.

---

## 🚀 Teknologi yang Digunakan

### Frontend
- **React** + **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Axios**
- **React Router DOM**
- **React Hot Toast**

### Backend
- **Node.js** + **Express.js**
- **MySQL** + **mysql2**
- **dotenv**
- **cors**

---

## ⚙️ Cara Instalasi & Menjalankan

### Prasyarat
- Node.js (v18+)
- NPM
- MySQL (bisa pakai XAMPP, Laragon, dsb)

### 1. Kloning Repository
```bash
git clone https://github.com/ifauzeee/sistem-manajemen-umkm.git
cd sistem-manajemen-umkm
```

### 2. Setup Backend
```bash
cd backend
npm install
```
- Buat file `.env` di folder backend:
  ```env
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=
  DB_NAME=db_umkm_pos
  ```
- Buat database `db_umkm_pos` dan tabel-tabelnya.
- Jalankan backend:
  ```bash
  npm start
  ```
  Backend berjalan di `http://localhost:5000`

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend berjalan di `http://localhost:5173`

---

## 📂 Struktur Folder

```
sistem-manajemen-umkm
├── backend/
│   ├── routes/
│   ├── middleware/
│   ├── db.js
│   ├── index.js
│   └── ...
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── pages/
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── ...
    ├── index.html
    └── ...
```

---

## 👤 Kontributor
- [ifauzeee](https://github.com/ifauzeee)

---

Dibuat dengan semangat belajar dan kopi ☕
