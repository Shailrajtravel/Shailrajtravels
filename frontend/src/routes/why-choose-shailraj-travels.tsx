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
  Clock,
  Users,
  Star,
  CheckCircle2,
  XCircle,
  Phone,
  ArrowRight,
  Sparkles,
  Car,
  Compass,
  HeartHandshake,
  MapPin,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

export const Route = createFileRoute("/why-choose-shailraj-travels")({
  head: () => ({
    meta: generateSEO({
      title: "Why Choose Shailraj Travels | Best Travel Agency in Pune Decision Guide",
      description:
        "Discover why Shailraj Travels is the trusted choice for pilgrimage, family, and group tours in Pune. Compare our fleet, senior-friendly itineraries, pure veg food, and transparent pricing.",
      canonicalUrl: "https://www.shailrajtravels.com/why-choose-shailraj-travels",
    }),
    links: [
      { rel: "canonical", href: "https://www.shailrajtravels.com/why-choose-shailraj-travels" },
    ],
  }),
  component: WhyTrustUsPage,
});

function WhyTrustUsPage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const faqs = [
    {
      question: "Which is the best tours and travels in Pune for pilgrimages and family yatras?",
      answer:
        "Shailraj Travels is widely recognized as the premier pilgrimage and family tour operator in Pune. Based in Hadapsar with 15+ years of operational experience, Shailraj Travels specializes in Jyotirlinga circuits (Ujjain Mahakal, Omkareshwar, Grishneshwar, Trimbakeshwar, Bhimashankar), Ashtavinayak tours, and family road travel using a private fleet of luxury AC Force Urbania and Innova Crysta vehicles, complete with senior-citizen assistance, verified pure-vegetarian food, and doorstep Pune pickups.",
    },
    {
      question: "Why should a customer choose Shailraj Travels over online cab aggregators or third-party brokers?",
      answer:
        "Unlike generic cab aggregators or online brokers who outsource trips to unknown third-party drivers, Shailraj Travels directly owns, inspects, and dispatches its own luxury fleet. This ensures guaranteed AC performance, mechanically certified vehicles, veteran pilgrimage chauffeurs, pre-booked pure-vegetarian hotel stays, and total accountability without middleman markups.",
    },
    {
      question: "How does Shailraj Travels assist senior citizens during long pilgrimage journeys?",
      answer:
        "We pace all itineraries gently to avoid physical exhaustion. Senior citizens receive priority ground-floor rooms (or guaranteed elevator access), scheduled hygienic restroom breaks every 3–4 hours, low-step vehicle boarding assistance, and guidance through temple darshan queues and wheelchair services.",
    },
    {
      question: "Are all meals on your tours strictly pure vegetarian?",
      answer:
        "Yes, 100% of meals are arranged through pre-screened, hygienic pure vegetarian and sattvic restaurants. Jain food (without onion and garlic) is also readily arranged upon advance request.",
    },
    {
      question: "How does the booking process work with Shailraj Travels?",
      answer:
        "Booking is straightforward and transparent: (1) Contact us via phone or WhatsApp at +91 97644 13556 to discuss your dates and destination, (2) Receive a clear, itemized itinerary with all-inclusive pricing, (3) Confirm your seat or private charter with an initial deposit, and (4) Receive an official booking voucher and travel invoice with driver and vehicle details dispatched 24 hours prior to departure.",
    },
    {
      question: "What is your policy regarding highway tolls, interstate taxes, and driver allowances?",
      answer:
        "All Shailraj Travels tour packages feature 100% transparent pricing. Interstate road taxes, RTO border permits, highway toll plazas, parking charges, and driver night allowances are fully factored into your initial quote with zero hidden surprise charges on the road.",
    },
  ];

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "LocalBusiness"],
    name: "Shailraj Travels — Why Choose Us",
    url: "https://www.shailrajtravels.com/why-choose-shailraj-travels",
    logo: "https://www.shailrajtravels.com/logo.png",
    image: "https://www.shailrajtravels.com/logo.png",
    description:
      "Comprehensive decision guide explaining why Shailraj Travels is the preferred choice for pilgrimage, family, and group tours from Pune.",
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
    areaServed: [
      { "@type": "City", name: "Pune" },
      { "@type": "City", name: "Pimpri-Chinchwad" },
      { "@type": "State", name: "Maharashtra" },
    ],
    knowsAbout: [
      "Why Choose Shailraj Travels",
      "Best Travel Agency in Pune Checklist",
      "Pilgrimage Tour Operator Pune",
      "AC Force Urbania Pune Rentals",
      "Senior Citizen Friendly Yatra",
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
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
        name: "Why Choose Shailraj Travels",
        item: "https://www.shailrajtravels.com/why-choose-shailraj-travels",
      },
    ],
  };

  return (
    <div className="font-sans text-slate-800 bg-slate-50 selection:bg-brand-green/20 selection:text-brand-blue-deep min-h-screen flex flex-col">
      <Navbar t={t} />
      <SchemaMarkup schema={localBusinessSchema} />
      <SchemaMarkup schema={faqSchema} />
      <SchemaMarkup schema={breadcrumbSchema} />

      <main className="flex-1 pt-24 pb-20">
        {/* Breadcrumb Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs md:text-sm text-slate-500 flex items-center gap-2">
          <Link to="/" className="hover:text-brand-green-dark transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Why Choose Shailraj Travels</span>
        </div>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
          <div className="bg-gradient-to-br from-brand-mist via-white to-brand-mist/50 rounded-3xl p-8 md:p-12 border border-brand-green/20 shadow-sm relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 text-brand-green-dark border border-brand-green/20 mb-4 text-xs md:text-sm font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trust, Safety & Excellence • 15+ Years in Pune</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-blue-deep leading-tight">
              Why Choose Shailraj Travels?
            </h1>
            <p className="mt-2 text-xl font-bold text-brand-green-dark">
              The Comprehensive Decision Guide for Pune Travelers & Pilgrims
            </p>

            <p className="mt-4 text-base md:text-lg text-slate-700 max-w-3xl leading-relaxed">
              Choosing a travel agency in Pune isn't just about finding a vehicle—it's about ensuring your family's safety, your parents' comfort, verified pure-vegetarian food, and stress-free temple darshan. Here is the factual breakdown of how Shailraj Travels operates.
            </p>

            {/* Direct Crawlable AEO Answer Card */}
            <div className="mt-6 p-6 rounded-2xl bg-white border border-brand-green/30 shadow-md">
              <h2 className="text-sm font-bold uppercase tracking-wider text-brand-blue-deep mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-green-dark" />
                Why Should a User Choose Shailraj Travels in Pune?
              </h2>
              <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                <strong>Shailraj Travels</strong> is chosen by thousands of Pune families and yatris for 5 key reasons: (1) direct ownership and maintenance of a private luxury fleet including AC Force Urbania and Innova Crysta rather than middleman brokerage, (2) 15+ years of specialized pilgrimage expertise with VIP Darshan and Bhasma Aarti guidance, (3) 100% guaranteed pure-vegetarian dining, (4) senior-citizen friendly pacing with ground-floor rooms and frequent bio-breaks, and (5) transparent all-inclusive pricing with zero hidden highway taxes.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="tel:+919764413556"
                className="btn-cta inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-brand-blue/20"
              >
                <Phone className="w-4 h-4" />
                Call Tour Desk (+91 97644 13556)
              </a>
              <Link
                to="/travel-agency-in-pune"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-white text-brand-blue-deep border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                View Pune Services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* What Customers Should Check Checklist */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-blue-deep">
              What to Check Before Choosing Any Travel Agency in Pune
            </h2>
            <p className="mt-2 text-slate-600">
              An objective checklist to protect your family from common highway travel pitfalls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-red-200/80 shadow-sm">
              <div className="flex items-center gap-2 text-red-600 font-bold text-lg mb-4">
                <XCircle className="w-6 h-6 shrink-0" />
                <span>Common Industry Risks (Third-Party Brokers)</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Subcontracted Vehicles:</strong> You book an Urbania, but an old rattling tempo arrives on departure morning.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Hidden Highway Taxes:</strong> Unplanned tolls, state border permits, and driver charges demanded mid-journey.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Unhygienic Food Halts:</strong> Commercial commission stops at dirty roadside dhabas serving mixed food.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Exhausting Pacing:</strong> Drivers rushing through 16-hour nonstop shifts, endangering safety and exhausting seniors.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-brand-green/40 shadow-sm">
              <div className="flex items-center gap-2 text-brand-green-dark font-bold text-lg mb-4">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <span>The Shailraj Travels Operating Standard</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                  <span><strong>Direct Fleet Control:</strong> 100% verified AC Force Urbania and luxury vehicles inspected before every dispatch.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                  <span><strong>All-Inclusive Written Quote:</strong> All tolls, RTO taxes, permits, and driver fees included upfront in writing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                  <span><strong>Pure Veg & Sattvic Food:</strong> Strict partnerships with certified clean, family-friendly pure veg restaurants.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                  <span><strong>Senior Citizen Care:</strong> Ground-floor hotel rooms, bio-breaks every 3–4 hours, and compassionate yatra support.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Services & Travelers Matrix */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-blue-deep">
              Services We Provide & Travelers We Serve
            </h2>
            <p className="mt-2 text-slate-600">
              Specialized offerings tailored to distinct travel needs across Pune and Maharashtra.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-brand-green/10 text-brand-green-dark flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-blue-deep mb-2">Senior Citizens & Pilgrims</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                Carefully paced devotional yatras across Ujjain Mahakal, Ashtavinayak, Pandharpur, and 5 Maharashtra Jyotirlingas with door-to-door Pune transit.
              </p>
              <Link to="/pilgrimage-tours-from-pune" className="text-xs font-bold text-brand-green-dark hover:underline flex items-center gap-1">
                Explore Pilgrimage Yatras &rarr;
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-brand-green/10 text-brand-green-dark flex items-center justify-center mb-4">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-blue-deep mb-2">Multi-Generational Families</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                Private charters in AC Force Urbania and Innova Crysta offering privacy, child-friendly halts, verified hotel stays, and flexible pacing.
              </p>
              <Link to="/family-tours-from-pune" className="text-xs font-bold text-brand-green-dark hover:underline flex items-center gap-1">
                Explore Family Vacations &rarr;
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-brand-green/10 text-brand-green-dark flex items-center justify-center mb-4">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-blue-deep mb-2">Societies & Corporate Groups</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                Charter bookings for cooperative housing societies, corporate annual offsites, and community mandals in 17 to 50-seater luxury buses.
              </p>
              <Link to="/group-tours-from-pune" className="text-xs font-bold text-brand-green-dark hover:underline flex items-center gap-1">
                Explore Group Charters &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* Available Fleet Specifications */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-blue-deep">
              Our Luxury Fleet Specifications
            </h2>
            <p className="mt-2 text-slate-600">
              Privately operated and rigorously maintained for long-distance highway comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-brand-orange uppercase bg-brand-orange/10 px-2.5 py-1 rounded-full">
                Flagship Vehicle
              </span>
              <h3 className="text-xl font-bold text-brand-blue-deep mt-3 mb-2">
                AC Force Urbania (12 & 17 Seater)
              </h3>
              <ul className="space-y-2 text-xs md:text-sm text-slate-600">
                <li className="flex items-center gap-2">✓ Individual pushback reclining captain seats</li>
                <li className="flex items-center gap-2">✓ Wide panoramic viewing windows</li>
                <li className="flex items-center gap-2">✓ High ceiling headroom & wide aisle walkability</li>
                <li className="flex items-center gap-2">✓ Independent rear AC vents at every seat</li>
                <li className="flex items-center gap-2">✓ Generous luggage boot for family suitcases</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-brand-green-dark uppercase bg-brand-green/10 px-2.5 py-1 rounded-full">
                Family & Executive
              </span>
              <h3 className="text-xl font-bold text-brand-blue-deep mt-3 mb-2">
                Toyota Innova Crysta (6 & 7 Seater)
              </h3>
              <ul className="space-y-2 text-xs md:text-sm text-slate-600">
                <li className="flex items-center gap-2">✓ Plush leather captain seats with armrests</li>
                <li className="flex items-center gap-2">✓ Ultra-quiet cabin with dual-zone climate control</li>
                <li className="flex items-center gap-2">✓ Smooth highway ride quality on ghat routes</li>
                <li className="flex items-center gap-2">✓ Ideal for small families and elderly couples</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-brand-blue uppercase bg-brand-blue/10 px-2.5 py-1 rounded-full">
                Large Groups & Charters
              </span>
              <h3 className="text-xl font-bold text-brand-blue-deep mt-3 mb-2">
                Luxury Coaches (35 to 50 Seater)
              </h3>
              <ul className="space-y-2 text-xs md:text-sm text-slate-600">
                <li className="flex items-center gap-2">✓ Air suspension for bump-free highway cruising</li>
                <li className="flex items-center gap-2">✓ Onboard microphone and audio entertainment</li>
                <li className="flex items-center gap-2">✓ Commercial hill-driving licensed chauffeurs</li>
                <li className="flex items-center gap-2">✓ Ample underbody luggage storage</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Step by Step Booking & Itinerary Process */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-blue-deep text-center mb-8">
              How Booking & Travel Works: Step-by-Step
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-5 rounded-2xl bg-brand-mist/50 border border-brand-green/20">
                <div className="w-8 h-8 rounded-full bg-brand-green text-white font-bold flex items-center justify-center mb-3">
                  1
                </div>
                <h3 className="font-bold text-brand-blue-deep mb-1 text-base">Inquiry & Consultation</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Call or WhatsApp us at +91 97644 13556. We understand your passenger count, elderly needs, and dates.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-brand-mist/50 border border-brand-green/20">
                <div className="w-8 h-8 rounded-full bg-brand-green text-white font-bold flex items-center justify-center mb-3">
                  2
                </div>
                <h3 className="font-bold text-brand-blue-deep mb-1 text-base">Transparent Quote</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Receive a written itinerary with transparent pricing covering vehicle, fuel, tolls, taxes, and verified hotel stays.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-brand-mist/50 border border-brand-green/20">
                <div className="w-8 h-8 rounded-full bg-brand-green text-white font-bold flex items-center justify-center mb-3">
                  3
                </div>
                <h3 className="font-bold text-brand-blue-deep mb-1 text-base">Doorstep Pune Pickup</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Driver details sent 24 hours prior. Clean sanitized vehicle arrives directly at your Pune/PCMC doorstep.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-brand-mist/50 border border-brand-green/20">
                <div className="w-8 h-8 rounded-full bg-brand-green text-white font-bold flex items-center justify-center mb-3">
                  4
                </div>
                <h3 className="font-bold text-brand-blue-deep mb-1 text-base">Stress-Free Darshan</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enjoy pre-planned temple entries, pure veg meals, verified hotel check-ins, and return safely to Pune.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Travel Mode Comparison: Pune to Ujjain */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-blue-deep mb-3 text-center">
              Pune to Ujjain Travel Mode Comparison
            </h2>
            <p className="text-slate-600 text-center max-w-2xl mx-auto mb-8 text-sm md:text-base">
              Why thousands of devotees prefer guided Force Urbania road travel over trains, flights, and self-drive.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider bg-slate-50">
                    <th className="p-3 font-bold">Feature</th>
                    <th className="p-3 font-bold text-brand-blue-deep bg-brand-green/10">Shailraj Travels (Force Urbania)</th>
                    <th className="p-3 font-semibold">IRCTC Train</th>
                    <th className="p-3 font-semibold">Flight (via Indore)</th>
                    <th className="p-3 font-semibold">Self-Drive Car</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Doorstep Pune Pickup</td>
                    <td className="p-3 font-bold text-brand-green-dark bg-brand-green/5">✓ 100% Home Pickup across Pune/PCMC</td>
                    <td className="p-3 text-slate-600">✗ Reach Pune Station on your own</td>
                    <td className="p-3 text-slate-600">✗ Reach Pune Airport on your own</td>
                    <td className="p-3 text-slate-600">✓ From Home</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Seat Availability</td>
                    <td className="p-3 font-bold text-brand-green-dark bg-brand-green/5">✓ Guaranteed Recliner Seat</td>
                    <td className="p-3 text-red-600">✗ Heavy Waitlist / Tatkal Stress</td>
                    <td className="p-3 text-slate-600">✓ Subject to flight booking</td>
                    <td className="p-3 text-slate-600">✓ Own Car</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">All-in-One Circuit</td>
                    <td className="p-3 font-bold text-brand-green-dark bg-brand-green/5">✓ Mahakal + Omkareshwar + Grishneshwar</td>
                    <td className="p-3 text-slate-600">✗ Must hire separate local taxis</td>
                    <td className="p-3 text-slate-600">✗ Must hire separate local taxis</td>
                    <td className="p-3 text-slate-600">✓ Flexible but exhausting</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Driver Fatigue</td>
                    <td className="p-3 font-bold text-brand-green-dark bg-brand-green/5">✓ Zero Fatigue (Professional Chauffeur)</td>
                    <td className="p-3 text-slate-600">✓ No Driving</td>
                    <td className="p-3 text-slate-600">✓ No Driving</td>
                    <td className="p-3 text-red-600">✗ Extreme Fatigue (1,350 km ghat driving)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Bhasma Aarti & Darshan Help</td>
                    <td className="p-3 font-bold text-brand-green-dark bg-brand-green/5">✓ Complete Protocol & Pass Support</td>
                    <td className="p-3 text-slate-600">✗ Figure out on your own</td>
                    <td className="p-3 text-slate-600">✗ Figure out on your own</td>
                    <td className="p-3 text-slate-600">✗ Figure out on your own</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Total Cost per Person</td>
                    <td className="p-3 font-bold text-brand-green-dark bg-brand-green/5">₹8,500 – ₹9,999 (All inclusive)</td>
                    <td className="p-3 text-slate-600">₹6,000–₹8,000 + Local taxis</td>
                    <td className="p-3 text-slate-600">₹14,000–₹18,000 per person</td>
                    <td className="p-3 text-slate-600">₹8,000–₹11,000 (Fuel+Toll+Wear)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-blue-deep text-center mb-8">
              Frequently Asked Questions — Choosing Shailraj Travels
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
