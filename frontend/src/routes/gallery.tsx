import React, { useState, useMemo, useRef } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Navbar } from '@/frontend/core/Navbar';
import { FooterSection as Footer } from '@/frontend/core/Footer';
import { translations } from '@/frontend/core/i18n';
import { generateSEO, generateHreflangLinks } from '@/backend/features/seo';
import { getGalleryPhotosFn } from '@/backend/shared/gallery';
import { seedGallery } from '@/backend/shared/seed-data';
import {
  GalleryLightbox,
  GalleryPhotoItem,
} from '@/frontend/features/gallery/GalleryLightbox';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Sparkles,
  Award,
  Users,
  Grid,
  Layers,
  Calendar,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const Route = createFileRoute("/gallery")({
  loader: async () => {
    try {
      const photos = await getGalleryPhotosFn({ forceFresh: true });
      if (Array.isArray(photos) && photos.length > 0) {
        return { photos };
      }
      return { photos: seedGallery };
    } catch (e) {
      console.error("Failed to load gallery photos:", e);
      return { photos: seedGallery };
    }
  },
  head: () => ({
    meta: generateSEO({
      title: "Photo Gallery & Milestones | Shailraj Travels Pune",
      description:
        "Explore moments of excellence, BNI Agni business achievements, Rising Star awards, and memorable pilgrimages with Shailraj Travels Pune.",
      canonicalUrl: "https://www.shailrajtravels.com/gallery",
      type: "website",
    }),
    links: [
      { rel: "canonical", href: "https://www.shailrajtravels.com/gallery" },
      ...generateHreflangLinks("https://www.shailrajtravels.com/gallery"),
    ],
  }),
  component: GalleryPageComponent,
});

