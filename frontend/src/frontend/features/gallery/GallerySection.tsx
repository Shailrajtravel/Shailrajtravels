import React, { useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, ArrowRight, Eye } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { LazyImage } from '@/frontend/shared/ui/lazy-image';
import { GalleryLightbox } from '@/frontend/features/gallery/GalleryLightbox';

export function GallerySection({ t, photos = [] }: { t: any; photos?: any[] }) {
  if (!photos || photos.length === 0) return null;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 3500, stopOnInteraction: false }),
  ]);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  const handleOpenLightbox = (index: number) => {
    setSelectedIdx(index);
    setLightboxOpen(true);
  };

  return (
    <section
      id="gallery"
      className="w-full bg-[#FCFCFC] py-12 lg:py-20 scroll-mt-28 md:scroll-mt-32 relative"
    >
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col items-center text-center mb-14 animate-reveal">
          <p className="flex items-center gap-3 text-[13px] md:text-[15px] font-bold tracking-[0.2em] text-brand-green-dark mb-4 uppercase">
            <span className="h-px w-8 bg-brand-green" />
            {t.galleryTitle}
            <span className="h-px w-8 bg-brand-green" />
          </p>
          <h2 className="text-4xl md:text-5xl font-bold font-display text-brand-blue-deep leading-tight">
            {t.gallerySubtitle}
          </h2>
        </div>

        <div className="relative group">
          <div className="overflow-hidden -mx-4 px-4 pb-4" ref={emblaRef}>
            <div className="flex gap-4 md:gap-6">
              {photos.map((photo, idx) => (
                <div
                  key={photo._id || idx}
                  className="flex-[0_0_100%] md:flex-[0_0_calc(50%-0.75rem)] lg:flex-[0_0_calc(33.333%-1rem)] min-w-0 flex flex-col transition-transform"
                >
                  <div
                    onClick={() => handleOpenLightbox(idx)}
                    className="relative h-[300px] md:h-[400px] w-full overflow-hidden rounded-2xl group/item border border-slate-200/80 shadow-sm bg-white flex items-center justify-center p-3 cursor-pointer"
                  >
                    <LazyImage
                      src={photo.imageUrl}
                      alt={photo.title || "Gallery Photo"}
                      className="h-full w-full object-contain transition-transform duration-700 group-hover/item:scale-105"
                    />

                    {/* Hover icon */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 text-brand-blue-deep flex items-center justify-center shadow-lg transform scale-90 group-hover/item:scale-100 transition-transform">
                        <Eye className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            suppressHydrationWarning
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg text-brand-blue-deep opacity-0 transition-all hover:bg-brand-green hover:text-white group-hover:opacity-100"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            suppressHydrationWarning
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg text-brand-blue-deep opacity-0 transition-all hover:bg-brand-green hover:text-white group-hover:opacity-100"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Explore Full Gallery Button */}
        <div className="flex justify-center mt-10">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand-blue-deep hover:bg-brand-blue text-white font-bold text-sm transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5"
          >
            View Complete Photo Gallery ({photos.length} Photos) <ArrowRight className="w-4 h-4 text-brand-green" />
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      <GalleryLightbox
        photos={photos}
        currentIndex={selectedIdx}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onSelectIndex={(index) => setSelectedIdx(index)}
      />
    </section>
  );
}
