import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2, Sparkles, Tag } from 'lucide-react';

export interface GalleryPhotoItem {
  _id?: string;
  imageUrl: string;
  title?: string;
  category?: string;
  aspect?: 'portrait' | 'landscape' | string;
  createdAt?: string;
}

interface GalleryLightboxProps {
  photos: GalleryPhotoItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

export function GalleryLightbox({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onSelectIndex,
}: GalleryLightboxProps) {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragCurrentX, setDragCurrentX] = useState(0);

  const total = photos.length;
  const currentPhoto = photos[currentIndex];

  const handlePrev = useCallback(() => {
    if (total === 0) return;
    onSelectIndex((currentIndex - 1 + total) % total);
  }, [currentIndex, total, onSelectIndex]);

  const handleNext = useCallback(() => {
    if (total === 0) return;
    onSelectIndex((currentIndex + 1) % total);
  }, [currentIndex, total, onSelectIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, handlePrev, handleNext, onClose]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      // Swiped Left -> Show Next
      handleNext();
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Show Prev
      handlePrev();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Mouse Drag Handlers for Desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragCurrentX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setDragCurrentX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    const diff = dragStartX - dragCurrentX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setIsDragging(false);
  };

  if (!isOpen || !currentPhoto) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery lightbox"
      className="fixed inset-0 z-[100] bg-black/92 backdrop-blur-xl flex flex-col justify-between select-none animate-in fade-in duration-200"
    >
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between px-4 sm:px-8 py-4 z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-mono font-bold tracking-wider backdrop-blur-md border border-white/10">
            {currentIndex + 1} / {total}
          </span>
          {currentPhoto.category && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green/20 text-brand-green text-xs font-semibold backdrop-blur-md border border-brand-green/20">
              <Tag className="w-3 h-3" />
              {currentPhoto.category}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="hidden md:block text-white/90 text-sm font-medium truncate max-w-md text-center px-4">
          {currentPhoto.title || `Photo ${currentIndex + 1}`}
        </h3>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            aria-label="Close Lightbox"
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-white/10"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Viewport Stage */}
      <div
        className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Previous Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          aria-label="Previous Image"
          className="absolute left-3 sm:left-6 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-white/15 backdrop-blur-md shadow-2xl group"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Active Image Card */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-full max-h-full flex flex-col items-center justify-center"
        >
          <img
            key={currentPhoto.imageUrl}
            src={currentPhoto.imageUrl}
            alt={currentPhoto.title || "Gallery image"}
            className="max-h-[72vh] sm:max-h-[76vh] max-w-[92vw] sm:max-w-[85vw] object-contain rounded-2xl shadow-2xl transition-all duration-300 pointer-events-none"
            draggable={false}
          />
          {currentPhoto.title && (
            <p className="mt-3 text-center text-xs sm:text-sm text-white/80 font-medium px-4 max-w-xl truncate">
              {currentPhoto.title}
            </p>
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          aria-label="Next Image"
          className="absolute right-3 sm:right-6 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-white/15 backdrop-blur-md shadow-2xl group"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Bottom Filmstrip Thumbnails */}
      <div className="w-full px-4 sm:px-8 py-3 bg-gradient-to-t from-black/90 to-transparent z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto py-2 custom-scrollbar">
          {photos.map((photo, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={photo._id || idx}
                onClick={() => onSelectIndex(idx)}
                className={`relative shrink-0 rounded-lg sm:rounded-xl overflow-hidden transition-all duration-200 border-2 ${
                  isSelected
                    ? 'border-brand-green scale-110 ring-2 ring-brand-green/40 opacity-100'
                    : 'border-white/10 opacity-50 hover:opacity-85 hover:border-white/40'
                } ${
                  photo.aspect === 'landscape'
                    ? 'w-16 sm:w-20 aspect-[16/9]'
                    : 'w-10 sm:w-12 aspect-[3/4]'
                }`}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title || `Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
