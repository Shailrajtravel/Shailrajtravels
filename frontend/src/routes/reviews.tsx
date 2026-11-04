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
        "Read authentic 5.0★ Google verified reviews for Shailraj Travels. Over 25+ verified pilgrim reviews for Pune to Ujjain Darshan, Ashtavinayak Yatra, and AC Force Urbania tours.",
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
  const t = translations[lang];

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Shailraj Travels",
    url: "https://www.shailrajtravels.com",
    telephone: businessConfig.supportPhone,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "25",
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
        <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-brand-blue-deep text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
          <div className="mx-auto max-w-4xl relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4 text-xs font-bold text-amber-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>OFFICIAL GOOGLE BUSINESS PROFILE REVIEWS</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold font-display mb-4">
              {lang === "mr" ? "आमच्या प्रवाशांचे गुगल अभिप्राय" : "Verified Customer Reviews"}
            </h1>

            <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto mb-8">
              {lang === "mr"
                ? "गुगलवर प्रमाणित ५.० स्टार रेटिंग आणि २५+ प्रवाशांचे अस्सल अनुभव. श्री महाकालेश्वर, अष्टविनायक व ज्योतिर्लिंग यात्रांचे खरे अभिप्राय वाचा."
                : "Authentic reviews and 5.0-star feedback from verified yatris who traveled with Shailraj Travels on Ujjain Mahakal, Ashtavinayak, and Maharashtra Jyotirlinga circuits."}
            </p>

            <div className="inline-flex flex-wrap items-center justify-center gap-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span className="font-extrabold text-2xl">5.0</span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400" />
                  ))}
                </div>
              </div>
              <span className="text-white/40">|</span>
              <span className="text-sm font-bold">25+ Verified Google Reviews</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                100% Recommended
              </span>
            </div>
          </div>
        </section>

        {/* Embedded Interactive Reviews Carousel Component */}
        <ReviewsSection lang={lang} t={t} />
      </main>

      <Footer t={t} lang={lang} />
    </div>
  );
}

