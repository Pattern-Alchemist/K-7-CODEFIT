"use client"

import { useLocale } from "next-intl"
import { useRouter, usePathname } from "next/navigation"
import { localeConfig } from "@/i18n/config"

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleLocaleChange = (newLocale: string) => {
    const path = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(path)
  }

  return (
    <div className="flex gap-2">
      {localeConfig.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleLocaleChange(loc)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            locale === loc
              ? "bg-teal text-ink"
              : "bg-transparent border border-cream/20 text-cream hover:border-cream/40"
          }`}
          aria-label={`Switch to ${loc}`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
