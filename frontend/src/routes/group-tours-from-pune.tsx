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
  Building2,
} from 'lucide-react';

export const Route = createFileRoute("/group-tours-from-pune")({
  head: () => ({
    meta: generateSEO({
      title: "Group Tours & Corporate Travel from Pune | Shailraj Travels",
      description:
        "Large group tours, corporate offsites, and community society yatras departing from Pune. Luxury AC Force Urbania and 35-50 seater luxury bus charters.",
      canonicalUrl: "https://www.shailrajtravels.com/group-tours-from-pune",
    }),
    links: [{ rel: "canonical", href: "https://www.shailrajtravels.com/group-tours-from-pune" }],
  }),
  component: GroupToursFromPunePage,
});

function GroupToursFromPunePage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const fleetOptions = [
    {
      type: "AC Force Urbania (12 & 17 Seater)",
      capacity: "10 to 16 Passengers",
      idealFor: "Extended family yatras, executive corporate offsites, and small pilgrimage groups.",
      features: "Individual recliner seats, high headroom, wide panoramic windows, personal AC vents, and large boot.",
    },
    {
      type: "Luxury AC Tempo Traveller (17 & 26 Seater)",
      capacity: "14 to 25 Passengers",
      idealFor: "Society groups, family reunions, and religious mandal yatras.",
      features: "Pushback seats, LED TV, audio entertainment, reading lights, and ample overhead luggage racks.",
    },
    {
      type: "Deluxe & BharatBenz AC Coaches (35 to 50 Seater)",
      capacity: "30 to 49 Passengers",
      idealFor: "Cooperative housing societies, corporate annual trips, and college / community pilgrimages.",
      features: "Air suspension for smooth ride, onboard mic system, panoramic windows, verified highway drivers.",
    },
  ];

  const faqs = [
    {
      question: "What group coach options are available from Pune?",
      answer:
        "We offer luxury AC Force Urbania (12 and 17 seaters), AC Tempo Travellers (17, 20, and 26 seaters), and large 35 to 50-seater luxury AC tourist buses with air-suspension and pushback seats.",
    },
    {
      question: "Can customized pure vegetarian or Jain catering be arranged for group tours?",
      answer:
        "Yes. For society and community tours, we coordinate dedicated pure vegetarian and Jain food catering (without onion and garlic upon request) along the highway and at destination hotels.",
    },
    {
      question: "Do you offer discounts for housing societies and senior citizen groups?",
      answer:
        "Yes, we offer attractive group discounts and special group packages for cooperative housing societies, senior citizen associations, and community mandals across Pune and PCMC.",
    },
    {
      question: "Are corporate GST invoices provided for business trips and offsites?",
      answer:
        "Yes, Shailraj Travels provides compliant GST tax invoices for corporate clients, company offsites, employee team outings, and industrial travel.",
    },
  ];

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "LocalBusiness"],
    name: "Shailraj Travels — Group Tours from Pune",
    url: "https://www.shailrajtravels.com/group-tours-from-pune",
    logo: "https://www.shailrajtravels.com/logo.png",
    description:
      "Group tour operator in Pune offering luxury bus rentals, corporate offsites, and housing society pilgrimage charters.",
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
        name: "Group Tours from Pune",
        item: "https://www.shailrajtravels.com/group-tours-from-pune",
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
          <span className="text-slate-800 font-semibold">Group Tours from Pune</span>
        </div>

        {/* Hero Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
          <div className="bg-gradient-to-br from-brand-mist via-white to-brand-mist/50 rounded-3xl p-8 md:p-12 border border-brand-green/20 shadow-sm relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 text-brand-green-dark border border-brand-green/20 mb-4 text-xs md:text-sm font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Charters from 12 to 50+ Passengers • GST Compliant</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-blue-deep leading-tight">
              Group Tours from Pune — <span className="text-brand-green-dark">Shailraj Travels</span>
            </h1>

            <p className="mt-4 text-base md:text-lg text-slate-700 max-w-3xl leading-relaxed">
              Organizing travel for 10, 20, or 50+ people? Shailraj Travels manages end-to-end group travel from Pune for housing societies, corporate offsites, community pilgrimage mandals, and extended families.
            </p>

            {/* Direct Crawlable AEO Answer Card */}
            <div className="mt-6 p-5 rounded-2xl bg-white border border-brand-green/30 shadow-md">
              <h2 className="text-sm font-bold uppercase tracking-wider text-brand-blue-deep mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-green-dark" />
                How Does Shailraj Travels Organize Group Tours from Pune?
              </h2>
              <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                <strong>Shailraj Travels</strong> handles group travel logistics with ease—providing luxury AC Force Urbania vans (12/17 seats) and 35 to 50-seater luxury tourist buses, coordinated multi-point pickups in Pune & PCMC, hotel room block bookings, and custom meal planning (including Jain and pure-veg options).
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="tel:+919764413556"
                className="btn-cta inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-brand-blue/20"
              >
                <Phone className="w-4 h-4" />
                Get Group Quotation (+91 97644 13556)
              </a>
              <Link
                to="/tour-packages-from-pune"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-white text-brand-blue-deep border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                View Standard Packages <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Fleet Chart */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-blue-deep">
              Available Group Vehicles in Pune Fleet
            </h2>
            <p className="mt-2 text-slate-600">
              Modern, verified vehicles equipped for smooth highway cruising.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fleetOptions.map((fleet, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-brand-green-dark uppercase tracking-wider bg-brand-green/10 px-2.5 py-1 rounded-full">
                    {fleet.capacity}
                  </span>
                  <h3 className="text-lg font-bold text-brand-blue-deep mt-3 mb-2">
                    {fleet.type}
                  </h3>
                  <p className="text-xs text-slate-600 mb-3">
                    <strong>Ideal for:</strong> {fleet.idealFor}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    <strong>Key Features:</strong> {fleet.features}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <a
                    href="tel:+919764413556"
                    className="w-full py-2 bg-brand-mist hover:bg-brand-green/10 text-brand-blue-deep font-bold rounded-xl text-center block text-xs border border-brand-green/30 transition-colors"
                  >
                    Check Charter Availability &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-blue-deep text-center mb-8">
              Frequently Asked Questions — Group Tours from Pune
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
