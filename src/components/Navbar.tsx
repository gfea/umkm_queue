"use client"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Logo } from "@/components/Logo"
import { Button } from "@/components/ui/Button"
import { Store, Sparkles, UserPlus } from "lucide-react"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 smooth-gpu ${
        scrolled
          ? "bg-slate-950/85 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5">
        {/* Logo Component */}
        <Link href="/" className="group">
          <Logo size="md" subtext="q-lite.gfea.my.id" />
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
          <a href="#fitur" className="hover:text-emerald-400 transition-colors">
            Fitur Utama
          </a>
          <a href="#simulasi" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" /> Live Demo
          </a>
          <a href="#kalkulator" className="hover:text-emerald-400 transition-colors">
            Hitung ROI
          </a>
          <a href="#harga" className="hover:text-emerald-400 transition-colors">
            Paket & Harga
          </a>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <Link href="/merchant/login" className="hidden sm:inline-flex">
            <Button variant="ghost" size="sm" className="text-xs">
              <Store className="w-3.5 h-3.5 mr-1" /> Login Toko
            </Button>
          </Link>
          <Link href="/merchant/register">
            <Button variant="emerald" size="sm" className="text-xs font-bold">
              <UserPlus className="w-3.5 h-3.5 mr-1" /> Daftar Toko Gratis
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
