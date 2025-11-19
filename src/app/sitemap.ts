import type { MetadataRoute } from "next";

const SITE_URL = "https://asdinfor.ovh";

export const revalidate = 86_400; // 24 h

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
