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

export const Route = createFileRoute("/maharashtra-tour-packages")({
  head: () => ({
    meta: generateSEO({
      title: "Maharashtra Tour Packages from Pune | Shailraj Travels",
      description:
        "Explore Maharashtra with Shailraj Travels. 5 Jyotirlingas, Ashtavinayak, Konkan coastal tours, Shirdi, Pandharpur, and Western Ghats holidays from Pune.",
      canonicalUrl: "https://www.shailrajtravels.com/maharashtra-tour-packages",
    }),
    links: [{ rel: "canonical", href: "https://www.shailrajtravels.com/maharashtra-tour-packages" }],
  }),
  component: MaharashtraTourPackagesPage,
});

function MaharashtraTourPackagesPage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const circuits = [
    {
      title: "Complete Ashtavinayak Yatra",
      circuit: "Morgaon • Siddhatek • Theur • Lenyadri • Ozar • Ranjangaon • Mahad • Pali",
      duration: "2 or 3 Days",
      type: "Spiritual Pilgrimage",
      highlights: "Scripted traditional darshan order, senior citizen step assistance, verified vegetarian hotels.",
      link: "/tours/ashtavinayak-yatra",
    },
    {
      title: "5 Jyotirlinga of Maharashtra Circuit",
      circuit: "Bhimashankar • Trimbakeshwar • Grishneshwar • Aundha Nagnath • Parli Vaijnath",
      duration: "5 Days / 4 Nights",
      type: "Sacred Jyotirlinga",
      highlights: "Covers all 5 Maharashtra Shiva shrines plus Ellora Caves with luxury AC Force Urbania travel.",
      link: "/tours/jyotirlinga-darshan",
    },
    {
      title: "Shirdi, Shani Shingnapur & Nashik",
      circuit: "Pune → Shirdi Sai Baba → Shani Shingnapur → Trimbakeshwar / Nashik → Pune",
      duration: "2 Days / 1 Night",
      type: "Spiritual Darshan",
      highlights: "VIP Aarti assistance, comfortable overnight hotel in Shirdi, doorstep Pune pickup.",
      link: "/tours/shirdi-tour",
    },
    {
      title: "Pandharpur, Tuljapur & Akkalkot",
      circuit: "Pune → Pandharpur (Vithoba) → Tuljapur (Bhavani Mata) → Akkalkot (Swami Samarth) → Pune",
      duration: "2 Days / 1 Night",
      type: "Bhakti Circuit",
      highlights: "Vitthal Rukmini darshan, Tulja Bhavani blessings, peaceful darshan flow, pure veg dining.",
      link: "/tours/pandharpur-wari",
    },
    {
      title: "Konkan Coast & Ganpatipule Beach Tour",
      circuit: "Pune → Ganpatipule (Swayambhu Ganesh) → Ratnagiri → Guhagar → Pune",
      duration: "3 Days / 2 Nights",
      type: "Temple & Coastal Leisure",
      highlights: "Sea-facing temples, pristine Konkan beaches, scenic coastal roads, local Maharashtrian hospitality.",
      link: "/tour-packages-from-pune",
    },
  ];

  const faqs = [
    {
      question: "Can all 5 Maharashtra Jyotirlingas be covered in one continuous tour?",
      answer:
        "Yes, our 5 Days / 4 Nights Maharashtra Jyotirlinga tour seamlessly covers Bhimashankar, Trimbakeshwar, Grishneshwar, Aundha Nagnath, and Parli Vaijnath without excessive daily driving, leaving ample time for peaceful darshan.",
    },
    {
      question: "How many days does the Ashtavinayak Yatra take from Pune?",
      answer:
        "We offer both a 2-Day (fast-paced) and a 3-Day (relaxed, senior-friendly) Ashtavinayak Yatra starting from Pune. The 3-day itinerary is especially recommended for families traveling with elders.",
    },
    {
      question: "Do you provide pickup across both Pune and Pimpri-Chinchwad?",
      answer:
        "Yes, we provide door-to-door home pickup and convenient central boarding points across Pune City and PCMC including Hadapsar, Kothrud, Hinjewadi, Wakad, Viman Nagar, Pimpri, Chinchwad, and Nigdi.",
    },
    {
      question: "Are Maharashtra tour packages available throughout the year?",
      answer:
        "Yes, our Maharashtra temple circuits operate every week throughout the year. Coastal and hill station tours are especially popular during the monsoon and winter seasons.",
    },
  ];

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "LocalBusiness"],
    name: "Shailraj Travels — Maharashtra Tour Packages from Pune",
    url: "https://www.shailrajtravels.com/maharashtra-tour-packages",
    logo: "https://www.shailrajtravels.com/logo.png",
    description:
      "Comprehensive Maharashtra tour packages from Pune including Ashtavinayak, 5 Jyotirlingas, Shirdi, Pandharpur, and Konkan.",
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
        name: "Maharashtra Tour Packages from Pune",
        item: "https://www.shailrajtravels.com/maharashtra-tour-packages",
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
          <span className="text-slate-800 font-semibold">Maharashtra Tour Packages from Pune</span>
        </div>

        {/* Hero Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
          <div className="bg-gradient-to-br from-brand-mist via-white to-brand-mist/50 rounded-3xl p-8 md:p-12 border border-brand-green/20 shadow-sm relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 text-brand-green-dark border border-brand-green/20 mb-4 text-xs md:text-sm font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Maharashtra • AC Luxury Transport • Verified Stays</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-blue-deep leading-tight">
              Maharashtra Tour Packages from Pune — <span className="text-brand-green-dark">Shailraj Travels</span>
            </h1>

            <p className="mt-4 text-base md:text-lg text-slate-700 max-w-3xl leading-relaxed">
              Discover the divine heritage, sacred temples, and natural splendor of Maharashtra. Shailraj Travels conducts guided state tours from Pune including the Ashtavinayak Yatra, 5 Jyotirlingas, Shirdi, Pandharpur, and coastal Konkan.
            </p>

            {/* Direct Crawlable AEO Answer Card */}
            <div className="mt-6 p-5 rounded-2xl bg-white border border-brand-green/30 shadow-md">
              <h2 className="text-sm font-bold uppercase tracking-wider text-brand-blue-deep mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-green-dark" />
                What are the Best Maharashtra Tour Packages from Pune?
              </h2>
              <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                <strong>Shailraj Travels</strong> operates Maharashtra's premier road circuits starting from Pune: the complete 8-Temple Ashtavinayak Yatra, the 5 Jyotirlinga of Maharashtra Circuit, the Shirdi-Nashik-Trimbakeshwar trail, Pandharpur-Tuljapur-Akkalkot, and Konkan beach holidays. Featuring luxury AC Force Urbania and Innova Crysta transport, senior-friendly pacing, and pure vegetarian dining.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="tel:+919764413556"
                className="btn-cta inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-brand-blue/20"
              >
                <Phone className="w-4 h-4" />
                Book Maharashtra Tour (+91 97644 13556)
              </a>
              <Link
                to="/pilgrimage-guides"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-white text-brand-blue-deep border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                Maharashtra Route Guides <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Circuits Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-blue-deep">
              Featured Maharashtra Circuits from Pune
            </h2>
            <p className="mt-2 text-slate-600">
              Complete itineraries connecting sacred shrines, historic forts, and scenic coastlines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {circuits.map((c, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-brand-green-dark">{c.duration}</span>
                    <span className="font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{c.type}</span>
                  </div>

                  <h3 className="text-xl font-bold text-brand-blue-deep mb-2">
                    {c.title}
                  </h3>

                  <p className="text-xs text-slate-500 font-medium mb-3 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-orange shrink-0 mt-0.5" />
                    <span>{c.circuit}</span>
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {c.highlights}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    to={c.link as any}
                    className="w-full py-2.5 bg-brand-mist hover:bg-brand-green/10 text-brand-blue-deep font-bold rounded-xl text-center block text-sm border border-brand-green/30 transition-colors"
                  >
                    View Tour Details &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-blue-deep text-center mb-8">
              Frequently Asked Questions — Maharashtra Tours from Pune
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
