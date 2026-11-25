import { BlogPost } from '@/frontend/shared/types/blog';

export function generateArticleSchema(post: BlogPost, authorName: string) {
  const isMayur = (authorName || "").toLowerCase().includes("mayur");

  const authorEntity = isMayur
    ? {
        "@type": "Person",
        name: "Mayur Patil",
        jobTitle: "Founder & Chief Pilgrimage Guide",
        url: "https://www.shailrajtravels.com/blog/author/mayur-patil",
        sameAs: [
          "https://www.instagram.com/wings_of_mayur_9999/",
          "https://www.facebook.com/share/1E2RUhpSAf/?mibextid=wwXIfr",
        ],
        worksFor: {
          "@type": "TravelAgency",
          name: "Shailraj Travels",
          url: "https://www.shailrajtravels.com",
          telephone: "+919764413556",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Vaibhav Super Market, near Akshada Medical, Gopal Patti, Manjri Budruk, Hadapsar",
            addressLocality: "Pune",
            addressRegion: "Maharashtra",
            postalCode: "412307",
            addressCountry: "IN",
          },
        },
      }
    : {
        "@type": "Organization",
        name: authorName || "Shailraj Travels Editorial Team",
        url: "https://www.shailrajtravels.com",
      };

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `https://www.shailrajtravels.com/blog/${post.slug}/#article`,
    isPartOf: {
      "@type": "WebPage",
      "@id": `https://www.shailrajtravels.com/blog/${post.slug}`,
    },
    headline: post.metaTitle || post.title,
    name: post.title,
    description: post.metaDescription || post.excerpt,
    inLanguage: "en-IN",
    image: [post.ogImage, post.featuredImage].filter(Boolean),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    mainEntityOfPage: `https://www.shailrajtravels.com/blog/${post.slug}`,
    author: authorEntity,
    publisher: {
      "@type": "TravelAgency",
      name: "Shailraj Travels",
      url: "https://www.shailrajtravels.com",
      telephone: "+919764413556",
      logo: {
        "@type": "ImageObject",
        url: "https://www.shailrajtravels.com/logo.png",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Vaibhav Super Market, near Akshada Medical, Gopal Patti, Manjri Budruk, Hadapsar",
        addressLocality: "Pune",
        addressRegion: "Maharashtra",
        postalCode: "412307",
        addressCountry: "IN",
      },
    },
    keywords: post.tags,
    articleSection: post.category,
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[], slug?: string) {
  if (!faqs || faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": slug ? `https://www.shailrajtravels.com/blog/${slug}/#faq` : undefined,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[], slug?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": slug ? `https://www.shailrajtravels.com/blog/${slug}/#breadcrumb` : undefined,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `https://www.shailrajtravels.com${item.url}`,
    })),
  };
}
