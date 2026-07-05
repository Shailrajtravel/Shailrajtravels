import React, { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Star, CheckCircle2, User, FileText, Send, Sparkles, Loader2, Wand2, ChevronLeft, ChevronRight, SlidersHorizontal, MessageSquare, X, Check } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Route } from '@/routes/index';
import { addReviewFn } from '@/backend/features/reviews';
import useEmblaCarousel from 'embla-carousel-react';

const parseReviewDate = (dateStr: any): number => {
  if (!dateStr) return 0;
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed.getTime();
  }

  if (typeof dateStr === 'string') {
    const cleaned = dateStr.toLowerCase().trim();
    if (cleaned.includes('week')) {
      const match = cleaned.match(/\d+/);
      const weeks = match ? parseInt(match[0], 10) : 1;
      return Date.now() - weeks * 7 * 24 * 60 * 60 * 1000;
    }
    if (cleaned.includes('month')) {
      const match = cleaned.match(/\d+/);
      const months = match ? parseInt(match[0], 10) : 1;
      return Date.now() - months * 30 * 24 * 60 * 60 * 1000;
    }
    if (cleaned.includes('day')) {
      const match = cleaned.match(/\d+/);
      const days = match ? parseInt(match[0], 10) : 1;
      return Date.now() - days * 24 * 60 * 60 * 1000;
    }
    if (cleaned.includes('year')) {
      const match = cleaned.match(/\d+/);
      const years = match ? parseInt(match[0], 10) : 1;
      return Date.now() - years * 365 * 24 * 60 * 60 * 1000;
    }
  }

  return 0;
};

const avatarColors = [
  'bg-amber-700',
  'bg-emerald-700',
  'bg-blue-700',
  'bg-rose-700',
  'bg-purple-700',
  'bg-orange-600',
  'bg-indigo-600',
  'bg-teal-700',
  'bg-cyan-700',
];

const getAvatarColor = (name: string) => {
  const code = name.charCodeAt(0) || 0;
  return avatarColors[code % avatarColors.length];
};

