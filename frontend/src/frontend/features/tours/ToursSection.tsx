import React, { useState, useEffect, useCallback } from 'react';
import { Link } from '@tanstack/react-router';
import { LazyImage } from '@/frontend/shared/ui/lazy-image';
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
  const mappedTripOptions = (tripOptions || []).map((trip: any) => ({
    id: trip._id,
    slug: trip.slug,
    image: trip.image || bgFallback,
    title: trip.name,
    destinations: trip.route || [],
    heroContent: { description: trip.description || "", image: trip.image || bgFallback },
  }));

  const mappedTours = (tours || []).map((tour: any) => ({
    id: tour._id,
    slug: tour.slug,
    image: tour.heroContent?.image || bgFallback,
    title: tour.title,
    destinations: tour.destinations || [],
    heroContent: tour.heroContent || { description: "", image: bgFallback },
  }));

  // Display DB packages, mapped trip options, or mapped popular tours based on mode
  const displayPackages = mode === "packages"
    ? [...(packages || []), ...mappedTripOptions]
    : mappedTours;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 3000, stopOnInteraction: true }),
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

  if (displayPackages.length === 0) {
    return null;
  }

  const sectionSubtitle = mode === "packages"
    ? (t.toursSubtitle || "PACKAGES")
    : (t.toursSectionSubtitle || "UPCOMING TOURS");

  const titlePrefix = mode === "packages"
    ? (t.toursTitlePrefix || "Popular")
    : (t.toursSectionTitlePrefix || "Special");

  const titleHighlight = mode === "packages"
    ? (t.toursTitleHighlight || "Journeys")
    : (t.toursSectionTitleHighlight || "Departures");

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
              {displayPackages.map((tour: any) => {
                const cardImage = tour.heroContent?.image || tour.image || bgFallback;
                const cardTitle = tour.title || tour.name || "";
                const cardDescription = tour.heroContent?.description || tour.metaDescription || tour.overview || "";
                const cardDestinations = tour.destinations || [];
                const cardSlug = tour.slug;

                const cardContent = (
                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-white hover:-translate-y-1">
                    <div className="w-full aspect-[1654/561] relative overflow-hidden bg-slate-950 flex items-center justify-center">
                      <LazyImage
                        src={cardImage}
                        alt={cardTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        optimizedWidth={1200}
                        autoOptimizeCloudinary={false}
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex gap-2 mb-3 flex-wrap">
                        {cardDestinations.slice(0, 2).map((dest: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-brand-blue/5 text-brand-blue-deep text-[11px] font-bold rounded-lg border border-brand-blue/10 uppercase tracking-wider"
                          >
                            {dest}
                          </span>
                        ))}
                        {cardDestinations.length > 2 && (
                          <span className="px-2.5 py-1 bg-slate-50 text-slate-500 text-[11px] font-bold rounded-lg border border-slate-100 uppercase tracking-wider">
                            +{cardDestinations.length - 2}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-brand-orange transition-colors">
                        {cardTitle}
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-3 mb-6 leading-relaxed">
                        {cardDescription}
                      </p>
                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-brand-orange font-bold text-sm group-hover:underline flex items-center gap-1">
                          {t.toursIndexViewDetails ? t.toursIndexViewDetails.replace(/→/g, '').trim() : "View Tour Details"}
                          <span className="transition-transform group-hover:translate-x-1">→</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );

                return (
                  <div
                    key={tour.id || tour._id || cardTitle}
                    className="flex-[0_0_100%] md:flex-[0_0_calc(50%-1rem)] lg:flex-[0_0_calc(33.333%-1.33rem)] min-w-0 flex flex-col group"
                  >
                    {cardSlug ? (
                      <Link
                        to="/tours/$tourSlug"
                        params={{ tourSlug: cardSlug }}
                        className="block h-full"
                      >
                        {cardContent}
                      </Link>
                    ) : (
                      <div className="h-full">
                        {cardContent}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={scrollPrev}
            className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 h-14 w-14 items-center justify-center rounded-full bg-white shadow-xl border border-slate-100 text-brand-blue-deep opacity-0 transition-all hover:bg-brand-green hover:text-white group-hover:opacity-100 hover:scale-110"
          >
            <ChevronLeft className="h-7 w-7 ml-[-2px]" />
          </button>
          <button
            onClick={scrollNext}
            className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 h-14 w-14 items-center justify-center rounded-full bg-white shadow-xl border border-slate-100 text-brand-blue-deep opacity-0 transition-all hover:bg-brand-green hover:text-white group-hover:opacity-100 hover:scale-110"
          >
            <ChevronRight className="h-7 w-7 mr-[-2px]" />
          </button>
        </div>
      </div>
    </section>
  );
}
