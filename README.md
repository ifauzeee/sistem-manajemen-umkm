# 📦 Sistem Manajemen Produk (Simple POS)

Aplikasi web full-stack untuk manajemen produk dan sistem kasir sederhana (Point of Sale). Proyek ini berfungsi sebagai studi kasus untuk membangun aplikasi modern dari awal hingga akhir menggunakan stack React (dengan TypeScript) dan Node.js (dengan Express & MySQL).

![Tangkapan Layar Aplikasi](https://i.imgur.com/L8aY3Xk.png)
*Catatan: Ganti URL di atas dengan link screenshot aplikasi Anda sendiri.*

---

## ✨ Fitur Utama

- **Manajemen Produk (CRUD)**:
  - **Create**: Menambahkan produk baru (nama, harga, stok) ke dalam database.
  - **Read**: Menampilkan seluruh daftar produk dalam tabel yang interaktif.
  - **Update**: Mengubah detail produk melalui form modal yang elegan.
  - **Delete**: Menghapus produk dari database dengan konfirmasi untuk mencegah kesalahan.
- **Antarmuka Modern**: UI yang bersih, responsif, dan menarik dibangun dengan **Tailwind CSS**.
- **API RESTful**: Backend menyediakan API yang terstruktur dan logis untuk mengelola data produk.
- **Feedback Visual**: Memberikan indikator loading saat mengambil data dan saat mengirim form untuk meningkatkan pengalaman pengguna.

---

## 🚀 Teknologi yang Digunakan

### Frontend
- **React**: Library JavaScript untuk membangun antarmuka pengguna.
- **TypeScript**: Menambahkan tipe data statis pada JavaScript untuk kode yang lebih aman.
- **Vite**: Alat build modern yang sangat cepat untuk pengembangan frontend.
- **Tailwind CSS**: Utility-first CSS framework untuk desain yang cepat dan kustom.
- **Axios**: Library untuk melakukan permintaan HTTP ke backend API.

### Backend
- **Node.js**: Lingkungan eksekusi JavaScript di sisi server.
- **Express.js**: Framework minimalis untuk membangun API di atas Node.js.
- **MySQL**: Sistem manajemen database relasional untuk menyimpan data.
- **`mysql2`**: Driver untuk menghubungkan aplikasi Node.js dengan database MySQL.
- **`dotenv`**: Untuk mengelola variabel lingkungan seperti kredensial database.
- **`cors`**: Middleware untuk mengaktifkan Cross-Origin Resource Sharing antara frontend dan backend.

---

## ⚙️ Panduan Instalasi & Penggunaan

Untuk menjalankan proyek ini di lingkungan lokal Anda, ikuti langkah-langkah berikut:

### Prasyarat
- [Node.js](https://nodejs.org/) (v18 atau lebih baru direkomendasikan)
- [NPM](https://www.npmjs.com/) (terinstal bersama Node.js)
- [XAMPP](https://www.apachefriends.org/) atau server database MySQL lainnya

### 1. Kloning Repository
Buka terminal dan jalankan perintah berikut:
```bash
git clone https://github.com/ifauzeee/sistem-manajemen-umkm.git
cd sistem-manajemen-umkm
```

### 2. Konfigurasi Backend
- Buka terminal baru dan navigasi ke folder `backend`.
  ```bash
  cd backend
  npm install
  ```
- Buat file `.env` di dalam folder `backend` dan isi konfigurasinya:
  ```env
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=
  DB_NAME=db_umkm_pos
  ```
- Pastikan Anda sudah membuat database `db_umkm_pos` dan tabel-tabelnya menggunakan skrip SQL yang disediakan atau secara manual.
- Jalankan server backend:
  ```bash
  npm start
  ```
  Server akan berjalan di `http://localhost:5000`.

### 3. Konfigurasi Frontend
- Buka terminal baru yang lain dan navigasi ke folder `frontend`.
  ```bash
  cd frontend
  npm install
  ```
- Jalankan server frontend:
  ```bash
  npm run dev
  ```
  Aplikasi akan dapat diakses di `http://localhost:5173` (atau port lain yang ditampilkan di terminal).

---

## 📂 Struktur Folder Proyek

Struktur folder utama proyek ini diatur sebagai berikut untuk memisahkan antara frontend dan backend.

```
.
├── backend/
│   ├── routes/
│   │   └── produk.js       # Rute API untuk produk
│   ├── .env                # File environment (tidak di-commit)
│   ├── .gitignore          # Mengabaikan node_modules dan .env
│   ├── db.js               # Konfigurasi koneksi database
│   ├── index.js            # File utama server Express
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── ProductPage.tsx # Komponen utama aplikasi
    │   ├── App.tsx             # Komponen root aplikasi
    │   ├── index.css           # File untuk direktif Tailwind CSS
    │   └── main.tsx            # Titik masuk aplikasi React
    ├── .gitignore              # Mengabaikan node_modules dan /dist
    ├── index.html
    ├── package.json
    ├── postcss.config.js       # Konfigurasi PostCSS
    └── tailwind.config.js      # Konfigurasi Tailwind CSS
```

---

Dibuat dengan semangat belajar dan secangkir kopi. ☕