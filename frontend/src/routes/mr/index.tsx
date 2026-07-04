import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { generateSEO, generateHreflangLinks } from '@/backend/features/seo';
import { translations } from '@/frontend/core/i18n';
import { Navbar } from '@/frontend/core/Navbar';
import { FooterSection as Footer } from '@/frontend/core/Footer';
import { Hero } from '@/frontend/features/home/Hero';
import { AboutSection } from '@/frontend/features/home/AboutSection';
import { FeaturesSection } from '@/frontend/features/why-choose-us/FeaturesSection';
import { ToursSection } from '@/frontend/features/tours/ToursSection';
import { FaqSection } from '@/frontend/features/faq/FaqSection';
import { ReviewsSection } from '@/frontend/features/reviews/ReviewsSection';
import { GallerySection } from '@/frontend/features/gallery/GallerySection';
import { BookingModal } from '@/frontend/features/tours/BookingModal';
import { getReviewsFn } from '@/backend/features/reviews';
import { getPackagesFn } from '@/backend/features/packages';

export const Route = createFileRoute("/mr/")({
  head: () => ({
    meta: generateSEO({
      title: "शैलराज ट्रॅव्हल्स | पुणे येथील सर्वोत्तम पर्यटन संस्था",
      description:
        "पुण्यातील सर्वोत्तम तीर्थक्षेत्र ट्रॅव्हल एजन्सी. अष्टविनायक, ज्योतिर्लिंग, पंढरपूर आणि चार धाम यात्रा आरामदायी प्रवास आणि दर्शन सुविधेसह बुक करा.",
      canonicalUrl: "https://www.shailrajtravels.com/mr/",
      type: "website",
      lang: "mr",
    }),
    links: [
      { rel: "canonical", href: "https://www.shailrajtravels.com/mr/" },
      ...generateHreflangLinks("https://www.shailrajtravels.com/mr/"),
    ],
  }),
  loader: async () => {
    try {
      const [reviews, packages, tripOptions, galleryPhotos, tours] = await Promise.all([
        getReviewsFn(),
        getPackagesFn(),
        import('@/backend/shared/bookings').then((m) => m.getTripOptionsFn()),
        import('@/backend/shared/gallery').then((m) => m.getGalleryPhotosFn()),
        import('@/backend/features/tours').then((m) => m.getToursFn({ data: { lang: "mr" } })),
      ]);
      return { reviews, packages, tripOptions, galleryPhotos, tours };
    } catch (e) {
      console.error(e);
      return { reviews: [], packages: [], tripOptions: [], galleryPhotos: [], tours: [] };
    }
  },
  component: MarathiHomePage,
});

function MarathiHomePage() {
  const lang = "mr";
  const t = translations[lang];

  const {
    packages: dbPackages = [],
    tripOptions = [],
    galleryPhotos = [],
    tours = [],
  } = Route.useLoaderData() as any;

  const [bookingTour, setBookingTour] = useState<any | null>(null);

  const handleBookSeat = (tour: any) => {
    setBookingTour(tour);
  };

  return (
    <div className="font-sans text-slate-800 bg-white selection:bg-brand-green/20 selection:text-brand-blue-deep overflow-x-hidden">
      <Navbar t={t} />
      <main>
        <Hero lang={lang} t={t} tripOptions={tripOptions} activeTripId="" />
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
      </main>
      {bookingTour && (
        <BookingModal tour={bookingTour} onClose={() => setBookingTour(null)} t={t} lang={lang} />
      )}
      <Footer t={t} lang={lang} />
    </div>
  );
}
