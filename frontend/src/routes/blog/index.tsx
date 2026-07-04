import React, { useMemo, useState } from 'react';
import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { generateSEO, generateHreflangLinks } from '@/backend/features/seo';
import { blogPosts, blogAuthors } from '@/frontend/shared/data/blogs';
import { Navbar } from '@/frontend/core/Navbar';
import { FooterSection as Footer } from '@/frontend/core/Footer';
import { translations } from '@/frontend/core/i18n';
import { Calendar, Clock, User, ChevronRight, PenTool, X } from 'lucide-react';
import { generateBreadcrumbSchema } from '@/backend/shared/blog-schema';
import { getCustomBlogsFn, createCustomBlogFn } from '@/backend/features/custom-blogs';

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

  // Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("Yatri");
  const [category, setCategory] = useState("Travel Guides");
  const [content, setContent] = useState("");
  const [thumbnailBase64, setThumbnailBase64] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image file size must be less than 5MB.");
        e.target.value = ""; // reset
        return;
      }
      setError("");
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !authorName.trim() || !thumbnailBase64) {
      setError("All fields are required, including the thumbnail image.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const res = await createCustomBlogFn({
        data: {
          title,
          content,
          authorName,
          category,
          thumbnailBase64,
        },
      });
      if (res.success) {
        setIsModalOpen(false);
        setTitle("");
        setContent("");
        setAuthorName("Yatri");
        setThumbnailBase64("");
        router.invalidate();
      }
    } catch (err: any) {
      setError(err.message || "Failed to publish blog post.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-green hover:bg-brand-green-dark text-[#0a192f] font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline-none cursor-pointer text-sm"
          >
            <PenTool className="w-4 h-4" /> Share Your Story / Write Blog
          </button>
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

      {/* Write Blog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-[650px] shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] animate-reveal overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-brand-green" />
                <h3 className="text-xl font-bold text-brand-blue-deep">Write a Travel Story / Blog</h3>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setError("");
                }}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Blog Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My spiritual experience at Mahakaleshwar Ujjain"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue transition-colors text-slate-800 text-sm md:text-base font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Author Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name (e.g. Rajesh Patil)"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue transition-colors text-slate-800 text-sm font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue bg-white transition-colors text-slate-800 text-sm font-medium"
                  >
                    <option value="Travel Guides">Travel Guides</option>
                    <option value="Temple Guides">Temple Guides</option>
                    <option value="Pilgrimage Planning">Pilgrimage Planning</option>
                    <option value="Spiritual Tourism">Spiritual Tourism</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Thumbnail Image (Max 5MB)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleFileChange}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-blue-deep/10 file:text-brand-blue-deep hover:file:bg-brand-blue-deep/20 cursor-pointer"
                  />
                  {thumbnailBase64 && (
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                      <img src={thumbnailBase64} alt="Thumbnail preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Story Content
                </label>
                <textarea
                  required
                  rows={8}
                  placeholder="Share your spiritual trip details, tips, and journey story here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue transition-colors text-slate-800 text-sm md:text-base leading-relaxed font-normal custom-scrollbar"
                ></textarea>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setError("");
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 text-sm font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-brand-blue-deep hover:bg-brand-blue text-white text-sm font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Publishing...
                    </>
                  ) : (
                    "Publish Story"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer t={t} lang={lang} />
    </div>
  );
}
