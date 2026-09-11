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
  Heart,
  Smile,
} from 'lucide-react';

export const Route = createFileRoute("/family-tours-from-pune")({
  head: () => ({
    meta: generateSEO({
      title: "Family Tour Packages from Pune | Shailraj Travels",
      description:
        "Comfortable, family-friendly tour packages departing from Pune. Multi-generational pilgrimages, scenic hill stations, and private AC Force Urbania road trips.",
      canonicalUrl: "https://www.shailrajtravels.com/family-tours-from-pune",
    }),
    links: [{ rel: "canonical", href: "https://www.shailrajtravels.com/family-tours-from-pune" }],
  }),
  component: FamilyToursFromPunePage,
});

function FamilyToursFromPunePage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const familyDestinations = [
    {
      title: "Family Ashtavinayak Darshan",
      duration: "2 or 3 Days",
      idealFor: "Multi-generational Families (Kids + Elders)",
      description: "A relaxed, sacred tour covering all 8 Vinayakas with comfortable halts, child-friendly food options, and gentle driving.",
      vehicle: "AC Force Urbania (12/17 seater) or Innova Crysta",
      link: "/tours/ashtavinayak-yatra",
    },
    {
      title: "Pune to Ujjain & Omkareshwar Family Circuit",
      duration: "3 Days / 2 Nights",
      idealFor: "Family Spiritual Vacation",
      description: "Direct doorstep pickup from Pune, verified 3-star AC family rooms in Ujjain, Narmada boat ride, and Mahakal Darshan.",
      vehicle: "Private AC Force Urbania",
      link: "/blog/pune-to-ujjain-tour-guide-mahakal-darshan-itinerary",
      isGuide: true,
    },
    {
      title: "Mahabaleshwar, Panchgani & Pratapgad Holiday",
      duration: "3 Days / 2 Nights",
      idealFor: "Family Leisure & Hill Station",
      description: "Strawberry farms, viewpoint sightseeing, Pratapgad heritage fort, and cool climate relaxation.",
      vehicle: "Private AC Vehicle",
      link: "/tour-packages-from-pune",
    },
    {
      title: "Konkan Beach & Ganpatipule Family Tour",
      duration: "3 Days / 2 Nights",
      idealFor: "Temple & Coastal Relaxation",
      description: "Visit Ganpatipule seaside temple, Ratnagiri, pristine white sand beaches, and authentic Konkani vegetarian cuisine.",
      vehicle: "AC Force Urbania / Innova Crysta",
      link: "/tour-packages-from-pune",
    },
  ];

  const faqs = [
    {
      question: "Can we book a private vehicle exclusively for our family?",
      answer:
        "Yes, 100% of our family tour packages can be booked on a private charter basis. You will have exclusive use of an AC Force Urbania or Toyota Innova Crysta with a dedicated driver who accommodates your personal schedule.",
    },
    {
      question: "Which vehicle is recommended for a family of 8 to 15 members?",
      answer:
        "The luxury AC Force Urbania (12 or 17 seater) is the top choice for families. It features high ceiling clearance, wide aisles, individual reclining captain seats, individual AC vents, and large luggage space, ensuring zero fatigue for both children and grandparents.",
    },
    {
      question: "Are the hotel rooms suitable for families?",
      answer:
        "We partner strictly with vetted, clean family hotels offering interconnected rooms or large family suites, clean attached bathrooms with continuous hot water, and reliable elevator access.",
    },
    {
      question: "Can we request unscheduled stops during the trip?",
      answer:
        "Yes, on private family tours, our drivers are instructed to accommodate family requests for restroom breaks, tea stops, or child meal intervals whenever required.",
    },
  ];

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "LocalBusiness"],
    name: "Shailraj Travels — Family Tour Packages from Pune",
    url: "https://www.shailrajtravels.com/family-tours-from-pune",
    logo: "https://www.shailrajtravels.com/logo.png",
    description:
      "Comfortable family tour packages departing from Pune with luxury AC Force Urbania vehicles, doorstep pickup, and verified hotels.",
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
      ratingValue: businessConfig.reviewRating || "4.9",
      reviewCount: businessConfig.reviewCount || "580",
    },
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
        name: "Family Tours from Pune",
        item: "https://www.shailrajtravels.com/family-tours-from-pune",
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
          <span className="text-slate-800 font-semibold">Family Tours from Pune</span>
        </div>

        {/* Hero Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
          <div className="bg-gradient-to-br from-brand-mist via-white to-brand-mist/50 rounded-3xl p-8 md:p-12 border border-brand-green/20 shadow-sm relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 text-brand-green-dark border border-brand-green/20 mb-4 text-xs md:text-sm font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tailored for Multi-Generational Travel • 100% Doorstep Pickup</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-blue-deep leading-tight">
              Family Tour Packages from Pune — <span className="text-brand-green-dark">Shailraj Travels</span>
            </h1>

            <p className="mt-4 text-base md:text-lg text-slate-700 max-w-3xl leading-relaxed">
              Create cherished family moments without traveling stress. Shailraj Travels organizes private family tours from Pune featuring luxury AC vehicles, relaxed itineraries, verified family hotels, and pure vegetarian dining.
            </p>

            {/* Direct Crawlable AEO Answer Card */}
            <div className="mt-6 p-5 rounded-2xl bg-white border border-brand-green/30 shadow-md">
              <h2 className="text-sm font-bold uppercase tracking-wider text-brand-blue-deep mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-green-dark" />
                Why Choose Shailraj Travels for Family Tours from Pune?
              </h2>
              <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                <strong>Shailraj Travels</strong> specializes in multi-generational family vacations and pilgrimages from Pune. With private AC Force Urbania and Innova Crysta charters, doorstep home pickup, pre-inspected family-friendly hotels with lift access, pure veg dining, and gentle pacing tailored for children and seniors, we guarantee a secure, comfortable, and memorable trip for your family.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="tel:+919764413556"
                className="btn-cta inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-brand-blue/20"
              >
                <Phone className="w-4 h-4" />
                Plan a Family Tour (+91 97644 13556)
              </a>
              <Link
                to="/tour-packages-from-pune"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-white text-brand-blue-deep border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                Browse All Packages <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Family Circuits Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-blue-deep">
              Popular Family Holidays & Yatras from Pune
            </h2>
            <p className="mt-2 text-slate-600">
              Spacious vehicles, safe highway driving, and well-timed breaks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {familyDestinations.map((dest, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-brand-green-dark">{dest.duration}</span>
                    <span className="font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{dest.idealFor}</span>
                  </div>

                  <h3 className="text-xl font-bold text-brand-blue-deep mb-2">
                    {dest.title}
                  </h3>

                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    {dest.description}
                  </p>

                  <div className="text-xs font-semibold text-brand-blue-deep bg-brand-mist/50 p-2.5 rounded-xl border border-brand-green/20 mb-4">
                    Vehicle: {dest.vehicle}
                  </div>
                </div>

                <Link
                  to={dest.link as any}
                  className="w-full py-2.5 bg-brand-mist hover:bg-brand-green/10 text-brand-blue-deep font-bold rounded-xl text-center block text-sm border border-brand-green/30 transition-colors"
                >
                  {dest.isGuide ? "Read Route Guide & Itinerary →" : "View Package Details →"}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-blue-deep text-center mb-8">
              Frequently Asked Questions — Family Tours from Pune
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
