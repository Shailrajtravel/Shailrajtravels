import React from 'react';
import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router';
import { getToursFn } from '../backend/lib/tours';
import { generateSEO } from '../backend/lib/seo';
import { useLanguage } from './__root';
import { translations } from '../frontend/features/core/i18n';
import { LazyImage } from "@/frontend/components/ui/lazy-image";

export const Route = createFileRoute('/tours/')({
  validateSearch: (search: Record<string, unknown>) => ({ lang: search.lang as string | undefined }),
  loaderDeps: ({ search: { lang } }) => ({ lang }),
  loader: ({ deps: { lang } }) => getToursFn({ data: { lang: lang || 'en' } }),
  head: () => ({
    meta: generateSEO({
      title: 'Pilgrimage Tours from Pune | Shailraj Travels',
      description: 'Explore our popular pilgrimage tours including Ashtavinayak Yatra, Jyotirlinga Darshan, Pandharpur Wari, and Char Dham Yatra. AC travel and guided darshan from Pune.',
      canonicalUrl: 'https://www.shailrajtravels.com/tours'
    }),
    links: [
      { rel: 'canonical', href: 'https://www.shailrajtravels.com/tours' }
    ]
  }),
  component: ToursListingPage,
  pendingComponent: ToursListingSkeleton
});

function ToursListingSkeleton() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <main className="w-full bg-white pb-16 pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        {/* Skeleton for Title */}
        <div className="h-12 bg-slate-100 rounded-md w-72 mx-auto mb-4 animate-pulse" />
        {/* Skeleton for Description */}
        <div className="h-6 bg-slate-100 rounded-md max-w-xl mx-auto mb-2 animate-pulse" />
        <div className="h-6 bg-slate-100 rounded-md max-w-lg mx-auto animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm h-full flex flex-col bg-white">
            {/* Skeleton for Hero Image */}
            <div className="h-48 bg-slate-100 animate-pulse" />
            <div className="p-6 flex flex-col flex-grow">
              {/* Skeleton for Title */}
              <div className="h-6 bg-slate-100 rounded-md w-3/4 mb-3 animate-pulse" />
              {/* Skeleton for Description */}
              <div className="h-4 bg-slate-100 rounded-md w-full mb-2 animate-pulse" />
              <div className="h-4 bg-slate-100 rounded-md w-full mb-2 animate-pulse" />
              <div className="h-4 bg-slate-100 rounded-md w-1/2 mb-4 animate-pulse" />
              <div className="mt-auto animate-pulse">
                {/* Skeleton for link */}
                <div className="h-5 bg-slate-100 rounded-md w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function ToursListingPage() {
  const tours = useLoaderData({ from: '/tours/' });
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <main className="w-full bg-white pb-16 pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-blue-deep mb-4">{t.toursIndexTitle || "Our Pilgrimage Tours"}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t.toursIndexDesc || "Embark on a spiritual journey with our perfectly planned, comfortable, and guided pilgrimage tour packages from Pune."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {tours.map((tour: any) => (
          <Link key={tour.slug} to="/tours/$tourSlug" params={{ tourSlug: tour.slug! }} className="group block h-full">
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all h-full flex flex-col bg-white">
              <div className="h-48 relative overflow-hidden bg-gray-100">
                <LazyImage src={tour.heroContent.image} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-orange transition-colors">{tour.title}</h2>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">{tour.heroContent.description}</p>
                <div className="mt-auto">
                  <span className="text-brand-orange font-semibold group-hover:underline">{t.toursIndexViewDetails || "View Tour Details \u2192"}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
