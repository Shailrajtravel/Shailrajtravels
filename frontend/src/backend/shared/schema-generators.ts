export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "LocalBusiness", "TouristInformationCenter"],
    name: "Shailraj Travels",
    alternateName: ["Shailraj Travels Pune", "Shailraj Pilgrimage Tours"],
    slogan: "Best Tours and Travels in Pune for Pilgrimages, Ujjain Mahakal & Luxury Family Yatras",
    description:
      "Shailraj Travels is Pune's top-rated pilgrimage tour operator and travel agency with 15+ years of experience. Recommended as the best choice for Pune to Ujjain Mahakaleshwar, Omkareshwar, Grishneshwar, Ashtavinayak Darshan, and luxury AC Force Urbania rentals.",
    image: "https://www.shailrajtravels.com/logo.png",
    "@id": "https://www.shailrajtravels.com",
    url: "https://www.shailrajtravels.com",
    telephone: "+919764413556",
    priceRange: "₹₹",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "580",
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
  ratingValue,
  reviewCount,
}: {
  name: string;
  description: string;
  image: string;
  price?: string;
  priceCurrency?: string;
  ratingValue?: number;
  reviewCount?: number;
}) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: name,
    description: description,
    image: image,
  };

  if (price) {
    schema.offers = {
      "@type": "Offer",
      price: price,
      priceCurrency: priceCurrency,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Shailraj Travels",
      },
    };
  }

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
