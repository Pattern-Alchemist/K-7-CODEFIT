export interface ImageVariant {
  format: "webp" | "jpeg" | "png"
  width: number
  height: number
  aspectRatio: string
}

export const IMAGE_VARIANTS: ImageVariant[] = [
  { format: "webp", width: 1200, height: 675, aspectRatio: "16/9" },
  { format: "webp", width: 900, height: 900, aspectRatio: "1/1" },
  { format: "webp", width: 1200, height: 900, aspectRatio: "4/3" },
  { format: "jpeg", width: 1200, height: 675, aspectRatio: "16/9" },
]

export function generateImageMarkup(src: string, alt: string, caption?: string): string {
  return `
    <figure>
      <picture>
        ${IMAGE_VARIANTS.filter((v) => v.format === "webp")
          .map(
            (v) =>
              `<source srcset="${src}?w=${v.width}&h=${v.height}&format=webp" type="image/webp" media="(min-width: 640px)" />`,
          )
          .join("\n")}
        <img 
          src="${src}?w=1200&h=675&format=jpeg"
          width="1200"
          height="675"
          alt="${alt}"
          loading="lazy"
          decoding="async"
        />
      </picture>
      ${caption ? `<figcaption>${caption}</figcaption>` : ""}
    </figure>
  `
}

export const IMAGE_QUALITY_GUIDELINES = {
  minPixels: 50000, // ~223x223 pixels
  minWidth: 300,
  preferredFormats: ["webp", "jpeg"],
  descriptiveFileNames: true,
}