export function ReviewsSection({ lang, t }: { lang: "mr" | "en"; t: any }) {
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const handleRefine = async () => {
    if (!review.trim()) return;
    setIsRefining(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        alert("Please add VITE_GEMINI_API_KEY to your .env file!");
        setIsRefining(false);
        return;
      }
      const genAI = new GoogleGenerativeAI(apiKey);
      let model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
      const prompt = `Correct the grammar and spelling, and improve the flow of this review, while keeping the original sentiment and language (English or Marathi). Return ONLY the improved review text without any other comments.\n\nReview:\n${review}`;

      let text = "";
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        text = response.text();
      } catch (e: any) {
        if (e.message?.includes("404") || e.status === 404) {
          console.log("Fallback to gemini-2.5-flash...");
          model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
          const result = await model.generateContent(prompt);
          const response = await result.response;
          text = response.text();
        } else {
          throw e;
        }
      }

      setReview(text.trim());
    } catch (error: any) {
      console.error("AI Refine Error:", error);
      alert(`AI Refine failed: ${error.message}`);
    }
    setIsRefining(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !review.trim()) return;

    setIsSubmitting(true);
    try {
      await addReviewFn({ data: { name: name.trim(), rating, text: review.trim() } });
      setShowToast(true);

      try {
        await navigator.clipboard.writeText(review);
      } catch (err) {
        console.error("Failed to copy text", err);
      }

      setTimeout(() => {
        window.open(
          "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4",
          "_blank",
        );
        setName("");
        setReview("");
        setRating(5);
        setIsFormOpen(false);
        setTimeout(() => setShowToast(false), 3000);
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { reviews: dbReviews } = Route.useLoaderData() as any;
  const displayReviews = dbReviews || [];

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

      <div className="mx-auto max-w-[1280px] px-6">
        {/* Main Dashboard Widget Layout */}
        <div className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-10 shadow-xl shadow-slate-200/50 flex flex-col gap-8 md:gap-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left side: EXCELLENT Rating Summary widget */}
            <div className="lg:col-span-3 flex flex-col items-center justify-center p-6 md:py-8 bg-slate-50/70 rounded-2xl border border-slate-100 text-center select-none shrink-0">
              <span className="font-extrabold text-slate-800 text-xl md:text-2xl tracking-wider uppercase mb-1">
                EXCELLENT
              </span>
              
              {/* 5 Yellow Stars */}
              <div className="flex gap-1 text-amber-400 my-2.5">
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
              </div>

              {/* Based on total reviews */}
              <span className="text-xs md:text-sm text-slate-600 font-bold mb-4">
                {lang === "mr" 
                  ? `एकूण ${displayReviews.length || 73} अभिप्रायांवर आधारित` 
                  : `Based on ${displayReviews.length || 73} reviews`}
              </span>

              {/* Colorful Google Wordmark */}
              <div className="flex items-center justify-center font-display font-black text-3xl tracking-tighter mb-5">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
              </div>

              {/* Write a review button */}
              <button
                type="button"
                onClick={() => setIsFormOpen(true)}
                className="w-full py-3 border border-slate-200 hover:border-brand-blue bg-white hover:bg-slate-50 text-slate-700 hover:text-brand-blue font-bold rounded-xl text-sm shadow-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Star className="w-4 h-4 fill-current text-amber-500" />
                {lang === "mr" ? "अभिप्राय लिहा" : "Write a Review"}
              </button>
            </div>

            {/* Right side: Reviews Carousel area */}
            <div className="lg:col-span-9 flex flex-col gap-4 relative">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-brand-blue-deep font-display">
                    {lang === "mr" ? "आमचे यात्रेकरू काय म्हणतात" : "What our Yatris say"}
                  </h3>
                </div>
                
                {/* Sorting Select Filter */}
                {displayReviews.length > 0 && (
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl shrink-0">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                      className="bg-transparent border-none text-brand-blue-deep font-bold text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="newest">{t.reviewSortNewest}</option>
                      <option value="oldest">{t.reviewSortOldest}</option>
                    </select>
                  </div>
                )}
              </div>

              {displayReviews.length > 0 ? (
                <div className="relative group/carousel">
                  {/* Navigation Arrows overlay */}
                  <button
                    type="button"
                    onClick={scrollPrev}
                    className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 shadow-md border border-slate-100 transition-all hover:scale-105 active:scale-95 cursor-pointer opacity-0 group-hover/carousel:opacity-100"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={scrollNext}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 shadow-md border border-slate-100 transition-all hover:scale-105 active:scale-95 cursor-pointer opacity-0 group-hover/carousel:opacity-100"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Slider Container */}
                  <div className="overflow-hidden w-full cursor-grab active:cursor-grabbing" ref={emblaRef}>
                    <div className="flex -ml-6">
                      {[...displayReviews]
                        .sort((a: any, b: any) => {
                          const timeA = parseReviewDate(a.date);
                          const timeB = parseReviewDate(b.date);
                          return sortBy === "newest" ? timeB - timeA : timeA - timeB;
                        })
                        .map((r: any) => {
                          const review = r as any;
                          const hasLongText = (lang === "mr" ? review.textMr : review.textEn || review.text)?.length > 120;
                          return (
                            <div
                              key={review._id || review.id}
                              className="pl-6 flex-[0_0_100%] md:flex-[0_0_50%] min-w-0 py-2"
                            >
                              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200/60 transition-all duration-300 flex flex-col justify-between h-[230px]">
                                <div>
                                  {/* Header: User avatar, Name, Date, Google Logo */}
                                  <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                      {/* User Initials Circle */}
                                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 uppercase shadow-sm ${getAvatarColor(review.name)}`}>
                                        {review.name.charAt(0)}
                                      </div>
                                      <div>
                                        <h4 className="font-bold text-brand-blue-deep text-sm line-clamp-1">{review.name}</h4>
                                        <p className="text-slate-400 text-[11px] font-medium mt-0.5">
                                          {isNaN(new Date(review.date).getTime())
                                            ? review.date
                                            : new Date(review.date).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                              })}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    {/* Google G Logo in corner */}
                                    <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
                                        <path
                                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                          fill="#4285F4"
                                        />
                                        <path
                                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                          fill="#34A853"
                                        />
                                        <path
                                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                          fill="#FBBC05"
                                        />
                                        <path
                                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                          fill="#EA4335"
                                        />
                                      </svg>
                                    </div>
                                  </div>

                                  {/* Yellow stars and Verified Badge */}
                                  <div className="flex items-center gap-1.5 mb-2.5">
                                    <div className="flex gap-0.5 text-amber-400">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-3.5 h-3.5 fill-current`}
                                        />
                                      ))}
                                    </div>
                                    {/* Verified Blue Checkmark icon */}
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8] fill-[#1A73E8] stroke-white" strokeWidth={3} />
                                  </div>

                                  {/* Review text */}
                                  <p className="text-slate-600 text-xs sm:text-[13px] leading-relaxed line-clamp-3 italic pr-1">
                                    "{lang === "mr" ? review.textMr : review.textEn || review.text}"
                                  </p>
                                </div>

                                {hasLongText && (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedReview(review)}
                                    className="text-brand-blue hover:text-brand-blue-deep font-bold text-[11px] self-start mt-2 cursor-pointer focus:outline-none hover:underline"
                                  >
                                    {lang === "mr" ? "अधिक वाचा" : "Read more"}
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-[24px] p-8 text-center bg-slate-50/50 min-h-[200px]">
                  <MessageSquare className="w-12 h-12 text-slate-300 mb-4 animate-pulse" />
                  <h3 className="font-bold text-brand-blue-deep text-lg mb-2">
                    {lang === "mr" ? "अद्याप कोणतीही प्रतिक्रिया नाही" : "No reviews yet"}
                  </h3>
                  <p className="text-slate-500 text-sm max-w-sm">
                    {lang === "mr"
                      ? "पहिली प्रतिक्रिया लिहिणारे व्हा आणि तुमचा प्रवास अनुभव आमच्यासोबत शेअर करा!"
                      : "Be the first to share your travel experience with us!"}
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Footer Row: Showing our latest reviews */}
          <div className="flex justify-center pt-6 border-t border-slate-100 text-xs font-bold text-slate-500 select-none">
            <span>
              {lang === "mr" ? "आमचे ताजे अभिप्राय दर्शवत आहे" : "Showing our latest reviews"}
            </span>
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
                {lang === "mr" ? "अभिप्राय लिहा" : "Write a Google Review"}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-brand-blue hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <form id="writeReviewForm" onSubmit={handleSubmit} className="space-y-5">
                {/* Stars selector */}
                <div className="flex flex-col items-center justify-center gap-2 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-500">Your Rating</span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                      >
                        <Star
                          className={`w-8 h-8 ${rating >= star ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-200"} transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder={t.reviewFormName}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none text-sm font-medium"
                  />
                </div>

                {/* Review text */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Your Experience</label>
                  <div className="relative">
                    <textarea
                      required
                      placeholder={t.reviewFormText}
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none text-sm font-medium pb-12 resize-none"
                    />
                    {/* AI Refine button */}
                    <button
                      type="button"
                      onClick={handleRefine}
                      disabled={isRefining || !review.trim()}
                      className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white rounded-lg text-xs font-bold shadow-md transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
                    >
                      {isRefining ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Wand2 className="w-3.5 h-3.5" />
                      )}
                      {isRefining ? "Refining..." : "Refine with AI"}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Form footer actions */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl text-sm transition-colors cursor-pointer"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="writeReviewForm"
                disabled={isSubmitting || showToast}
                className="px-5 py-2.5 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-blue-deep text-sm transition-all flex items-center gap-2 shadow-lg shadow-brand-blue/20 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Review Full Text View Modal */}
      {selectedReview && isMounted && createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-[500px] shadow-2xl border border-slate-100 flex flex-col max-h-[80vh] animate-reveal overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 uppercase shadow-sm ${getAvatarColor(selectedReview.name)}`}>
                  {selectedReview.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-brand-blue-deep text-sm">{selectedReview.name}</h4>
                  <p className="text-slate-400 text-[11px] font-medium">Verified Customer Review</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReview(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-brand-blue hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/30">
              {/* Star rating */}
              <div className="flex items-center gap-1.5 mb-4">
                <div className="flex gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-current"
                    />
                  ))}
                </div>
                <CheckCircle2 className="w-4 h-4 text-[#1A73E8] fill-[#1A73E8] stroke-white" strokeWidth={3} />
                <span className="text-xs font-bold text-[#1A73E8] uppercase tracking-wider">Verified Review</span>
              </div>

              {/* Text */}
              <p className="text-slate-700 text-sm leading-relaxed italic whitespace-pre-line bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                "{lang === "mr" ? selectedReview.textMr : selectedReview.textEn || selectedReview.text}"
              </p>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                className="px-5 py-2 bg-brand-blue hover:bg-brand-blue-deep text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
