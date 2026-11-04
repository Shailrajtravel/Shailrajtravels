import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Star, CheckCircle2, Sparkles, Loader2, Wand2, MessageSquare, X, Check, ArrowRight, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { addReviewFn, getGoogleReviewStatsFn } from '@/backend/features/reviews';
import {
  type GoogleReviewStats,
  type GoogleReviewItem,
  fallbackGoogleReviews,
  sortReviewsByLatest
} from '@/backend/shared/reviews-data';
import { cn } from '@/backend/shared/utils';

export function ReviewsSection({ lang, t }: { lang: "mr" | "en"; t: any }) {
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Embla Carousel for one-line auto side-scroll
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const [reviewStats, setReviewStats] = useState<GoogleReviewStats>({
    rating: "5.0",
    reviewCount: "23",
    placeId: "ChIJXRgrL53DwjsRs0FidQRovF0",
    source: "business_default",
    lastSynced: new Date().toISOString(),
    writeReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJXRgrL53DwjsRs0FidQRovF0",
    googleMapsUrl: "https://www.google.com/maps/place/Shailraj+Travels/@18.5116495,73.9655755,17z/data=!4m8!3m7!1s0x3bc2c39d2f2b185d:0x5dbc6804756241b3!8m2!3d18.5116495!4d73.9655755!9m1!1b1!16s%2Fg%2F11zd36ljtd?entry=ttu",
    reviews: fallbackGoogleReviews,
  });

  useEffect(() => {
    setIsMounted(true);
    getGoogleReviewStatsFn()
      .then((res) => {
        if (res) {
          setReviewStats(res);
        }
      })
      .catch((e) => console.error("Failed to load review stats:", e));
  }, []);

  const handleAiRefine = async () => {
    if (!review.trim()) return;
    setIsRefining(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Gemini API Key missing");

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

      const prompt = `You are an assistant for a happy traveler writing a 5-star review for Shailraj Travels (a premium pilgrimage travel agency in Pune, Maharashtra specializing in luxury Force Urbania, Ashtavinayak, Ujjain, and Jyotirlinga tours).
Refine the following rough review into an authentic, enthusiastic, 2-3 sentence Google review. Keep it natural, genuine, and warm.
Language: ${lang === "mr" ? "Marathi" : "English"}.

User's draft: "${review}"`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text) setReview(text.trim());
    } catch (err) {
      console.error("AI refine error:", err);
      alert("Could not refine review right now. Please write directly.");
    } finally {
      setIsRefining(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !review.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await addReviewFn({
        data: {
          name: name.trim(),
          rating,
          text: review.trim(),
        },
      });

      if (res?.success) {
        setShowToast(true);
      }

      setTimeout(() => {
        window.open(reviewStats.writeReviewUrl, "_blank");
        setName("");
        setReview("");
        setRating(5);
        setIsFormOpen(false);
        setTimeout(() => setShowToast(false), 3000);
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayReviews = React.useMemo(() => {
    const raw = reviewStats.reviews && reviewStats.reviews.length > 0 
      ? reviewStats.reviews 
      : fallbackGoogleReviews;
    return sortReviewsByLatest(raw);
  }, [reviewStats.reviews]);

  return (
    <section
      id="reviews"
      className="w-full bg-slate-50/50 py-16 lg:py-24 relative scroll-mt-28 md:scroll-mt-32 overflow-hidden border-t border-b border-slate-100"
    >
      {/* Toast Notification */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] bg-brand-green text-white px-6 py-3.5 rounded-full font-bold shadow-2xl transition-all duration-500 flex items-center gap-2 ${showToast ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"}`}
      >
        <CheckCircle2 className="w-5 h-5" />
        {t.reviewFormSuccess}
      </div>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <div className="flex flex-col items-center justify-center text-center mb-12 animate-reveal">
          {/* Section Subtitle */}
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-10 bg-brand-green" />
            <span className="text-[13px] md:text-[15px] font-bold tracking-[0.2em] text-brand-green-dark uppercase leading-none flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-green-dark fill-brand-green-dark text-white inline shrink-0" />
              {lang === "mr" ? "सत्यापित गुगल प्रतिक्रिया" : "VERIFIED GOOGLE REVIEWS"}
            </span>
            <div className="h-[1px] w-10 bg-brand-green" />
          </div>

          {/* Main Title */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-brand-blue-deep leading-tight max-w-4xl mb-4">
            {lang === "mr" ? (
              <>
                आमच्या प्रवाशांचा <span className="text-brand-green-dark">अनुभव व विश्वास</span>
              </>
            ) : (
              <>
                What Our Travelers <span className="text-brand-green-dark">Say About Us</span>
              </>
            )}
          </h2>
          
          <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mb-6">
            {lang === "mr" 
              ? "गुगल बिझनेस प्रोफाइल वरून थेट आणि प्रमाणित प्रवाशांचे अनुभव. तुमचाही अनुभव नक्की सामायिक करा!"
              : "Authentic stories and high-rated pilgrimage experiences verified directly from our official Google Business Profile."}
          </p>

          {/* Live Synchronized Google Maps Trust Banner */}
          <div className="inline-flex flex-wrap items-center justify-center gap-3 px-5 py-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span className="font-extrabold text-slate-800 text-base">{reviewStats.rating}</span>
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-sm font-bold text-slate-700">
              {reviewStats.reviewCount} {lang === "mr" ? "गुगल प्रमाणित पुनरावलोकने" : "Verified Google Reviews"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {lang === "mr" ? "थेट सिंक" : "Live Google Sync"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 w-full max-w-2xl mx-auto pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="flex w-full sm:w-auto items-center justify-center gap-2 bg-brand-green-dark hover:bg-brand-green-dark/90 text-white rounded-lg px-5 py-3.5 text-[15px] font-semibold transition-all shadow-sm hover:shadow-[0_8px_20px_rgba(16,163,74,0.25)] hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 shrink-0 text-amber-300" />
              <span>{lang === "mr" ? "AI सोबत अभिप्राय लिहा" : "Write Review with AI"}</span>
            </button>

            <a
              href={reviewStats.writeReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full sm:w-auto items-center justify-center gap-2 bg-[#EA4335] hover:bg-[#d9382b] text-white rounded-lg px-5 py-3.5 text-[15px] font-semibold transition-all shadow-sm hover:shadow-[0_8px_20px_rgba(234,67,53,0.25)] hover:-translate-y-0.5 no-underline whitespace-nowrap"
            >
              <Star className="w-4 h-4 fill-white shrink-0" />
              <span>{lang === "mr" ? "गुगलवर ५★ स्टार द्या" : "Write a Google Review"}</span>
            </a>

            <a
              href={reviewStats.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full sm:w-auto items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg px-5 py-3.5 text-[15px] font-semibold transition-all hover:shadow-sm hover:-translate-y-0.5 no-underline whitespace-nowrap"
            >
              <span>{lang === "mr" ? "गुगल प्रोफाइल" : "View Profile"}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </a>
          </div>
        </div>

        {/* Unified Native Review Widget Container with Curved Corners throughout */}
        <div className="w-full max-w-6xl mx-auto rounded-[28px] overflow-hidden border border-slate-200/80 shadow-lg shadow-slate-200/50 bg-white">
          {/* Header Bar */}
          <div className="border-b border-slate-100 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner shrink-0">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-slate-900">Shailraj Travels</h3>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                  <span className="font-extrabold text-slate-900">{reviewStats.rating}</span>
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span>({reviewStats.reviewCount} {lang === "mr" ? "गुगल परीक्षणे" : "reviews"})</span>
                </div>
              </div>
            </div>

            {/* Navigation and Action buttons */}
            <div className="flex items-center gap-2.5">
              {/* Prev / Next Carousel Controls */}
              <button
                type="button"
                onClick={scrollPrev}
                aria-label="Previous Reviews"
                className="w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors shadow-sm cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                aria-label="Next Reviews"
                className="w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors shadow-sm cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <a
                href={reviewStats.writeReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer no-underline whitespace-nowrap ml-1"
              >
                {lang === "mr" ? "अभिप्राय नोंदवा" : "Write a review"}
              </a>
              <a
                href={reviewStats.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors no-underline flex items-center gap-1 whitespace-nowrap"
              >
                <span>{lang === "mr" ? "सर्व पहा" : "View All"}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* One-Line Auto Side Scroll Track (Embla Carousel) */}
          <div className="bg-slate-50/70 p-5 md:p-6 overflow-hidden select-none" ref={emblaRef}>
            <div className="flex gap-5">
              {displayReviews.map((rev, index) => (
                <div
                  key={rev.id || index}
                  className="flex-[0_0_88%] sm:flex-[0_0_calc(50%-0.625rem)] lg:flex-[0_0_calc(33.333%-0.85rem)] min-w-0 flex flex-col transition-transform"
                >
                  <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full group hover:-translate-y-1">
                    <div>
                      {/* Reviewer Header */}
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          {rev.authorPhotoUrl ? (
                            <img
                              src={rev.authorPhotoUrl}
                              alt={rev.name}
                              className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-brand-orange to-amber-500 text-white font-extrabold text-sm flex items-center justify-center shadow-sm shrink-0">
                              {rev.name.charAt(0)}
                            </div>
                          )}
                          <div className="text-left">
                            <h4 className="font-bold text-slate-900 text-sm group-hover:text-brand-blue-deep transition-colors">
                              {rev.name}
                            </h4>
                            <span className="text-xs text-slate-500 font-medium">{rev.relativeTime}</span>
                          </div>
                        </div>

                        {/* Google G Icon */}
                        <div className="w-6 h-6 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                          </svg>
                        </div>
                      </div>

                      {/* Star Rating */}
                      <div className="flex items-center gap-1 mb-3 text-amber-400">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>

                      {/* Review Text */}
                      <p className="text-slate-700 text-sm leading-relaxed text-left line-clamp-4">
                        {lang === "mr" && rev.textMr ? rev.textMr : rev.text}
                      </p>
                    </div>

                    {/* Card Bottom Meta with Curved Pill */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {lang === "mr" ? "सत्यापित यात्रा" : "Verified Yatri"}
                      </span>
                      <a
                        href={reviewStats.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-brand-blue font-medium transition-colors"
                      >
                        {lang === "mr" ? "गुगलवर पहा" : "View on Google"} &rarr;
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Bar with Google Attribution & View All Button */}
          <div className="border-t border-slate-100 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-600 bg-white">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>{lang === "mr" ? "गुगल बिझनेस प्रोफाइल थेट सिंक • १००% अस्सल प्रवाशांचे अभिप्राय" : "Powered by Google Reviews • Live Google Business Profile Sync"}</span>
            </div>

            <a
              href={reviewStats.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold rounded-2xl transition-all shadow-sm hover:shadow-md flex items-center gap-1.5 no-underline"
            >
              <span>{lang === "mr" ? `गुगलवरील सर्व ${reviewStats.reviewCount}+ अभिप्राय वाचा` : `Read All ${reviewStats.reviewCount}+ Reviews on Google`}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Write Review Modal */}
      {isFormOpen && isMounted && createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-[500px] shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] animate-reveal overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xl font-display font-bold text-brand-blue-deep flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-blue" />
                {t.writeReviewTitle}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {t.reviewRating}
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={cn(
                          "w-7 h-7",
                          rating >= star ? "fill-amber-400 text-amber-400" : "text-slate-200"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {t.reviewName}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t.reviewExperience}
                  </label>
                  <button
                    type="button"
                    onClick={handleAiRefine}
                    disabled={isRefining || !review.trim()}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-blue-deep disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {isRefining ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Wand2 className="w-3.5 h-3.5" />
                    )}
                    {t.refineWithAi}
                  </button>
                </div>
                <textarea
                  required
                  rows={4}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share details about your pilgrimage itinerary, vehicle cleanliness, driver behavior, etc..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-brand-green hover:bg-brand-green-dark text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t.submitting}</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{t.submitReview}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </section>
  );
}
