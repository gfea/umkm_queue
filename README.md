# Q-Lite — Antrean Digital UMKM

Q-Lite adalah sistem manajemen antrean digital untuk UMKM. Pelanggan cukup memindai QR code untuk mengambil nomor antrean tanpa perlu menginstal aplikasi. Admin/pemilik toko dapat memantau antrean dari dashboard pusat.

## Fitur

- **Dashboard Admin:** Kelola pendaftaran UMKM, pantau antrean berjalan, dan *suspend/activate* UMKM.
- **Auto-Generate QR:** Setiap UMKM mendapat QR unik untuk pelanggannya.
- **Halaman Publik UMKM:** Tautan khusus (misal: `/q/kopi-pagi`) tempat pelanggan masuk antrean.
- **Auto-Status:** Pelanggan bisa melihat status nomornya: Menunggu → Dilayani → Selesai.
- **Ringan & Cepat:** Dibangun dengan Next.js App Router (React Server Components), output standalone Docker image.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4 + Lucide React icons
- **State / Storage:** LocalStorage (saat ini MVP), disiapkan schema migration untuk Supabase.
- **CI/CD:** GitHub Actions (Build multi-arch `linux/amd64` & `linux/arm64` image) -> GitHub Container Registry (GHCR).
- **Deployment:** Docker Compose + Watchtower (Auto-update container).

## Struktur Repositori

```text
├── schema.sql           # Schema production untuk Supabase DB
├── docker-compose.yml   # Konfigurasi container host
├── Dockerfile           # Multi-stage build standalone image
├── .github/workflows    # GitHub Actions CI pipeline
└── src/
    ├── app/             
    │   ├── admin/       # Dashboard & login admin
    │   ├── q/[slug]/    # Halaman antrean publik untuk pelanggan
    │   └── page.tsx     # Landing page Q-Lite
    ├── components/ui    # Reusable UI components (Button, Input, dll)
    └── lib/             # Utilities (domain, localStorage store)
```

## Menjalankan secara Lokal (Development)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Jalankan development server:**
   ```bash
   npm run dev
   ```

3. **Buka di browser:**
   - Landing: `http://localhost:3000`
   - Admin Login: `http://localhost:3000/admin/login`
     *(Kredensial demo MVP: `admin@qlite.id` / `admin123`)*

## Deployment via Docker

Proyek ini telah dikonfigurasi untuk environment *production-ready* via Docker Compose. Image otomatis dibangun oleh CI setiap commit di `main` dan dipublikasikan ke GHCR.

```bash
docker compose pull
docker compose up -d
```

## Catatan Transisi Supabase (Database)

Saat ini state disimpan di LocalStorage browser (`src/lib/store.ts`) untuk demo MVP cepat. 
Bila beralih ke production dengan Supabase:
1. Terapkan tabel dari `schema.sql` di console Supabase.
2. Salin `.env.example` ke `.env` lalu isi URL dan Anon Key.
3. Ganti fungsi di `src/lib/store.ts` agar memanggil Supabase client (`src/lib/supabase.ts`).
