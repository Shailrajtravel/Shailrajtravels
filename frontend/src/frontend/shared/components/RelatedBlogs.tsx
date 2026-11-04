import React, { useMemo } from 'react';
import { RelatedItem } from '@/frontend/shared/types/tour';
import { LazyImage } from '@/frontend/shared/ui/lazy-image';
import { blogPosts } from '@/frontend/shared/data/blogs';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';

export interface RelatedBlogsProps {
  blogs?: (string | RelatedItem)[];
  tourSlug?: string;
  tourTitle?: string;
}

const DEFAULT_BLOG_THUMBNAIL = 'https://res.cloudinary.com/dquecn5qj/image/upload/v1789154040/blogs/spy42xnlvgry5xoznqzn.png';

function sanitizeBlogImage(url?: string): string {
  if (!url) return DEFAULT_BLOG_THUMBNAIL;
  if (url.includes('photo-1698223126743-3b10b78df025')) {
    return 'https://res.cloudinary.com/dquecn5qj/image/upload/v1789154040/blogs/spy42xnlvgry5xoznqzn.png';
  }
  if (url.includes('photo-1567591414240-e2b2f6b8a8b8')) {
    return 'https://res.cloudinary.com/dquecn5qj/image/upload/v1792764848/blogs/avej2lsveggdqan1spor.png';
  }
  return url;
}

