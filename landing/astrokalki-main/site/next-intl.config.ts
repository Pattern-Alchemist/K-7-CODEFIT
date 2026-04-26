import { getRequestConfig } from "next-intl/server"

export const locales = ["en", "es", "hi", "pt"] as const
export const defaultLocale = "en" as const
export type Locale = (typeof locales)[number]

export const localeConfig = {
  locales,
  defaultLocale,
  pathnames: {
    "/": "/",
    "/services": "/services",
    "/booking": "/booking",
    "/consultation": "/consultation",
  },
} as const

export default getRequestConfig(async ({ locale }) => {
  const validLocale = locale && locales.includes(locale as Locale) ? locale : defaultLocale

  return {
    locale: validLocale,
    messages: (await import(`./i18n/messages/${validLocale}.json`)).default,
    timeZone: "UTC",
    now: new Date(),
  }
})
