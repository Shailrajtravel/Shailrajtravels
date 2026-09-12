import React, { useState, useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useLanguage } from '@/routes/__root';
import { translations } from '@/frontend/core/i18n';
import { Navbar } from '@/frontend/core/Navbar';
const Footer = React.lazy(() => import('@/frontend/core/Footer').then(m => ({ default: m.FooterSection })));
import { Hero } from '@/frontend/features/home/Hero';
const AboutSection = React.lazy(() => import('@/frontend/features/home/AboutSection').then(m => ({ default: m.AboutSection })));
const FeaturesSection = React.lazy(() => import('@/frontend/features/why-choose-us/FeaturesSection').then(m => ({ default: m.FeaturesSection })));
const ToursSection = React.lazy(() => import('@/frontend/features/tours/ToursSection').then(m => ({ default: m.ToursSection })));
const FaqSection = React.lazy(() => import('@/frontend/features/faq/FaqSection').then(m => ({ default: m.FaqSection })));
const ReviewsSection = React.lazy(() => import('@/frontend/features/reviews/ReviewsSection').then(m => ({ default: m.ReviewsSection })));
const GallerySection = React.lazy(() => import('@/frontend/features/gallery/GallerySection').then(m => ({ default: m.GallerySection })));
const BookingModal = React.lazy(() => import('@/frontend/features/tours/BookingModal').then(m => ({ default: m.BookingModal })));
import { OfferBannerSection } from '@/frontend/features/offers/OfferBannerSection';

import { getPackagesFn } from '@/backend/features/packages';
import { generateSEO } from '@/backend/features/seo';

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { lang?: string } => ({
    lang: search.lang as string | undefined,
  }),
  loaderDeps: ({ search: { lang } }) => ({ lang }),
  head: () => ({
    meta: generateSEO({
      title: "Best Travel Agency in Pune | Shailraj Travels",
      description:
        "Shailraj Travels is a Pune-based travel agency offering pilgrimage, family, group and customized tour packages across Maharashtra and India.",
      canonicalUrl: "https://www.shailrajtravels.com",
    }),
    links: [{ rel: "canonical", href: "https://www.shailrajtravels.com" }],
  }),
  component: HomePage,
  loader: async ({ deps: { lang } }) => {
    try {
      const [packages, tripOptions, galleryPhotos, tours, activeOffer] = await Promise.all([
        getPackagesFn(),
        import('@/backend/shared/bookings').then((m) => m.getTripOptionsFn()),
        import('@/backend/shared/gallery').then((m) => m.getGalleryPhotosFn()),
        import('@/backend/features/tours').then((m) => m.getToursFn({ data: { lang: lang || "en" } })),
        import('@/backend/features/offers').then((m) => m.getActiveOfferFn()),
      ]);
      return { packages, tripOptions, galleryPhotos, tours, activeOffer };
    } catch (e) {
      console.error(e);
      return { packages: [], tripOptions: [], galleryPhotos: [], tours: [], activeOffer: null };
    }
  },
});

function HomePage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const {
    packages: dbPackages,
    tripOptions = [],
    galleryPhotos = [],
    tours = [],
    activeOffer = null,
  } = Route.useLoaderData() as any;

  const [bookingTour, setBookingTour] = useState<any | null>(null);

  const handleBookSeat = (tour: any) => {
    setBookingTour(tour);
  };

  const allPackages = useMemo(() => {
    function norm(s: string) {
      return (s || '')
        .toLowerCase()
        .replace(/[–—\-_()]/g, ' ')
        .replace(/dhoomeshwar|dhrushneshwar/g, 'ghrishneshwar')
        .replace(/tour/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
    }

    const tourMap = new Map();
    for (const tour of tours || []) {
      if (tour.title) {
        tourMap.set(tour.title.toLowerCase().trim(), tour);
        tourMap.set(norm(tour.title), tour);
      }
      if (tour.slug) tourMap.set(tour.slug.toLowerCase().trim(), tour);
      if (tour._id) tourMap.set(String(tour._id), tour);
    }

    const merged = (dbPackages || []).map((pkg: any) => {
      let match =
        tourMap.get((pkg.title || "").toLowerCase().trim()) ||
        tourMap.get(norm(pkg.title)) ||
        tourMap.get((pkg.slug || "").toLowerCase().trim()) ||
        tourMap.get(String(pkg._id));

      if (!match && norm(pkg.title).includes('ujjain') && norm(pkg.title).includes('omkareshwar')) {
        match = (tours || []).find((t: any) => t.slug === 'ujjain-omkareshwar-Ghrishneshwar-maheshwar-tour');
      }

      const tourDates = match && Array.isArray(match.dates) && match.dates.length > 0 ? match.dates : null;
      const pkgDates = Array.isArray(pkg.dates) && pkg.dates.length > 0 ? pkg.dates : null;

      return {
        ...pkg,
        image: match?.heroContent?.image || match?.image || pkg.image,
        heroContent: match?.heroContent || pkg.heroContent,
        destinations: match?.destinations || pkg.destinations || [],
        tourId: match?._id,
        slug: match?.slug || pkg.slug,
        dates: tourDates || pkgDates || (pkg.schedule && !/every|daily|weekly|departures/i.test(pkg.schedule) ? [pkg.schedule] : []),
      };
    });

    const existingTitles = new Set(merged.map((p: any) => (p.title || "").toLowerCase().trim()));
    for (const tour of tours || []) {
      const key = (tour.title || "").toLowerCase().trim();
      if (!existingTitles.has(key) && !existingTitles.has(norm(tour.title))) {
        merged.push({
          _id: tour._id,
          tourId: tour._id,
          title: tour.title,
          name: tour.title,
          slug: tour.slug,
          dates: Array.isArray(tour.dates) ? tour.dates : [],
          image: tour.heroContent?.image || "",
          heroContent: tour.heroContent,
          destinations: tour.destinations || [],
          price: tour.packages?.[0]?.price ? `₹${tour.packages[0].price}` : undefined,
          ...tour,
        });
      }
    }
    // Only show cards that match an actual tour (have a valid slug)
    return merged.filter((p: any) => p.slug && p.title);
  }, [dbPackages, tours]);

  return (
    <div className="font-sans text-slate-800 bg-white selection:bg-brand-green/20 selection:text-brand-blue-deep overflow-x-hidden">
      <Navbar t={t} />
      <main>
        <Hero lang={lang} t={t} tripOptions={tripOptions} packages={allPackages} activeTripId="" />
        {activeOffer && activeOffer.isActive && (
          <OfferBannerSection offer={activeOffer} onBookTour={handleBookSeat} />
        )}
        <React.Suspense
          fallback={
            <div className="w-full max-w-7xl mx-auto py-16 px-4 md:px-8 animate-pulse space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-96 rounded-3xl bg-slate-100 border border-slate-200/60" />
                ))}
              </div>
            </div>
          }
        >
          <AboutSection lang={lang} t={t} />
          <FeaturesSection lang={lang} t={t} />
          <ToursSection
            lang={lang}
            t={t}
            packages={allPackages}
            tripOptions={tripOptions}
            onBookSeat={handleBookSeat}
            mode="packages"
          />
          <FaqSection lang={lang} t={t} />
          <ReviewsSection lang={lang} t={t} />
          <GallerySection t={t} photos={galleryPhotos} />
          <Footer t={t} lang={lang} />
        </React.Suspense>
      </main>
      {bookingTour && (
        <React.Suspense fallback={null}>
          <BookingModal tour={bookingTour} onClose={() => setBookingTour(null)} t={t} lang={lang} />
        </React.Suspense>
      )}
    </div>
  );
}
