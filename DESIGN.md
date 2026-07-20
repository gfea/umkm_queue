# Design Guideline (Token & Design System)
## Q-Lite UI Framework

Desain Q-Lite fokus pada kecepatan load (zero-delay), responsif ekstrem (mobile-first untuk pembeli, tablet-first untuk penjual), dan visual modern (minimalis, font proporsional, border tipis, efek glassmorphism halus, tanpa gradasi warna norak ala AI-slop).

### 1. Typography & Hierarchy
- **Primary Font:** Inter / Geist Sans (Geometris, rapat, modern).
- **Monospace Font (untuk nomor antrean):** Geist Mono / JetBrains Mono (Karakteristik angka tegas).
- **Scale:**
  - Display (Nomor Antrean): `text-7xl font-bold tracking-tighter font-mono`
  - H1 (Header): `text-2xl font-semibold tracking-tight`
  - Body: `text-sm font-normal text-slate-600`
  - Small/Muted: `text-xs font-medium text-slate-400`

### 2. Color Palette (Light Mode Minimalist)
- **Background Utama:** `#fafafa` (Slate/Grey super terang, mengurangi silau).
- **Card/Surface:** `#ffffff` (Putih bersih).
- **Border:** `#e2e8f0` (Slate-200, tipis `border-[1px]`).
- **Brand/Primary:** `#0f172a` (Slate-900, dominan gelap profesional).
- **Accent (Status):**
  - Antre (Queue): `#64748b` (Slate-500).
  - Diproses (Preparing): `#f59e0b` (Amber-500, transisi).
  - Selesai (Ready): `#10b981` (Emerald-500, siap diambil).

### 3. Component Spec & Tailwind Classes

#### A. Tiket Antrean Pembeli (Live Card)
Desain berbentuk fisik tiket sobek klasik tapi modern:
```html
<div class="relative bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden max-w-sm mx-auto">
  <!-- Sobek Border Effect (Modern Minimalist Dash) -->
  <div class="absolute top-1/2 left-0 right-0 h-[1px] border-t border-dashed border-slate-200 -translate-y-1/2"></div>
  
  <!-- Info Atas -->
  <div class="pb-8 text-center">
    <span class="text-xs font-semibold tracking-widest text-slate-400 uppercase">Antrean Anda</span>
    <h2 class="text-7xl font-bold font-mono tracking-tighter text-slate-900 mt-2">A-12</h2>
    <p class="text-sm font-medium text-slate-500 mt-1">Nama: Rian</p>
  </div>
  
  <!-- Info Bawah -->
  <div class="pt-8 text-center flex flex-col items-center">
    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
      <span class="h-2 w-2 rounded-full bg-amber-500"></span>
      Sedang Disiapkan
    </span>
    <p class="text-xs text-slate-400 mt-3">Estimasi: ~5 menit lagi</p>
  </div>
</div>
```

#### B. Dashboard Penjual (Kanban Kolom)
Tampilan 3 kolom grid minimalis:
```html
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-[#fafafa] min-h-screen">
  <!-- Kolom Antre -->
  <div class="flex flex-col bg-slate-50 rounded-2xl p-4 border border-slate-100">
    <div class="flex items-center justify-between mb-4 px-1">
      <h3 class="font-semibold text-slate-800 text-sm">Menunggu (3)</h3>
      <span class="bg-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded-md font-mono">WAIT</span>
    </div>
    <!-- List Tiket -->
    <div class="space-y-3">
      <!-- Item -->
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-slate-300 transition cursor-pointer">
        <div>
          <span class="text-xs font-mono font-bold text-slate-400">#A-14</span>
          <h4 class="font-medium text-slate-800 text-sm">Budi</h4>
        </div>
        <button class="text-xs font-semibold px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition">
          Proses →
        </button>
      </div>
    </div>
  </div>
</div>
```

### 4. Interactive UX Rules
1. **Transition:** Selalu gunakan `transition-all duration-200 ease-out` untuk setiap perpindahan status/hover tombol.
2. **Alert State:** Ketika status pembeli bergeser ke **Selesai**, halaman pembeli melakukan transisi warna latar belakang ke Emerald-50 penuh selama 3 detik, memicu getaran HP (`navigator.vibrate([200, 100, 200])`), dan memainkan file audio bip pendek (`ping.mp3`).
3. **Skeleton Loading:** Gunakan shimmer statis minimalis saat inisialisasi koneksi websocket Supabase.
4. **Smooth Request Lifecycle (Optimistic UI & Queuing):**
   - Saat pembeli klik "Ambil Nomor", tampilkan spinner mini di dalam tombol seketika (optimistic loading) dan nonaktifkan tombol untuk mencegah klik berulang.
   - Status antrean di-update secara bertahap menggunakan animasi fade-in/fade-out yang halus (CSS transitions) saat data baru masuk dari WebSocket, meminimalisir efek visual melompat (layout shifts) di layar HP.
   - Dashboard penjual menerapkan antrean lokal di memori frontend (optimistic UI updates) agar ketika penjual menekan "Proses", item langsung berpindah ke kolom berikutnya secara instan di layar lokal tanpa menunggu balasan sukses dari jaringan backend, lalu meresolusi status jaringan di background.

### 5. Reusable Component Guidelines (Tailwind / React)
Semua komponen UI wajib modular dan tanpa *side-effects* (pure visual component). State dan event handler dilewatkan via props.

#### Button Primitive (`src/components/ui/button.tsx`)
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}
// Implementasi dengan varian Tailwind kelas dasar yang clean.
```

#### Card Primitive (`src/components/ui/card.tsx`)
```typescript
// Wrapper visual konsisten dengan border tipis 1px dan bg slate-50/white.
```


