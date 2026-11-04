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
  Check,
  Send,
  Loader2,
  MessageSquare,
  Tag,
  Zap,
  Building,
  Flame,
  CheckCheck,
} from 'lucide-react';
import newhomeMobileAvif from '@/frontend/shared/assets/newhome-mobile.avif';
import newhomeMobileWebp from '@/frontend/shared/assets/newhome-mobile.webp';
import newhomeAvif from '@/frontend/shared/assets/newhome.avif';
import newhomeWebp from '@/frontend/shared/assets/newhome.webp';

export const Route = createFileRoute("/pune-to-ujjain-bus-travels")({
  head: () => ({
    meta: generateSEO({
      title: "Pune to Ujjain Tour Package | Friday Mahakal Darshan – Shailraj Travels",
      description:
        "Explore Pune to Ujjain Mahakal Darshan tours with Shailraj Travels. Weekly Friday departures in premium AC Force Urbania with comfortable seating, experienced guides and a memorable 2-day pilgrimage experience.",
      canonicalUrl: "https://www.shailrajtravels.com/pune-to-ujjain-bus-travels",
      keywords: [
        "Pune to Ujjain Travels",
        "Pune to Ujjain Tour Package",
        "Pune to Ujjain Best Travels",
        "Pune to Ujjain Mahakal Darshan",
        "Pune to Ujjain Bus Tour",
        "Pune to Ujjain Urbania Tour",
        "Pune to Ujjain Tour Every Friday",
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
        "friday ujjain darshan tour from pune",
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
  const t = translations[lang] || translations.en;

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
      const text = `*Pune to Ujjain Mahakal Darshan Tour Inquiry*%0A%0A*Name:* ${formData.name}%0A*Phone:* ${formData.phone}%0A*Departure:* Friday Batch (${formData.travelDate || "Next Upcoming Friday"})%0A*Passengers:* ${formData.passengers}%0A*Pickup Point:* ${formData.boardingPoint}%0A*Vehicle Preference:* ${formData.busType}%0A%0A_Please share current package offers and seat availability._`;
      window.open(`https://wa.me/919764413556?text=${text}`, "_blank");
    }, 700);
  };

  const routeDetails = [
    { label: "Departure", value: "Every Friday (Weekly Batch)", icon: Calendar },
    { label: "Duration", value: "2 Days / 1 Night Pilgrimage", icon: Clock },
    { label: "Vehicle", value: "AC Luxury Force Urbania & Sleeper", icon: Bus },
    { label: "Route", value: "Pune – Mumbai – Ujjain (NH 60/52)", icon: Navigation },
    { label: "Experience", value: "Guided Temple Darshan & Bhasma Aarti", icon: ShieldCheck },
    { label: "Package Offers", value: "Contact Us for Current Package Offers", icon: Tag, highlight: true },
  ];

  const itinerarySteps = [
    {
      day: "Friday Evening",
      title: "Pune Departure & Highway Overnight Cruise",
      badge: "Day 0 • Departure",
      description:
        "Board our AC Luxury Force Urbania or multi-axle sleeper coach at your chosen Pune pickup point (Hadapsar, Swargate, Station, Wakad, Bhosari). Settle into pushback recliners with USB charging ports. Smooth, overnight transit via Mumbai / Nashik express corridor with scheduled hygienic washroom halts.",
    },
    {
      day: "Saturday",
      title: "Ujjain Arrival, Ram Ghat, Kaal Bhairav & Evening Mahakal Darshan",
      badge: "Day 1 • Ujjain Darshan",
      description:
        "Morning arrival in Ujjain with direct doorstep hotel drop next to Mahakaleshwar Temple. Freshen up in verified 3-star AC rooms and enjoy pure vegetarian Sattvic breakfast. Take a holy dip at Ram Ghat on the sacred Shipra River. Seek divine blessings at Baba Kaal Bhairav and Harsiddhi Mata (51 Shaktipeeth). Attend the grand evening Sandhya Aarti at Shri Mahakaleshwar and explore the magnificent Mahakal Lok Corridor.",
    },
    {
      day: "Sunday",
      title: "4 AM Bhasma Aarti, Omkareshwar Jyotirlinga & Return Journey",
      badge: "Day 2 • Omkareshwar & Return",
      description:
        "Experience the sacred 4:00 AM Bhasma Aarti or Sheegra Darshan at Shri Mahakaleshwar Temple with our personal VIP token guidance. After breakfast, proceed to Shri Omkareshwar Jyotirlinga and Mamleshwar on the Narmada River island with boat parikrama. In the afternoon, begin the return journey to Pune, arriving early Monday morning refreshed and blessed.",
    },
  ];

  const destinationsList = [
    {
      name: "Shri Mahakaleshwar Jyotirlinga",
      desc: "Dakshinmukhi swayambhu lingam, Bhasma Aarti & sacred Nandi hall",
      icon: Flame,
    },
    {
      name: "Baba Kaal Bhairav Mandir",
      desc: "The fierce guardian of Ujjain, famous for traditional Prasad offerings",
      icon: ShieldCheck,
    },
    {
      name: "Maa Harsiddhi Shaktipeeth",
      desc: "One of the 51 sacred Shaktipeeths with majestic twin deepstambhas",
      icon: Sparkles,
    },
    {
      name: "Ram Ghat & Shipra River",
      desc: "Historic Kumbh Mela bathing ghat with serene evening Shipra Maha Aarti",
      icon: Navigation,
    },
    {
      name: "Shri Mahakal Lok Corridor",
      desc: "900-meter grand cultural corridor featuring 108 Lord Shiva murals",
      icon: Building,
    },
    {
      name: "Shri Omkareshwar Jyotirlinga",
      desc: "Sacred Om-shaped river island, Mamleshwar & Narmada boat parikrama",
      icon: Star,
    },
  ];

  const facilitiesList = [
    { title: "Dual AC Climate Control", desc: "Even, pleasant cooling across every seat row" },
    { title: "Plush Pushback Recliners", desc: "Italian ergonomic leatherette seating for restful highway sleep" },
    { title: "Individual USB Charging", desc: "Keep mobile phones & cameras charged throughout the pilgrimage" },
    { title: "Air Suspension Chassis", desc: "Zero road shock or highway fatigue for senior citizens" },
    { title: "Direct Hotel Doorstep Drop", desc: "Stay within walking distance of Mahakaleshwar Temple Gate" },
    { title: "Sattvic Pure Veg Dining", desc: "Pre-verified family restaurants serving clean, hygienic food" },
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
      shailraj: "Complete 2-Day Itinerary: Mahakal, Kaal Bhairav, Harsiddhi, Ram Ghat & Omkareshwar",
      regular: "Point-to-point only; separate expensive local autos required",
    },
    {
      feature: "Vehicle Fleet & Comfort",
      shailraj: "Luxury AC Force Urbania (10/13/17 seats) with recliners, air suspension & USB ports",
      regular: "Crowded 40-50 passenger buses with hard berths and rattles",
    },
    {
      feature: "Senior Citizen Support",
      shailraj: "Low-step entry, luggage assistance, hygienic washroom halts every 3 hrs",
      regular: "High climb, hurried 10-minute halts at unhygienic dhabas",
    },
    {
      feature: "Pricing Transparency",
      shailraj: "Contact Us for Current Package Offers (Zero hidden extras, all toll/taxes included)",
      regular: "Hidden charges, high festival surcharges added at last minute",
    },
  ];

  const boardingPoints = [
    { point: "Hadapsar (Shailraj Travels Office, Gadital)", timeEvening: "07:30 PM" },
    { point: "Swargate (Laxmi Narayan Cinema / ST Stand)", timeEvening: "08:15 PM" },
    { point: "Pune Railway Station (Opp. Inox / Central)", timeEvening: "08:45 PM" },
    { point: "Viman Nagar / Kharadi Bypass", timeEvening: "09:15 PM" },
    { point: "Bhosari / Nashik Phata / Chakan", timeEvening: "09:45 PM" },
    { point: "Wakad / Hinjewadi Bridge", timeEvening: "10:15 PM" },
    { point: "Doorstep Home Pickup (For Private Urbania Groups)", timeEvening: "As Scheduled" },
  ];

  const faqs = [
    {
      question: "When does the Pune to Ujjain Mahakal Darshan tour depart?",
      answer:
        "Shailraj Travels operates guaranteed weekly departures every Friday evening from Pune. The vehicle departs between 7:30 PM and 10:15 PM across designated Pune pickup points, arrives in Ujjain on Saturday morning, and returns on Sunday night/Monday morning for a seamless 2 Days / 1 Night weekend pilgrimage without missing working hours.",
    },
    {
      question: "What vehicle is used for the Pune to Ujjain Urbania tour every Friday?",
      answer:
        "We operate executive AC Luxury Force Urbania vans (10, 13, and 17-seater capacity) as well as multi-axle AC sleeper coaches. All vehicles are equipped with pushback ergonomic recliners, individual AC vents, dedicated USB charging points at every seat, panoramic windows, and advanced air suspension for zero highway fatigue.",
    },
    {
      question: "What is the package price for the Pune to Ujjain tour?",
      answer:
        "We follow a dynamic pricing strategy to give our travelers the best seasonal discounts, festival offers (Mahashivratri, Shravan Maas), and family group rates. Please click 'Check Current Offers' or 'WhatsApp for Details' (+91 9764413556) to receive our current package offers and special discounts immediately.",
    },
    {
      question: "Which temples and attractions are covered in the 2-day itinerary?",
      answer:
        "Our complete 2-day pilgrimage covers Shri Mahakaleshwar Jyotirlinga (Dakshinmukhi), Baba Kaal Bhairav Mandir, Maa Harsiddhi Shaktipeeth, the sacred Shipra River at Ram Ghat, the 900-meter Mahakal Lok Corridor, and Shri Omkareshwar Jyotirlinga with Narmada boat parikrama.",
    },
    {
      question: "Does Shailraj Travels assist with Mahakaleshwar Bhasma Aarti tokens?",
      answer:
        "Yes! We provide complete advance token booking guidance for the sacred 4:00 AM Bhasma Aarti and daytime Sheegra Darshan fast-track passes. We also assist travelers with the mandatory traditional dress code (unstitched Dhoti/Solah for men, traditional Saree for women) and Gate No. 4 entry protocols.",
    },
    {
      question: "Where are the boarding points in Pune for the Friday Ujjain tour?",
      answer:
        "We offer multiple convenient boarding spots across Pune: Hadapsar (Head Office), Swargate, Pune Railway Station, Viman Nagar / Kharadi, Bhosari / Nashik Phata, and Wakad / Hinjewadi Bridge. For private family Urbania bookings, 100% doorstep home pickup across Pune and PCMC is available.",
    },
    {
      question: "What facilities and inclusions are included in the package?",
      answer:
        "The package includes round-trip travel in AC Luxury Force Urbania / sleeper coach, 3-star AC hotel accommodation within walking distance of Mahakaleshwar Temple, pure vegetarian Sattvic meals, all interstate toll taxes, state permits, parking charges, driver allowances, and temple darshan guidance.",
    },
    {
      question: "How do I book my seat for the upcoming Friday departure?",
      answer:
        "You can reserve your seat immediately by clicking 'Book Your Seat' or messaging our reservation desk on WhatsApp at +91 9764413556. A small advance token secures your seat, with remaining payment upon boarding.",
    },
  ];

  return (
    <div className="font-sans text-slate-800 bg-white selection:bg-brand-blue/10 selection:text-brand-blue-deep overflow-x-hidden">
      {/* Structured Schema Markup */}
      <SchemaMarkup
        schema={[
          generateBusTripSchema(),
          generateLocalBusinessSchema(),
          generateFAQSchema(faqs),
          generateBreadcrumbSchema([
            { name: "Home", url: "https://www.shailrajtravels.com" },
            { name: "Tours", url: "https://www.shailrajtravels.com/tours" },
            {
              name: "Pune to Ujjain Tour Package",
              url: "https://www.shailrajtravels.com/pune-to-ujjain-bus-travels",
            },
          ]),
        ]}
      />

      <Navbar t={t} />

      {/* Hero Section with Main Landing Page Background Image (Light Theme) */}
      <section className="relative w-full overflow-hidden bg-brand-mist pt-28 pb-16 lg:pt-36 lg:pb-24 text-slate-800">
        {/* Main Landing Page Background Split */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Image on Right */}
          <div className="absolute inset-y-0 right-0 w-full lg:w-[65%] overflow-hidden">
            {/* Mobile background */}
            <picture className="block lg:hidden h-full w-full">
              <source srcSet={newhomeMobileAvif} type="image/avif" />
              <source srcSet={newhomeMobileWebp} type="image/webp" />
              <img
                src={newhomeMobileWebp}
                alt="Pune to Ujjain Mahakal Darshan Tour - Shailraj Travels"
                className="h-full w-full object-cover object-[70%_center]"
                fetchPriority="high"
                loading="eager"
                width={720}
                height={400}
              />
            </picture>

            {/* Desktop background */}
            <picture className="hidden lg:block h-full w-full">
              <source srcSet={newhomeAvif} type="image/avif" />
              <source srcSet={newhomeWebp} type="image/webp" />
              <img
                src={newhomeWebp}
                alt="Pune to Ujjain Mahakal Darshan Tour - Shailraj Travels"
                className="h-full w-full object-cover object-right-bottom scale-105"
                fetchPriority="high"
                loading="eager"
                width={1738}
                height={905}
              />
            </picture>

            {/* White gradient fade for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/50 to-transparent lg:bg-gradient-to-r lg:from-white lg:via-white/35 lg:to-transparent" />
            {/* Bottom soft fade */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-mist to-transparent" />
          </div>

          {/* Left soft surface for crisp text contrast */}
          <div className="absolute inset-y-0 left-0 hidden lg:block w-[55%] bg-gradient-to-r from-brand-mist via-white/95 to-transparent" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & High-Intent Copy */}
            <div className="lg:col-span-7 text-left">
              {/* Trust Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-green/10 text-brand-green-dark border border-brand-green/20 mb-5 text-xs sm:text-sm font-bold tracking-wide">
                <Calendar className="w-4 h-4 text-brand-green-dark" />
                <span>DEPARTURE: EVERY FRIDAY</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                <span className="text-slate-700 font-medium">5.0 ★ Google Rating (Verified Yatris)</span>
              </div>

              {/* H1 Heading */}
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold font-display leading-[1.15] text-brand-blue-deep tracking-tight mb-4">
                Pune to Ujjain <br className="hidden sm:inline" />
                <span className="text-brand-green-dark">
                  Mahakal Darshan Tour
                </span>
              </h1>

              {/* Subheadline with Key Route Details */}
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl font-medium mb-6">
                Explore Pune to Ujjain Mahakal Darshan tours with <strong className="text-brand-blue-deep font-bold">Shailraj Travels</strong>. Weekly Friday departures in premium AC Force Urbania with comfortable seating, experienced guides and a memorable 2-day pilgrimage experience covering Shri Mahakaleshwar, Kaal Bhairav, Ram Ghat, and Omkareshwar.
              </p>

              {/* Quick Route Summary Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-7 text-xs font-semibold text-slate-800">
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2.5 rounded-xl border border-slate-200/90 shadow-xs">
                  <Calendar className="w-4 h-4 text-brand-blue shrink-0" />
                  <span>Every Friday Batch</span>
                </div>
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2.5 rounded-xl border border-slate-200/90 shadow-xs">
                  <Clock className="w-4 h-4 text-brand-blue shrink-0" />
                  <span>2 Days / 1 Night</span>
                </div>
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2.5 rounded-xl border border-slate-200/90 shadow-xs">
                  <Bus className="w-4 h-4 text-brand-blue shrink-0" />
                  <span>AC Luxury Urbania</span>
                </div>
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2.5 rounded-xl border border-slate-200/90 shadow-xs">
                  <Navigation className="w-4 h-4 text-brand-blue shrink-0" />
                  <span>Pune – Mumbai – Ujjain</span>
                </div>
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2.5 rounded-xl border border-slate-200/90 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Guided Darshan</span>
                </div>
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2.5 rounded-xl border border-slate-200/90 shadow-xs">
                  <Sparkles className="w-4 h-4 text-brand-blue shrink-0" />
                  <span>Doorstep Temple Drop</span>
                </div>
              </div>

              {/* Dynamic Pricing Callout Banner */}
              <div className="bg-brand-green/5 border border-brand-green/20 rounded-2xl p-4 mb-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wider font-extrabold text-brand-green-dark flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-brand-green-dark" />
                    Transparent Dynamic Pricing
                  </div>
                  <div className="text-base sm:text-lg font-bold text-brand-blue-deep mt-0.5">
                    Contact Us for Current Package Offers
                  </div>
                </div>
                <span className="text-xs text-slate-600 sm:text-right font-medium">
                  Seasonal & group deals available • No hidden fees
                </span>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5">
                <a
                  href="#booking-section"
                  className="btn-cta inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 no-underline transition-all"
                >
                  <Tag className="w-4 h-4" />
                  <span>Check Current Offers</span>
                </a>

                <a
                  href={`tel:${businessConfig.supportPhone}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-brand-blue-deep font-bold text-sm sm:text-base border border-slate-200 shadow-xs hover:shadow-sm hover:-translate-y-0.5 no-underline transition-all"
                >
                  <Phone className="w-4 h-4 text-brand-blue" />
                  <span>Book Your Seat</span>
                </a>

                <a
                  href="https://wa.me/919764413556?text=Hi%20Shailraj%20Travels,%20please%20share%20the%20current%20package%20offers%20and%20seat%20availability%20for%20the%20Pune%20to%20Ujjain%20Friday%20Mahakal%20Darshan%20Tour."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm sm:text-base transition-all shadow-md hover:-translate-y-0.5 no-underline"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp for Details</span>
                </a>
              </div>
            </div>

            {/* Right Column: Instant Booking & Quote Card */}
            <div className="lg:col-span-5" id="booking-section">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-slate-800 relative">
                <div className="text-left mb-6">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-brand-green-dark uppercase tracking-wider">
                      Friday Batch Booking
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Friday Seats Open
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold font-display text-brand-blue-deep">
                    Book Your Ujjain Tour Seat
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Contact us for current package offers, seat selection & Bhasma Aarti guidance
                  </p>
                </div>

                {formSubmitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center text-emerald-800">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                    <h4 className="text-lg font-bold mb-1">Inquiry Dispatched!</h4>
                    <p className="text-xs text-emerald-700 mb-4">
                      Our reservation desk will confirm your seat within 15 minutes. WhatsApp chat opened with full details.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormSubmitted(false)}
                      className="text-xs font-bold text-brand-blue underline cursor-pointer"
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
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue text-sm font-medium"
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
                          placeholder="e.g. 9764413556"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue text-sm font-medium"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Upcoming Friday Date</label>
                        <input
                          type="date"
                          value={formData.travelDate}
                          onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Passengers</label>
                        <select
                          value={formData.passengers}
                          onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue text-sm font-medium bg-white"
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
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue text-sm font-medium bg-white"
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
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue text-sm font-medium bg-white"
                      >
                        <option value="AC Force Urbania (10/13/17 Seater)">AC Luxury Force Urbania (10/13/17 Seater)</option>
                        <option value="Multi-Axle AC Sleeper Bus">Multi-Axle AC Sleeper Coach Bus</option>
                        <option value="Toyota Innova Crysta Private">Toyota Innova Crysta (Private Executive)</option>
                        <option value="Complete 2D/1N Tour Package">Complete 2D/1N All-Inclusive Package</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-cta w-full mt-2 py-3.5 rounded-xl text-white font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Checking Friday Availability...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Check Current Offers & Book Seat</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-slate-400 text-center">
                      Instant WhatsApp quote • Direct call support 24/7
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Tour Logistics & Specifications Grid */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200">
              <div className="text-left">
                <span className="text-xs font-bold text-brand-green-dark uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-4 h-4 text-brand-green-dark" />
                  Official Tour Specifications
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-brand-blue-deep">
                  Pune to Ujjain Tour Package Logistics
                </h2>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-semibold text-slate-500">Departure Schedule:</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-green/10 text-brand-green-dark border border-brand-green/20">
                  Every Friday Guaranteed
                </span>
              </div>
            </div>

            {/* Fact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
              {routeDetails.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl p-4 border shadow-sm flex items-start gap-3.5 transition-all ${
                      item.highlight
                        ? "bg-brand-green/5 border-brand-green/30 ring-1 ring-brand-green/20"
                        : "bg-white border-slate-200/60"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        item.highlight
                          ? "bg-brand-green-dark text-white"
                          : "bg-brand-mist border border-brand-blue/10 text-brand-blue"
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                        {item.label}
                      </div>
                      <div
                        className={`text-sm sm:text-base font-extrabold mt-0.5 ${
                          item.highlight ? "text-brand-green-dark" : "text-brand-blue-deep"
                        }`}
                      >
                        {item.value}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Complete 2-Day Itinerary Section */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-brand-green-dark uppercase tracking-wider">
              Pilgrimage Schedule
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-brand-blue-deep mt-2 mb-4">
              Complete 2-Day Itinerary
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Carefully scheduled Friday to Sunday weekend circuit crafted for seamless temple darshan without fatigue or rushing.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {itinerarySteps.map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-brand-green/10 text-brand-green-dark border border-brand-green/20">
                    {step.badge}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{step.day}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-brand-blue-deep mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Itinerary CTA */}
          <div className="mt-10 text-center">
            <a
              href="https://wa.me/919764413556?text=Hi%20Shailraj%20Travels,%20please%20send%20me%20the%20detailed%20Pune%20to%20Ujjain%202-Day%20Itinerary%20PDF%20and%20current%20offers."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-md hover:-translate-y-0.5 transition-all no-underline"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp for Details & PDF Itinerary</span>
            </a>
          </div>
        </div>
      </section>

      {/* Destinations Covered Section */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-brand-green-dark uppercase tracking-wider">
              Sacred Circuit
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-brand-blue-deep mt-2 mb-4">
              Destinations Covered in the Tour
            </h2>
            <p className="text-slate-600 text-base">
              Visit the holiest Jyotirlingas, Shaktipeeths, and sacred river ghats of Madhya Pradesh with complete local guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {destinationsList.map((dest, i) => {
              const IconComp = dest.icon;
              return (
                <div
                  key={i}
                  className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-brand-blue/30 hover:bg-white hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-mist border border-brand-blue/10 text-brand-blue flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-blue transition-colors mb-2">
                    {dest.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {dest.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Facilities & Vehicle Fleet Options Section */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-brand-green-dark uppercase tracking-wider">
              Fleet & Facilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-brand-blue-deep mt-2 mb-4">
              Premium Facilities & Vehicle Fleet
            </h2>
            <p className="text-slate-600 text-base">
              Engineered for maximum highway relaxation, smooth suspension, and comfortable senior citizen travel.
            </p>
          </div>

          {/* Key Facilities Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16 text-left">
            {facilitiesList.map((f, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start gap-3.5"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{f.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Vehicle Fleet Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Card 1: Force Urbania */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-brand-blue/30 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between relative">
              <div className="absolute -top-3.5 right-6 bg-brand-blue-deep text-white text-[11px] font-extrabold uppercase px-3.5 py-1 rounded-full shadow-sm">
                Preferred for Friday Tours
              </div>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-mist border border-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-lg mb-4">
                  <Bus className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">AC Luxury Force Urbania</h3>
                <p className="text-xs text-brand-green-dark font-bold mb-4">10 / 13 / 17 Seater Configurations</p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Plush Italian recliners, independent overhead AC blowers, panoramic viewing windows, and soft air suspension designed specifically for highway comfort.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 mb-6">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Individual USB Mobile Charging</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Air Suspension for Zero Fatigue</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Low-Step Senior Citizen Access</li>
                </ul>
              </div>
              <div>
                <div className="p-3 bg-slate-50 rounded-xl text-center mb-4 border border-slate-100">
                  <span className="text-xs font-bold text-brand-blue-deep">
                    Contact Us for Current Package Offers
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="#booking-section"
                    className="btn-cta py-2.5 rounded-xl text-white font-bold text-xs text-center transition-all shadow-xs hover:shadow-sm no-underline block"
                  >
                    Check Offers
                  </a>
                  <a
                    href="https://wa.me/919764413556?text=Hi%20Shailraj%20Travels,%20please%20share%20current%20offers%20for%20AC%20Force%20Urbania%20Pune%20to%20Ujjain%20Tour."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs text-center transition-colors no-underline block shadow-xs"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Card 2: Multi-Axle AC Sleeper Bus */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-mist border border-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-lg mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Multi-Axle AC Sleeper Bus</h3>
                <p className="text-xs text-brand-green-dark font-bold mb-4">Double & Single Sleeper Berths</p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Spacious sleeper coaches ideal for family mandals and group yatras. Includes sanitized clean bedding, privacy curtains, and dual high-capacity AC.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 mb-6">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Full Reclining 2x1 Sleeper Layout</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Experienced Highway Chauffeurs</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Direct Mahakal Mandir Drop</li>
                </ul>
              </div>
              <div>
                <div className="p-3 bg-slate-50 rounded-xl text-center mb-4 border border-slate-100">
                  <span className="text-xs font-bold text-brand-blue-deep">
                    Contact Us for Current Package Offers
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="#booking-section"
                    className="py-2.5 rounded-xl bg-brand-blue-deep hover:bg-brand-blue text-white font-bold text-xs text-center transition-colors no-underline block shadow-xs"
                  >
                    Check Offers
                  </a>
                  <a
                    href="https://wa.me/919764413556?text=Hi%20Shailraj%20Travels,%20please%20share%20current%20offers%20for%20AC%20Sleeper%20Bus%20Pune%20to%20Ujjain."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs text-center transition-colors no-underline block shadow-xs"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Card 3: Toyota Innova Crysta Private */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-mist border border-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-lg mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Toyota Innova Crysta</h3>
                <p className="text-xs text-brand-green-dark font-bold mb-4">6 - 7 Seater Private Executive</p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Fast, ultra-reliable private family car for customized departure timings. 100% doorstep home pickup across Pune and PCMC with flexible temple halts.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 mb-6">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Captain Chair Comfort</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Flexible Departure Timings</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Doorstep Pickup & Drop</li>
                </ul>
              </div>
              <div>
                <div className="p-3 bg-slate-50 rounded-xl text-center mb-4 border border-slate-100">
                  <span className="text-xs font-bold text-brand-blue-deep">
                    Contact Us for Current Package Offers
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="#booking-section"
                    className="py-2.5 rounded-xl bg-brand-blue-deep hover:bg-brand-blue text-white font-bold text-xs text-center transition-colors no-underline block shadow-xs"
                  >
                    Check Offers
                  </a>
                  <a
                    href="https://wa.me/919764413556?text=Hi%20Shailraj%20Travels,%20please%20share%20current%20offers%20for%20Innova%20Crysta%20Pune%20to%20Ujjain."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs text-center transition-colors no-underline block shadow-xs"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section: Shailraj Travels vs Ordinary Highway Buses */}
      <section className="py-16 lg:py-24 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green-dark text-xs font-bold uppercase tracking-widest mb-3">
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
            <div className="grid grid-cols-12 bg-brand-blue-deep text-white font-bold text-xs sm:text-sm p-4 sm:p-5">
              <div className="col-span-4 sm:col-span-3">Feature</div>
              <div className="col-span-4 sm:col-span-5 text-brand-green flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-brand-green text-brand-green" />
                Shailraj Travels (Urbania & Bus)
              </div>
              <div className="col-span-4 sm:col-span-4 text-slate-400">Ordinary Highway Aggregators</div>
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
                    <div className="w-4 h-4 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">✕</div>
                    <span>{row.regular}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Boarding Points & Timetable Table */}
      <section className="py-16 bg-slate-50 border-t border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-brand-green-dark uppercase tracking-wider">Convenient Boarding</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-brand-blue-deep mt-2 mb-4">
              Pune Boarding Points & Friday Schedule
            </h2>
            <p className="text-slate-600 text-base">
              Convenient departure points across Pune city and PCMC highway exits.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-12 bg-brand-blue-deep text-white font-bold text-xs sm:text-sm p-4">
              <div className="col-span-8 sm:col-span-8 text-left">Boarding Location in Pune</div>
              <div className="col-span-4 sm:col-span-4 text-center">Friday Evening Time</div>
            </div>
            <div className="divide-y divide-slate-100 text-xs sm:text-sm text-left">
              {boardingPoints.map((b, i) => (
                <div key={i} className="grid grid-cols-12 p-4 items-center hover:bg-slate-50/80">
                  <div className="col-span-8 sm:col-span-8 font-semibold text-slate-800 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-blue shrink-0" />
                    <span>{b.point}</span>
                  </div>
                  <div className="col-span-4 sm:col-span-4 text-center font-bold text-brand-green-dark">
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
            <span className="text-xs font-bold text-brand-green-dark uppercase tracking-wider">Got Questions?</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-brand-blue-deep mt-2 mb-4">
              Frequently Asked Questions (FAQs)
            </h2>
            <p className="text-slate-600 text-base max-w-2xl mx-auto">
              Everything you need to know about our Friday Pune to Ujjain Mahakal Darshan Tour, booking process, vehicles, and package inclusions.
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
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-800 hover:text-brand-blue-deep text-sm sm:text-base bg-white cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-brand-blue shrink-0" />
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${
                        isOpen ? "rotate-180" : ""
                      }`}
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

      {/* Final Call to Action Section (Light Theme) */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-brand-mist via-white to-slate-50 border-t border-slate-200/80 text-center relative overflow-hidden">
        {/* Subtle decorative background blur glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-blue/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-green/10 text-brand-green-dark text-xs font-bold uppercase tracking-wider mb-4 border border-brand-green/20">
            <Calendar className="w-3.5 h-3.5 text-brand-green-dark" />
            <span>Every Friday Departures • Limited Seats Per Batch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-brand-blue-deep tracking-tight mb-4">
            Book Your Seat for This Friday's <span className="text-brand-green-dark">Ujjain Tour</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
            Direct temple hotel doorstep drop, confirmed Bhasma Aarti reservation assistance, verified 3-star AC hotel stay, and luxury AC Force Urbania travel.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#booking-section"
              className="btn-cta px-7 py-3.5 rounded-xl text-white font-bold text-base transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 no-underline flex items-center gap-2"
            >
              <Tag className="w-4 h-4" />
              <span>Check Current Offers</span>
            </a>
            <a
              href={`tel:${businessConfig.supportPhone}`}
              className="px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-brand-blue-deep font-bold text-base border border-slate-200 transition-all shadow-xs hover:shadow-sm hover:-translate-y-0.5 no-underline flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-brand-blue" />
              <span>Book Your Seat</span>
            </a>
            <a
              href="https://wa.me/919764413556?text=Hi%20Shailraj%20Travels,%20please%20share%20current%20package%20offers%20for%20the%20Friday%20Pune%20to%20Ujjain%20Tour."
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-base transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 no-underline flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp for Details</span>
            </a>
          </div>
        </div>
      </section>

      <Footer t={t} lang={lang} />
    </div>
  );
}
