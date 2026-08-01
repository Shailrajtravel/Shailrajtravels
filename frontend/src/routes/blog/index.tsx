import React, { useMemo, useState } from 'react';
import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { generateSEO, generateHreflangLinks } from '@/backend/features/seo';
import { blogPosts, blogAuthors } from '@/frontend/shared/data/blogs';
import { Navbar } from '@/frontend/core/Navbar';
import { FooterSection as Footer } from '@/frontend/core/Footer';
import { translations } from '@/frontend/core/i18n';
import { Calendar, Clock, User, ChevronRight } from 'lucide-react';
import { generateBreadcrumbSchema } from '@/backend/shared/blog-schema';
import { getCustomBlogsFn } from '@/backend/features/custom-blogs';

export const Route = createFileRoute("/blog/")({
  loader: async () => {
    try {
      const customBlogs = await getCustomBlogsFn();
      return { customBlogs };
    } catch (e) {
      console.error("Failed to load custom blogs", e);
      return { customBlogs: [] };
    }
  },
  head: () => ({
    meta: generateSEO({
      title: "Spiritual Travel Blog & Pilgrimage Guides | Shailraj Travels",
      description:
        "Discover comprehensive guides on Ashtavinayak Yatra, Jyotirlinga Darshan, Chardham Yatra, and more. Read expert spiritual travel advice from Shailraj Travels.",
      canonicalUrl: "https://www.shailrajtravels.com/blog",
      type: "website",
    }),
    links: [
      { rel: "canonical", href: "https://www.shailrajtravels.com/blog" },
      ...generateHreflangLinks("https://www.shailrajtravels.com/blog"),
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          generateBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Blog", url: "/blog" },
          ]),
        ),
      },
    ],
  }),
  component: BlogIndexPage,
});

function BlogIndexPage() {
  const lang = "en";
  const t = translations[lang];
  const router = useRouter();

  const { customBlogs } = Route.useLoaderData() as any;

  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  const allPosts = useMemo(() => {
    const visibleCustomBlogs = (customBlogs || []).filter((b: any) => !b.isHidden);
    const combined = [...visibleCustomBlogs, ...blogPosts];
    return combined.sort((a, b) => {
      const timeA = new Date(a.publishedAt).getTime();
      const timeB = new Date(b.publishedAt).getTime();
      return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
    });
  }, [customBlogs, sortBy]);


  // Get categories and count
  const categories = useMemo<[string, number][]>(() => {
    const cats = allPosts.reduce(
      (acc, post: any) => {
        if (post && post.category) {
          acc[post.category] = (acc[post.category] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );
    return (Object.entries(cats) as [string, number][]).sort((a, b) => b[1] - a[1]);
  }, [allPosts]);

  // Render all blogs as horizontal list cards

  return (
    <div className="font-sans text-slate-800 bg-slate-50 min-h-screen selection:bg-brand-green/20 selection:text-brand-blue-deep flex flex-col">
      <Navbar t={t} />

      <main className="flex-1 pt-32 pb-20 px-4 md:px-8 max-w-[1500px] mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-16 animate-reveal">
          <span className="inline-block py-1 px-3 rounded-full bg-brand-green/10 text-brand-green-dark font-bold text-sm mb-4">
            Our Blog
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-blue-deep mb-6">
            Spiritual Travel Guides & Insights
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg mb-8">
            Comprehensive guides, itineraries, and spiritual knowledge to help you plan the perfect
            Darshan.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-3 justify-center mb-16">
          <Link
            to="/blog"
            className="px-5 py-2.5 rounded-full bg-brand-blue-deep text-white font-semibold text-sm transition-transform hover:scale-105 shadow-md"
          >
            All Articles
          </Link>
          {categories.map(([cat, count]) => (
            <Link
              key={cat}
              to={`/blog/category/$categorySlug`}
              params={{ categorySlug: cat.toLowerCase().replace(/\s+/g, "-") }}
              className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-600 font-medium text-sm transition-all hover:border-brand-blue hover:text-brand-blue shadow-sm hover:shadow-md"
            >
              {cat} <span className="text-slate-400 text-xs ml-1">({count})</span>
            </Link>
          ))}
        </div>

        {allPosts.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-3xl border border-slate-100 shadow-sm animate-reveal">
            <h3 className="text-xl font-bold text-slate-400">Articles are being published soon.</h3>
          </div>
        ) : (
          <>
            {/* Sort & Count Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 backdrop-blur-sm p-4 rounded-[20px] border border-slate-100 mb-10 shadow-sm animate-reveal">
              <div className="text-xs md:text-sm font-semibold text-slate-500 pl-2">
                Showing {allPosts.length} {allPosts.length === 1 ? 'article' : 'articles'}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs md:text-sm font-bold text-slate-500">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                    className="appearance-none bg-white border border-slate-200 text-brand-blue-deep font-bold rounded-xl pl-4 pr-10 py-2.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all cursor-pointer shadow-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Post List - Horizontal compact cards (width up to 1500px, height 150px) */}
            <div className="flex flex-col gap-6 max-w-[1500px] mx-auto">
              {allPosts.map((post, idx) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-row h-[150px] group animate-reveal"
                  style={{ animationDelay: (idx % 4) * 100 + "ms" }}
                >
                  <Link
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="flex flex-row w-full h-full"
                  >
                    {/* Left: Image */}
                    <div className="w-[150px] sm:w-[220px] h-full relative overflow-hidden bg-slate-100 shrink-0">
                      {post.featuredImage ? (
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading={idx === 0 ? "eager" : "lazy"}
                        />
                      ) : (
                        <div className="w-full h-full bg-brand-blue/10 flex items-center justify-center">
                          <span className="text-brand-blue/30 font-bold text-xs">
                            Shailraj Travels
                          </span>
                        </div>
                      )}
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2 py-0.5 bg-white/95 backdrop-blur-sm text-brand-blue-deep text-[10px] font-bold rounded-full shadow-sm">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Right: Content */}
                    <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                      <div className="space-y-1">
                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-brand-blue-deep group-hover:text-brand-blue transition-colors line-clamp-1">
                          {post.title}
                        </h3>
                        <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                          {post.excerpt || (post.content ? post.content.replace(/<[^>]+>/g, '').substring(0, 150) + '...' : '')}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-500 border-t border-slate-100/60 pt-2.5 shrink-0">
                        <div className="flex items-center gap-3 sm:gap-6">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-brand-green" />
                            <span className="font-semibold text-slate-700">
                              {post.authorName || blogAuthors[post.authorId]?.name || "Editorial Team"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-brand-green" />
                            <span>
                              {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="hidden sm:flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-brand-green" />
                            <span>{post.readingTimeMinutes} min read</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 font-bold text-brand-blue">
                          Read More <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer t={t} lang={lang} />
    </div>
  );
}
