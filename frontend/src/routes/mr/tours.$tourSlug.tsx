import React from 'react';
import { createFileRoute, notFound, redirect } from '@tanstack/react-router';
import { getTourBySlugFn } from '@/backend/features/tours';
import { TourPageTemplate } from '@/frontend/shared/templates/TourPageTemplate';
import { generateSEO, generateHreflangLinks } from '@/backend/features/seo';

const LEGACY_TOUR_REDIRECTS: Record<string, string> = {
  "tirupati-balaji-tour": "/mr/tours/pune-to-tirupati-balaji-darshan-tour",
  "ashtavinayak-yatra": "/mr/tours/pune-to-ashtavinayak-darshan",
  "jyotirlinga-darshan": "/mr/tours/pune-mumbai-to-3-jyotirlinga-darshan",
  "pandharpur-wari": "/mr/tours/pune-to-shakti-peeth-yatra",
  "char-dham-yatra": "/pilgrimage-tours-from-pune",
  "shirdi-tour": "/tours",
};

export const Route = createFileRoute("/mr/tours/$tourSlug")({
  loader: async ({ params }) => {
    if (LEGACY_TOUR_REDIRECTS[params.tourSlug]) {
      throw redirect({
        to: LEGACY_TOUR_REDIRECTS[params.tourSlug] as any,
        statusCode: 301,
      });
    }

    // With our new seeded SEO DB, city variants are stored as individual documents!
    const tour = await getTourBySlugFn({ data: { slug: params.tourSlug, lang: "mr" } });

    if (!tour) {
      throw notFound();
    }

    return tour as any;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "404 Not Found" }, { name: "robots", content: "noindex, nofollow" }],
      };
    }

    return {
      meta: generateSEO({
        title: loaderData.metaTitle,
        description: loaderData.metaDescription,
        canonicalUrl: loaderData.canonicalUrl,
        ogImage: `https://www.shailrajtravels.com${loaderData.heroContent.image}`,
        type: "website",
        lang: "mr",
      }),
      links: [
        { rel: "canonical", href: loaderData.canonicalUrl },
        ...generateHreflangLinks(loaderData.canonicalUrl),
      ],
    };
  },
  component: TourPageComponent,
});

function TourPageComponent() {
  const tour = Route.useLoaderData();
  return <TourPageTemplate data={tour} />;
}
