import { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${process.env.NEXT_PUBLIC_SITE_URL}/`, lastModified: new Date() },
    { url: `${process.env.NEXT_PUBLIC_SITE_URL}/services`, lastModified: new Date() },
    { url: `${process.env.NEXT_PUBLIC_SITE_URL}/horoscope`, lastModified: new Date() },
    { url: `${process.env.NEXT_PUBLIC_SITE_URL}/karmic-map`, lastModified: new Date() },
    { url: `${process.env.NEXT_PUBLIC_SITE_URL}/relationship`, lastModified: new Date() },
    { url: `${process.env.NEXT_PUBLIC_SITE_URL}/radio`, lastModified: new Date() },
    { url: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/dashboard`, lastModified: new Date() },
  ]
}
