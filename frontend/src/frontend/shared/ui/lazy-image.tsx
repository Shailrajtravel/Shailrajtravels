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
  autoOptimizeCloudinary?: boolean;
  optimizedWidth?: number;
}

export function LazyImage({
  src,
  alt,
  className,
  containerClassName,
  skeletonClassName,
  autoOptimizeCloudinary = true,
  optimizedWidth = 800,
  decoding = "async",
  loading = "lazy",
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const resolvedSrc = autoOptimizeCloudinary && typeof src === 'string'
    ? optimizeCloudinaryUrl(src, optimizedWidth)
    : src;

  useEffect(() => {
    // If the image is cached, it might have loaded before React attaches the onLoad listener
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
      setError(false);
    }
  }, [resolvedSrc]);

  return (
    <div className={cn("relative w-full h-full overflow-hidden", containerClassName)}>
      {!isLoaded && !error && (
        <Skeleton
          className={cn("absolute inset-0 w-full h-full rounded-none bg-slate-200/70 dark:bg-slate-800/60 animate-pulse", skeletonClassName)}
        />
      )}
      <img
        ref={imgRef}
        src={resolvedSrc}
        alt={alt}
        decoding={decoding}
        loading={loading}
        className={cn(
          "w-full h-full transition-opacity duration-500 ease-in-out",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        {...props}
      />
    </div>
  );
}
