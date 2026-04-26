import Script from "next/script"

interface SchemaRendererProps {
  schemas: Record<string, any>[]
}

export function SchemaRenderer({ schemas }: SchemaRendererProps) {
  return (
    <>
      {schemas.map((schema, index) => (
        <Script
          key={`ld-json-${index}`}
          id={`ld-json-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          strategy="afterInteractive"
        />
      ))}
    </>
  )
}
