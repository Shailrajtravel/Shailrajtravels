import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Phone,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Users,
  Compass,
  Bus,
  Share2,
} from 'lucide-react';
import type { PromotionalOffer } from '@/backend/features/offers';

interface OfferDetailsModalProps {
  offer: PromotionalOffer;
  isOpen: boolean;
  onClose: () => void;
  onBookOnline?: () => void;
}

export function OfferDetailsModal({ offer, isOpen, onClose, onBookOnline }: OfferDetailsModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const whatsappUrl = `https://wa.me/919764413556?text=${encodeURIComponent(
    offer.whatsappMessage ||
      `Hello Shailraj Travels, I want to book seats for ${offer.title} at ₹${offer.offerPrice} ${offer.priceUnit}. Please confirm availability.`
  )}`;

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/offers/${offer.slug}` : '';
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${offer.title} - ₹${offer.offerPrice}`,
          text: offer.subtitle,
          url: shareUrl,
        });
      } catch (e) {}
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      alert('Offer link copied to clipboard!');
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden my-auto animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header / Banner Section */}
        <div className="relative bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 p-6 md:p-8 text-white overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_70%)] pointer-events-none" />
          
          {/* Top Bar with Badges and Close Button */}
          <div className="flex items-center justify-between gap-4 mb-4 relative z-10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider text-amber-100 border border-white/30 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                {offer.badge || "SPECIAL OFFER"}
              </span>
              <span className="px-3 py-1 bg-black/25 backdrop-blur-md rounded-full text-xs font-bold text-white/90">
                {offer.vehicleName || "Luxury AC Force Urbania"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
                title="Share Offer"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors border border-white/20"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Title & Pricing */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight text-white drop-shadow-sm">
                {offer.title}
              </h2>
              <p className="text-sm sm:text-base text-orange-100 font-medium mt-1.5 leading-relaxed">
                {offer.subtitle}
              </p>
              {offer.urgencyText && (
                <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 bg-amber-400/20 rounded-lg text-amber-200 text-xs font-bold border border-amber-300/30">
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                  {offer.urgencyText}
                </div>
              )}
            </div>

            {/* Price Card */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/25 text-right shrink-0">
              <div className="text-xs uppercase font-bold tracking-wider text-orange-200">Special Offer</div>
              <div className="flex items-baseline justify-end gap-2 mt-0.5">
                {offer.originalPrice && (
                  <span className="text-sm line-through text-white/60">
                    ₹{offer.originalPrice}
                  </span>
                )}
                <span className="text-3xl sm:text-4xl font-black text-white">
                  ₹{offer.offerPrice}
                </span>
              </div>
              <div className="text-[11px] text-white/80 font-medium mt-0.5">
                {offer.priceUnit || "per person"}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 divide-y divide-slate-100">
          {/* Poster Preview */}
          {offer.bannerImageUrl && (
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-900 group">
              <img
                src={offer.bannerImageUrl}
                alt={offer.title}
                className="w-full h-auto max-h-[450px] object-contain block mx-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-medium">
                <span className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  <Bus className="w-3.5 h-3.5 text-yellow-400" />
                  Luxury AC Travel Experience
                </span>
                <span className="hidden sm:inline bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  Shailraj Travels Official Promotion
                </span>
              </div>
            </div>
          )}

          {/* Route Section */}
          {offer.route && (
            <div className="pt-6">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-600 mb-2">
                <Compass className="w-4 h-4" />
                Trip Route
              </div>
              <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200/60 text-slate-800 font-bold text-sm sm:text-base flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600 shrink-0" />
                <span>{offer.route}</span>
              </div>
            </div>
          )}

          {/* Schedule / Itinerary Timeline */}
          {offer.schedule && offer.schedule.length > 0 && (
            <div className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
                  <Clock className="w-4 h-4 text-orange-600" />
                  Detailed Trip Schedule
                </div>
                <span className="text-xs text-slate-400 font-medium">Pune ➔ Mumbai ➔ Pune</span>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-orange-500 before:via-amber-400 before:to-slate-200">
                {offer.schedule.map((item, idx) => (
                  <div key={idx} className="relative group">
                    {/* Timeline Node */}
                    <div className="absolute -left-[29px] top-1 w-5 h-5 rounded-full bg-white border-4 border-orange-500 shadow-sm transition-transform group-hover:scale-125" />
                    <div className="bg-slate-50 hover:bg-orange-50/40 p-4 rounded-2xl border border-slate-200/70 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-orange-600 bg-orange-100/60 px-2.5 py-0.5 rounded-full w-fit">
                          {item.time}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">Step {idx + 1}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-800 mt-1">{item.title}</h4>
                      {item.description && (
                        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Highlights & Amenities */}
          {offer.highlights && offer.highlights.length > 0 && (
            <div className="pt-6">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 mb-3">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Vehicle Features & Tour Amenities
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {offer.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs font-bold text-slate-700 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pickup Points */}
          {offer.pickupPoints && offer.pickupPoints.length > 0 && (
            <div className="pt-6">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 mb-3">
                <MapPin className="w-4 h-4 text-orange-600" />
                Pickup Locations Across Pune
              </div>
              <div className="flex flex-wrap gap-2">
                {offer.pickupPoints.map((pt, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-orange-50 hover:text-orange-700 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    {pt}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Inclusions & Exclusions */}
          <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {offer.inclusions && offer.inclusions.length > 0 && (
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/60">
                <h5 className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  What's Included
                </h5>
                <ul className="space-y-2 text-xs font-semibold text-emerald-950">
                  {offer.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold mt-0.5">•</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {offer.exclusions && offer.exclusions.length > 0 && (
              <div className="p-4 bg-rose-50/40 rounded-2xl border border-rose-200/50">
                <h5 className="text-xs font-black uppercase tracking-wider text-rose-800 flex items-center gap-1.5 mb-3">
                  <XCircle className="w-4 h-4 text-rose-500" />
                  Exclusions
                </h5>
                <ul className="space-y-2 text-xs font-semibold text-rose-950">
                  {offer.exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold mt-0.5">•</span>
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Terms Note */}
          {offer.terms && (
            <div className="pt-4 text-slate-500 text-xs leading-relaxed italic">
              <strong>Note:</strong> {offer.terms}
            </div>
          )}
        </div>

        {/* Bottom Booking Action Bar */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 text-slate-600 text-xs w-full sm:w-auto">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-slate-800">100% Guaranteed Seat Reservation</div>
              <div>Instant Confirmation on WhatsApp & Call</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href="tel:+919764413556"
              className="p-3 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 rounded-xl transition-all font-bold text-xs flex items-center justify-center gap-2 shadow-sm shrink-0"
              title="Call Us Now"
            >
              <Phone className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Call +91 97644 13556</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{offer.ctaText || "Book Your Seat Now"}</span>
            </a>

            {onBookOnline && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBookOnline();
                }}
                className="px-4 py-3 bg-brand-blue-deep hover:bg-blue-900 text-white rounded-xl font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                Online Form
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modalContent, document.body);
}
