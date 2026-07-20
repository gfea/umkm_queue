# Product Requirements Document (PRD)
## Q-Lite (Queue Lite) for UMKM

### 1. Vision & Concept
Sistem manajemen antrean digital ringan berbasis Web untuk UMKM (penjual makanan, minuman, dll) dengan volume pelanggan tinggi. 
- **Zero-Friction untuk Pembeli:** Tanpa download aplikasi, tanpa perlu registrasi/login. Cukup scan QR code.
- **Mudah untuk Penjual:** Cukup daftar, cetak QR code, dan gunakan HP/Tablet untuk mengatur pesanan.

### 2. Target Audience
- **Penjual (UMKM):** Kedai kopi, pedagang kaki lima, food truck, rumah makan take-away.
- **Pembeli:** Pelanggan yang ingin memesan dan memantau status antrean tanpa harus berdiri berdesakan di depan kasir.

### 3. Core Flow (User Journey)
1. **Pendaftaran Penjual:**
   - Penjual mendaftar di web (Email/Password atau Google Login).
   - Sistem men-generate **Unique QR Code** dan link khusus untuk toko tersebut (contoh: `q-lite.com/toko/kopi-senja`).
   - Penjual mencetak QR Code dan menempelkannya di meja kasir/gerobak.
2. **Pembeli Masuk Antrean:**
   - Pembeli datang, memesan/bayar ke kasir seperti biasa.
   - Pembeli scan QR Code menggunakan HP mereka.
   - Web browser terbuka, pembeli hanya perlu memasukkan "Nama Panggilan" lalu klik "Ambil Nomor".
   - Pembeli mendapatkan Nomor Antrean digital dan bisa melihat statusnya (Live Tracking).
3. **Manajemen Penjual:**
   - Nama pembeli muncul di dashboard penjual.
   - Penjual menggeser status pesanan: `Antre` -> `Diproses` -> `Selesai (Siap Diambil)`.
4. **Notifikasi Pembeli:**
   - Layar HP pembeli otomatis update secara real-time.
   - Ketika status "Selesai", layar pembeli berubah warna dan berbunyi/bergetar agar mereka segera mengambil pesanan.

### 4. Minimum Viable Product (MVP) Features

#### A. Sisi Pembeli (Buyer Web Interface)
- **Scan to Join:** Halaman input nama panggilan (tanpa login).
- **Live Queue Tracker:** Tampilan status pesanan real-time.
- **Audio/Visual Alert:** Notifikasi browser (suara/getar/warna berkedip) saat pesanan selesai.

#### B. Sisi Penjual (Merchant Dashboard)
- **Auth & Onboarding:** Register/Login sederhana.
- **QR Generator:** Halaman untuk mengunduh dan mencetak QR Code toko.
- **Kanban Board:** Dashboard 3 kolom sederhana (`Antre`, `Proses`, `Selesai`) yang auto-refresh.
- **One-Tap Action:** Tap atau swipe untuk memindahkan tiket antrean ke kolom berikutnya.
- **Clear Queue:** Tombol untuk mereset antrean harian atau menandai pesanan yang sudah diambil.

### 5. Technical Architecture (Next.js)
- **Frontend & Backend:** Next.js App Router + TypeScript. PWA-ready agar penjual bisa memasang web ke home screen.
- **Modular & Reusable Architecture:**
  - **Frontend (Feature-Based & Atomic):**
    - Struktur folder menggunakan pendekatan modular berbasis fitur (e.g., `src/features/queue/`, `src/features/dashboard/`, `src/features/auth/`).
    - Komponen UI dasar yang reusable diletakkan di `src/components/ui/` (Button, Card, Input, Badge, Dialog) dibangun murni menggunakan Tailwind CSS + Radix primitives (tanpa ketergantungan library UI eksternal yang besar).
  - **Backend (Service-Repository Pattern):**
    - Logika bisnis dipisah dari HTTP handler Next.js API Routes.
    - Struktur backend menggunakan layer: `routes/handlers` -> `services` (business logic/queue processing) -> `repositories` (database queries/Supabase client).
    - Middleware reusable untuk penanganan error global, rate limiting, validasi skema (Zod), dan autentikasi.
- **Database:** Supabase PostgreSQL + Realtime WebSocket.
- **Queue & Concurrency Management (Crowded Handler):**
  - **Pessimistic Locking & Database Transactions:** Menggunakan `SELECT ... FOR UPDATE` atau fungsi stored procedure di PostgreSQL (RPC) untuk mencegah nomor antrean ganda (race conditions) saat ratusan pembeli menekan tombol "Ambil Nomor" di detik yang sama.
  - **Debouncing & Rate Limiting:** Pembatasan rate limit API per alamat IP (atau sidik jari browser) dan debouncing tombol UI (tombol langsung dinonaktifkan setelah sekali klik) guna menangkal double-submission atau spam klik.
  - **InMemory Queue / Redis (Skala Menengah):** Jika traffic meningkat tajam, backend menggunakan antrean memori internal (seperti BullMQ dengan Redis) untuk memproses pembuatan tiket antrean secara berurutan (first-in-first-out/FIFO) sebelum ditulis ke database utama.
- **Styling:** Tailwind CSS. Komponen custom kecil; hindari library UI besar agar identitas visual unik dan bundle ringan.
- **QR:** QR code berisi URL publik berbasis ID/slug penjual, bukan data rahasia.
- **Hosting:** Vercel untuk aplikasi; Supabase untuk auth, database, dan realtime.

### 6. UX dan Visual Requirements
- Modern, minimalis, unik, serta tidak memakai pola visual generik hasil AI.
- Mobile-first untuk pembeli; tablet/desktop responsive untuk dashboard penjual.
- Interaksi halus dengan animasi 150–200 ms. Hormati `prefers-reduced-motion`.
- Gunakan semantic HTML, fokus keyboard terlihat, kontras WCAG AA, dan target sentuh minimal 44×44 px.
- Tidak ada animasi berat, video latar, atau JavaScript dekoratif.
- Gunakan system font/Geist, SVG icon, dan aset terkompresi.
- Target performa: LCP < 2,5 detik, CLS < 0,1, INP < 200 ms pada jaringan seluler menengah.
- Detail token dan komponen ada di `DESIGN.md`.

### 7. Phase 1 Success Metrics
- Sistem berjalan real-time tanpa delay signifikan (< 2 detik dari klik penjual ke layar pembeli).
- 20 UMKM aktif mencoba dalam bulan pertama.
- Pengurangan kerumunan fisik di depan kasir terbukti secara kualitatif.
