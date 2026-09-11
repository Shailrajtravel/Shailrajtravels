// @ts-nocheck
import React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { generateSEO } from '@/backend/features/seo';
import { useLanguage } from '@/routes/__root';
import { translations } from '@/frontend/core/i18n';
import { Navbar } from '@/frontend/core/Navbar';
import { FooterSection as Footer } from '@/frontend/core/Footer';
import { SchemaMarkup } from '@/frontend/shared/components/SchemaMarkup';
import { businessConfig } from '@/frontend/shared/config/business';
import {
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  Users,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Car,
  Compass,
  BookOpen,
} from 'lucide-react';

export const Route = createFileRoute("/travel-agency-in-pune")({
  head: () => ({
    meta: generateSEO({
      title: "Travel Agency in Pune | Shailraj Travels",
      description:
        "Looking for a reliable travel agency in Pune? Shailraj Travels offers pilgrimage tours, family vacations, group travel, and luxury AC Force Urbania packages across India.",
      canonicalUrl: "https://www.shailrajtravels.com/travel-agency-in-pune",
    }),
    links: [{ rel: "canonical", href: "https://www.shailrajtravels.com/travel-agency-in-pune" }],
  }),
  component: TravelAgencyInPunePage,
});

function TravelAgencyInPunePage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const faqs = [
    {
      question: "What is Shailraj Travels and where is it located in Pune?",
      answer:
        "Shailraj Travels is a premier travel agency and tour operator headquartered at Hadapsar, Pune (PIN: 412307). With 15+ years of experience and 580+ 5-star traveler reviews, Shailraj Travels specializes in pilgrimage yatras, family tours, group charters, and customized packages across Maharashtra and India.",
    },
    {
      question: "Which areas in Pune does Shailraj Travels offer pickup from?",
      answer:
        "Shailraj Travels provides convenient doorstep and central pickup points across Pune and PCMC, including Hadapsar, Swargate, Kothrud, Deccan, Shivajinagar, Hinjewadi, Wakad, Baner, Viman Nagar, Kharadi, Pimpri, and Chinchwad.",
    },
    {
      question: "What tour packages does this Pune travel agency specialize in?",
      answer:
        "Shailraj Travels specializes in Jyotirlinga yatras (Ujjain Mahakaleshwar, Omkareshwar, Grishneshwar, Trimbakeshwar, Bhimashankar), Ashtavinayak Darshan, Char Dham Yatra, Tirupati Balaji, Pandharpur, Konkan coastal holidays, and custom family vacations.",
    },
    {
      question: "What vehicles are available in your fleet?",
      answer:
        "Our fleet consists of luxury AC Force Urbania (12 and 17 seaters with individual reclining seats and large panoramic windows), Toyota Innova Crysta, tempo travellers, and 35-50 seater luxury AC coaches.",
    },
    {
      question: "How do I book a tour package with Shailraj Travels?",
      answer:
        "You can book directly by calling our 24/7 hotline at +91 97644 13556, WhatsApping us, or filling out the booking form on our website. All bookings receive an instant confirmation and verified travel invoice.",
    },
  ];

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "LocalBusiness"],
    name: "Shailraj Travels — Travel Agency in Pune",
    url: "https://www.shailrajtravels.com/travel-agency-in-pune",
    logo: "https://www.shailrajtravels.com/logo.png",
    image: "https://www.shailrajtravels.com/logo.png",
    description:
      "Premier travel agency in Pune offering pilgrimage tours, family holidays, group coach bookings, and customized tour packages across Maharashtra and India.",
    telephone: businessConfig.supportPhone,
    email: businessConfig.supportEmail,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Gopal Patti, Manjri Budruk, Hadapsar",
      addressLocality: "Pune",
      addressRegion: "Maharashtra",
      postalCode: "412307",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "18.5089",
      longitude: "73.9657",
    },
    priceRange: "₹₹",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: businessConfig.reviewRating || "4.9",
      reviewCount: businessConfig.reviewCount || "580",
    },
    areaServed: [
      { "@type": "City", name: "Pune" },
      { "@type": "City", name: "Pimpri-Chinchwad" },
      { "@type": "State", name: "Maharashtra" },
    ],
    knowsAbout: [
      "Pilgrimage Tours from Pune",
      "Ujjain Mahakal Tour Packages",
      "Ashtavinayak Yatra from Pune",
      "Jyotirlinga Darshan Tours",
      "AC Force Urbania on Rent Pune",
      "Family Tour Packages from Pune",
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

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
        name: "Travel Agency in Pune",
        item: "https://www.shailrajtravels.com/travel-agency-in-pune",
      },
    ],
  };

  return (
    <div className="font-sans text-slate-800 bg-white selection:bg-brand-green/20 selection:text-brand-blue-deep min-h-screen flex flex-col">
      <Navbar t={t} />
      <SchemaMarkup schema={localBusinessSchema} />
      <SchemaMarkup schema={faqSchema} />
      <SchemaMarkup schema={breadcrumbSchema} />

      <main className="flex-1 pt-24 pb-20">
        {/* Breadcrumb Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs md:text-sm text-slate-500 flex items-center gap-2">
          <Link to="/" className="hover:text-brand-green-dark transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Travel Agency in Pune</span>
        </div>

        {/* Hero Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
          <div className="bg-gradient-to-br from-brand-mist via-white to-brand-mist/50 rounded-3xl p-8 md:p-12 border border-brand-green/20 shadow-sm relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 text-brand-green-dark border border-brand-green/20 mb-4 text-xs md:text-sm font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pune's Trusted Travel Partner • 15+ Years Experience</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-blue-deep leading-tight">
              Travel Agency in Pune — <span className="text-brand-green-dark">Shailraj Travels</span>
            </h1>

            <p className="mt-4 text-base md:text-lg text-slate-700 max-w-3xl leading-relaxed">
              Shailraj Travels is a Pune-based travel agency offering pilgrimage, family, group and customized tours across Maharashtra and India. We provide luxury transport, handpicked accommodations, transparent pricing, and 24/7 on-trip assistance.
            </p>

            {/* Direct Crawlable AEO Answer Card */}
            <div className="mt-6 p-5 rounded-2xl bg-white border border-brand-green/30 shadow-md">
              <h2 className="text-sm font-bold uppercase tracking-wider text-brand-blue-deep mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-green-dark" />
                What is Shailraj Travels?
              </h2>
              <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                <strong>Shailraj Travels</strong> is a Pune-based travel agency and tour operator offering pilgrimage, family, group and customized tours across Maharashtra and India. Headquartered in Hadapsar, Pune, the company operates a private fleet of luxury AC Force Urbania and Innova Crysta vehicles, providing end-to-end travel coordination with 580+ 5-star customer ratings.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="tel:+919764413556"
                className="btn-cta inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-brand-blue/20"
              >
                <Phone className="w-4 h-4" />
                Call +91 97644 13556
              </a>
              <Link
                to="/tours"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-white text-brand-blue-deep border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                View Tour Packages <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose This Travel Agency */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-blue-deep">
              Why Choose Shailraj Travels in Pune?
            </h2>
            <p className="mt-2 text-slate-600">
              Reliable arrangements designed for comfort, punctuality, and complete peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-brand-green/10 text-brand-green-dark flex items-center justify-center mb-4">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-blue-deep mb-2">Luxury AC Fleet</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Travel in superior comfort with our AC Force Urbania, Innova Crysta, and luxury buses featuring individual recliners, wide panoramic windows, and smooth highway suspension.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-brand-green/10 text-brand-green-dark flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-blue-deep mb-2">Senior Citizen & Family Care</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ground-floor hotel rooms, regular hygienic restroom halts every 3–4 hours, wheelchair assistance, and gentle travel pacing tailored for elderly family members.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-brand-green/10 text-brand-green-dark flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-blue-deep mb-2">Zero Hidden Charges</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                All driver allowances, interstate permits, highway tolls, and parking taxes are included upfront. Transparent GST invoicing with zero surprises.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Commercial Packages */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-brand-blue-deep">
                Popular Tour Packages from Pune
              </h2>
              <p className="text-slate-600 mt-1">
                Handcrafted itineraries departing directly from Pune & PCMC.
              </p>
            </div>
            <Link to="/tour-packages-from-pune" className="text-brand-green-dark font-bold text-sm hover:underline mt-2 md:mt-0 flex items-center gap-1">
              Explore All Packages <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm flex flex-col">
              <div className="p-6 flex-1">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-2.5 py-1 rounded-full">
                  Top Pilgrimage Circuit
                </span>
                <h3 className="text-xl font-bold text-brand-blue-deep mt-3">
                  Pune to Ujjain Mahakal & Omkareshwar Tour
                </h3>
                <p className="text-sm text-slate-600 mt-2">
                  2 Nights / 3 Days luxury AC Force Urbania tour covering Mahakaleshwar Bhasma Aarti, Omkareshwar Jyotirlinga, Maheshwar Ghats, and Grishneshwar.
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t pt-3">
                  <span>Duration: 3 Days</span>
                  <span className="font-bold text-brand-blue-deep text-sm">From ₹8,500/seat</span>
                </div>
              </div>
              <div className="px-6 pb-6 pt-0">
                <Link
                  to="/blog/pune-to-ujjain-tour-guide-mahakal-darshan-itinerary"
                  className="w-full py-2.5 bg-brand-mist hover:bg-brand-green/10 text-brand-blue-deep font-bold rounded-xl text-center block text-sm border border-brand-green/30 transition-colors"
                >
                  Read Route Guide & Itinerary &rarr;
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm flex flex-col">
              <div className="p-6 flex-1">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-green-dark bg-brand-green/10 px-2.5 py-1 rounded-full">
                  Sacred Maharashtra Yatra
                </span>
                <h3 className="text-xl font-bold text-brand-blue-deep mt-3">
                  Complete Ashtavinayak Yatra from Pune
                </h3>
                <p className="text-sm text-slate-600 mt-2">
                  Complete 8 Ganesha darshan in scripted traditional order (Morgaon, Siddhatek, Theur, Lenyadri, Ozar, Ranjangaon, Mahad, Pali) with verified vegetarian hotels.
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t pt-3">
                  <span>Duration: 2 or 3 Days</span>
                  <span className="font-bold text-brand-blue-deep text-sm">Custom & Group</span>
                </div>
              </div>
              <div className="px-6 pb-6 pt-0">
                <Link
                  to="/tours/ashtavinayak-yatra"
                  className="w-full py-2.5 bg-brand-mist hover:bg-brand-green/10 text-brand-blue-deep font-bold rounded-xl text-center block text-sm border border-brand-green/30 transition-colors"
                >
                  View Ashtavinayak Details &rarr;
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm flex flex-col">
              <div className="p-6 flex-1">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-blue bg-brand-blue/10 px-2.5 py-1 rounded-full">
                  Spiritual Circuit
                </span>
                <h3 className="text-xl font-bold text-brand-blue-deep mt-3">
                  5 Jyotirlinga of Maharashtra Circuit
                </h3>
                <p className="text-sm text-slate-600 mt-2">
                  Visit Bhimashankar, Trimbakeshwar, Grishneshwar, Aundha Nagnath, and Parli Vaijnath with hassle-free transfers and experienced guides.
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t pt-3">
                  <span>Duration: 4 Nights / 5 Days</span>
                  <span className="font-bold text-brand-blue-deep text-sm">Doorstep Pickup</span>
                </div>
              </div>
              <div className="px-6 pb-6 pt-0">
                <Link
                  to="/tours/jyotirlinga-darshan"
                  className="w-full py-2.5 bg-brand-mist hover:bg-brand-green/10 text-brand-blue-deep font-bold rounded-xl text-center block text-sm border border-brand-green/30 transition-colors"
                >
                  View Jyotirlinga Details &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Knowledge Hub & Travel Guides Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/20 text-brand-green mb-4 text-xs font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Shailraj Travels Knowledge Hub</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                Detailed Guides, Routes & Travel Tips from Pune
              </h2>
              <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed">
                Get honest road conditions, temple darshan rules, VIP pass booking advice, and comprehensive itineraries created by our experienced travel managers.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/blog/pune-to-ujjain-tour-guide-mahakal-darshan-itinerary"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-white border border-slate-700 transition-colors"
                >
                  Pune to Ujjain Guide
                </Link>
                <Link
                  to="/pilgrimage-guides"
                  className="px-4 py-2 rounded-xl bg-brand-green hover:bg-brand-green-dark text-sm font-bold text-white transition-colors"
                >
                  Visit All Knowledge Hub Guides &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Visible Crawlable FAQs */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-blue-deep text-center mb-8">
              Frequently Asked Questions — Travel Agency in Pune
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm"
                >
                  <h3 className="text-base md:text-lg font-bold text-brand-blue-deep mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer t={t} lang={lang} />
    </div>
  );
}
