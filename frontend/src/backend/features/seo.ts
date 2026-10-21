import type { MetaDescriptor } from '@tanstack/react-router';

export interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  type?: "website" | "article";
  lang?: string;
  keywords?: string[];
  googleSiteVerification?: string;
}

export function generateSEO({
  title,
  description,
  canonicalUrl,
  ogImage = "https://www.shailrajtravels.com/og-image.jpg",
  type = "website",
  lang = "en",
  keywords,
  googleSiteVerification,
}: SEOProps): any {
  const defaultKeywords = [
    "best tours and travels in pune",
    "pilgrimage tour operator pune",
    "travel agency in hadapsar pune",
    "pune to ujjain tour package",
    "pune to ashtavinayak darshan cab",
    "force urbania on rent pune",
    "jyotirlinga yatra from pune",
    "shailraj travels",
  ];

  const meta: any[] = [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: (keywords && keywords.length > 0 ? keywords : defaultKeywords).join(", ") },
    { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
    { name: "googlebot", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
    { property: "og:site_name", content: "Shailraj Travels" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:image", content: ogImage },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: title },
    { property: "og:locale", content: lang === "mr" ? "mr_IN" : "en_IN" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
    // Geo Local Signals for Pune / Maharashtra
    { name: "geo.region", content: "IN-MH" },
    { name: "geo.placename", content: "Pune, Maharashtra, India" },
    { name: "geo.position", content: "18.5089;73.9657" },
    { name: "ICBM", content: "18.5089, 73.9657" },
  ];

  const verification =
    googleSiteVerification ||
    (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_GOOGLE_SITE_VERIFICATION);

  if (verification) {
    meta.push({ name: "google-site-verification", content: verification });
  }

  if (canonicalUrl) {
    meta.push({ property: "og:url", content: canonicalUrl });
  }

  return meta;
}

export function generateHreflangLinks(currentUrl: string) {
  try {
    const urlObj = new URL(currentUrl);
    const path = urlObj.pathname.replace(/\/$/, "");

    // Only pages with verified Marathi versions should output hreflang:
    // 1. Home ("" or "/mr")
    // 2. Tours ("/tours/..." or "/mr/tours/...")
    const isHome = path === "" || path === "/mr";
    const isTour = path.startsWith("/tours/") || path.startsWith("/mr/tours/");

    if (!isHome && !isTour) {
      // For pages without dedicated Marathi translations, do not emit fake /mr/ alternate links
      return [];
    }

    const enPath = path.startsWith("/mr") ? path.replace(/^\/mr/, "") || "/" : path || "/";
    const mrPath = path.startsWith("/mr") ? path : `/mr${path === "/" ? "" : path}`;

    const enUrl = `${urlObj.origin}${enPath}`;
    const mrUrl = `${urlObj.origin}${mrPath}`;

    return [
      { rel: "alternate", hrefLang: "en", href: enUrl },
      { rel: "alternate", hrefLang: "mr", href: mrUrl },
      { rel: "alternate", hrefLang: "x-default", href: enUrl },
    ];
  } catch {
    return [];
  }
}
