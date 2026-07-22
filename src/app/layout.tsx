import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Q-Lite — Antrean Digital UMKM Real-Time",
    template: "%s | Q-Lite"
  },
  description: "Solusi antrean digital tanpa instal aplikasi. Cukup pindai QR Code, ambil nomor antrean, dan pantau giliran secara real-time. Cocok untuk kafe, klinik, salon, dan toko kelontong.",
  keywords: [
    "antrean umkm",
    "aplikasi antrean gratis",
    "queue system indonesia",
    "qr code antrean",
    "antrean digital kafe",
    "sistem antrean klinik",
    "q-lite",
    "q-lite.gfea.my.id",
    "antrean real-time"
  ],
  authors: [{ name: "GFEA" }],
  creator: "GFEA",
  metadataBase: new URL("https://q-lite.gfea.my.id"),
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Q-Lite — Antrean Digital UMKM Real-Time",
    description: "Ambil nomor antrean langsung dari HP tanpa instal aplikasi. Sistem antrean digital gratis dan responsif untuk kenyamanan pelanggan UMKM Anda.",
    url: "https://q-lite.gfea.my.id",
    siteName: "Q-Lite",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 800,
        alt: "Q-Lite Logo"
      }
    ],
    locale: "id_ID",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Q-Lite — Antrean Digital UMKM Real-Time",
    description: "Sistem antrean digital gratis dan praktis untuk UMKM. Cukup pindai QR, ambil nomor, pantau giliran.",
    images: ["/logo.jpg"]
  },
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-[#090b10] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
        {children}
      </body>
    </html>
  )
}
