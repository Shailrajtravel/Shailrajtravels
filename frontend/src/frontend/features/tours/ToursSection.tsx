import React, { useState, useEffect, useCallback } from 'react';
import { TourCard, TourData } from '@/frontend/features/tours/TourCard';
import { TourModal } from '@/frontend/features/tours/TourModal';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
// @ts-ignore
import bgFallback from '@/frontend/shared/assets/hero-pandharpur.webp?w=600&format=webp&as=url';

export function ToursSection({
  lang,
  t,
  packages,
  tripOptions,
  tours,
  onBookSeat,
  mode = "packages",
}: {
  lang: "mr" | "en";
  t: any;
  packages?: any[];
  tripOptions?: any[];
  tours?: any[];
  onBookSeat?: (tour: any) => void;
  mode?: "packages" | "tours";
}) {
  const [selectedTour, setSelectedTour] = useState<TourData | null>(null);

  const formatTourData = (item: any): TourData => {
    const cardImage = item.heroContent?.image || item.image || bgFallback;
    const cardTitle = item.title || item.name || "";
    const cardSubtitle =
      item.subtitle ||
      item.metaTitle ||
      item.heroContent?.description ||
      item.metaDescription ||
      item.overview ||
      "Special Spiritual Tour";

    const durationBadge =
      item.durationBadge ||
      item.packages?.[0]?.title ||
      (item.duration ? `${item.duration}` : "Weekly Trip");

    const tourRoute =
      Array.isArray(item.route) && item.route.length > 0
        ? item.route
        : Array.isArray(item.destinations) && item.destinations.length > 0
        ? item.destinations
        : [cardTitle];

    const tourLocation =
      item.location ||
      (Array.isArray(item.destinations) && item.destinations.length > 0
        ? item.destinations.join(", ")
        : "Maharashtra");

    const tourSchedule =
      item.schedule ||
      (Array.isArray(item.dates) && item.dates.length > 0
        ? item.dates.join(", ")
        : "Every Friday & Weekend Departures");

    const tourFrequency = item.frequency || "Weekly";

    const tourTags =
      Array.isArray(item.tags) && item.tags.length > 0
        ? item.tags
        : ["Jyotirlinga", "Temple Tour", "Spiritual Tour"];

    const tourPrice =
      item.price ||
      (item.packages?.[0]?.price ? `₹${item.packages[0].price}` : "₹6,999");

    const tourItinerary =
      Array.isArray(item.itinerary) && item.itinerary.length > 0
        ? item.itinerary
        : Array.isArray(item.highlights)
        ? item.highlights.map((h: string, idx: number) => ({
            day: `Day ${idx + 1}`,
            title: h,
          }))
        : [];

    const tourIncludes =
      Array.isArray(item.includes) && item.includes.length > 0
        ? item.includes
        : item.packages?.[0]?.inclusions || [
            "AC Travel",
            "Temple Darshan",
            "Verified Hotels",
            "Travel Assistance",
          ];

    return {
      id: item._id || item.id || item.tourId || cardTitle,
      slug: item.slug,
      image: cardImage,
      images: Array.isArray(item.images) && item.images.length > 0 ? item.images : [cardImage],
      durationBadge,
      subtitle: cardSubtitle,
      title: cardTitle,
      location: tourLocation,
      schedule: tourSchedule,
      frequency: tourFrequency,
      route: tourRoute,
      tags: tourTags,
      seatsAvailable: typeof item.seatsAvailable === 'number' ? item.seatsAvailable : 14,
      seatsTotal: typeof item.seatsTotal === 'number' ? item.seatsTotal : 17,
      price: tourPrice,
      itinerary: tourItinerary,
      includes: tourIncludes,
      dates: Array.isArray(item.dates) ? item.dates : [],
    };
  };

  const mappedTripOptions = (tripOptions || []).map((trip: any) =>
    formatTourData({
      _id: trip._id,
      slug: trip.slug,
      image: trip.image,
      title: trip.name,
      route: trip.route,
      subtitle: trip.description,
      itinerary: trip.itinerary,
      includes: trip.includes,
      dates: trip.dates,
      schedule: trip.schedule,
      price: trip.price,
    })
  );

  const mappedTours = (tours || []).map((tour: any) => formatTourData(tour));

  const displayList: TourData[] =
    mode === "packages"
      ? [...(packages || []).map(formatTourData), ...mappedTripOptions]
      : mappedTours;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 3500, stopOnInteraction: true }),
  ]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (displayList.length === 0) {
    return null;
  }

  const sectionSubtitle =
    mode === "packages"
      ? t.toursSubtitle || "PACKAGES"
      : t.toursSectionSubtitle || "UPCOMING TOURS";

  const titlePrefix =
    mode === "packages"
      ? t.toursTitlePrefix || "Popular"
      : t.toursSectionTitlePrefix || "Special";

  const titleHighlight =
    mode === "packages"
      ? t.toursTitleHighlight || "Journeys"
      : t.toursSectionTitleHighlight || "Departures";

  return (
    <section
      id={mode === "packages" ? "tours" : "upcoming-tours"}
      className={`w-full ${mode === "packages" ? "bg-[#F8FAFC]" : "bg-white"} pt-12 pb-8 lg:pt-20 lg:pb-16 relative scroll-mt-28 md:scroll-mt-32`}
    >
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col items-center justify-center text-center mb-12 animate-reveal">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-10 bg-brand-green" />
            <span className="text-[13px] md:text-[15px] font-bold tracking-[0.2em] text-brand-green-dark uppercase leading-none">
              {sectionSubtitle}
            </span>
            <div className="h-[1px] w-10 bg-brand-green" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-brand-blue-deep leading-tight">
            {titlePrefix}{" "}
            <span className="text-brand-green-dark">{titleHighlight}</span>
          </h2>
        </div>

        <div className="relative group">
          <div className="overflow-hidden -mx-4 px-4 pb-4" ref={emblaRef}>
            <div className="flex gap-8">
              {displayList.map((tour: TourData) => (
                <div
                  key={tour.id || tour.slug || tour.title}
                  className="flex-[0_0_100%] md:flex-[0_0_calc(50%-1rem)] lg:flex-[0_0_calc(33.333%-1.33rem)] min-w-0 flex flex-col"
                >
                  <TourCard
                    tour={tour}
                    onOpenDetails={setSelectedTour}
                    onBookSeat={onBookSeat}
                    t={t}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={scrollPrev}
            aria-label="Previous tours"
            className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-[#16a34a] hover:bg-[#15803d] text-white shadow-xl hover:scale-110 transition-all cursor-pointer"
          >
            <ChevronLeft className="h-6 w-6 ml-[-2px]" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next tours"
            className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-[#16a34a] hover:bg-[#15803d] text-white shadow-xl hover:scale-110 transition-all cursor-pointer"
          >
            <ChevronRight className="h-6 w-6 mr-[-2px]" />
          </button>
        </div>
      </div>

      {selectedTour && (
        <TourModal
          tour={selectedTour}
          onClose={() => setSelectedTour(null)}
          onBookSeat={onBookSeat}
          t={t}
        />
      )}
    </section>
  );
}
