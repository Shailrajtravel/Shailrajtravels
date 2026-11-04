import { useState, useEffect, useRef, type ImgHTMLAttributes } from 'react';
import { Skeleton } from '@/frontend/shared/ui/skeleton';
import { cn } from '@/backend/shared/utils';

export function optimizeCloudinaryUrl(url?: string, maxWidth = 800): string | undefined {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  // If already transformed, don't duplicate
  if (url.includes('/upload/f_') || url.includes('/upload/w_') || url.includes('/upload/q_')) {
    return url;
  }
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${maxWidth},c_limit/`);
}

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
  skeletonClassName?: string;
  fallbackSrc?: string;
  autoOptimizeCloudinary?: boolean;
  optimizedWidth?: number;
}

export function LazyImage({
  src,
  alt,
  className,
  containerClassName,
  skeletonClassName,
  fallbackSrc = "/images/jyotirlinga.jpg",
  autoOptimizeCloudinary = true,
  optimizedWidth = 800,
  decoding = "async",
  loading = "lazy",
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setCurrentSrc(src);
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const resolvedSrc = autoOptimizeCloudinary && typeof currentSrc === 'string'
    ? optimizeCloudinaryUrl(currentSrc, optimizedWidth)
    : currentSrc;

  useEffect(() => {
    if (imgRef.current?.complete && (imgRef.current?.naturalWidth ?? 0) > 0) {
      setIsLoaded(true);
    }
  }, [resolvedSrc]);

  const handleImageError = () => {
    if (currentSrc !== fallbackSrc && fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
      setIsLoaded(true);
    }
  };

  return (
    <div className={cn("relative w-full h-full overflow-hidden bg-slate-100", containerClassName)}>
      {!isLoaded && !hasError && (
        <Skeleton
          className={cn("absolute inset-0 w-full h-full rounded-none bg-slate-200/70 dark:bg-slate-800/60 animate-pulse", skeletonClassName)}
        />
      )}
      <img
        ref={imgRef}
        src={resolvedSrc || fallbackSrc}
        alt={alt}
        decoding={decoding}
        loading={loading}
        className={cn(
          "w-full h-full transition-opacity duration-300 ease-in-out",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={() => setIsLoaded(true)}
        onError={handleImageError}
        {...props}
      />
    </div>
  );
}
