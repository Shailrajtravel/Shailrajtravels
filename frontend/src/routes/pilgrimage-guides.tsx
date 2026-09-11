// @ts-nocheck
import React, { useMemo } from 'react';
import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router';
import { generateSEO } from '@/backend/features/seo';
import { blogPosts } from '@/frontend/shared/data/blogs';
import { getCustomBlogsFn } from '@/backend/features/custom-blogs';
import { useLanguage } from '@/routes/__root';
import { translations } from '@/frontend/core/i18n';
import { Navbar } from '@/frontend/core/Navbar';
import { FooterSection as Footer } from '@/frontend/core/Footer';
import { SchemaMarkup } from '@/frontend/shared/components/SchemaMarkup';
import {
  BookOpen,
  MapPin,
  Sparkles,
  ArrowRight,
  Compass,
  Calendar,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const Route = createFileRoute("/pilgrimage-guides")({
  loader: async () => {
    try {
      const customBlogs = await getCustomBlogsFn();
      return { customBlogs: customBlogs || [] };
    } catch (e) {
      console.error("Failed to load custom blogs in pilgrimage guides", e);
      return { customBlogs: [] };
    }
  },
  head: () => ({
    meta: generateSEO({
      title: "Shailraj Travels Knowledge Hub | Pilgrimage Guides & Route Maps",
      description:
        "Comprehensive pilgrimage guides, temple darshan advice, route itineraries, and travel planning from Pune. Covering Ujjain, Ashtavinayak, Jyotirlingas, and Char Dham.",
      canonicalUrl: "https://www.shailrajtravels.com/pilgrimage-guides",
    }),
    links: [{ rel: "canonical", href: "https://www.shailrajtravels.com/pilgrimage-guides" }],
  }),
  component: PilgrimageKnowledgeHubPage,
});

function PilgrimageKnowledgeHubPage() {
  const { customBlogs = [] } = useLoaderData({ from: "/pilgrimage-guides" }) as any;
  const { lang } = useLanguage();
  const t = translations[lang];

  // Merge static blogs and dynamic custom blogs safely with database precedence
  const allPosts = useMemo(() => {
    const visibleCustom = (customBlogs || []).filter((b: any) => !b.isHidden);
    const customSlugs = new Set(visibleCustom.map((b: any) => b.slug));
    const combined: any[] = visibleCustom.map((cb: any) => ({
      slug: cb.slug,
      title: cb.title,
      excerpt: cb.excerpt || cb.summary || "",
      featuredImage: cb.featuredImage || cb.thumbnailUrl || cb.coverImage || "",
      category: cb.category || "Travel Guides",
      readingTimeMinutes: cb.readingTimeMinutes || 6,
      publishDate: cb.publishedAt || cb.publishDate || new Date().toISOString(),
    }));

    for (const sp of blogPosts) {
      if (!customSlugs.has(sp.slug)) {
        combined.push(sp);
      }
    }
    return combined;
  }, [customBlogs]);

  // Group blogs by category/cluster
  const clusters = useMemo(() => {
    const groups: Record<string, any[]> = {
      "Temple Guides": allPosts.filter((p) => p.category === "Temple Guides"),
      "Travel Guides": allPosts.filter((p) => p.category === "Travel Guides" || p.category === "Itinerary"),
      "Spiritual Tourism": allPosts.filter((p) => p.category === "Spiritual Tourism"),
      "Pilgrimage Planning": allPosts.filter((p) => p.category === "Pilgrimage Planning"),
    };
    return groups;
  }, [allPosts]);

  const commercialLinks = [
    { label: "Travel Agency in Pune", href: "/travel-agency-in-pune" },
    { label: "Tour Operator in Pune", href: "/tour-operator-in-pune" },
    { label: "Tour Packages from Pune", href: "/tour-packages-from-pune" },
    { label: "Pilgrimage Tours from Pune", href: "/pilgrimage-tours-from-pune" },
    { label: "Family Tours from Pune", href: "/family-tours-from-pune" },
    { label: "Group Tours from Pune", href: "/group-tours-from-pune" },
    { label: "Maharashtra Tour Packages", href: "/maharashtra-tour-packages" },
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.shailrajtravels.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Knowledge Hub",
        item: "https://www.shailrajtravels.com/pilgrimage-guides",
      },
    ],
  };

  return (
    <div className="font-sans text-slate-800 bg-slate-50 selection:bg-brand-green/20 selection:text-brand-blue-deep min-h-screen flex flex-col">
      <Navbar t={t} />
      <SchemaMarkup schema={breadcrumbSchema} />

      <main className="flex-1 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Breadcrumb Navigation */}
          <div className="py-2 text-xs md:text-sm text-slate-500 flex items-center gap-2">
            <Link to="/" className="hover:text-brand-green-dark transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Knowledge Hub</span>
          </div>

          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 text-brand-green-dark border border-brand-green/20 mb-3 text-xs md:text-sm font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Authentic Guidance • Verified Highway Routes</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-blue-deep mb-4">
              Shailraj Travels Knowledge Hub
            </h1>
            <p className="text-base md:text-lg text-slate-600">
              Detailed destination guides, temple darshan advice, route itineraries, and expert travel tips for journeys across Maharashtra and India.
            </p>
          </div>

          {/* Commercial Interlinking Header Bar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Explore Our Core Pune Travel Services & Packages:
            </div>
            <div className="flex flex-wrap gap-2.5">
              {commercialLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href as any}
                  className="px-3.5 py-1.5 rounded-xl bg-brand-mist hover:bg-brand-green/10 text-brand-blue-deep text-xs md:text-sm font-semibold border border-brand-green/30 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Spotlight: Pune to Ujjain Guide */}
          <div className="bg-gradient-to-br from-brand-blue-deep via-[#0d2a4d] to-brand-blue-deep rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="max-w-2xl relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider bg-brand-green text-white px-3 py-1 rounded-full">
                Featured Guide
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-4 mb-3">
                Pune to Ujjain Mahakal & Omkareshwar Tour Guide & Complete Itinerary
              </h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
                Everything you need to know about traveling from Pune to Ujjain: Bhasma Aarti protocols, ₹250 Sheegra Darshan rules, Narmada boat parikrama, Sendhwa Ghat driving tips, and pure veg food halts.
              </p>
              <Link
                to="/blog/pune-to-ujjain-tour-guide-mahakal-darshan-itinerary"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-green hover:bg-brand-green-dark text-white font-bold text-sm transition-colors shadow-lg"
              >
                Read Full Ujjain Guide <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Category Anchors */}
          <div className="flex flex-wrap gap-3">
            {Object.keys(clusters).map((key) => (
              <a
                key={key}
                href={`#${key.replace(/\s+/g, "-").toLowerCase()}`}
                className="px-4 py-2 bg-white text-brand-blue-deep rounded-xl text-sm font-bold border border-slate-200 hover:border-brand-green shadow-sm transition-colors"
              >
                {key} ({clusters[key].length})
              </a>
            ))}
          </div>

          {/* Guide Sections */}
          <div className="space-y-16">
            {Object.entries(clusters).map(([category, posts]) => {
              if (!posts || posts.length === 0) return null;
              return (
                <div
                  key={category}
                  id={category.replace(/\s+/g, "-").toLowerCase()}
                  className="scroll-mt-32"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <BookOpen className="w-6 h-6 text-brand-orange" />
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{category}</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                      <Link
                        key={post.slug}
                        to={`/blog/${post.slug}`}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all group flex flex-col h-full"
                      >
                        <div className="h-48 overflow-hidden bg-slate-100 relative">
                          {post.featuredImage ? (
                            <img
                              src={post.featuredImage}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                              <MapPin className="w-8 h-8 opacity-20" />
                            </div>
                          )}
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="text-xs font-bold text-brand-orange uppercase tracking-wider mb-2">
                            {post.category}
                          </div>
                          <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-brand-blue-deep transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-slate-600 text-xs md:text-sm mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>
                          <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                            <span>{post.readingTimeMinutes} min read</span>
                            <span className="font-semibold text-brand-blue-deep group-hover:text-brand-green-dark flex items-center gap-1">
                              Read Guide &rarr;
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer t={t} lang={lang} />
    </div>
  );
}
