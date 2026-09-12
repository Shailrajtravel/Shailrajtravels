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
  Phone,
  Eye,
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
    <section className="relative w-full py-6 md:py-10 bg-gradient-to-b from-amber-50/60 via-white to-orange-50/40 overflow-hidden border-y border-amber-200/70">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-300/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-300/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header Tag Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 text-white shadow-sm shadow-orange-500/20">
              <Sparkles className="w-3.5 h-3.5 text-yellow-200 animate-spin" style={{ animationDuration: '4s' }} />
              {offer.badge || "LIMITED TIME SPECIAL OFFER"}
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-800 border border-slate-200 shadow-2xs">
              <Bus className="w-3.5 h-3.5 text-orange-600" />
              {offer.vehicleName || "Luxury AC Force Urbania"}
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-orange-800 border border-amber-200">
              ₹{offer.offerPrice} {offer.priceUnit || "per person"}
            </span>
          </div>

          {offer.urgencyText && (
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50/90 px-3.5 py-1 rounded-full border border-red-200/80 animate-pulse">
              <Clock className="w-3.5 h-3.5 text-red-600" />
              <span>{offer.urgencyText}</span>
            </div>
          )}
        </div>

        {/* Full Uncropped Panoramic Poster Presentation */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-amber-200/90 shadow-2xl shadow-amber-900/10 overflow-hidden transition-all">
          
          {/* Uncropped Poster Image */}
          <div
            className="relative w-full bg-slate-950 group cursor-pointer overflow-hidden"
            onClick={() => setIsLightboxOpen(true)}
            title="Click to zoom full poster"
          >
            <img
              src={offer.bannerImageUrl}
              alt={offer.title}
              className="w-full h-auto block object-contain transition-transform duration-500 group-hover:scale-[1.01]"
              loading="eager"
            />

            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4 sm:p-6 pointer-events-none">
              <span className="flex items-center gap-2 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3.5 py-2 rounded-full border border-white/20">
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                Click to View Full Size Poster
              </span>

              <span className="bg-emerald-600 text-white text-xs font-extrabold px-3.5 py-2 rounded-full shadow-lg">
                Book for ₹{offer.offerPrice}
              </span>
            </div>
          </div>

          {/* Quick Details & Action Strip Directly Underneath Poster */}
          <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-b from-white to-amber-50/30 border-t border-amber-100">
            
            {/* Route & Pickup Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center pb-6 border-b border-slate-200/70">
              
              {/* Route & Vehicle Info (7 cols) */}
              <div className="lg:col-span-7 space-y-2">
                {offer.route && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800">
                    <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Route: <strong className="text-orange-700">{offer.route}</strong></span>
                  </div>
                )}

                {offer.pickupPoints && offer.pickupPoints.length > 0 && (
                  <div className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="font-extrabold text-slate-700 shrink-0 uppercase tracking-wider text-[11px] mt-0.5">
                      Pune Pickups:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {offer.pickupPoints.map((pt, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold text-[11px] border border-slate-200/60"
                        >
                          {pt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Pricing & Guarantee Pill (5 cols) */}
              <div className="lg:col-span-5 flex flex-row lg:flex-col items-center lg:items-end justify-between gap-1 text-right bg-amber-500/10 lg:bg-transparent p-3 lg:p-0 rounded-xl">
                <div className="flex items-baseline gap-2">
                  {offer.originalPrice && (
                    <span className="text-sm line-through text-slate-400 font-semibold">
                      ₹{offer.originalPrice}
                    </span>
                  )}
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">
                    ₹{offer.offerPrice}
                  </span>
                  <span className="text-xs text-slate-600 font-semibold">
                    {offer.priceUnit || "per person"}
                  </span>
                  {discountPercent && (
                    <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-black rounded-md">
                      SAVE {discountPercent}%
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  All Highway Tolls, Parking & Driver Allowance Included
                </div>
              </div>
            </div>

            {/* CTAs Bar */}
            <div className="pt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Reserved Push-Back AC Seats • Punctual Departure</span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href="tel:+919764413556"
                  className="px-4 py-3 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-2xs flex items-center justify-center gap-2 shrink-0"
                >
                  <Phone className="w-4 h-4 text-slate-600" />
                  <span className="hidden sm:inline">Call Helpline</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsDetailsOpen(true)}
                  className="px-4 py-3 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs sm:text-sm transition-all shadow-2xs flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span>Full Schedule & Details</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 group"
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

      {/* Fullscreen Lightbox Modal for Poster */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6 bg-slate-950/92 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full flex flex-col items-center animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute -top-12 right-0 p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors border border-white/20"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={offer.bannerImageUrl}
              alt={offer.title}
              className="w-full h-auto max-h-[85vh] rounded-2xl shadow-2xl object-contain border border-white/20"
            />

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-lg flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Book Your Seat Now for ₹{offer.offerPrice}
              </a>

              <button
                type="button"
                onClick={() => {
                  setIsLightboxOpen(false);
                  setIsDetailsOpen(true);
                }}
                className="px-5 py-3 bg-white text-slate-800 hover:bg-slate-100 rounded-xl font-bold text-sm shadow-lg"
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