export function RelatedBlogs({ blogs, tourSlug, tourTitle }: RelatedBlogsProps) {
  const resolvedBlogs = useMemo(() => {
    const list: Array<{
      slug: string;
      title: string;
      image: string;
      excerpt?: string;
      category?: string;
      readingTimeMinutes?: number;
    }> = [];
    const seenSlugs = new Set<string>();

    const addBlog = (
      slug?: string,
      title?: string,
      image?: string,
      excerpt?: string,
      category?: string,
      readingTimeMinutes?: number
    ) => {
      const cleanSlug = (slug || '').trim().toLowerCase();
      if (!cleanSlug || cleanSlug === 'undefined' || cleanSlug === 'null' || seenSlugs.has(cleanSlug)) {
        return;
      }
      seenSlugs.add(cleanSlug);
      list.push({
        slug: slug!.trim(),
        title: title || 'Helpful Travel Guide',
        image: sanitizeBlogImage(image),
        excerpt,
        category: category || 'Travel Guide',
        readingTimeMinutes,
      });
    };

    // 1. Process explicit blogs passed via props
    if (Array.isArray(blogs) && blogs.length > 0) {
      for (const item of blogs) {
        if (!item) continue;
        if (typeof item === 'string') {
          const itemSlug = item.trim();
          if (!itemSlug || itemSlug === 'undefined' || itemSlug === 'null') continue;
          const match = blogPosts.find(
            (b) => b.slug.toLowerCase() === itemSlug.toLowerCase()
          );
          if (match) {
            addBlog(
              match.slug,
              match.title,
              match.featuredImage || match.ogImage,
              match.excerpt,
              match.category,
              match.readingTimeMinutes
            );
          }
        } else if (typeof item === 'object') {
          const candidateSlug =
            item.slug ||
            (item as any).blogSlug ||
            ((item as any).url && (item as any).url.replace(/^\/blog\//, '')) ||
            ((item as any).link && (item as any).link.replace(/^\/blog\//, ''));

          if (candidateSlug && candidateSlug !== 'undefined' && candidateSlug !== 'null') {
            const match = blogPosts.find(
              (b) => b.slug.toLowerCase() === candidateSlug.toLowerCase()
            );
            addBlog(
              candidateSlug,
              item.title || match?.title,
              item.image || match?.featuredImage || match?.ogImage,
              item.description || match?.excerpt,
              match?.category,
              match?.readingTimeMinutes
            );
          }
        }
      }
    }

    // 2. Dynamic auto-discovery: if tourSlug is provided, find any blogs in blogPosts that target this tourSlug
    if (tourSlug) {
      const cleanTourSlug = tourSlug.toLowerCase().trim();
      const matchingPosts = blogPosts.filter((post) => {
        if (!post || !post.slug) return false;
        // Check if relatedTourSlugs contains the tourSlug
        const hasTourSlug = post.relatedTourSlugs?.some(
          (s) =>
            s.toLowerCase() === cleanTourSlug ||
            cleanTourSlug.includes(s.toLowerCase()) ||
            s.toLowerCase().includes(cleanTourSlug)
        );
        return Boolean(hasTourSlug);
      });

      for (const post of matchingPosts) {
        // Special relevance safeguard: for ujjain tours, ensure only ujjain-related blogs match
        if (cleanTourSlug.includes('ujjain')) {
          const isUjjainRelated =
            post.slug.toLowerCase().includes('ujjain') ||
            post.tags?.some((t) => t.toLowerCase().includes('ujjain')) ||
            post.title.toLowerCase().includes('ujjain');
          if (!isUjjainRelated) continue;
        }

        addBlog(
          post.slug,
          post.title,
          post.featuredImage || post.ogImage,
          post.excerpt,
          post.category,
          post.readingTimeMinutes
        );
      }
    }

    // 3. Fallback for Ujjain tour pages: if it is an Ujjain tour and no blogs matched yet, auto-populate Ujjain guides
    const isUjjainTour =
      (tourSlug && tourSlug.toLowerCase().includes('ujjain')) ||
      (tourTitle && tourTitle.toLowerCase().includes('ujjain'));

    if (list.length === 0 && isUjjainTour) {
      const ujjainPosts = blogPosts.filter(
        (b) => b.slug.toLowerCase().includes('ujjain') || b.title.toLowerCase().includes('ujjain')
      );
      for (const post of ujjainPosts) {
        addBlog(
          post.slug,
          post.title,
          post.featuredImage || post.ogImage,
          post.excerpt,
          post.category,
          post.readingTimeMinutes
        );
      }
    }

    return list;
  }, [blogs, tourSlug, tourTitle]);

  // If no related blogs exist for this tour, DO NOT render this section at all
  if (!resolvedBlogs || resolvedBlogs.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <div className="flex items-center space-x-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-brand-orange shrink-0">
          <BookOpen className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-brand-blue-deep leading-tight">
            Helpful Guides & Travel Tips
          </h3>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">
            Verified local routes, temple darshan rules, and travel tips
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resolvedBlogs.map((blog) => (
          <a
            key={blog.slug}
            href={`/blog/${blog.slug}`}
            className="group flex flex-col sm:flex-row bg-white border border-gray-200 hover:border-brand-orange/40 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="sm:w-36 h-36 sm:h-auto shrink-0 relative overflow-hidden bg-gray-100">
              <LazyImage
                src={blog.image}
                fallbackSrc="/images/jyotirlinga.jpg"
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {blog.category && (
                <span className="absolute top-2 left-2 bg-brand-blue-deep/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-xs">
                  {blog.category}
                </span>
              )}
            </div>
            <div className="p-3.5 flex flex-col justify-between flex-1 min-w-0">
              <div>
                <h4 className="font-bold text-gray-900 group-hover:text-brand-orange transition-colors text-sm line-clamp-2 leading-snug">
                  {blog.title}
                </h4>
                {blog.excerpt && (
                  <p className="text-xs text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {blog.excerpt}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-gray-100 text-xs">
                {blog.readingTimeMinutes ? (
                  <span className="flex items-center text-gray-500 font-medium">
                    <Clock className="w-3 h-3 mr-1 text-gray-400" />
                    {blog.readingTimeMinutes} min read
                  </span>
                ) : (
                  <span />
                )}
                <span className="inline-flex items-center text-brand-orange font-semibold group-hover:translate-x-0.5 transition-transform">
                  Read Article
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
