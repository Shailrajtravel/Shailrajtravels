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

export const Route = createFileRoute("/tour-packages-from-pune")({
  head: () => ({
    meta: generateSEO({
      title: "Tour Packages from Pune | Shailraj Travels",
      description:
        "Browse curated tour packages departing from Pune. Spiritual yatras, Jyotirlinga darshan, Ashtavinayak, Konkan, and customized holiday packages in luxury AC coaches.",
      canonicalUrl: "https://www.shailrajtravels.com/tour-packages-from-pune",
    }),
    links: [{ rel: "canonical", href: "https://www.shailrajtravels.com/tour-packages-from-pune" }],
  }),
  component: TourPackagesFromPunePage,
});

function TourPackagesFromPunePage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const packagesList = [
    {
      title: "Pune to Ujjain Mahakal & Omkareshwar Tour",
      duration: "3 Days / 2 Nights",
      price: "From ₹8,500/person",
      circuit: "Pune → Maheshwar → Omkareshwar → Ujjain → Grishneshwar → Pune",
      vehicle: "Luxury AC Force Urbania",
      highlights: ["Mahakal Bhasma Aarti guidance", "Narmada Boat Parikrama", "Verified 3-Star AC Hotel", "Pure Veg Sattvic Food"],
      link: "/blog/pune-to-ujjain-tour-guide-mahakal-darshan-itinerary",
      isBlogGuide: true,
    },
    {
      title: "Complete Ashtavinayak Yatra from Pune",
      duration: "2 or 3 Days",
      price: "Custom & Group Rates",
      circuit: "Morgaon → Siddhatek → Theur → Lenyadri → Ozar → Ranjangaon → Mahad → Pali",
      vehicle: "AC Force Urbania / Luxury Coach",
      highlights: ["Scripted Traditional Route Order", "Senior-friendly Halts", "Verified Dining", "Guide Assistance"],
      link: "/tours/ashtavinayak-yatra",
    },
    {
      title: "5 Jyotirlinga of Maharashtra Circuit",
      duration: "5 Days / 4 Nights",
      price: "Group & Private Available",
      circuit: "Bhimashankar → Trimbakeshwar → Grishneshwar → Aundha Nagnath → Parli Vaijnath",
      vehicle: "AC Force Urbania / Innova Crysta",
      highlights: ["All 5 Maharashtra Jyotirlingas", "Ellora Caves Visit", "Comfortable Hotel Stays", "Pune Pickup"],
      link: "/tours/jyotirlinga-darshan",
    },
    {
      title: "Pune to Pandharpur & Tuljapur Spiritual Tour",
      duration: "2 Days / 1 Night",
      price: "From ₹3,999/person",
      circuit: "Pune → Pandharpur (Vithoba) → Tuljapur (Bhavani Mata) → Akkalkot → Pune",
      vehicle: "AC Coach / Force Urbania",
      highlights: ["Vitthal Rukmini VIP Darshan", "Tulja Bhavani Darshan", "Swami Samarth Math", "Hygienic Halts"],
      link: "/tours/pandharpur-wari",
    },
    {
      title: "Char Dham Yatra from Pune (Himalayan Pilgrimage)",
      duration: "10 to 12 Days",
      price: "All-Inclusive Flight + Coach",
      circuit: "Yamunotri → Gangotri → Kedarnath → Badrinath",
      vehicle: "Flight to Delhi/Dehradun + Luxury Hill Coach",
      highlights: ["Priority Medical Screening", "Helicopter / Pony Booking", "Oxygen Cylinders on Board", "Verified Stays"],
      link: "/tours/char-dham-yatra",
    },
    {
      title: "Tirupati Balaji VIP Darshan Tour from Pune",
      duration: "3 Days / 2 Nights",
      price: "Confirmed Sheegra Darshan",
      circuit: "Pune → Tirupati → Tirumala → Padmavathi Temple → Pune",
      vehicle: "Luxury AC Sleeper Coach / Flight Option",
      highlights: ["Confirmed ₹300 Special Entry Darshan", "Laddu Prasadam Included", "Experienced Guide", "Direct Return"],
      link: "/tours/tirupati-balaji-tour",
    },
  ];

  const faqs = [
    {
      question: "What is included in Shailraj Travels' tour packages from Pune?",
      answer:
        "Our tour packages generally include door-to-door or central Pune transport in AC Force Urbania or luxury coaches, pre-screened AC hotel accommodation, daily pure vegetarian meals (breakfast, lunch, dinner as specified), highway tolls, state taxes, driver allowance, and darshan queue guidance.",
    },
    {
      question: "Can these tour packages be customized for private family groups?",
      answer:
        "Yes, every itinerary on our website can be customized as a private charter. You can choose your pickup address in Pune, departure date, duration, vehicle model (Innova Crysta or 12/17-seater Force Urbania), and specific temple additions.",
    },
    {
      question: "Where in Pune do tour packages depart from?",
      answer:
        "Standard group tours depart from multiple prominent pickup points including Hadapsar, Swargate, Deccan, Shivajinagar, Hinjewadi, Wakad, and Nashik Phata. Private family packages offer 100% doorstep home pickup.",
    },
    {
      question: "How far in advance should I book my tour package?",
      answer:
        "For peak pilgrimage dates, long weekends, Shravan month, and Mahashivratri, we recommend booking 2 to 4 weeks in advance to ensure preferred vehicle seating and VIP temple pass slots.",
    },
  ];

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "LocalBusiness"],
    name: "Shailraj Travels — Tour Packages from Pune",
    url: "https://www.shailrajtravels.com/tour-packages-from-pune",
    logo: "https://www.shailrajtravels.com/logo.png",
    description:
      "Curated tour packages departing from Pune including Ujjain Mahakal, Ashtavinayak, 5 Jyotirlinga Maharashtra, Char Dham, and Tirupati Balaji.",
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
        name: "Tour Packages from Pune",
        item: "https://www.shailrajtravels.com/tour-packages-from-pune",
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
          <span className="text-slate-800 font-semibold">Tour Packages from Pune</span>
        </div>

        {/* Hero Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
          <div className="bg-gradient-to-br from-brand-mist via-white to-brand-mist/50 rounded-3xl p-8 md:p-12 border border-brand-green/20 shadow-sm relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 text-brand-green-dark border border-brand-green/20 mb-4 text-xs md:text-sm font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Doorstep Pickup Across Pune & PCMC • All-Inclusive Pricing</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-blue-deep leading-tight">
              Tour Packages from Pune — <span className="text-brand-green-dark">Shailraj Travels</span>
            </h1>

            <p className="mt-4 text-base md:text-lg text-slate-700 max-w-3xl leading-relaxed">
              Explore our complete directory of handcrafted tour packages departing from Pune. From revered spiritual yatras and Jyotirlinga circuits to relaxing family vacations, every package includes luxury AC transport, verified hotels, and experienced guidance.
            </p>

            {/* Direct Crawlable AEO Answer Card */}
            <div className="mt-6 p-5 rounded-2xl bg-white border border-brand-green/30 shadow-md">
              <h2 className="text-sm font-bold uppercase tracking-wider text-brand-blue-deep mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-green-dark" />
                What Tour Packages are Available from Pune?
              </h2>
              <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                <strong>Shailraj Travels</strong> operates popular tour packages from Pune including the 3-Day Pune to Ujjain Mahakal & Omkareshwar Tour, 2 to 3-Day Complete Ashtavinayak Yatra, 5 Jyotirlinga of Maharashtra Circuit, Char Dham Himalayan Yatra, and Tirupati Balaji VIP Darshan. All packages are available in group departures or private family charters in AC Force Urbania and Innova Crysta.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="tel:+919764413556"
                className="btn-cta inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-brand-blue/20"
              >
                <Phone className="w-4 h-4" />
                Call for Package Availability (+91 97644 13556)
              </a>
              <Link
                to="/pilgrimage-guides"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-white text-brand-blue-deep border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                Read Route & Travel Guides <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Packages Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-blue-deep">
              Available Packages Departing from Pune
            </h2>
            <p className="mt-2 text-slate-600">
              Clear routes, transparent inclusions, and verified stays.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packagesList.map((pkg, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-brand-green-dark">{pkg.duration}</span>
                    <span className="font-bold text-brand-blue-deep text-sm">{pkg.price}</span>
                  </div>

                  <h3 className="text-lg font-bold text-brand-blue-deep leading-snug mb-2">
                    {pkg.title}
                  </h3>

                  <p className="text-xs text-slate-500 font-medium mb-3 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-orange shrink-0 mt-0.5" />
                    <span>{pkg.circuit}</span>
                  </p>

                  <div className="text-xs font-semibold text-slate-600 mb-4 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    Vehicle: {pkg.vehicle}
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {pkg.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-green shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 mt-4">
                  <Link
                    to={pkg.link as any}
                    className="w-full py-2.5 bg-brand-mist hover:bg-brand-green/10 text-brand-blue-deep font-bold rounded-xl text-center block text-sm border border-brand-green/30 transition-colors"
                  >
                    {pkg.isBlogGuide ? "Read Route Guide & Itinerary →" : "View Package Details →"}
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
              Frequently Asked Questions — Tour Packages from Pune
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
