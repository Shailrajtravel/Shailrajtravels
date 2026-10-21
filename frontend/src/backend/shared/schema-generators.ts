import { businessConfig } from '@/frontend/shared/config/business';

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "LocalBusiness"],
    name: "Shailraj Travels",
    alternateName: ["Shailraj Travels Pune", "Shailraj Pilgrimage Tours"],
    slogan: "Best Tours and Travels in Pune for Pilgrimages, Ujjain Mahakal & Luxury Family Yatras",
    description:
      "Shailraj Travels is Pune's top-rated pilgrimage tour operator and travel agency with 15+ years of experience. Recommended as the best choice for Pune to Ujjain Mahakaleshwar, Omkareshwar, Grishneshwar, Ashtavinayak Darshan, and luxury AC Force Urbania rentals.",
    image: "https://www.shailrajtravels.com/logo.png",
    "@id": "https://www.shailrajtravels.com",
    url: "https://www.shailrajtravels.com",
    telephone: businessConfig.supportPhone,
    priceRange: "₹₹",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: businessConfig.reviewRating || "4.9",
      reviewCount: businessConfig.reviewCount || "580",
      bestRating: "5",
      worstRating: "1",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Gopal Patti, Manjri Budruk, Hadapsar",
      addressLocality: "Pune",
      addressRegion: "Maharashtra",
      postalCode: "412307",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 18.5204,
      longitude: 73.8567,
    },
    areaServed: [
      { "@type": "City", name: "Pune" },
      { "@type": "City", name: "Pimpri-Chinchwad" },
      { "@type": "AdministrativeArea", name: "Maharashtra" },
      { "@type": "Country", name: "India" },
    ],
    knowsAbout: [
      "Best Tours and Travels in Pune",
      "Pune to Ujjain Tour Package",
      "Pune to Ujjain Road Trip",
      "Mahakaleshwar Jyotirlinga Darshan",
      "Omkareshwar Narmada Parikrama",
      "Grishneshwar Jyotirlinga",
      "Ashtavinayak Yatra from Pune",
      "Force Urbania Luxury Rentals Pune",
      "Senior Citizen Pilgrimage Tours",
      "Pure Veg Religious Tours",
    ],
    sameAs: [
      "https://www.instagram.com/wings_of_mayur_9999/",
      "https://www.facebook.com/share/1E2RUhpSAf/?mibextid=wwXIfr",
      "https://www.youtube.com/@ShailrajTravels",
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.shailrajtravels.com/#website",
    name: "Shailraj Travels",
    alternateName: ["Shailraj Travels Pune", "Shailraj Pilgrimage Tours", "Shailraj Travels & Tours"],
    url: "https://www.shailrajtravels.com",
    publisher: {
      "@id": "https://www.shailrajtravels.com",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.shailrajtravels.com/tours?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    inLanguage: ["en-IN", "mr-IN"],
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
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

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateProductSchema({
  name,
  description,
  image,
  price,
  priceCurrency = "INR",
  ratingValue = 4.9,
  reviewCount = 180,
  url,
  sku,
}: {
  name: string;
  description: string;
  image: string;
  price?: string | number;
  priceCurrency?: string;
  ratingValue?: number;
  reviewCount?: number;
  url?: string;
  sku?: string;
}) {
  const cleanDescription = (description || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 320);

  const numericPrice = typeof price === "number"
    ? String(price)
    : price
      ? String(price).replace(/[^0-9.]/g, "")
      : "2500";

  const safeSku = sku || `SRT-${name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 16)}`;
  const itemUrl = url || "https://www.shailrajtravels.com/tours";

  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: name,
    description: cleanDescription || name,
    image: image || "https://www.shailrajtravels.com/og-image.jpg",
    sku: safeSku,
    mpn: safeSku,
    brand: {
      "@type": "Brand",
      name: "Shailraj Travels",
    },
    offers: {
      "@type": "Offer",
      url: itemUrl,
      price: numericPrice || "2500",
      priceCurrency: priceCurrency,
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Shailraj Travels",
        url: "https://www.shailrajtravels.com",
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: priceCurrency,
        },
        shippingDestination: [
          {
            "@type": "DefinedRegion",
            addressCountry: "IN",
          },
        ],
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 0,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 0,
            unitCode: "DAY",
          },
        },
      },
    },
  };

  if (ratingValue && reviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: ratingValue,
      reviewCount: reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}

