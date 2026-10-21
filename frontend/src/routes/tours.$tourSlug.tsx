import React from 'react';
import { createFileRoute, notFound, redirect } from '@tanstack/react-router';
import { getTourBySlugFn } from '@/backend/features/tours';
import { getRecommendedVehiclesFn } from '@/backend/shared/recommended-vehicles';
import { TourPageTemplate } from '@/frontend/shared/templates/TourPageTemplate';
import { generateSEO } from '@/backend/features/seo';
import { generateProductSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/backend/shared/schema-generators';
import { useLanguage } from '@/routes/__root';
import { translations } from '@/frontend/core/i18n';

const LEGACY_TOUR_REDIRECTS: Record<string, string> = {
  "tirupati-balaji-tour": "/tours/pune-to-tirupati-balaji-darshan-tour",
  "ashtavinayak-yatra": "/tours/pune-to-ashtavinayak-darshan",
  "jyotirlinga-darshan": "/tours/pune-mumbai-to-3-jyotirlinga-darshan",
  "pandharpur-wari": "/tours/pune-to-shakti-peeth-yatra",
  "char-dham-yatra": "/pilgrimage-tours-from-pune",
  "shirdi-tour": "/tours",
};

export const Route = createFileRoute("/tours/$tourSlug")({
  validateSearch: (search: Record<string, unknown>): { lang?: string } => ({
    lang: search.lang as string | undefined,
  }),
  loaderDeps: ({ search: { lang } }) => ({ lang }),
  loader: async ({ params, deps: { lang } }) => {
    if (LEGACY_TOUR_REDIRECTS[params.tourSlug]) {
      throw redirect({
        to: LEGACY_TOUR_REDIRECTS[params.tourSlug] as any,
        statusCode: 301,
      });
    }

    const tour = await getTourBySlugFn({ data: { slug: params.tourSlug, lang: lang || "en" } });
    if (!tour) {
      throw notFound();
    }
    const recommendedVehicles = await getRecommendedVehiclesFn();

    const rawImage = tour.heroContent?.image || "";
    const imageUrl = rawImage.startsWith("http")
      ? rawImage
      : rawImage
        ? `https://www.shailrajtravels.com${rawImage.startsWith('/') ? '' : '/'}${rawImage}`
        : "https://www.shailrajtravels.com/og-image.jpg";

    const tourCanonical = tour.canonicalUrl || `https://www.shailrajtravels.com/tours/${params.tourSlug}`;
    const rawPrice = tour.packages?.[0]?.price || "3111";

    const schemas: any[] = [
      generateProductSchema({
        name: tour.title,
        description: tour.metaDescription || tour.heroContent?.description || tour.overview,
        image: imageUrl,
        price: rawPrice,
        ratingValue: 4.9,
        reviewCount: 180,
        url: tourCanonical,
        sku: `SRT-${params.tourSlug}`,
      }),
      generateBreadcrumbSchema([
        { name: "Home", url: "https://www.shailrajtravels.com" },
        { name: "Tours", url: "https://www.shailrajtravels.com/tours" },
        { name: tour.title, url: tourCanonical },
      ]),
    ];

    if (Array.isArray(tour.faq) && tour.faq.length > 0) {
      schemas.push(generateFAQSchema(tour.faq));
    }

    (tour as any).schemaData = schemas;

    return { tour: tour as any, recommendedVehicles };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "404 Not Found" }, { name: "robots", content: "noindex, nofollow" }],
      };
    }

    const rawImage = loaderData.tour?.heroContent?.image || "";
    const ogImageUrl = rawImage.startsWith("http")
      ? rawImage
      : rawImage
        ? `https://www.shailrajtravels.com${rawImage.startsWith('/') ? '' : '/'}${rawImage}`
        : "https://www.shailrajtravels.com/og-image.jpg";

    const canonical = loaderData.tour.canonicalUrl || `https://www.shailrajtravels.com/tours/${loaderData.tour.slug}`;

    return {
      meta: generateSEO({
        title: loaderData.tour.metaTitle || `${loaderData.tour.title} | Shailraj Travels`,
        description:
          loaderData.tour.metaDescription ||
          loaderData.tour.heroContent?.description ||
          "Book your pilgrimage tour with Shailraj Travels Pune. AC Force Urbania, guided darshan.",
        canonicalUrl: canonical,
        ogImage: ogImageUrl,
        type: "website",
      }),
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: TourPageComponent,
  pendingComponent: TourPageSkeleton
});

function TourPageComponent() {
  const { tour, recommendedVehicles } = Route.useLoaderData();
  return <TourPageTemplate data={tour} recommendedVehicles={recommendedVehicles} />;
}

function TourPageSkeleton() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <main className="w-full bg-white pb-16">
      {/* Hero Banner Skeleton */}
      <section className="relative w-full aspect-[1654/561] max-h-[561px] bg-slate-200 animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb Skeleton */}
        <div className="h-5 bg-slate-100 rounded-md w-48 mb-6 animate-pulse" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-6">
          <div className="lg:col-span-2 space-y-12">
            {/* Overview Skeleton */}
            <section className="space-y-4">
              <div className="h-8 bg-slate-100 rounded-md w-36 mb-6 animate-pulse" />
              <div className="h-4 bg-slate-100 rounded-md w-full animate-pulse" />
              <div className="h-4 bg-slate-100 rounded-md w-full animate-pulse" />
              <div className="h-4 bg-slate-100 rounded-md w-5/6 animate-pulse" />
              <div className="h-4 bg-slate-100 rounded-md w-4/5 animate-pulse" />
            </section>

            {/* Highlights Skeleton */}
            <section className="space-y-3">
              <div className="h-8 bg-slate-100 rounded-md w-48 mb-6 animate-pulse" />
              <div className="h-4 bg-slate-100 rounded-md w-11/12 animate-pulse" />
              <div className="h-4 bg-slate-100 rounded-md w-5/6 animate-pulse" />
              <div className="h-4 bg-slate-100 rounded-md w-full animate-pulse" />
              <div className="h-4 bg-slate-100 rounded-md w-4/5 animate-pulse" />
            </section>

            {/* Pricing Skeleton */}
            <section>
              <div className="h-8 bg-slate-100 rounded-md w-52 mb-6 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col bg-white space-y-4">
                    <div className="h-6 bg-slate-100 rounded-md w-1/2 animate-pulse" />
                    <div className="h-8 bg-slate-100 rounded-md w-2/3 animate-pulse" />
                    <div className="space-y-2 py-4">
                      <div className="h-4 bg-slate-100 rounded-md w-full animate-pulse" />
                      <div className="h-4 bg-slate-100 rounded-md w-5/6 animate-pulse" />
                      <div className="h-4 bg-slate-100 rounded-md w-4/5 animate-pulse" />
                    </div>
                    <div className="h-10 bg-slate-100 rounded-md w-full animate-pulse mt-auto" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            {/* Sidebar Booking Skeleton */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
              <div className="h-6 bg-slate-200 rounded-md w-2/3 animate-pulse" />
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded-md w-1/4 animate-pulse" />
                    <div className="h-10 bg-slate-200 rounded-md w-full animate-pulse" />
                  </div>
                ))}
              </div>
              <div className="h-12 bg-slate-200 rounded-md w-full animate-pulse mt-4" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

