import { getRequestConfig } from "next-intl/server"

const locales = ["en", "es", "hi", "pt"] as const
const defaultLocale = "en" as const

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

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
  timeZone: "UTC",
  now: new Date(),
}))
