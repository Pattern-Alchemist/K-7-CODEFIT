"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)

  const NAV_LINKS = [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "Plans", href: "#pricing" },
    { label: "Book", href: "#booking" },
  ]

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-teal/20 bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
            <div className="relative h-10 sm:h-12 w-10 sm:w-12 rounded-lg border border-teal/50 overflow-hidden bg-gradient-to-br from-teal/20 to-gold/10">
              <img
                src="/logo_image.png"
                alt="AstroKalki"
                className="w-full h-full object-cover"
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=100"
                }}
              />
            </div>
            <div className="hidden sm:block">
              <div className="font-cinzel text-base sm:text-lg font-bold tracking-wider text-gold">ASTROKALKI</div>
              <div className="text-xs text-gray-400">Cosmic Clarity</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-gray-300 hover:text-teal-light transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-teal/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6 text-teal-light" /> : <Menu className="h-6 w-6 text-teal-light" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-teal/20 bg-black/95 px-4 py-4 space-y-3 pb-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-2 text-sm text-gray-300 hover:text-teal-light transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
