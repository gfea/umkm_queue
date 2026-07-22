import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Q-Lite — Antrean Digital UMKM Real-Time",
  description: "Solusi antrean digital tanpa instal aplikasi. Pindai QR, ambil nomor, dan atur antrean UMKM di q-lite.gfea.my.id.",
  keywords: ["antrean umkm", "queue system", "qr antrean", "antrean cafe", "digital queue", "q-lite.gfea.my.id"],
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  metadataBase: new URL("https://q-lite.gfea.my.id"),
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
