import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useLanguage } from '@/routes/__root';
import { getReviewsFn } from '@/backend/features/reviews';

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

import { getPackagesFn } from '@/backend/features/packages';
import { HomeSkeleton } from '@/frontend/shared/ui/HomeSkeleton';

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { lang?: string } => ({
    lang: search.lang as string | undefined,
  }),
  loaderDeps: ({ search: { lang } }) => ({ lang }),
  pendingComponent: HomeSkeleton,
  component: HomePage,
  loader: async ({ deps: { lang } }) => {
    try {
      const [reviews, packages, tripOptions, galleryPhotos, tours] = await Promise.all([
        getReviewsFn(),
        getPackagesFn(),
        import('@/backend/shared/bookings').then((m) => m.getTripOptionsFn()),
        import('@/backend/shared/gallery').then((m) => m.getGalleryPhotosFn()),
        import('@/backend/features/tours').then((m) => m.getToursFn({ data: { lang: lang || "en" } })),
      ]);
      return { reviews, packages, tripOptions, galleryPhotos, tours };
    } catch (e) {
      console.error(e);
      return { reviews: [], packages: [], tripOptions: [], galleryPhotos: [], tours: [] };
    }
  },
});

function HomePage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const {
    reviews: dbReviews,
    packages: dbPackages,
    tripOptions = [],
    galleryPhotos = [],
    tours = [],
  } = Route.useLoaderData() as any;

  const [bookingTour, setBookingTour] = useState<any | null>(null);

  const handleBookSeat = (tour: any) => {
    setBookingTour(tour);
  };

  const allPackages = (dbPackages && dbPackages.length > 0) ? dbPackages : (tours || []);

  return (
    <div className="font-sans text-slate-800 bg-white selection:bg-brand-green/20 selection:text-brand-blue-deep overflow-x-hidden">
      <Navbar t={t} />
      <main>
        <Hero lang={lang} t={t} tripOptions={tripOptions} packages={allPackages} activeTripId="" />
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
            packages={dbPackages}
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
