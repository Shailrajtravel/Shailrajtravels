import React from 'react';
import { Link } from '@tanstack/react-router';
import { MapPin, Calendar, Repeat, Route, Info } from 'lucide-react';
import { LazyImage } from '@/frontend/shared/ui/lazy-image';

export interface TourData {
  id: string;
  slug?: string;
  image: string;
  images?: string[];
  durationBadge: string;
  subtitle: string;
  title: string;
  location: string;
  schedule: string;
  frequency: string;
  route: string[];
  tags: string[];
  seatsAvailable?: number;
  seatsTotal?: number;
  price: string;
  itinerary: { day: string; title: string }[];
  includes: string[];
  dates?: string[];
}

interface TourCardProps {
  tour: TourData;
  onOpenDetails: (tour: TourData) => void;
  onBookSeat?: (tour: TourData) => void;
  t: any;
}

export function TourCard({ tour, onOpenDetails, onBookSeat, t }: TourCardProps) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col max-w-[400px] w-full mx-auto h-full group">
      {/* Poster Image Header: exactly matches 2152x731 poster ratio */}
      {tour.slug ? (
        <Link
          to="/tours/$tourSlug"
          params={{ tourSlug: tour.slug }}
          className="relative w-full aspect-[2152/731] overflow-hidden block bg-slate-950 group/header cursor-pointer"
        >
          <LazyImage
            src={tour.image}
            alt={tour.title}
            width={400}
            height={136}
            optimizedWidth={1200}
            autoOptimizeCloudinary={false}
            className="w-full h-full object-cover group-hover/header:scale-105 transition-transform duration-500 ease-out"
          />
          {/* Duration Badge */}
          {tour.durationBadge && (
            <div className="absolute top-2.5 right-2.5 bg-[#F59E0B] text-[#112233] font-bold text-xs px-2.5 py-1 rounded-full shadow-md z-10">
              {tour.durationBadge}
            </div>
          )}
        </Link>
      ) : (
        <div
          onClick={() => onOpenDetails(tour)}
          className="relative w-full aspect-[2152/731] overflow-hidden bg-slate-950 cursor-pointer group/header"
        >
          <LazyImage
            src={tour.image}
            alt={tour.title}
            width={400}
            height={136}
            optimizedWidth={1200}
            autoOptimizeCloudinary={false}
            className="w-full h-full object-cover group-hover/header:scale-105 transition-transform duration-500 ease-out"
          />
          {/* Duration Badge */}
          {tour.durationBadge && (
            <div className="absolute top-2.5 right-2.5 bg-[#F59E0B] text-[#112233] font-bold text-xs px-2.5 py-1 rounded-full shadow-md z-10">
              {tour.durationBadge}
            </div>
          )}
        </div>
      )}

      {/* Info Section */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title & Subtitle */}
        <div className="mb-3">
          {tour.subtitle && (
            <p className="text-[#F59E0B] font-semibold text-xs uppercase tracking-wider mb-1 line-clamp-1">
              {tour.subtitle}
            </p>
          )}
          {tour.slug ? (
            <Link
              to="/tours/$tourSlug"
              params={{ tourSlug: tour.slug }}
              className="block group-hover:text-[#F59E0B] transition-colors"
            >
              <h3 className="text-[#112233] font-bold text-xl leading-snug group-hover:text-[#F59E0B] transition-colors line-clamp-2">
                {tour.title}
              </h3>
            </Link>
          ) : (
            <h3 className="text-[#112233] font-bold text-xl leading-snug line-clamp-2">
              {tour.title}
            </h3>
          )}
        </div>

        {/* Location & Schedule */}
        <div className="flex items-center gap-4 mb-3.5 flex-wrap">
          {tour.location && (
            <div className="flex items-center gap-1.5 text-slate-600">
              <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="text-[14px] font-medium line-clamp-1">{tour.location}</span>
            </div>
          )}
          {tour.schedule && (
            <div className="flex items-center gap-1.5 text-slate-600">
              <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="text-[14px] font-medium">{tour.schedule}</span>
            </div>
          )}
        </div>

        {/* Frequency Badge */}
        {tour.frequency && (
          <div className="bg-amber-50 text-amber-900 border border-amber-100 rounded-full px-3.5 py-1.5 flex items-center gap-2 w-fit mb-3.5">
            <Repeat className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[13px] font-semibold">{tour.frequency}</span>
          </div>
        )}

        {/* Route Box */}
        {tour.route && tour.route.length > 0 && (
          <div className="bg-[#F8FAFC] rounded-2xl p-3.5 mb-3.5">
            <div className="flex items-center gap-2 mb-1.5 text-[#112233] font-semibold">
              <Route className="w-4 h-4" />
              <span className="text-[13px]">{t?.cardRoute || "Route"}</span>
            </div>
            <div className="flex flex-wrap items-center text-[13px] text-[#112233] font-medium leading-relaxed gap-x-1.5">
              {tour.route.map((stop, index) => (
                <React.Fragment key={index}>
                  <span>{stop}</span>
                  {index < tour.route.length - 1 && (
                    <span className="text-amber-500 text-[12px] opacity-70">›</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {tour.tags && tour.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tour.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-slate-100 text-slate-700 text-[12px] font-semibold px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="w-full h-px bg-slate-100 mb-4 mt-auto" />

        {/* Footer: Price & Buttons */}
        <div className="flex justify-between items-end gap-2">
          <div>
            <p className="text-[12px] font-medium text-slate-500 mb-0.5">
              {t?.cardPerPerson || "Per person"}
            </p>
            <p className="text-[#112233] font-bold text-2xl tracking-tight">{tour.price}</p>
          </div>
          <div className="flex gap-2">
            {tour.slug ? (
              <Link
                suppressHydrationWarning
                to="/tours/$tourSlug"
                params={{ tourSlug: tour.slug }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-[#112233] font-semibold text-[13px] hover:bg-slate-50 transition-colors"
              >
                <Info className="w-4 h-4" /> {t?.cardDetails || "Details"}
              </Link>
            ) : (
              <button
                suppressHydrationWarning
                onClick={() => onOpenDetails(tour)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-[#112233] font-semibold text-[13px] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Info className="w-4 h-4" /> {t?.cardDetails || "Details"}
              </button>
            )}
            {onBookSeat ? (
              <button
                suppressHydrationWarning
                onClick={() => onBookSeat(tour)}
                className="flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#E5910A] text-[#112233] font-bold text-[13px] transition-colors cursor-pointer"
              >
                {t?.cardBookSeat || "Book Seat"}
              </button>
            ) : tour.slug ? (
              <Link
                suppressHydrationWarning
                to="/tours/$tourSlug"
                params={{ tourSlug: tour.slug }}
                hash="sidebar-booking-form"
                className="flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#E5910A] text-[#112233] font-bold text-[13px] transition-colors"
              >
                {t?.cardBookSeat || "Book Seat"}
              </Link>
            ) : (
              <a
                suppressHydrationWarning
                href="#sidebar-booking-form"
                className="flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#E5910A] text-[#112233] font-bold text-[13px] transition-colors"
              >
                {t?.cardBookSeat || "Book Seat"}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
