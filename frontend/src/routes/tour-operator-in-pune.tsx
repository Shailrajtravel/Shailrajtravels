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
  ShieldCheck,
  Phone,
  ArrowRight,
  Sparkles,
  Users,
  Compass,
  CheckCircle2,
  Car,
  Clock,
  BookOpen,
} from 'lucide-react';

export const Route = createFileRoute("/tour-operator-in-pune")({
  head: () => ({
    meta: generateSEO({
      title: "Tour Operator in Pune | Shailraj Travels",
      description:
        "Leading tour operator in Pune specializing in fully guided pilgrimages, AC coach tours, darshan pass facilitation, and custom yatra logistics across India.",
      canonicalUrl: "https://www.shailrajtravels.com/tour-operator-in-pune",
    }),
    links: [{ rel: "canonical", href: "https://www.shailrajtravels.com/tour-operator-in-pune" }],
  }),
  component: TourOperatorInPunePage,
});

function TourOperatorInPunePage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const faqs = [
    {
      question: "What is the difference between a travel agent and a tour operator?",
      answer:
        "While a travel agent typically resells third-party tickets, a tour operator like Shailraj Travels directly manages and executes the entire tour experience from start to finish. We control our own luxury fleet (AC Force Urbania and luxury buses), employ dedicated tour managers, contract verified hotels, curate pure-vegetarian meals, and handle temple darshan logistics on the ground.",
    },
    {
      question: "Does Shailraj Travels provide a tour manager on group trips?",
      answer:
        "Yes. All group tours and pilgrimage circuits operated by Shailraj Travels are accompanied by experienced tour captains who assist with hotel check-ins, senior citizen boarding, luggage management, and darshan queue guidance.",
    },
    {
      question: "Can Shailraj Travels arrange VIP Darshan and temple passes?",
      answer:
        "Yes, our tour operations team assists pilgrims with official temple protocol guidelines, including ₹250 Sheegra Darshan booking at Mahakaleshwar Ujjain, Bhasma Aarti online verification, Tirupati Balaji VIP tickets, and Ashtavinayak puja arrangements.",
    },
    {
      question: "Are custom private tour operations available for families?",
      answer:
        "Absolutely. In addition to fixed group departures, we operate customized private tours tailored to your family's preferred dates, pickup location in Pune, vehicle choice (Innova Crysta or Force Urbania), and personalized travel pace.",
    },
  ];

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "LocalBusiness"],
    name: "Shailraj Travels — Tour Operator in Pune",
    url: "https://www.shailrajtravels.com/tour-operator-in-pune",
    logo: "https://www.shailrajtravels.com/logo.png",
    image: "https://www.shailrajtravels.com/logo.png",
    description:
      "Licensed and experienced tour operator in Pune offering guided pilgrimage yatras, corporate group charters, and end-to-end travel management across India.",
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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "580",
    },
    areaServed: [
      { "@type": "City", name: "Pune" },
      { "@type": "City", name: "Pimpri-Chinchwad" },
      { "@type": "State", name: "Maharashtra" },
    ],
    knowsAbout: [
      "Guided Pilgrimage Tours",
      "End-to-End Tour Operations Pune",
      "AC Force Urbania Group Tours",
      "Temple Darshan Logistics",
      "Custom Family Tour Operations",
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
        name: "Tour Operator in Pune",
        item: "https://www.shailrajtravels.com/tour-operator-in-pune",
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
          <span className="text-slate-800 font-semibold">Tour Operator in Pune</span>
        </div>

        {/* Hero Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
          <div className="bg-gradient-to-br from-brand-mist via-white to-brand-mist/50 rounded-3xl p-8 md:p-12 border border-brand-green/20 shadow-sm relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 text-brand-green-dark border border-brand-green/20 mb-4 text-xs md:text-sm font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Service Tour Management • Direct Fleet Operators</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-blue-deep leading-tight">
              Tour Operator in Pune — <span className="text-brand-green-dark">Shailraj Travels</span>
            </h1>

            <p className="mt-4 text-base md:text-lg text-slate-700 max-w-3xl leading-relaxed">
              As an experienced tour operator in Pune, Shailraj Travels handles the entire spectrum of travel management—from luxury vehicle dispatch and highway coordination to verified hotel accommodations and on-ground darshan facilitation.
            </p>

            {/* Direct Crawlable AEO Answer Card */}
            <div className="mt-6 p-5 rounded-2xl bg-white border border-brand-green/30 shadow-md">
              <h2 className="text-sm font-bold uppercase tracking-wider text-brand-blue-deep mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-green-dark" />
                Why Choose a Direct Tour Operator in Pune?
              </h2>
              <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                Booking with a direct tour operator like <strong>Shailraj Travels</strong> eliminates middleman commissions and ensures total accountability. We control our own fleet of AC Force Urbania vans, employ trained pilgrimage chauffeurs, and deploy dedicated tour captains to ensure every leg of your journey is executed smoothly without compromises.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="tel:+919764413556"
                className="btn-cta inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-brand-blue/20"
              >
                <Phone className="w-4 h-4" />
                Speak with Tour Operations (+91 97644 13556)
              </a>
              <Link
                to="/pilgrimage-tours-from-pune"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-white text-brand-blue-deep border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                Pilgrimage Tour Offerings <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Operational Pillars */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-blue-deep">
              How Shailraj Travels Operates Your Journey
            </h2>
            <p className="mt-2 text-slate-600">
              Meticulous planning and execution behind every kilometer traveled.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-brand-green/10 text-brand-green-dark flex items-center justify-center mb-3">
                <Car className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-brand-blue-deep mb-1.5">1. Fleet Dispatch</h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                Sanitized, mechanical-check approved AC Force Urbania and luxury coaches dispatched on time directly to your Pune pickup spot.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-brand-green/10 text-brand-green-dark flex items-center justify-center mb-3">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-brand-blue-deep mb-1.5">2. Route Mastery</h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                Trained highway captains who navigate ghats, bypass traffic bottlenecks, and pick safe, clean family rest stops.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-brand-green/10 text-brand-green-dark flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-brand-blue-deep mb-1.5">3. Verified Stays</h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                Pre-inspected 3-star and boutique hotels with hygienic bathrooms, lift access, ground floor rooms, and pure veg food.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-brand-green/10 text-brand-green-dark flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-brand-blue-deep mb-1.5">4. Darshan Flow</h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                Accurate guidance on Aarti timings, VIP line access, dress code compliance, and footwear safe-keeping.
              </p>
            </div>
          </div>
        </section>

        {/* Knowledge Hub Interlinking */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-green">
                Knowledge Hub & Field Itineraries
              </span>
              <h2 className="text-xl md:text-2xl font-bold mt-1 text-white">
                Read our field-tested itineraries and highway road condition guides
              </h2>
              <p className="text-slate-300 text-xs md:text-sm mt-2 max-w-xl">
                Authored by our senior operations managers who drive these circuits weekly.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/blog/pune-to-ujjain-tour-guide-mahakal-darshan-itinerary"
                className="px-4 py-2.5 bg-brand-green hover:bg-brand-green-dark text-white font-bold rounded-xl text-xs md:text-sm transition-colors"
              >
                Ujjain Operations Guide &rarr;
              </Link>
              <Link
                to="/pilgrimage-guides"
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs md:text-sm border border-slate-700 transition-colors"
              >
                All Destination Guides
              </Link>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-blue-deep text-center mb-8">
              Tour Operator FAQs — Pune
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
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
