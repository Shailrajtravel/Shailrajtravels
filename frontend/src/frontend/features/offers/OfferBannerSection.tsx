import React, { useState } from 'react';
import {
  Sparkles,
  Clock,
  MapPin,
  CheckCircle,
  MessageSquare,
  ArrowRight,
  Maximize2,
  X,
  Bus,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import type { PromotionalOffer } from '@/backend/features/offers';
import { OfferDetailsModal } from './OfferDetailsModal';

interface OfferBannerSectionProps {
  offer?: PromotionalOffer | null;
  onBookTour?: (tour: any) => void;
}

export function OfferBannerSection({ offer, onBookTour }: OfferBannerSectionProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!offer || !offer.isActive) {
    return null;
  }

  const originalPriceNum = offer.originalPrice ? parseFloat(offer.originalPrice.replace(/,/g, '')) : 0;
  const offerPriceNum = offer.offerPrice ? parseFloat(offer.offerPrice.replace(/,/g, '')) : 0;
  const discountPercent =
    originalPriceNum && offerPriceNum && originalPriceNum > offerPriceNum
      ? Math.round(((originalPriceNum - offerPriceNum) / originalPriceNum) * 100)
      : null;

  const whatsappUrl = `https://wa.me/919764413556?text=${encodeURIComponent(
    offer.whatsappMessage ||
      `Hello Shailraj Travels, I want to book seats for ${offer.title} at ₹${offer.offerPrice} ${offer.priceUnit}. Please confirm availability.`
  )}`;

  return (
    <section className="relative w-full py-8 md:py-14 bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30 overflow-hidden border-y border-amber-100/60">
      {/* Subtle Background Elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Header Tag */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm shadow-orange-500/20">
              <Sparkles className="w-3.5 h-3.5 text-yellow-200 animate-spin" style={{ animationDuration: '4s' }} />
              {offer.badge || "LIMITED TIME SPECIAL OFFER"}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-700 border border-slate-200 shadow-sm">
              <Bus className="w-3.5 h-3.5 text-orange-600" />
              {offer.vehicleName || "Luxury AC Force Urbania"}
            </span>
          </div>

          {offer.urgencyText && (
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200/60 animate-pulse">
              <Clock className="w-3.5 h-3.5" />
              <span>{offer.urgencyText}</span>
            </div>
          )}
        </div>

        {/* Main Banner Card */}
        <div className="bg-white rounded-3xl border border-amber-200/70 shadow-xl shadow-amber-900/5 overflow-hidden transition-all hover:shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Left Column: Interactive Poster with Lightbox Trigger (5 Cols) */}
            <div className="lg:col-span-5 relative bg-slate-950 flex flex-col justify-center items-center overflow-hidden min-h-[280px] sm:min-h-[340px] lg:min-h-[420px] group cursor-pointer"
                 onClick={() => setIsLightboxOpen(true)}>
              <img
                src={offer.bannerImageUrl}
                alt={offer.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:opacity-75" />

              {/* Hover to Zoom Overlay Hint */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-semibold z-10">
                <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                  <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                  Click to View Full Poster
                </span>
                <span className="bg-amber-500 text-slate-950 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm">
                  ₹{offer.offerPrice} Only
                </span>
              </div>
            </div>

            {/* Right Column: Offer Information, Schedule & CTA (7 Cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-gradient-to-br from-white via-white to-amber-50/30">
              <div>
                {/* Title & Subtitle */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-slate-900 tracking-tight leading-tight">
                      {offer.title}
                    </h2>
                    <p className="text-sm sm:text-base font-semibold text-orange-600 mt-1">
                      {offer.subtitle}
                    </p>
                  </div>

                  {/* Pricing Badge */}
                  <div className="bg-amber-500/10 border border-amber-300/80 p-3.5 rounded-2xl shrink-0 sm:text-right flex sm:flex-col items-baseline sm:items-end justify-between gap-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-700">
                      Offer Price
                    </span>
                    <div className="flex items-baseline gap-2">
                      {offer.originalPrice && (
                        <span className="text-sm line-through text-slate-400 font-semibold">
                          ₹{offer.originalPrice}
                        </span>
                      )}
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                        ₹{offer.offerPrice}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {discountPercent && (
                        <span className="px-1.5 py-0.5 bg-emerald-600 text-white text-[10px] font-black rounded-md">
                          {discountPercent}% OFF
                        </span>
                      )}
                      <span className="text-xs text-slate-500 font-medium">
                        {offer.priceUnit || "per person"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Route Pill */}
                {offer.route && (
                  <div className="mb-5 inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 border border-slate-200/80">
                    <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span>Route: {offer.route}</span>
                  </div>
                )}

                {/* Schedule Quick Preview */}
                {offer.schedule && offer.schedule.length > 0 && (
                  <div className="mb-6 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-orange-600" />
                        Trip Highlights & Milestones
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsDetailsOpen(true)}
                        className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline"
                      >
                        View Full Details →
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {offer.schedule.map((item, idx) => (
                        <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                          <span className="block text-[10px] font-bold text-orange-600 truncate">{item.time}</span>
                          <span className="block text-xs font-bold text-slate-800 truncate mt-0.5">{item.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features Badges */}
                {offer.highlights && offer.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {offer.highlights.slice(0, 4).map((h, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg text-xs font-bold text-slate-700 border border-slate-200 shadow-2xs"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        {h}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Sanitised Luxury Vehicle • Verified Drivers</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDetailsOpen(true)}
                    className="px-4 py-3 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    Trip Details
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 group"
                  >
                    <MessageSquare className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>{offer.ctaText || "Book Your Seat Now"}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <OfferDetailsModal
        offer={offer}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onBookOnline={
          onBookTour
            ? () => {
                onBookTour({
                  title: offer.title,
                  name: offer.title,
                  price: `₹${offer.offerPrice}`,
                  slug: offer.slug,
                  schedule: offer.schedule?.[0]?.time || "14th Sep",
                  dates: ["14th Sep 2024", "15th Sep 2024"],
                });
              }
            : undefined
        }
      />

      {/* Lightbox Modal for Poster */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute -top-12 right-0 p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors border border-white/20"
              title="Close Poster"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={offer.bannerImageUrl}
              alt={offer.title}
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain border border-white/20"
            />
            <div className="mt-3 flex items-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-lg flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Book Now for ₹{offer.offerPrice}
              </a>
              <button
                onClick={() => {
                  setIsLightboxOpen(false);
                  setIsDetailsOpen(true);
                }}
                className="px-6 py-2.5 bg-white text-slate-800 hover:bg-slate-100 rounded-xl font-bold text-sm shadow-lg"
              >
                View Full Itinerary & Pickup Points
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
