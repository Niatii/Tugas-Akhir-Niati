# EVOMA - Platform Manajemen Acara & Kegiatan Organisasi

EVOMA (Event Organization Management Application) adalah aplikasi web komprehensif yang dirancang untuk mempermudah pengelolaan acara, kegiatan organisasi, pendaftaran peserta, divisi internal, presensi/absensi, notulensi rapat, serta pembuatan dan penerbitan sertifikat digital secara otomatis. 

Proyek ini dibangun sebagai **Tugas Akhir** menggunakan arsitektur modern yang memisahkan **Backend API** (NestJS) dan **Frontend SPA** (Vue 3 dengan Quasar Framework).

---

## 📋 Fitur Utama

- 📅 **Manajemen Acara & Pendaftaran**: Pembuatan acara, pengaturan kuota/manfaat/persyaratan, serta pendaftaran peserta secara publik maupun internal.
- 👥 **Manajemen Divisi & Anggota**: Penugasan panitia/anggota ke dalam divisi-divisi acara beserta peran masing-masing.
- 📝 **Presensi & Notulensi Rapat**: Sistem pencatatan kehadiran rapat/acara dan dokumentasi notulensi rapat yang terstruktur.
- 🎓 **Generasi Sertifikat Digital**: Desain template sertifikat kustom dan penerbitan otomatis sertifikat PDF bagi peserta acara.
- 🔔 **Sistem Notifikasi**: Notifikasi di dalam aplikasi (in-app system notification) untuk pembaruan status acara, rapat, dan aktivitas pengguna.
- 📊 **Dashboard Analytics & Role-Based Access**: Dashboard informatif khusus Admin dan User/Peserta dengan visualisasi statistik acara.

---

## 🛠️ Teknologi & Stack

### **Backend**
- **Framework**: [NestJS](https://nestjs.com/) (TypeScript)
- **Runtime / Package Manager**: [Bun](https://bun.sh/) / Node.js
- **ORM & Database**: [Sequelize ORM](https://sequelize.org/) dengan **MySQL**
- **Autentikasi**: Passport JWT & Local Strategy
- **Utility & Services**: Puppeteer (Generasi PDF), Sharp (Pengolahan Gambar), Nodemailer (Email), ExcelJS, QRCode

### **Frontend**
- **Framework**: [Vue 3](https://vuejs.org/) + [Quasar Framework v2](https://quasar.dev/) (Vite CLI)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **Visualisasi & Komponen UI**: ApexCharts (Grafik), Motion (Animasi)

---

## 💻 Prasyarat Sistem

Sebelum memulai, pastikan perangkat Anda telah terinstal:
- **Node.js**: v18.x atau yang lebih baru
- **Bun**: (Direkomendasikan untuk Backend) atau **npm** / **yarn**
- **MySQL Database**: Berjalan di port default `3306` (misalnya melalui XAMPP, Laragon, atau MySQL Server standalone)

---

## ⚙️ Petunjuk Instalasi

### 1. Clone Repository
```bash
git clone <URL_REPOSITORY>
cd bridgeup
```

### 2. Konfigurasi Database & Environment Variables (Backend)
1. Buat database baru di MySQL, misalnya dengan nama `db_ta2`:
   ```sql
   CREATE DATABASE db_ta2;
   ```
2. Buka folder `Backend/` dan salin/edit file `.env`:
   ```env
   # DATABASE
   DB_DRIVER=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=db_ta2

   # JWT SECRET
   SECRET_KEY=secret

   # MAIL CONFIGURATION (SMTP)
   MAIL_USER=email_anda@gmail.com
   MAIL_PASS=password_app_anda

   # FRONTEND URL
   FRONTEND_URL=http://localhost:9000
   ```

### 3. Instalasi Dependensi & Migrasi Database

#### **Backend**
```bash
cd Backend

# Menginstal dependensi (menggunakan Bun atau npm)
bun install
# atau
npm install

# Menjalankan migrasi database
npx sequelize-cli db:migrate
```

#### **Frontend**
```bash
cd ../Frontend

# Menginstal dependensi
npm install
# atau
yarn install
```

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Menjalankan Backend Server
Buka terminal baru di direktori `Backend`:
```bash
cd Backend

# Menjalankan dalam mode pengembangan (watch mode)
bun run start:dev
# atau jika menggunakan npm
npm run start:dev
```
Backend API akan berjalan pada **`http://localhost:3000`**.

---

### 2. Menjalankan Frontend Web Application
Buka terminal baru di direktori `Frontend`:
```bash
cd Frontend

# Menjalankan server pengembangan Quasar (Vite)
npm run dev
# atau jika menggunakan quasar CLI
npx quasar dev
```
Frontend aplikasi akan secara otomatis terbuka/dapat diakses pada **`http://localhost:9000`**.

---

## 📂 Struktur Direktori Project

```text
bridgeup/
├── Backend/               # Server API (NestJS + Sequelize)
│   ├── src/
│   │   ├── cores/         # Konfigurasi database, event listener, & response formatting
│   │   ├── database/      # File migrasi & konfigurasi Sequelize
│   │   └── features/      # Modul fitur (Auth, Event, Attendance, Certificate, Meeting, dll)
│   ├── .env               # Konfigurasi Environment Backend
│   └── package.json
│
├── Frontend/              # Aplikasi Web SPA (Vue 3 + Quasar)
│   ├── src/
│   │   ├── assets/        # Gambar, logo, & aset statis
│   │   ├── components/    # Komponen UI reusable
│   │   ├── layouts/       # Main Layout & Admin Layout
│   │   ├── pages/         # Halaman aplikasi (Admin & User)
│   │   ├── router/        # Routing aplikasi & Guard
│   │   └── stores/        # Pinia State Management
│   └── package.json
│
└── README.md              # Dokumentasi utama proyek
```

---

## 🛠️ Perintah Tambahan

- **Linting Code Backend**: `bun run lint` / `npm run lint` (di dalam direktori `Backend`)
- **Linting Code Frontend**: `npm run lint` (di dalam direktori `Frontend`)
- **Build Production Frontend**: `npm run build` (di dalam direktori `Frontend`)

---

## 📜 Lisensi & Pengembang

Proyek ini dikembangkan oleh **Niati** sebagai bagian dari **Tugas Akhir**.  
All rights reserved.
