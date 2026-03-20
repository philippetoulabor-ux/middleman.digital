/**
 * Seiten-Meta für SEO und Layout. Erweiterbar um title, description, ogImage.
 */
export const pageMeta = {
  home: {
    title: "ProjectGrid",
    description: "",
  },
  contact: {
    title: "contact",
    description: "",
  },
  "ls-candle": {
    title: "LScandle",
    description: "",
  },
}

export function getPageMeta(slug) {
  return pageMeta[slug] ?? { title: slug, description: "" }
}
