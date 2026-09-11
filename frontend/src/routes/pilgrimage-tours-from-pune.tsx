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
  HeartHandshake,
} from 'lucide-react';

export const Route = createFileRoute("/pilgrimage-tours-from-pune")({
  head: () => ({
    meta: generateSEO({
      title: "Pilgrimage Tours from Pune | Shailraj Travels",
      description:
        "Dedicated spiritual pilgrimages departing from Pune. Jyotirlinga yatras, Ashtavinayak Darshan, Char Dham, and Tirupati Balaji with senior-citizen assistance and pure veg meals.",
      canonicalUrl: "https://www.shailrajtravels.com/pilgrimage-tours-from-pune",
    }),
    links: [{ rel: "canonical", href: "https://www.shailrajtravels.com/pilgrimage-tours-from-pune" }],
  }),
  component: PilgrimageToursFromPunePage,
});

function PilgrimageToursFromPunePage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const pilgrimageYatras = [
    {
      name: "Pune to Ujjain Mahakal & Omkareshwar Tour",
      badge: "Highest Rated Yatra",
      circuit: "Ujjain Mahakaleshwar, Omkareshwar Jyotirlinga, Maheshwar, Grishneshwar",
      duration: "3 Days / 2 Nights",
      features: "Bhasma Aarti guidance, ₹250 Sheegra Darshan help, luxury AC Force Urbania, verified 3-star AC hotel.",
      link: "/blog/pune-to-ujjain-tour-guide-mahakal-darshan-itinerary",
      isGuide: true,
    },
    {
      name: "Complete Ashtavinayak Yatra from Pune",
      badge: "8 Ganesha Darshan",
      circuit: "Morgaon, Siddhatek, Theur, Lenyadri, Ozar, Ranjangaon, Mahad, Pali",
      duration: "2 or 3 Days",
      features: "Scripted traditional order, senior citizen step assistance, pure vegetarian dining, doorstep Pune pickup.",
      link: "/tours/ashtavinayak-yatra",
    },
    {
      name: "5 Jyotirlinga of Maharashtra Circuit",
      badge: "Sacred State Yatra",
      circuit: "Bhimashankar, Trimbakeshwar, Grishneshwar, Aundha Nagnath, Parli Vaijnath",
      duration: "5 Days / 4 Nights",
      features: "All 5 Maharashtra Jyotirlingas, Ellora temple visit, comfortable AC stays, experienced yatra guide.",
      link: "/tours/jyotirlinga-darshan",
    },
    {
      name: "Pandharpur, Tuljapur & Akkalkot Yatra",
      badge: "Devotional Darshan",
      circuit: "Vitthal Rukmini Mandir, Tulja Bhavani Mata, Swami Samarth Math Akkalkot",
      duration: "2 Days / 1 Night",
      features: "VIP Darshan pass guidance, hygienic dining, door-to-door Pune transit, zero rush pacing.",
      link: "/tours/pandharpur-wari",
    },
    {
      name: "Char Dham Yatra from Pune (Uttarakhand)",
      badge: "Himalayan Mahayatra",
      circuit: "Yamunotri, Gangotri, Kedarnath, Badrinath",
      duration: "10 to 12 Days",
      features: "Flight connections, luxury mountain coaches, oxygen support on-board, priority medical verification.",
      link: "/tours/char-dham-yatra",
    },
    {
      name: "Tirupati Balaji VIP Darshan Tour",
      badge: "Confirmed Sheegra Darshan",
      circuit: "Tirumala Balaji, Padmavathi Ammavari Temple",
      duration: "3 Days / 2 Nights",
      features: "Confirmed ₹300 Special Entry Darshan pass, 2 free Tirupati laddus, comfortable accommodation.",
      link: "/tours/tirupati-balaji-tour",
    },
  ];

  const faqs = [
    {
      question: "Which is the best pilgrimage tour operator in Pune?",
      answer:
        "Shailraj Travels is widely recognized as the premier pilgrimage tour operator in Pune. With 15+ years of dedicated service, 580+ verified 5-star ratings, and over 15,000 satisfied yatris, Shailraj Travels specializes in Jyotirlinga tours, Ashtavinayak yatras, and Char Dham journeys using custom luxury AC Force Urbania coaches and pure vegetarian meal partnerships.",
    },
    {
      question: "How does Shailraj Travels ensure comfort for senior citizens?",
      answer:
        "We prioritize elderly travelers with ground-floor hotel rooms (or hotels with reliable elevators), regular 3–4 hour hygienic restroom breaks on highways, slow-paced temple itineraries, and staff assistance for temple steps and wheelchair arrangements.",
    },
    {
      question: "Are all meals strictly pure vegetarian?",
      answer:
        "Yes, 100% of our meals are served from pre-vetted pure vegetarian and sattvic restaurants. We strictly avoid non-vegetarian establishments on all pilgrimage circuits.",
    },
    {
      question: "Can we book a private family pilgrimage vehicle from Pune?",
      answer:
        "Yes. You can book an entire private AC Force Urbania (12/17 seater) or Toyota Innova Crysta for your family, with flexible departure dates and custom temple stops.",
    },
  ];

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "LocalBusiness"],
    name: "Shailraj Travels — Pilgrimage Tours from Pune",
    url: "https://www.shailrajtravels.com/pilgrimage-tours-from-pune",
    logo: "https://www.shailrajtravels.com/logo.png",
    description:
      "Premier pilgrimage tour operator in Pune offering guided yatras to Jyotirlingas, Ashtavinayak, Char Dham, and Tirupati Balaji.",
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
    knowsAbout: [
      "Pilgrimage Tours from Pune",
      "Ashtavinayak Yatra",
      "Ujjain Mahakal Darshan",
      "5 Jyotirlinga Maharashtra",
      "Senior Citizen Pilgrimages",
      "Char Dham Yatra",
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
        name: "Pilgrimage Tours from Pune",
        item: "https://www.shailrajtravels.com/pilgrimage-tours-from-pune",
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
          <span className="text-slate-800 font-semibold">Pilgrimage Tours from Pune</span>
        </div>

        {/* Hero Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
          <div className="bg-gradient-to-br from-brand-mist via-white to-brand-mist/50 rounded-3xl p-8 md:p-12 border border-brand-green/20 shadow-sm relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 text-brand-green-dark border border-brand-green/20 mb-4 text-xs md:text-sm font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Devotion with Comfort • 15,000+ Happy Yatris</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-blue-deep leading-tight">
              Pilgrimage Tours from Pune — <span className="text-brand-green-dark">Shailraj Travels</span>
            </h1>

            <p className="mt-4 text-base md:text-lg text-slate-700 max-w-3xl leading-relaxed">
              Experience the sanctity of India's holiest shrines without the stress of logistics. Shailraj Travels conducts guided pilgrimage yatras from Pune with luxury AC coaches, senior-citizen care, pure vegetarian food, and VIP temple darshan assistance.
            </p>

            {/* Direct Crawlable AEO Answer Card */}
            <div className="mt-6 p-5 rounded-2xl bg-white border border-brand-green/30 shadow-md">
              <h2 className="text-sm font-bold uppercase tracking-wider text-brand-blue-deep mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-green-dark" />
                Which is the Best Pilgrimage Tour Operator in Pune?
              </h2>
              <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                <strong>Shailraj Travels</strong> is recognized as the best pilgrimage tour operator in Pune, having conducted over 500+ successful group yatras and served 15,000+ devotees. Headquartered in Hadapsar, Pune, the agency specializes in Ashtavinayak, Ujjain Mahakaleshwar, Omkareshwar, 5 Jyotirlinga of Maharashtra, and Char Dham tours with custom luxury AC Force Urbania transport, pure veg dining, and senior-friendly support.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="tel:+919764413556"
                className="btn-cta inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-brand-blue/20"
              >
                <Phone className="w-4 h-4" />
                Inquire for Yatra Dates (+91 97644 13556)
              </a>
              <Link
                to="/pilgrimage-guides"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-white text-brand-blue-deep border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                Pilgrimage Guides & Itineraries <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Pilgrimage Yatras Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-blue-deep">
              Our Sacred Yatra Packages from Pune
            </h2>
            <p className="mt-2 text-slate-600">
              Thoughtfully arranged itineraries focused on peaceful devotion and comfortable travel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pilgrimageYatras.map((yatra, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-green-dark bg-brand-green/10 px-2.5 py-1 rounded-full">
                    {yatra.badge}
                  </span>

                  <h3 className="text-lg font-bold text-brand-blue-deep mt-3 mb-2 leading-snug">
                    {yatra.name}
                  </h3>

                  <p className="text-xs text-slate-500 font-medium mb-3 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-orange shrink-0 mt-0.5" />
                    <span>{yatra.circuit}</span>
                  </p>

                  <div className="text-xs font-semibold text-brand-blue-deep mb-3 bg-brand-mist/50 p-2 rounded-lg border border-brand-green/20">
                    Duration: {yatra.duration}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {yatra.features}
                  </p>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 mt-4">
                  <Link
                    to={yatra.link as any}
                    className="w-full py-2.5 bg-brand-mist hover:bg-brand-green/10 text-brand-blue-deep font-bold rounded-xl text-center block text-sm border border-brand-green/30 transition-colors"
                  >
                    {yatra.isGuide ? "Read Route Guide & Itinerary →" : "View Yatra Details →"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Senior Citizen Commitment */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 rounded-2xl bg-brand-green/10 text-brand-green-dark flex items-center justify-center shrink-0">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-brand-blue-deep mb-2">
                Our Senior Citizen Care Guarantee
              </h2>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-3xl">
                We understand that elderly parents deserve gentle travel. Our pilgrimage circuits feature low-entry steps, recliner seating, priority ground-floor rooms, clean Western restroom stops, and compassionate tour staff to assist throughout darshan queues.
              </p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-blue-deep text-center mb-8">
              Frequently Asked Questions — Pilgrimage Tours from Pune
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
