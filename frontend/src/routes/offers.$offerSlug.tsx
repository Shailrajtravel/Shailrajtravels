import React, { useState } from 'react';
import { createFileRoute, notFound, Link } from '@tanstack/react-router';
import { getOfferBySlugFn } from '@/backend/features/offers';
import { generateSEO } from '@/backend/features/seo';
import { useLanguage } from '@/routes/__root';
import { translations } from '@/frontend/core/i18n';
import { Navbar } from '@/frontend/core/Navbar';
import { FooterSection } from '@/frontend/core/Footer';
import {
  Sparkles,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Phone,
  MessageSquare,
  ShieldCheck,
  Compass,
  Bus,
  Share2,
  Calendar,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { OfferDetailsModal } from '@/frontend/features/offers/OfferDetailsModal';

export const Route = createFileRoute("/offers/$offerSlug")({
  loader: async ({ params }: { params: any }) => {
    const offer = await getOfferBySlugFn({ data: { slug: params.offerSlug } });
    if (!offer) {
      throw notFound();
    }
    return { offer };
  },
  head: ({ loaderData }: { loaderData?: any }) => {
    if (!loaderData?.offer) {
      return {
        meta: [{ title: "Special Offer Not Found | Shailraj Travels" }, { name: "robots", content: "noindex, nofollow" }],
      };
    }
    const { offer } = loaderData;
    const title = `${offer.title} - ₹${offer.offerPrice} ${offer.priceUnit || 'per person'} | Shailraj Travels`;
    const description = `${offer.subtitle} Round-trip from Pune in Luxury AC Force Urbania for ₹${offer.offerPrice}. Limited seats available, book your seat now!`;
    const canonicalUrl = `https://www.shailrajtravels.com/offers/${offer.slug}`;
    const ogImage = offer.bannerImageUrl?.startsWith('http')
      ? offer.bannerImageUrl
      : `https://www.shailrajtravels.com${offer.bannerImageUrl}`;

    return {
      meta: generateSEO({
        title,
        description,
        canonicalUrl,
        ogImage,
        type: "website",
      }),
      links: [{ rel: "canonical", href: canonicalUrl }],
    };
  },
  component: OfferPage,
});

function OfferPage() {
  const { offer } = Route.useLoaderData() as { offer: any };
  const { lang } = useLanguage();
  const t = translations[lang];
  const [isModalOpen, setIsModalOpen] = useState(false);

  const whatsappUrl = `https://wa.me/919764413556?text=${encodeURIComponent(
    offer.whatsappMessage ||
      `Hello Shailraj Travels, I want to book seats for ${offer.title} at ₹${offer.offerPrice} ${offer.priceUnit}. Please confirm availability.`
  )}`;

  const originalPriceNum = offer.originalPrice ? parseFloat(offer.originalPrice.replace(/,/g, '')) : 0;
  const offerPriceNum = offer.offerPrice ? parseFloat(offer.offerPrice.replace(/,/g, '')) : 0;
  const discountPercent =
    originalPriceNum && offerPriceNum && originalPriceNum > offerPriceNum
      ? Math.round(((originalPriceNum - offerPriceNum) / originalPriceNum) * 100)
      : null;

  const handleShare = async () => {
    if (typeof window !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${offer.title} - ₹${offer.offerPrice}`,
          text: offer.subtitle,
          url: window.location.href,
        });
      } catch (e) {}
    } else if (typeof window !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      alert('Offer link copied to clipboard!');
    }
  };

  return (
    <div className="font-sans text-slate-800 bg-[#FAF8F5] min-h-screen flex flex-col selection:bg-orange-100 selection:text-orange-900">
      <Navbar t={t} />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb navigation */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-orange-600 transition-colors font-medium">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-medium">Offers</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-bold truncate max-w-[200px] sm:max-w-none">
              {offer.title}
            </span>
          </nav>

          {/* Hero Header Card */}
          <div className="bg-white rounded-3xl border border-amber-200/80 shadow-xl shadow-amber-900/5 overflow-hidden mb-10">
            {/* Top Bar with Badge */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 p-6 sm:p-8 text-white relative">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider text-amber-100 border border-white/30 flex items-center gap-1.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    {offer.badge || "SPECIAL ONE DAY TRIP"}
                  </span>
                  <span className="px-3 py-1 bg-black/20 backdrop-blur-md rounded-full text-xs font-bold text-white">
                    {offer.vehicleName || "Luxury AC Force Urbania"}
                  </span>
                </div>

                <button
                  onClick={handleShare}
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-white/25 rounded-full text-xs font-bold text-white transition-colors border border-white/20 flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Offer</span>
                </button>
              </div>

              <div className="mt-4 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="max-w-2xl">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-white drop-shadow-sm">
                    {offer.title}
                  </h1>
                  <p className="text-base sm:text-lg text-orange-100 font-medium mt-2 leading-relaxed">
                    {offer.subtitle}
                  </p>
                  {offer.urgencyText && (
                    <div className="inline-flex items-center gap-2 mt-4 px-3.5 py-1.5 bg-amber-400/25 rounded-xl text-amber-200 text-xs sm:text-sm font-bold border border-amber-300/40">
                      <Clock className="w-4 h-4 text-amber-300" />
                      {offer.urgencyText}
                    </div>
                  )}
                </div>

                {/* Price Display */}
                <div className="bg-white/15 backdrop-blur-md p-5 rounded-2xl border border-white/25 text-right shrink-0">
                  <div className="text-xs uppercase font-extrabold tracking-wider text-orange-200">
                    Offer Price
                  </div>
                  <div className="flex items-baseline justify-end gap-2.5 mt-1">
                    {offer.originalPrice && (
                      <span className="text-base line-through text-white/60 font-semibold">
                        ₹{offer.originalPrice}
                      </span>
                    )}
                    <span className="text-4xl sm:text-5xl font-black text-white">
                      ₹{offer.offerPrice}
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-1">
                    {discountPercent && (
                      <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 text-[11px] font-black rounded">
                        SAVE {discountPercent}%
                      </span>
                    )}
                    <span className="text-xs text-white/90 font-medium">
                      {offer.priceUnit || "per person"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Poster Showcase */}
            {offer.bannerImageUrl && (
              <div className="relative bg-slate-950 p-2 sm:p-4">
                <img
                  src={offer.bannerImageUrl}
                  alt={offer.title}
                  className="w-full h-auto block rounded-2xl object-contain shadow-lg border border-slate-800 mx-auto"
                />
              </div>
            )}
          </div>

          {/* Grid: Route, Schedule, Amenities, Inclusions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            
            {/* Main Details (8 Cols) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Route Card */}
              {offer.route && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                  <h2 className="text-xs font-black uppercase tracking-wider text-orange-600 flex items-center gap-2 mb-3">
                    <Compass className="w-4 h-4" />
                    Trip Route & Highway Journey
                  </h2>
                  <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200/70 text-slate-800 font-bold text-sm sm:text-base flex items-center gap-2.5">
                    <MapPin className="w-5 h-5 text-orange-600 shrink-0" />
                    <span>{offer.route}</span>
                  </div>
                </div>
              )}

              {/* Schedule Timeline */}
              {offer.schedule && offer.schedule.length > 0 && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-orange-600" />
                        Detailed Itinerary & Timings
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Punctual and coordinated departure for hassle-free darshan
                      </p>
                    </div>
                    <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200/60">
                      {offer.schedule.length} Milestones
                    </span>
                  </div>

                  <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-[11px] sm:before:left-[15px] before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-orange-500 via-amber-400 before:to-slate-200">
                    {offer.schedule.map((item: any, idx: number) => (
                      <div key={idx} className="relative group">
                        <div className="absolute -left-[29px] sm:-left-[33px] top-1.5 w-5 h-5 rounded-full bg-white border-4 border-orange-500 shadow-sm transition-transform group-hover:scale-125" />
                        <div className="bg-slate-50 hover:bg-orange-50/40 p-5 rounded-2xl border border-slate-200/80 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1.5">
                            <span className="text-xs font-extrabold text-orange-600 bg-orange-100/70 px-3 py-1 rounded-full w-fit">
                              {item.time}
                            </span>
                            <span className="text-xs font-semibold text-slate-400">
                              Phase {idx + 1} of {offer.schedule.length}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vehicle & Tour Amenities */}
              {offer.highlights && offer.highlights.length > 0 && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
                  <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2 mb-4">
                    <Bus className="w-5 h-5 text-orange-600" />
                    Luxury Vehicle Features & Comfort
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {offer.highlights.map((h: string, i: number) => (
                      <div
                        key={i}
                        className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-3"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {offer.inclusions && offer.inclusions.length > 0 && (
                  <div className="bg-white p-6 rounded-3xl border border-emerald-200/80 shadow-sm">
                    <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-4">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      What's Included
                    </h3>
                    <ul className="space-y-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                      {offer.inclusions.map((inc: string, i: number) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {offer.exclusions && offer.exclusions.length > 0 && (
                  <div className="bg-white p-6 rounded-3xl border border-rose-200/80 shadow-sm">
                    <h3 className="text-xs font-black uppercase tracking-wider text-rose-800 flex items-center gap-1.5 mb-4">
                      <XCircle className="w-4 h-4 text-rose-500" />
                      Exclusions
                    </h3>
                    <ul className="space-y-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                      {offer.exclusions.map((exc: string, i: number) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="text-rose-400 font-bold mt-0.5">✗</span>
                          <span>{exc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Booking Card (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="sticky top-24 bg-white p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-xl shadow-amber-900/5">
                <div className="text-center pb-6 border-b border-slate-100">
                  <span className="px-3 py-1 bg-amber-100 text-orange-700 text-xs font-black rounded-full uppercase tracking-wider">
                    {offer.badge || "LIMITED TIME OFFER"}
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-3">
                    ₹{offer.offerPrice}
                  </div>
                  <div className="text-xs text-slate-500 font-semibold mt-1">
                    {offer.priceUnit || "per person"} • All highway tolls & parking included
                  </div>
                </div>

                {/* Pune Pickup Points */}
                {offer.pickupPoints && offer.pickupPoints.length > 0 && (
                  <div className="py-6 border-b border-slate-100">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-orange-600" />
                      Pickup Points Across Pune
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {offer.pickupPoints.map((pt: string, i: number) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg"
                        >
                          {pt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-6 space-y-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-sm group"
                  >
                    <MessageSquare className="w-5 h-5 transition-transform group-hover:scale-110" />
                    <span>{offer.ctaText || "Book Your Seat Now"}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>

                  <a
                    href="tel:+919764413556"
                    className="w-full py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 text-xs"
                  >
                    <Phone className="w-4 h-4 text-slate-600" />
                    <span>Call Helpline: +91 97644 13556</span>
                  </a>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Instant seat confirmation on WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Luxury AC Force Urbania with push-back seats</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterSection t={t} lang={lang} />

      <OfferDetailsModal
        offer={offer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
