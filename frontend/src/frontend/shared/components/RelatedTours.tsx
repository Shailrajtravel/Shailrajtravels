import React, { useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { RelatedItem } from '@/frontend/shared/types/tour';
import { LazyImage } from '@/frontend/shared/ui/lazy-image';
import { seedTours } from '@/backend/shared/seed-data';
import { MapPin, ArrowRight } from 'lucide-react';

export interface RelatedToursProps {
  tours?: (string | RelatedItem)[];
  currentTourSlug?: string;
}

export function RelatedTours({ tours, currentTourSlug }: RelatedToursProps) {
  const resolvedTours = useMemo(() => {
    const list: Array<{
      slug: string;
      title: string;
      image: string;
      price?: string;
    }> = [];
    const seenSlugs = new Set<string>();

    if (currentTourSlug) {
      seenSlugs.add(currentTourSlug.toLowerCase().trim());
    }

    if (Array.isArray(tours) && tours.length > 0) {
      for (const item of tours) {
        if (!item) continue;
        if (typeof item === 'string') {
          const slug = item.trim();
          if (!slug || slug === 'undefined' || slug === 'null' || seenSlugs.has(slug.toLowerCase())) {
            continue;
          }
          const match = seedTours.find(
            (t: any) => t.slug && t.slug.toLowerCase() === slug.toLowerCase()
          );
          if (match) {
            seenSlugs.add(slug.toLowerCase());
            list.push({
              slug: match.slug,
              title: match.title,
              image: match.heroContent?.image || match.image || '',
              price: match.packages?.[0]?.price || '',
            });
          }
        } else if (typeof item === 'object' && item.slug && item.slug !== 'undefined' && item.slug !== 'null') {
          const slug = item.slug.trim();
          if (seenSlugs.has(slug.toLowerCase())) continue;
          seenSlugs.add(slug.toLowerCase());
          const match = seedTours.find(
            (t: any) => t.slug && t.slug.toLowerCase() === slug.toLowerCase()
          );
          list.push({
            slug,
            title: item.title || match?.title || 'Pilgrimage Tour',
            image: item.image || match?.heroContent?.image || match?.image || '',
            price: match?.packages?.[0]?.price || '',
          });
        }
      }
    }

    return list;
  }, [tours, currentTourSlug]);

  if (!resolvedTours || resolvedTours.length === 0) return null;

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <div className="flex items-center space-x-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-brand-blue-deep shrink-0">
          <MapPin className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-brand-blue-deep leading-tight">
            Related Pilgrimage Tours
          </h3>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">
            Popular devotional packages and yatra circuits from Pune
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {resolvedTours.map((tour) => (
          <Link
            key={tour.slug}
            to="/tours/$tourSlug"
            params={{ tourSlug: tour.slug }}
            className="block group bg-white border border-gray-200 hover:border-brand-orange/40 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="w-full aspect-[16/10] bg-slate-900 flex items-center justify-center relative overflow-hidden">
              {tour.image ? (
                <LazyImage
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  autoOptimizeCloudinary={false}
                />
              ) : (
                <span className="text-brand-orange font-bold text-base">Shailraj Travels</span>
              )}
              {tour.price && (
                <span className="absolute bottom-2 right-2 bg-black/75 text-white text-xs font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
                  From ₹{tour.price}
                </span>
              )}
            </div>
            <div className="p-3.5">
              <h4 className="font-bold text-sm text-gray-900 group-hover:text-brand-orange transition-colors line-clamp-2 leading-snug">
                {tour.title}
              </h4>
              <p className="text-xs text-brand-orange font-semibold mt-2 inline-flex items-center group-hover:translate-x-0.5 transition-transform">
                View Tour Package
                <ArrowRight className="w-3 h-3 ml-1" />
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
