// @ts-nocheck
import React, { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { generateSEO } from '@/backend/features/seo';
import { useLanguage } from '@/routes/__root';
import { translations } from '@/frontend/core/i18n';
import { Navbar } from '@/frontend/core/Navbar';
import { FooterSection as Footer } from '@/frontend/core/Footer';
import { SchemaMarkup } from '@/frontend/shared/components/SchemaMarkup';
import {
  generateLocalBusinessSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateBusTripSchema,
} from '@/backend/shared/schema-generators';
import { businessConfig } from '@/frontend/shared/config/business';
import {
  Bus,
  MapPin,
  Clock,
  ShieldCheck,
  Star,
  Users,
  Calendar,
  CheckCircle2,
  Phone,
  ArrowRight,
  Sparkles,
  HelpCircle,
  ChevronDown,
  Navigation,
  Compass,
  AlertCircle,
  Check,
  Send,
  Loader2,
} from 'lucide-react';

export const Route = createFileRoute("/pune-to-ujjain-bus-travels")({
  head: () => ({
    meta: generateSEO({
      title: "Pune to Ujjain Bus Travels | Luxury AC Sleeper & Force Urbania | Shailraj",
      description:
        "Looking for the best Pune to Ujjain bus travels? Book luxury AC Force Urbania and sleeper bus travels from Pune to Ujjain Mahakal. Direct temple doorstep drop, Bhasma Aarti guidance, ₹1,499 onwards. 24/7 Booking: 9764413556.",
      canonicalUrl: "https://www.shailrajtravels.com/pune-to-ujjain-bus-travels",
      keywords: [
        "pune to ujjain bus travels",
        "pune to ujjain bus",
        "pune to ujjain travels",
        "pune to ujjain sleeper bus",
        "pune to ujjain bus booking",
        "pune to ujjain luxury bus travels",
        "ujjain bus travels",
        "pune to ujjain ac bus travels",
        "pune to ujjain tour and travels",
        "pune to ujjain force urbania travels",
        "pune to ujjain travel agency",
        "best travels in pune",
        "pune travels",
        "hadapsar travels",
        "shailraj travels",
      ],
    }),
    links: [{ rel: "canonical", href: "https://www.shailrajtravels.com/pune-to-ujjain-bus-travels" }],
  }),
  component: PuneToUjjainBusTravelsPage,
});

function PuneToUjjainBusTravelsPage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  // Accordion state for FAQs
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Quick Booking Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    travelDate: "",
    passengers: "2",
    boardingPoint: "Hadapsar",
    busType: "AC Force Urbania (10/13/17 Seater)",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
      const text = `*New Pune to Ujjain Bus Travels Inquiry*%0A%0A*Name:* ${formData.name}%0A*Phone:* ${formData.phone}%0A*Travel Date:* ${formData.travelDate}%0A*Passengers:* ${formData.passengers}%0A*Boarding Point:* ${formData.boardingPoint}%0A*Bus Type:* ${formData.busType}`;
      window.open(`https://wa.me/919764413556?text=${text}`, "_blank");
    }, 700);
  };

  const routeDetails = [
    { label: lang === "mr" ? "एकूण अंतर" : "Total Distance", value: "~615 km (via NH 60 & NH 52)", icon: Navigation },
    { label: lang === "mr" ? "प्रवासाचा वेळ" : "Travel Duration", value: "14 - 16 Hours (Smooth Highway)", icon: Clock },
    { label: lang === "mr" ? "प्रस्थान" : "Bus Departures", value: "Daily Evening & Weekend Yatras", icon: Calendar },
    { label: lang === "mr" ? "तिकीट दर" : "Ticket / Package Fare", value: "From ₹1,499 (Seat) / ₹6,999 (3D/2N All-Inclusive)", icon: Sparkles },
    { label: lang === "mr" ? "पुणे पिकअप" : "Pune Pickup", value: "Hadapsar, Swargate, Station, Wakad, Bhosari", icon: MapPin },
    { label: lang === "mr" ? "उज्जैन ड्रॉप" : "Ujjain Drop", value: "Direct Mahakal Temple Hotel Doorstep", icon: ShieldCheck },
  ];

  const comparisonRows = [
    {
      feature: "Dropping Location in Ujjain",
      shailraj: "Direct hotel room doorstep next to Mahakaleshwar Temple Gate (200m)",
      regular: "Highway bypass or Nanakheda bus stand (8 km away at 3 AM)",
    },
    {
      feature: "Bhasma Aarti & Darshan",
      shailraj: "Personal advance token booking assistance & traditional dress guidance",
      regular: "Zero guidance; passengers left to navigate long unassisted queues",
    },
    {
      feature: "Sightseeing Included",
      shailraj: "Complete Tri-Jyotirlinga: Mahakaleshwar, Omkareshwar, Mamleshwar & Maheshwar Fort",
      regular: "Point-to-point only; separate expensive local autos required",
    },
    {
      feature: "Vehicle Fleet & Comfort",
      shailraj: "Luxury AC Force Urbania (10/13/17 seats) with recliners, air-ride suspension & USB ports",
      regular: "Crowded 40-50 passenger sleeper buses with hard berths and rattles",
    },
    {
      feature: "Senior Citizen Support",
      shailraj: "Low-step entry, luggage loading assistance, hygienic washroom halts every 3 hrs",
      regular: "High climb, hurried 10-minute halts at unhygienic dhabas",
    },
    {
      feature: "Meals & Food Halts",
      shailraj: "100% pure vegetarian, verified sattvic dining stops along the highway",
      regular: "Random mixed highway stops with uncertain hygiene",
    },
  ];

  const boardingPoints = [
    { point: "Hadapsar (Shailraj Travels Office, Gadital)", timeMorning: "06:00 AM", timeEvening: "08:00 PM" },
    { point: "Swargate (Laxmi Narayan Cinema / ST Stand)", timeMorning: "06:45 AM", timeEvening: "08:45 PM" },
    { point: "Pune Railway Station (Opp. Inox / Central)", timeMorning: "07:15 AM", timeEvening: "09:15 PM" },
    { point: "Viman Nagar / Kharadi Bypass", timeMorning: "07:45 AM", timeEvening: "09:45 PM" },
    { point: "Bhosari / Nashik Phata / Chakan", timeMorning: "08:15 AM", timeEvening: "10:15 PM" },
    { point: "Wakad / Hinjewadi Bridge", timeMorning: "08:45 AM", timeEvening: "10:45 PM" },
  ];

  const faqs = [
    {
      question: "What is the bus ticket price from Pune to Ujjain with Shailraj Travels?",
      answer:
        "Shailraj Travels offers both individual seat bookings (starting from ₹1,499 per seat in luxury AC coaches/Urbania) and complete 3 Days / 2 Nights all-inclusive pilgrimage packages starting from ₹6,999 to ₹8,500 per person. The all-inclusive package includes luxury AC travel, 2 nights 3-star AC hotel stay, pure veg meals, and Mahakal Bhasma Aarti guidance.",
    },
    {
      question: "Which bus travels is best for the Pune to Ujjain pilgrimage journey?",
      answer:
        "Shailraj Travels is rated Pune's best travels for Pune to Ujjain (5.0★ Google rating with 23+ verified reviews). Unlike standard highway buses that drop you on the bypass 8 km away, Shailraj Travels takes you directly to your hotel right beside Mahakaleshwar temple, offers luxury AC Force Urbania travel, and provides comprehensive Bhasma Aarti and Omkareshwar tour guidance.",
    },
    {
      question: "How much time does the bus take from Pune to Ujjain?",
      answer:
        "The road distance is approximately 615 km via the modern Pune - Nashik - Dhule - Sendhwa - Indore - Ujjain highway corridor (NH 60 & NH 52). Travel time is approximately 14 to 16 hours, featuring smooth highway cruising, air-ride comfort, and pre-scheduled hygienic dining halts.",
    },
    {
      question: "Where are the boarding and pickup points in Pune for Ujjain bus travels?",
      answer:
        "We offer convenient pickup locations across Pune: Hadapsar (Head Office), Swargate, Pune Railway Station, Viman Nagar / Kharadi, Bhosari / Nashik Phata, and Wakad / Hinjewadi Bridge. For private family bookings, 100% doorstep home pickup across Pune and PCMC is included.",
    },
    {
      question: "Does Shailraj Travels bus drop passengers directly at Mahakaleshwar temple?",
      answer:
        "Yes! One of the biggest advantages of traveling with Shailraj Travels is our direct doorstep temple hotel drop. While regular buses (redBus / MakeMyTrip) drop passengers at Nanakheda bus stand or highway bypass in the middle of the night, our vehicle drops you directly at your pre-booked AC hotel within walking distance of Shri Mahakaleshwar Jyotirlinga.",
    },
    {
      question: "Can I book a private AC Force Urbania or bus for my family group?",
      answer:
        "Yes, private charter bookings are our specialty! We have 10-seater, 13-seater, and 17-seater luxury AC Force Urbania vans, 20-seater mini-buses, and full-size AC sleeper coaches available on rent for family yatras and corporate groups with customized itineraries.",
    },
    {
      question: "How do you help with Mahakaleshwar Bhasma Aarti token passes?",
      answer:
        "Bhasma Aarti takes place daily between 4:00 AM and 6:00 AM. We guide our travelers through the official online booking portal (shrimahakaleshwar.com) 30 days prior, ensure compliance with the mandatory traditional dress code (Dhoti/Solah for men, Saree for women), and coordinate timely arrival at Gate No. 4.",
    },
    {
      question: "Are Omkareshwar and Maheshwar included in the Pune to Ujjain travels?",
      answer:
        "Yes! Our flagship 3D/2N tour connects the complete Tri-Jyotirlinga and Shaktipeeth circuit: Mahakaleshwar (Ujjain), Omkareshwar (Narmada River island), Mamleshwar, Harsiddhi Mata Shaktipeeth, Baba Kaal Bhairav, and Queen Ahilyabai Holkar's Maheshwar Fort.",
    },
  ];

  return (
    <div className="font-sans text-slate-800 bg-white selection:bg-brand-orange/20 selection:text-brand-blue-deep overflow-x-hidden">
      {/* Structured Schema Markup */}
      <SchemaMarkup
        schema={[
          generateBusTripSchema(),
          generateLocalBusinessSchema(),
          generateFAQSchema(faqs),
          generateBreadcrumbSchema([
            { name: "Home", url: "https://www.shailrajtravels.com" },
            { name: "Tours", url: "https://www.shailrajtravels.com/tours" },
            { name: "Pune to Ujjain Bus Travels", url: "https://www.shailrajtravels.com/pune-to-ujjain-bus-travels" },
          ]),
        ]}
      />

      <Navbar t={t} />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 bg-gradient-to-b from-slate-900 via-slate-800 to-brand-blue-deep text-white overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-orange/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-blue/30 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & High-Intent Copy */}
            <div className="lg:col-span-7 text-left">
              {/* Trust Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 text-xs sm:text-sm font-bold text-amber-300">
                <Bus className="w-4 h-4 text-brand-orange" />
                <span>{lang === "mr" ? "पुणे ते उज्जैन थेट लक्झरी बस ट्रॅव्हल्स" : "PREMIER PUNE TO UJJAIN BUS TRAVELS"}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-white font-medium">5.0 ★ Google Rating</span>
              </div>

              {/* H1 Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display leading-[1.15] tracking-tight mb-6">
                Pune to Ujjain <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200">
                  Bus Travels & Tour
                </span>
              </h1>

              {/* Subheadline with Key Route Details */}
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl mb-8">
                {lang === "mr"
                  ? "पुणे येथून श्री महाकालेश्वर व ओंकारेश्वर ज्योतिर्लिंगासाठी लक्झरी एसी फोर्स अर्बनिया आणि स्लीपर बस ट्रॅव्हल्स. थेट मंदिर हॉटेल ड्रॉप, भस्म आरती मार्गदर्शन आणि शुद्ध शाकाहारी जेवणाची उत्तम सोय."
                  : "Experience Maharashtra's highest-rated pilgrimage bus travels from Pune to Shri Mahakaleshwar & Omkareshwar Jyotirlinga. Travel in executive AC Force Urbania & luxury sleeper coaches with direct temple doorstep hotel drop and guaranteed Bhasma Aarti assistance."}
              </p>

              {/* Quick Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold">Direct Temple Drop</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold">5.0★ (23+ Reviews)</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10 col-span-2 sm:col-span-1">
                  <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold">Bhasma Aarti Help</span>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={`tel:${businessConfig.supportPhone}`}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-white font-bold text-base transition-all shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 no-underline"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call 9764413556 to Book</span>
                </a>

                <Link
                  to={"/tours/pune-to-ujjain-tour-package" as any}
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-base border border-white/20 transition-all hover:-translate-y-0.5 no-underline"
                >
                  <span>View 3D/2N Tour Package</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Instant Booking & Quote Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-slate-800 relative">
                <div className="text-left mb-6">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">Fast Seat Reservation</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Seats Available
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold font-display text-brand-blue-deep">
                    Book Pune to Ujjain Bus
                  </h3>
                  <p className="text-xs text-slate-500">
                    Get instant pricing, boarding point confirmation & Bhasma Aarti guidance
                  </p>
                </div>

                {formSubmitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center text-emerald-800">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                    <h4 className="text-lg font-bold mb-1">Inquiry Dispatched!</h4>
                    <p className="text-xs text-emerald-700 mb-4">
                      Our reservation desk will confirm your seat within 15 minutes. WhatsApp chat opened.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormSubmitted(false)}
                      className="text-xs font-bold text-brand-blue underline"
                    >
                      Book Another Seat
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-3.5 text-left text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Mayur Patil"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange text-sm font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. 9876543210"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange text-sm font-medium"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Preferred Date</label>
                        <input
                          type="date"
                          required
                          value={formData.travelDate}
                          onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Passengers</label>
                        <select
                          value={formData.passengers}
                          onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange text-sm font-medium bg-white"
                        >
                          <option value="1">1 Person</option>
                          <option value="2">2 Persons</option>
                          <option value="3-5">3 to 5 (Family)</option>
                          <option value="6-10">6 to 10 (Urbania)</option>
                          <option value="11-17">11 to 17 (Full Group)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Pune Pickup Point</label>
                        <select
                          value={formData.boardingPoint}
                          onChange={(e) => setFormData({ ...formData, boardingPoint: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange text-sm font-medium bg-white"
                        >
                          <option value="Hadapsar">Hadapsar (Head Office)</option>
                          <option value="Swargate">Swargate ST Stand</option>
                          <option value="Pune Station">Pune Railway Station</option>
                          <option value="Viman Nagar">Viman Nagar / Kharadi</option>
                          <option value="Bhosari">Bhosari / Nashik Phata</option>
                          <option value="Wakad">Wakad / Hinjewadi</option>
                          <option value="Doorstep">Doorstep Home Pickup</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Vehicle Preference</label>
                      <select
                        value={formData.busType}
                        onChange={(e) => setFormData({ ...formData, busType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange text-sm font-medium bg-white"
                      >
                        <option value="AC Force Urbania (10/13/17 Seater)">Luxury AC Force Urbania (10/13/17 Seater)</option>
                        <option value="AC Sleeper Coach Bus">Multi-Axle AC Sleeper Coach Bus</option>
                        <option value="Innova Crysta Private">Toyota Innova Crysta (Private Executive)</option>
                        <option value="3D/2N All-Inclusive Yatra">3D/2N All-Inclusive Yatra Package</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-2 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-white font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Checking Availability...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Reserve Seat / Inquire on WhatsApp</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-slate-400 text-center">
                      Instant WhatsApp response • No cancellation fee before 7 days
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google AI Overview & GEO-Optimized Route Summary Section */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200">
              <div className="text-left">
                <span className="text-xs font-bold text-brand-orange uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-4 h-4 text-brand-orange" />
                  Key Route Logistics & Facts
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-brand-blue-deep">
                  Pune to Ujjain Bus Travels: Route, Duration & Fares
                </h2>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-semibold text-slate-500">Live Travel Sync:</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Daily Departures Active
                </span>
              </div>
            </div>

            {/* Fact Grid that Feeds Google AI Overviews */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
              {routeDetails.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-200/60 shadow-sm flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 text-brand-orange flex items-center justify-center shrink-0">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">{item.label}</div>
                      <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">{item.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section: Shailraj Travels vs Ordinary Highway Buses (redBus / MakeMyTrip) */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-brand-orange text-xs font-bold uppercase tracking-widest mb-3">
              Why We Are #1 in Pune
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-brand-blue-deep mb-4">
              Shailraj Travels vs. Ordinary Highway Buses
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              Why thousands of families avoid ordinary online aggregator buses and choose Shailraj Travels for their sacred Ujjain pilgrimage.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg text-left">
            <div className="grid grid-cols-12 bg-slate-900 text-white font-bold text-sm sm:text-base p-4 sm:p-5">
              <div className="col-span-4 sm:col-span-3">Feature</div>
              <div className="col-span-4 sm:col-span-5 text-amber-300 flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-300" />
                Shailraj Travels Bus & Urbania
              </div>
              <div className="col-span-4 sm:col-span-4 text-slate-400">Ordinary Highway Buses</div>
            </div>

            <div className="divide-y divide-slate-100 text-xs sm:text-sm">
              {comparisonRows.map((row, i) => (
                <div key={i} className="grid grid-cols-12 p-4 sm:p-5 items-center hover:bg-slate-50/80 transition-colors">
                  <div className="col-span-4 sm:col-span-3 font-bold text-slate-800 pr-2">
                    {row.feature}
                  </div>
                  <div className="col-span-4 sm:col-span-5 text-slate-700 font-medium pr-3 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{row.shailraj}</span>
                  </div>
                  <div className="col-span-4 sm:col-span-4 text-slate-500 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{row.regular}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Options Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">Luxury Fleet Choices</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-brand-blue-deep mt-2 mb-4">
              Pune to Ujjain Travel Fleet Options
            </h2>
            <p className="text-slate-600 text-base">
              From executive private Force Urbania vans to spacious luxury AC sleeper coaches for family and community tours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Card 1: Force Urbania */}
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-brand-orange flex items-center justify-center font-bold text-lg mb-4">
                  <Bus className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Luxury AC Force Urbania</h3>
                <p className="text-xs text-brand-orange font-bold mb-4">10 / 13 / 17 Seater Capacities</p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  The king of highway pilgrimage comfort. Plush Italian leather recliners, independent AC vents, panoramic viewing glass, and aircraft-style luggage bins.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 mb-6">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Individual USB Mobile Charging</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Air Suspension for Zero Fatigue</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Senior Citizen Friendly Low-Steps</li>
                </ul>
              </div>
              <a
                href={`tel:${businessConfig.supportPhone}`}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center transition-colors no-underline block"
              >
                Inquire Urbania Rates
              </a>
            </div>

            {/* Card 2: Multi-Axle AC Sleeper Bus */}
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border-2 border-brand-orange/40 shadow-md hover:shadow-lg transition-all flex flex-col justify-between relative">
              <div className="absolute -top-3 right-6 bg-brand-orange text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-sm">
                Most Popular for Groups
              </div>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-brand-orange flex items-center justify-center font-bold text-lg mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Multi-Axle AC Sleeper Bus</h3>
                <p className="text-xs text-brand-orange font-bold mb-4">Spacious Double & Single Berths</p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Ideal for large family mandals and corporate spiritual retreats. Overnight travel with clean sanitized bedding, privacy curtains, and dual air-conditioning.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 mb-6">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Full Reclining 2x1 Sleeper Layout</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Experienced Twin Highway Chauffeurs</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Direct Mahakal Mandir Drop</li>
                </ul>
              </div>
              <a
                href={`tel:${businessConfig.supportPhone}`}
                className="w-full py-3 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-white font-bold text-xs text-center transition-colors no-underline block"
              >
                Inquire Sleeper Bus Rates
              </a>
            </div>

            {/* Card 3: Innova Crysta Private */}
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-brand-orange flex items-center justify-center font-bold text-lg mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Toyota Innova Crysta</h3>
                <p className="text-xs text-brand-orange font-bold mb-4">6 - 7 Seater Private Executive</p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Fast, ultra-reliable private family car for customized timing. 100% doorstep Pune home pickup, flexible temple halts, and priority highway express transit.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 mb-6">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Captain Chair Comfort</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Flexible Departure Timings</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Complete Sightseeing Flexibility</li>
                </ul>
              </div>
              <a
                href={`tel:${businessConfig.supportPhone}`}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center transition-colors no-underline block"
              >
                Inquire Crysta Rates
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Boarding Points & Timetable Table */}
      <section className="py-16 bg-slate-50 border-t border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">Convenient Boarding</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-brand-blue-deep mt-2 mb-4">
              Pune Boarding Points & Timetable
            </h2>
            <p className="text-slate-600 text-base">
              Multiple designated boarding spots across Pune city and PCMC highway exits.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-12 bg-slate-900 text-white font-bold text-xs sm:text-sm p-4">
              <div className="col-span-6 sm:col-span-6 text-left">Boarding Location</div>
              <div className="col-span-3 sm:col-span-3 text-center">Morning Batch</div>
              <div className="col-span-3 sm:col-span-3 text-center">Night Sleeper</div>
            </div>
            <div className="divide-y divide-slate-100 text-xs sm:text-sm text-left">
              {boardingPoints.map((b, i) => (
                <div key={i} className="grid grid-cols-12 p-4 items-center hover:bg-slate-50/80">
                  <div className="col-span-6 sm:col-span-6 font-semibold text-slate-800 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-orange shrink-0" />
                    <span>{b.point}</span>
                  </div>
                  <div className="col-span-3 sm:col-span-3 text-center font-bold text-brand-blue">
                    {b.timeMorning}
                  </div>
                  <div className="col-span-3 sm:col-span-3 text-center font-bold text-slate-700">
                    {b.timeEvening}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Accordion */}
      <section className="py-16 lg:py-24 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">Got Questions?</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-brand-blue-deep mt-2 mb-4">
              Pune to Ujjain Bus Travels FAQs
            </h2>
            <p className="text-slate-600 text-base max-w-2xl mx-auto">
              Clear answers to the most frequently asked questions about booking bus travels from Pune to Ujjain.
            </p>
          </div>

          <div className="space-y-4 text-left">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-800 hover:text-brand-orange text-sm sm:text-base bg-white cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-brand-orange shrink-0" />
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 bg-gradient-to-r from-brand-blue-deep to-slate-900 text-white text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
            Plan Your Pune to Ujjain Bus Travel Today
          </h2>
          <p className="text-slate-200 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Direct temple drop, verified 3-star AC hotels, and VIP Bhasma Aarti reservation support. Speak with our pilgrimage planner now.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`tel:${businessConfig.supportPhone}`}
              className="px-8 py-4 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-white font-bold text-base transition-all shadow-lg hover:shadow-orange-500/30 no-underline"
            >
              Call 9764413556
            </a>
            <a
              href="https://wa.me/919764413556?text=Hi%20Shailraj%20Travels,%20I%20want%20to%20book%20Pune%20to%20Ujjain%20Bus%20Travels."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base transition-all shadow-lg hover:shadow-emerald-600/30 no-underline"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer t={t} lang={lang} />
    </div>
  );
}

