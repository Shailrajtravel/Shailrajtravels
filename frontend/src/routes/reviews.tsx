// @ts-nocheck
import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { generateSEO } from '@/backend/features/seo';
import { useLanguage } from '@/routes/__root';
import { translations } from '@/frontend/core/i18n';
import { Navbar } from '@/frontend/core/Navbar';
import { FooterSection as Footer } from '@/frontend/core/Footer';
import { SchemaMarkup } from '@/frontend/shared/components/SchemaMarkup';
import { ReviewsSection } from '@/frontend/features/reviews/ReviewsSection';
import { fallbackGoogleReviews } from '@/backend/shared/reviews-data';
import { businessConfig } from '@/frontend/shared/config/business';
import {
  generateLocalBusinessSchema,
  generateBreadcrumbSchema,
} from '@/backend/shared/schema-generators';
import { Star, CheckCircle2, ShieldCheck, ExternalLink, MessageSquare } from 'lucide-react';

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: generateSEO({
      title: "Shailraj Travels Reviews | 5.0★ Google Rating & Verified Yatri Feedback",
      description:
        "Read authentic 5.0★ Google verified reviews for Shailraj Travels. Verified pilgrim reviews for Pune to Ujjain Darshan, Ashtavinayak Yatra, and AC Force Urbania tours.",
      canonicalUrl: "https://www.shailrajtravels.com/reviews",
      keywords: [
        "shailraj travels reviews",
        "shailraj travels google reviews",
        "shailraj travels rating",
        "best travels in pune reviews",
        "ujjain tour reviews",
        "pune travels customer feedback",
        "ashtavinayak yatra reviews pune",
      ],
    }),
    links: [{ rel: "canonical", href: "https://www.shailrajtravels.com/reviews" }],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const { lang } = useLanguage();
  const t = (lang && translations[lang]) || translations.en;

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Shailraj Travels",
    url: "https://www.shailrajtravels.com",
    telephone: businessConfig.supportPhone,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: businessConfig.reviewCount || "23",
      bestRating: "5",
      worstRating: "1",
    },
    review: fallbackGoogleReviews.map((rev) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: rev.name,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: rev.rating || 5,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: rev.text,
      datePublished: rev.publishTime || "2026-10-01",
    })),
  };

  return (
    <div className="font-sans text-slate-800 bg-white selection:bg-brand-orange/20 selection:text-brand-blue-deep overflow-x-hidden min-h-screen flex flex-col">
      <SchemaMarkup
        schema={[
          reviewSchema,
          generateLocalBusinessSchema(),
          generateBreadcrumbSchema([
            { name: "Home", url: "https://www.shailrajtravels.com" },
            { name: "Reviews", url: "https://www.shailrajtravels.com/reviews" },
          ]),
        ]}
      />

      <Navbar t={t} />

      <main className="flex-1 pt-24">
        {/* Page Header */}
        <section className="relative text-white py-16 md:py-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
          {/* Background Image with Atmospheric Gradient Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/reviews-hero-temple.jpg"
              alt="Holy Temple Pilgrimage Ghat"
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-900/80 to-brand-blue-deep/90" />
          </div>

          <div className="mx-auto max-w-4xl relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4 text-xs font-bold text-amber-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>OFFICIAL GOOGLE BUSINESS PROFILE REVIEWS</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold font-display mb-4">
              {lang === "mr" ? "आमच्या प्रवाशांचे गुगल अभिप्राय" : "Verified Customer Reviews"}
            </h1>

            <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto mb-0">
              {lang === "mr"
                ? "गुगलवर प्रमाणित ५.० स्टार रेटिंग आणि प्रवाशांचे अस्सल अनुभव. श्री महाकालेश्वर, अष्टविनायक व ज्योतिर्लिंग यात्रांचे खरे अभिप्राय वाचा."
                : "Authentic reviews and 5.0-star feedback from verified yatris who traveled with Shailraj Travels on Ujjain Mahakal, Ashtavinayak, and Maharashtra Jyotirlinga circuits."}
            </p>


          </div>
        </section>

        {/* Embedded Interactive Reviews Carousel Component */}
        <ReviewsSection lang={lang} t={t} />
      </main>

      <Footer t={t} lang={lang} />
    </div>
  );
}