function GalleryPageComponent() {
  const { photos: loaderPhotos } = Route.useLoaderData();
  const photos: GalleryPhotoItem[] = useMemo(() => {
    const list = Array.isArray(loaderPhotos) && loaderPhotos.length > 0 ? loaderPhotos : seedGallery;
    return list.map((item: any, idx: number) => {
      const seedMatch = seedGallery[idx];
      return {
        _id: item._id || seedMatch?._id || `photo-${idx}`,
        imageUrl: item.imageUrl || seedMatch?.imageUrl,
        title: item.title || seedMatch?.title || `Shailraj Travels Moment ${idx + 1}`,
        category: item.category || seedMatch?.category || (idx % 2 === 0 ? "BNI Agni Events" : "Awards & Recognition"),
        aspect: item.aspect || seedMatch?.aspect || (idx === 8 ? "landscape" : "portrait"),
      };
    });
  }, [loaderPhotos]);

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Top row scroll reference for horizontal showcase
  const topRowScrollRef = useRef<HTMLDivElement>(null);

  const scrollTopRow = (direction: 'left' | 'right') => {
    if (!topRowScrollRef.current) return;
    const scrollAmount = direction === 'left' ? -380 : 380;
    topRowScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
    setLightboxOpen(true);
  };

  // Filtered list
  const filteredPhotos = useMemo(() => {
    if (activeCategory === 'ALL') return photos;
    return photos.filter((p) => p.category === activeCategory);
  }, [photos, activeCategory]);

  // Specific slots for showcase arrangement matching the user's layout:
  // Top row: 7 vertical event cards (indices 0 to 6)
  const topRowPhotos = useMemo(() => photos.slice(0, 7), [photos]);
  // Bottom row left: Presentation screen (index 7)
  const bottomPresentation = photos[7] || photos[0];
  // Bottom row right: Wide certificate (index 8)
  const bottomCertificate = photos[8] || photos[photos.length - 1];

  const t = translations.en;

  return (
    <div className="w-full bg-[#FAFCFB] min-h-screen text-slate-800 flex flex-col font-sans">
      <Navbar t={t} />

      <main className="flex-1 w-full pt-28 pb-20">
        {/* Hero Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-green/10 text-brand-green-dark border border-brand-green/20 text-xs font-bold uppercase tracking-wider mb-4 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-brand-green" />
            Moments of Excellence & Honors
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-brand-blue-deep tracking-tight mb-4 leading-tight">
            Photo Gallery & Enterprise Milestones
          </h1>

          <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Witness our journey of trust, leadership, prestigious BNI awards, and unforgettable pilgrimage moments crafted by Shailraj Travels.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
            <button
              onClick={() => setActiveCategory('ALL')}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all shadow-sm ${
                activeCategory === 'ALL'
                  ? 'bg-brand-blue-deep text-white shadow-brand-blue-deep/20 shadow-md scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Moments ({photos.length})
            </button>
            <button
              onClick={() => setActiveCategory('Awards & Recognition')}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                activeCategory === 'Awards & Recognition'
                  ? 'bg-brand-blue-deep text-white shadow-brand-blue-deep/20 shadow-md scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              Awards & Honors (5)
            </button>
            <button
              onClick={() => setActiveCategory('BNI Agni Events')}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                activeCategory === 'BNI Agni Events'
                  ? 'bg-brand-blue-deep text-white shadow-brand-blue-deep/20 shadow-md scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-brand-blue" />
              BNI Agni Events (4)
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* FEATURED SHOWCASE SECTION (EXACT ARRANGEMENT FROM USER'S DESIGN) */}
        {/* ============================================================== */}
        {activeCategory === 'ALL' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm border border-slate-200/80 space-y-6">
              {/* Top Row: Horizontal strip of 7 Portrait Cards */}
              <div className="relative group/strip">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-green"></span>
                    <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">
                      BNI Agni Entrepreneur Meet & Felicitation
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => scrollTopRow('left')}
                      aria-label="Scroll Left"
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all active:scale-95 shadow-sm"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => scrollTopRow('right')}
                      aria-label="Scroll Right"
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all active:scale-95 shadow-sm"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Horizontal Scroll Track */}
                <div
                  ref={topRowScrollRef}
                  className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 pt-1 snap-x snap-mandatory custom-scrollbar"
                >
                  {topRowPhotos.map((photo, index) => (
                    <div
                      key={photo._id || index}
                      onClick={() => openLightbox(index)}
                      className="shrink-0 w-[140px] sm:w-[170px] md:w-[190px] aspect-[9/14] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group relative snap-start"
                    >
                      <img
                        src={photo.imageUrl}
                        alt={photo.title || `Gallery ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                        <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center mb-1">
                          <Eye className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-white text-[11px] sm:text-xs font-bold line-clamp-2 leading-tight">
                          {photo.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Row: 2-Column Split (Left: Presentation Photo | Right: Wide Certificate) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 pt-2">
                {/* Left Card: Award Presentation Photo */}
                <div
                  onClick={() => openLightbox(7)}
                  className="md:col-span-4 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group relative min-h-[260px] sm:min-h-[340px]"
                >
                  <img
                    src={bottomPresentation.imageUrl}
                    alt={bottomPresentation.title || "Rising Star Award"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-6">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded w-fit mb-2 backdrop-blur-sm">
                      Award Ceremony
                    </span>
                    <h3 className="text-white text-base sm:text-lg font-bold leading-snug">
                      {bottomPresentation.title}
                    </h3>
                  </div>
                </div>

                {/* Right Card: Terrific Performance Certificate (Wide Landscape) */}
                <div
                  onClick={() => openLightbox(8)}
                  className="md:col-span-8 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group relative min-h-[260px] sm:min-h-[340px]"
                >
                  <img
                    src={bottomCertificate.imageUrl}
                    alt={bottomCertificate.title || "BNI Agni Certificate"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-400 bg-emerald-400/20 px-2 py-0.5 rounded backdrop-blur-sm">
                        Score 100/100
                      </span>
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-white/80 bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">
                        Official Recognition
                      </span>
                    </div>
                    <h3 className="text-white text-lg sm:text-xl font-bold leading-snug">
                      {bottomCertificate.title}
                    </h3>
                    <p className="text-white/80 text-xs sm:text-sm mt-1 line-clamp-1">
                      In Recognition of Terrific Performance in Green Category for June 2026
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* RESPONSIVE FULL GRID VIEW (ALL FILTERABLE PHOTOS) */}
        {/* ============================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-brand-blue-deep flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-green" />
              {activeCategory === 'ALL' ? 'Complete Gallery Collection' : activeCategory}
            </h2>
            <span className="text-xs sm:text-sm text-slate-500 font-medium">
              Click any photo to open full swipe view
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredPhotos.map((photo, idx) => {
              const originalIndex = photos.findIndex((p) => p.imageUrl === photo.imageUrl);
              const isWide = photo.aspect === 'landscape';

              return (
                <div
                  key={photo._id || idx}
                  onClick={() => openLightbox(originalIndex >= 0 ? originalIndex : idx)}
                  className={`group relative rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer ${
                    isWide ? 'col-span-2 aspect-[16/9]' : 'aspect-[3/4]'
                  }`}
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.title || `Gallery photo ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Dark hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                    <div className="flex justify-end">
                      <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center shadow-sm">
                        <Eye className="w-4 h-4" />
                      </span>
                    </div>

                    <div>
                      {photo.category && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-brand-green bg-brand-green/20 px-2 py-0.5 rounded w-fit inline-block mb-1 backdrop-blur-sm">
                          {photo.category}
                        </span>
                      )}
                      <h4 className="text-white text-sm font-bold line-clamp-2 leading-tight">
                        {photo.title}
                      </h4>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA Box */}
          <div className="mt-16 bg-gradient-to-br from-brand-blue-deep to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-brand-green text-xs font-bold uppercase tracking-widest block mb-2">
                Plan Your Next Pilgrimage
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-bold mb-3">
                Experience Award-Winning Service with Shailraj Travels
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                From Ashtavinayak and Jyotirlinga yatras to luxury AC Force Urbania family bookings, travel with Pune's trusted tour specialist.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <Link
                to="/tours"
                className="px-6 py-3.5 rounded-xl bg-brand-green hover:bg-brand-green-dark text-brand-blue-deep font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Browse Tour Packages <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/20 flex items-center justify-center"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer t={t} lang="en" />

      {/* Swipeable Fullscreen Lightbox Modal */}
      <GalleryLightbox
        photos={photos}
        currentIndex={selectedPhotoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onSelectIndex={(index) => setSelectedPhotoIndex(index)}
      />
    </div>
  );
}
