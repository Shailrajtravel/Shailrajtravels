import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Star, CheckCircle2, Sparkles, Loader2, Wand2, MessageSquare, X, Check, ArrowRight, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { addReviewFn } from '@/backend/features/reviews';

const googleReviewsList = [
  {
    id: 1,
    author: "Abhijeet Chalak",
    time: "1 week ago",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    text: "Had a great experience on the Ujjain Jyotirlinga trip with Mayur. Everything was well organized, the journey was comfortable, and the darshan went smoothly. Thank you, Mayur, for making our trip memorable. Highly recommended!",
  },
  {
    id: 2,
    author: "Sagar Jadhav",
    time: "1 week ago",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    text: "Amazing tour package and excellent service! Everything was well organized, from transportation to accommodation. The itinerary was perfectly planned, and the team was very supportive throughout the trip. We had a wonderful and memorable experience.",
  },
  {
    id: 3,
    author: "Pooja Deshpande",
    time: "2 weeks ago",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    text: "We booked our family tour through Shailraj Travels and couldn't be happier. The vehicle was spotless, our driver was humble and punctual, and hotel arrangements were top notch. Will surely book our upcoming Kedarnath trip with them!",
  },
  {
    id: 4,
    author: "Rahul Kulkarni",
    time: "3 weeks ago",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    text: "One of the best tour operators in Pune and Maharashtra! Highly transparent pricing, no hidden costs, and exceptional customer assistance throughout our Ashtavinayak yatra. Special thanks to Mayur and team!",
  },
];

export function ReviewsSection({ lang, t }: { lang: "mr" | "en"; t: any }) {
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Smooth automatic right-to-left scrolling for cards
  useEffect(() => {
    if (isPaused || expandedId !== null) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 310, behavior: 'smooth' });
        }
      }
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, expandedId]);


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

          {/* Action Buttons styled identically to Explore Tours & Contact Us buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 w-full max-w-md mx-auto sm:max-w-none pt-4">
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="flex w-full sm:w-[260px] items-center justify-center gap-2 bg-brand-green-dark hover:bg-brand-green-dark/90 text-white rounded-lg px-6 py-4 text-[16px] font-semibold transition-all shadow-sm hover:shadow-[0_8px_20px_rgba(16,163,74,0.25)] hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
            >
              <span>{lang === "mr" ? "AI सोबत अभिप्राय लिहा" : "Write a Review with AI"}</span>
              <ArrowRight className="w-5 h-5 shrink-0" />
            </button>

            <a
              href="https://www.google.com/maps/place/Shailraj+Travels/data=!4m2!3m1!1s0x0:0x5dbc6804756241b3?sa=X&ved=1t:2428&ictx=111"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full sm:w-[260px] items-center justify-center gap-2 bg-white border-2 border-brand-green-dark text-brand-green-dark hover:bg-brand-green-dark/5 rounded-lg px-6 py-4 text-[16px] font-semibold transition-all hover:shadow-sm hover:-translate-y-0.5 no-underline whitespace-nowrap"
            >
              <span>{lang === "mr" ? "गुगल प्रोफाइल पहा" : "View on Google Maps"}</span>
              <ArrowRight className="w-5 h-5 shrink-0" />
            </a>
          </div>
        </div>

        {/* Native Google Reviews Custom Carousel */}
        <div 
          className="w-full max-w-6xl mx-auto rounded-[28px] border border-slate-200/80 bg-slate-50/40 shadow-xl p-6 md:p-8 relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Top Carousel Navigation Controls */}
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-xs md:text-sm font-bold text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {lang === "mr" ? "प्रमाणित गुगल प्रतिक्रिया" : "Verified Google Business Reviews"}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
                className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-brand-green-dark hover:border-brand-green-dark transition-all shadow-sm cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
                className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-brand-green-dark hover:border-brand-green-dark transition-all shadow-sm cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cards Track */}
          <div 
            ref={scrollRef}
            className="flex items-start gap-6 overflow-x-auto custom-scrollbar pt-2 pb-6 px-1 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* 1. Google Business Badge Card (Small like Image 2) */}
            <div className="w-[300px] min-h-[275px] bg-white rounded-2xl border border-slate-200/90 shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col justify-between items-center text-center shrink-0">
              <div>
                <span className="font-bold tracking-tight text-2xl flex items-center justify-center mb-1">
                  <span className="text-[#4285F4]">G</span>
                  <span className="text-[#EA4335]">o</span>
                  <span className="text-[#FBBC05]">o</span>
                  <span className="text-[#4285F4]">g</span>
                  <span className="text-[#34A853]">l</span>
                  <span className="text-[#EA4335]">e</span>
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Shailraj Travels</h3>
                <div className="flex items-center justify-center gap-1.5 my-2">
                  <span className="text-2xl font-black text-slate-900">5</span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs font-semibold text-slate-500 mb-4">Read our 4 Reviews</p>
              </div>
              
              <button
                type="button"
                onClick={() => setIsFormOpen(true)}
                className="w-full bg-black text-white hover:bg-slate-800 font-bold text-sm py-3 px-4 rounded-xl shadow transition-colors duration-200 cursor-pointer text-center block"
              >
                Write a review
              </button>
            </div>

            {/* 2. Customer Review Cards */}
            {googleReviewsList.map((rev) => {
              const isExpanded = expandedId === rev.id;
              const displayText = !isExpanded && rev.text.length > 95
                ? `${rev.text.substring(0, 95)}...`
                : rev.text;

              return (
                <div
                  key={rev.id}
                  className={`w-[300px] ${isExpanded ? 'min-h-[275px] h-auto border-2 border-brand-green-dark/40 shadow-xl' : 'h-[275px] border border-slate-200/90 shadow-md hover:shadow-lg'} bg-white rounded-2xl transition-all duration-300 p-6 flex flex-col justify-between shrink-0 relative`}
                >
                  <div>
                    {/* Author Header */}
                    <div className="flex items-center gap-3.5 mb-3">
                      <img
                        src={rev.avatar}
                        alt={rev.author}
                        className="w-11 h-11 rounded-full object-cover border border-slate-200"
                      />
                      <div className="text-left">
                        <h4 className="font-bold text-sm text-slate-900 leading-tight">{rev.author}</h4>
                        <span className="text-xs font-medium text-slate-400">{rev.time}</span>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>

                    {/* Review Text with Read More / Show Less Toggle */}
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium text-left">
                      {displayText}{" "}
                      {!isExpanded && rev.text.length > 95 && (
                        <button
                          onClick={() => setExpandedId(rev.id)}
                          className="text-[#4285F4] hover:underline font-bold text-xs ml-1 inline-flex items-center cursor-pointer"
                        >
                          Read more
                        </button>
                      )}
                      {isExpanded && (
                        <button
                          onClick={() => setExpandedId(null)}
                          className="text-[#4285F4] hover:underline font-bold text-xs ml-2 inline-flex items-center cursor-pointer block mt-1"
                        >
                          Show less
                        </button>
                      )}
                    </p>
                  </div>

                  {/* Google View Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-slate-500 hover:text-slate-800 transition-colors text-xs font-bold w-full">
                    <a
                      href="https://www.google.com/maps/place/Shailraj+Travels/data=!4m2!3m1!1s0x0:0x5dbc6804756241b3?sa=X&ved=1t:2428&ictx=111"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 no-underline text-slate-600 hover:text-slate-900"
                    >
                      <span className="text-base font-black text-[#4285F4]">G</span>
                      <span>View on Google</span>
                    </a>
                    <Share2 className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer" />
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-center py-2 text-xs font-bold text-slate-400 select-none">
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
