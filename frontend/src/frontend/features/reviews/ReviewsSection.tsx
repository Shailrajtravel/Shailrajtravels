import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Star, CheckCircle2, Sparkles, Loader2, Wand2, MessageSquare, X, Check } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { addReviewFn } from '@/backend/features/reviews';

export function ReviewsSection({ lang, t }: { lang: "mr" | "en"; t: any }) {
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
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
        window.open(
          "https://www.google.com/maps/place/Shailraj+Travels/data=!4m2!3m1!1s0x0:0x5dbc6804756241b3?sa=X&ved=1t:2428&ictx=111",
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

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-blue-deep hover:bg-brand-blue text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
              <span>{lang === "mr" ? "AI सोबत अभिप्राय लिहा" : "Write a Review with AI"}</span>
            </button>

            <a
              href="https://www.google.com/maps/place/Shailraj+Travels/data=!4m2!3m1!1s0x0:0x5dbc6804756241b3?sa=X&ved=1t:2428&ictx=111"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 hover:border-brand-blue-deep/60 text-slate-700 hover:text-brand-blue-deep hover:bg-slate-50 font-bold rounded-xl text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 no-underline whitespace-nowrap"
            >
              <span className="text-base leading-none">📍</span>
              <span>{lang === "mr" ? "गुगल प्रोफाइल पहा" : "View on Google Maps"}</span>
            </a>
          </div>
        </div>

        {/* Compact SociableKit Carousel Layout without redundant outer box spacing */}
        <div className="w-full max-w-6xl mx-auto overflow-hidden rounded-[24px] shadow-lg shadow-slate-200/50 border border-slate-200/60 bg-white">
          <iframe
            src="https://widgets.sociablekit.com/google-reviews/iframe/25701887"
            width="100%"
            height="480"
            frameBorder="0"
            title="Shailraj Travels Google Reviews"
            className="w-full border-none block"
            style={{ width: '100%', border: 'none', height: '480px', overflow: 'hidden' }}
          />
          
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

    </section>
  );
}
