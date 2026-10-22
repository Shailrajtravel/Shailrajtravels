import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Star, CheckCircle2, Sparkles, Loader2, Wand2, MessageSquare, X, Check, ArrowRight, QrCode } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { addReviewFn, getGoogleReviewStatsFn, GoogleReviewStats } from '@/backend/features/reviews';
import { Skeleton } from '@/frontend/shared/ui/skeleton';
import { cn } from '@/backend/shared/utils';

export function ReviewsSection({ lang, t }: { lang: "mr" | "en"; t: any }) {
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [qrTab, setQrTab] = useState<'google' | 'website'>('google');
  const [isMounted, setIsMounted] = useState(false);

  // Lazy-load SociableKit iframe to prevent blocking main thread
  const [shouldLoadIframe, setShouldLoadIframe] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeContainerRef = useRef<HTMLDivElement>(null);

  const [reviewStats, setReviewStats] = useState<GoogleReviewStats>({
    rating: "5.0",
    reviewCount: "12",
    placeId: "ChIJXRgrL53DwjsRs0FidQRovF0",
    source: "business_default",
    lastSynced: new Date().toISOString(),
    writeReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJXRgrL53DwjsRs0FidQRovF0",
    googleMapsUrl: "https://www.google.com/maps/place/Shailraj+Travels/@18.5116495,73.9655755,17z/data=!4m8!3m7!1s0x3bc2c39d2f2b185d:0x5dbc6804756241b3!8m2!3d18.5116495!4d73.9655755!9m1!1b1!16s%2Fg%2F11zd36ljtd?entry=ttu",
  });

  useEffect(() => {
    setIsMounted(true);
    getGoogleReviewStatsFn()
      .then((res) => {
        if (res && res.reviewCount) setReviewStats(res);
      })
      .catch((e) => console.error("Failed to load review stats:", e));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setShouldLoadIframe(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoadIframe(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px' }
    );

    if (iframeContainerRef.current) {
      observer.observe(iframeContainerRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
        window.open(reviewStats.writeReviewUrl, "_blank");
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
        <div className="flex flex-col items-center justify-center text-center mb-12 animate-reveal">
          {/* Section Subtitle with green decorative lines */}
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-10 bg-brand-green" />
            <span className="text-[13px] md:text-[15px] font-bold tracking-[0.2em] text-brand-green-dark uppercase leading-none flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-green-dark fill-brand-green-dark text-white inline shrink-0" />
              {lang === "mr" ? "सत्यापित प्रतिक्रिया" : "VERIFIED REVIEWS"}
            </span>
            <div className="h-[1px] w-10 bg-brand-green" />
          </div>

          {/* Main Title with brand colors */}
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
              ? "गुगल बिझनेस प्रोफाइल वरून थेट आणि रिअल-टाईम प्रवाशांचे अनुभव आणि प्रतिक्रिया. तुमचाही अनुभव नक्की सामायिक करा!"
              : "Authentic stories and high-rated travel experiences synced in real-time directly from our official Google Business Profile."}
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

          {/* Action Buttons styled identically to Explore Tours & Contact Us buttons */}
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 w-full max-w-2xl mx-auto pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="flex w-full sm:w-auto items-center justify-center gap-2 bg-brand-green-dark hover:bg-brand-green-dark/90 text-white rounded-lg px-5 py-3.5 text-[15px] font-semibold transition-all shadow-sm hover:shadow-[0_8px_20px_rgba(16,163,74,0.25)] hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
            >
              <span>{lang === "mr" ? "AI सोबत अभिप्राय लिहा" : "Write Review with AI"}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            <a
              href={reviewStats.writeReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full sm:w-auto items-center justify-center gap-2 bg-[#EA4335] hover:bg-[#d9382b] text-white rounded-lg px-5 py-3.5 text-[15px] font-semibold transition-all shadow-sm hover:shadow-[0_8px_20px_rgba(234,67,53,0.25)] hover:-translate-y-0.5 no-underline whitespace-nowrap"
            >
              <Star className="w-4 h-4 fill-white shrink-0" />
              <span>{lang === "mr" ? "गुगलवर ५★ स्टार द्या" : "Review on Google Maps"}</span>
            </a>

            <button
              type="button"
              onClick={() => setIsQrOpen(true)}
              className="flex w-full sm:w-auto items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-5 py-3.5 text-[15px] font-semibold transition-all shadow-sm hover:shadow-[0_8px_20px_rgba(15,23,42,0.25)] hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
            >
              <QrCode className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{lang === "mr" ? "QR कोड स्कॅन करा" : "Scan Review QR"}</span>
            </button>

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

        {/* Live Synchronized SociableKit Widget Container */}
        <div
          ref={iframeContainerRef}
          className="w-full max-w-6xl mx-auto overflow-hidden rounded-[24px] shadow-lg shadow-slate-200/50 border border-slate-200/60 bg-white relative min-h-[450px]"
        >
          {/* Skeleton while iframe is loading or deferred */}
          {!iframeLoaded && (
            <div className="w-full p-8 flex flex-col justify-between min-h-[450px] bg-slate-50/50 animate-pulse">
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-36 bg-slate-200" />
                    <Skeleton className="h-3 w-24 bg-slate-100" />
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-6 w-28 rounded-full bg-amber-100" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-auto">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
                      <div className="flex flex-col gap-1.5 flex-1">
                        <Skeleton className="h-3.5 w-24 bg-slate-200" />
                        <Skeleton className="h-2.5 w-16 bg-slate-100" />
                      </div>
                    </div>
                    <Skeleton className="h-3 w-20 bg-amber-100 rounded" />
                    <Skeleton className="h-3 w-full bg-slate-100 rounded" />
                    <Skeleton className="h-3 w-4/5 bg-slate-100 rounded" />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center pt-4">
                <Skeleton className="h-3 w-64 bg-slate-200" />
              </div>
            </div>
          )}

          {shouldLoadIframe && (
            <iframe
              src="https://widgets.sociablekit.com/google-reviews/iframe/25701887"
              width="100%"
              height="450"
              frameBorder="0"
              loading="lazy"
              title="Shailraj Travels Live Google Reviews"
              className={cn(
                "w-full border-none block transition-opacity duration-500",
                iframeLoaded ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"
              )}
              style={{ width: '100%', border: 'none', minHeight: '360px', height: '450px', overflow: 'hidden' }}
              onLoad={() => setIframeLoaded(true)}
            />
          )}
          
          <div className="flex justify-center py-3 border-t border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-500 select-none">
            <span>
              {lang === "mr" ? "गुगल बिझनेस प्रोफाइल वरून थेट प्रमाणित प्रतिक्रिया" : "Live synchronization via Google Business Profile Ecosystem"}
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

      {/* QR Code Modal */}
      {isQrOpen && isMounted && createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-[440px] shadow-2xl border border-slate-100 flex flex-col items-center p-6 text-center animate-reveal relative">
            <button
              onClick={() => setIsQrOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Icon & Title */}
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5 mt-1">
              <QrCode className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-display font-bold text-slate-900">
              {lang === "mr" ? "अधिकृत QR कोड" : "Official Shailraj QR Codes"}
            </h3>

            {/* Segmented Switcher */}
            <div className="flex p-1 bg-slate-100 rounded-xl my-3 w-full border border-slate-200/70">
              <button
                type="button"
                onClick={() => setQrTab('google')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  qrTab === 'google'
                    ? 'bg-white text-brand-blue-deep shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⭐ {lang === "mr" ? "गुगल ५★ अभिप्राय" : "Google 5★ Review"}
              </button>
              <button
                type="button"
                onClick={() => setQrTab('website')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  qrTab === 'website'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🌐 {lang === "mr" ? "अधिकृत वेबसाइट" : "Official Website"}
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-3 max-w-xs leading-relaxed">
              {qrTab === 'google'
                ? (lang === "mr"
                    ? "मोबाईल कॅमेरा किंवा गुगल लेन्सने स्कॅन करून थेट तुमचा ५★ अभिप्राय नोंदवा"
                    : "Scan to open our direct 5★ Google Review form & share your travel experience")
                : (lang === "mr"
                    ? "शैलराज ट्रॅव्हल्सची अधिकृत वेबसाइट, टूर पॅकेजेस व माहिती पाहण्यासाठी स्कॅन करा"
                    : "Scan to visit shailrajtravels.com to view pilgrimage packages, vehicles & book tours")}
            </p>

            {/* QR Code Container with Center Logo Badge */}
            <div className="p-3.5 bg-slate-50/80 rounded-2xl border-2 border-dashed border-slate-200 mb-4 relative group">
              <img
                src={
                  qrTab === 'google'
                    ? "/images/shailraj-google-review-qr.png"
                    : "/images/shailraj-website-qr.png"
                }
                alt={
                  qrTab === 'google'
                    ? "Shailraj Travels Google Review QR with Center Logo"
                    : "Shailraj Travels Website QR with Center Logo"
                }
                className="w-60 h-60 rounded-xl object-contain shadow-sm bg-white"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 w-full pt-1">
              <a
                href="/review-qr.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors no-underline flex items-center justify-center gap-1.5"
              >
                <span>Print Standee</span>
              </a>
              <a
                href={
                  qrTab === 'google'
                    ? "/images/shailraj-google-review-qr.png"
                    : "/images/shailraj-website-qr.png"
                }
                download={
                  qrTab === 'google'
                    ? "shailraj-google-review-qr.png"
                    : "shailraj-website-qr.png"
                }
                className="flex-1 py-3 px-3 bg-brand-green-dark hover:bg-brand-green-dark/90 text-white rounded-xl text-xs font-bold transition-colors no-underline flex items-center justify-center gap-1.5"
              >
                <span>Download PNG</span>
              </a>
              <a
                href={
                  qrTab === 'google'
                    ? "/images/shailraj-google-review-qr.svg"
                    : "/images/shailraj-website-qr.svg"
                }
                download={
                  qrTab === 'google'
                    ? "shailraj-google-review-qr.svg"
                    : "shailraj-website-qr.svg"
                }
                className="py-3 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors no-underline flex items-center justify-center"
                title="Download Vector SVG"
              >
                <span>SVG</span>
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}

    </section>
  );
}
