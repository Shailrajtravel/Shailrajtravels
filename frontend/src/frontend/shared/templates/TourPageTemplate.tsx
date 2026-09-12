import React, { useState } from 'react';
import { SEOBreadcrumbs, type BreadcrumbItem } from '@/frontend/shared/components/SEOBreadcrumbs';
import { SchemaMarkup } from '@/frontend/shared/components/SchemaMarkup';
import { generateProductSchema } from '@/backend/shared/schema-generators';
import { Tour } from '@/frontend/shared/types/tour';
import { RelatedTours } from '@/frontend/shared/components/RelatedTours';
import { RelatedBlogs } from '@/frontend/shared/components/RelatedBlogs';
import { useLanguage } from '@/routes/__root';
import { translations } from '@/frontend/core/i18n';
import { createBookingFn } from '@/backend/shared/bookings';
import { LazyImage } from '@/frontend/shared/ui/lazy-image';
import { CheckCircle2, Sparkles, Users, Check, ArrowRight } from 'lucide-react';
import { DEFAULT_RECOMMENDED_VEHICLES } from '@/backend/shared/recommended-vehicles';

// RECOMMENDED_VEHICLES moved to DB

interface TourPageTemplateProps {
  data: Tour;
  recommendedVehicles?: any[];
}

export function TourPageTemplate({ data, recommendedVehicles = [] }: TourPageTemplateProps) {
  const { lang } = useLanguage();
  const t = translations[lang];

  const activeVehicles = (recommendedVehicles && recommendedVehicles.length > 0)
    ? recommendedVehicles
    : DEFAULT_RECOMMENDED_VEHICLES;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [persons, setPersons] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [showTrust, setShowTrust] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);

  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      const target = e.target as HTMLElement;
      if (
        (target.tagName === "INPUT" && (target as HTMLInputElement).type !== "button" && (target as HTMLInputElement).type !== "submit") ||
        target.tagName === "SELECT"
      ) {
        const form = e.currentTarget;
        const inputs = Array.from(
          form.querySelectorAll("input:not([type='hidden']):not([disabled]), select:not([disabled])")
        ) as HTMLElement[];
        
        const index = inputs.indexOf(target);
        if (index > -1 && index < inputs.length - 1) {
          e.preventDefault();
          inputs[index + 1].focus();
        }
      }
    }
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { name: t.breadcrumbTours || "Tours", url: "/tours" },
    { name: data.title, url: `/tours/${data.slug}` },
  ];

  const isUpcomingDate = (dateStr: string) => {
    if (typeof dateStr !== "string") return false;
    const match = dateStr.match(/(\d+)\s+([a-zA-Z]+)(?:\s+(\d{4}))?/);
    if (!match) return true;
    const now = new Date();
    const year = match[3] || now.getFullYear();
    const parsedDate = new Date(`${match[1]} ${match[2]} ${year}`);
    if (isNaN(parsedDate.getTime())) return true;
    now.setHours(0, 0, 0, 0);
    return parsedDate >= now;
  };

  const validDates = Array.isArray(data.dates) ? data.dates.filter(isUpcomingDate) : [];

  return (
    <main className="w-full bg-white">
      <SchemaMarkup schema={data.schemaData} />

      {/* Tour Banner / Poster Section */}
      <section className="relative w-full bg-slate-950 flex justify-center items-center overflow-hidden">
        {/* Visually hidden H1 for SEO and screen-reader accessibility */}
        <h1 className="sr-only">{data.title}</h1>

        <div className="w-full max-w-[1920px] mx-auto flex justify-center items-center">
          {data.heroContent?.mobileImage ? (
            <>
              {/* Mobile Poster Image */}
              <div className="block md:hidden w-full">
                <LazyImage
                  src={data.heroContent.mobileImage}
                  alt={data.title}
                  containerClassName="w-full h-auto"
                  className="w-full h-auto object-cover block"
                  loading="eager"
                  autoOptimizeCloudinary={false}
                />
              </div>
              {/* Desktop Poster / Banner */}
              <div className="hidden md:block w-full aspect-[1654/561] max-h-[561px]">
                <LazyImage
                  src={data.heroContent.image}
                  alt={data.title}
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover block"
                  loading="eager"
                  optimizedWidth={1920}
                  autoOptimizeCloudinary={false}
                />
              </div>
            </>
          ) : (
            <div className="w-full aspect-[1654/561] max-h-[561px]">
              <LazyImage
                src={data.heroContent?.image || ""}
                alt={data.title}
                containerClassName="w-full h-full"
                className="w-full h-full object-cover block"
                loading="eager"
                optimizedWidth={1920}
                autoOptimizeCloudinary={false}
              />
            </div>
          )}
        </div>
      </section>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <SEOBreadcrumbs items={breadcrumbs} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12 mt-6">
        <div className="lg:col-span-2 space-y-8">
          {/* Overview Section */}
          <section>
            <h2 className="text-3xl font-bold text-brand-blue-deep mb-6">
              {t.tourOverview || "Overview"}
            </h2>
            <div className={`relative ${!isOverviewExpanded ? "max-h-[300px] overflow-hidden" : ""}`}>
              <div
                className="prose max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: data.overview }}
              />
              {!isOverviewExpanded && (
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              )}
            </div>
            <button
              onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
              className="mt-4 text-brand-orange font-bold text-sm hover:text-brand-orange-dark transition-colors flex items-center"
            >
              {isOverviewExpanded ? "Read Less" : "Read More"}
              <svg
                className={`ml-1.5 w-4 h-4 transition-transform duration-300 ${isOverviewExpanded ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </section>

          {/* Highlights Section */}
          <section className="pt-4">
            <button 
              onClick={() => setShowHighlights(!showHighlights)}
              className="w-full flex items-center justify-between text-left group"
            >
              <h2 className="text-3xl font-bold text-brand-blue-deep group-hover:text-brand-orange transition-colors">
                {t.tourHighlights || "Tour Highlights"}
              </h2>
              <svg 
                className={`w-6 h-6 text-brand-blue-deep transition-transform duration-300 ${showHighlights ? "rotate-180" : ""}`} 
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showHighlights && (
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-6">
                {data.highlights.map((highlight, idx) => (
                  <li key={idx} className="pl-1">
                    {highlight}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Recommended Vehicles Section */}
          <section className="pt-4">
            <h2 className="text-3xl font-bold text-brand-blue-deep mb-2">
              Recommended Vehicle for Your Group
            </h2>
            <p className="text-gray-600 mb-8">
              Choose your group size and we'll recommend the perfect vehicle for a comfortable journey.
            </p>

            {/* Smart Traveler Selector */}
            <div className="bg-brand-blue-deep/5 p-6 rounded-2xl mb-8 border border-brand-blue-deep/10">
              <label className="block text-lg font-bold text-brand-blue-deep mb-3">
                How many travelers are joining?
              </label>
              <select
                className="w-full md:w-1/2 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none text-slate-800 text-lg shadow-sm"
                value={persons}
                onChange={(e) => {
                  const num = Number(e.target.value);
                  setPersons(num);
                  if (num === 17) {
                    setSelectedVehicle("");
                  } else {
                    // Find best vehicle
                    const best = activeVehicles.find(v => num >= v.minCap && num <= v.maxCap) || activeVehicles[0];
                    setSelectedVehicle(best?.name || "");
                    // Scroll slightly to let them see it
                    setTimeout(() => {
                      document.getElementById(`vehicle-${best.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }, 100);
                  }
                }}
              >
                {Array.from(new Set(activeVehicles.map(v => `${v.minCap}-${v.maxCap}|${v.capacityStr}`))).map(opt => {
                  const [range, label] = opt.split('|');
                  const min = parseInt(range.split('-')[0]);
                  return <option key={opt} value={min}>{label}</option>;
                })}
                <option value={17}>Other</option>
              </select>
            </div>

            {/* Responsive Vehicle Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
              {activeVehicles.map((vehicle) => {
                const isRecommended = persons >= vehicle.minCap && persons <= vehicle.maxCap;
                const isSelected = selectedVehicle === vehicle.name;

                return (
                  <div
                    key={vehicle.id}
                    id={`vehicle-${vehicle.id}`}
                    className={`group relative rounded-2xl overflow-hidden bg-white flex flex-col justify-between transition-all duration-300 ${
                      isRecommended
                        ? 'border-2 border-brand-orange ring-4 ring-brand-orange/15 shadow-lg shadow-brand-orange/10'
                        : isSelected
                        ? 'border-2 border-brand-blue-deep ring-2 ring-brand-blue-deep/20 shadow-md'
                        : 'border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-slate-300'
                    }`}
                  >
                    {/* Recommended Banner if Best Match */}
                    {isRecommended && (
                      <div className="bg-gradient-to-r from-brand-orange to-amber-500 text-white text-[11px] font-black uppercase tracking-wider text-center py-1.5 px-3 flex items-center justify-center gap-1.5 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 fill-white shrink-0" />
                        <span>Best Match for Your Group ({persons} {persons === 1 ? 'Traveler' : 'Travelers'})</span>
                      </div>
                    )}

                    {/* Vehicle Showcase Image Container - 100% Uncropped & Responsive */}
                    <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-gradient-to-b from-slate-50 via-slate-100/70 to-slate-100 overflow-hidden flex items-center justify-center p-3 sm:p-4 border-b border-slate-100">
                      {/* Floating Badges Bar (Non-overlapping) */}
                      <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-2 z-10 pointer-events-none">
                        {vehicle.badge ? (
                          <span className="px-2.5 py-1 bg-slate-900/90 backdrop-blur-sm text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider rounded-full shadow-sm max-w-[62%] truncate">
                            {vehicle.badge}
                          </span>
                        ) : (
                          <div />
                        )}
                        <span className="px-2.5 py-1 bg-white/95 backdrop-blur-sm text-brand-blue-deep text-[10px] sm:text-[11px] font-black rounded-full shadow-sm border border-slate-200/90 shrink-0 flex items-center gap-1">
                          <Users className="w-3 h-3 text-brand-orange shrink-0" />
                          <span>{vehicle.capacityStr}</span>
                        </span>
                      </div>

                      <LazyImage
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-full h-full object-contain drop-shadow-sm transition-transform duration-500 group-hover:scale-105"
                        autoOptimizeCloudinary={false}
                      />
                    </div>
                    
                    {/* Card Content & Features */}
                    <div className="p-4 sm:p-5 flex flex-col flex-1">
                      <div className="mb-2">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                          {vehicle.name}
                        </h3>
                      </div>

                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2 min-h-[36px]">
                        {vehicle.description}
                      </p>
                      
                      {/* Amenities with Checkmarks */}
                      <div className="space-y-2 mb-5 flex-1">
                        {vehicle.amenities.map((amenity: string, i: number) => (
                          <div key={i} className="flex items-start text-xs sm:text-sm text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 mt-0.5 shrink-0" />
                            <span className="leading-snug">{amenity}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Pinned Bottom Action Button */}
                      <div className="pt-4 border-t border-slate-100 mt-auto">
                        <button
                          type="button"
                          className={`w-full py-2.5 sm:py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                            isSelected
                              ? 'bg-brand-blue-deep text-white shadow-md ring-2 ring-brand-blue-deep/30'
                              : isRecommended
                              ? 'bg-brand-orange text-white hover:bg-brand-orange-dark shadow-md shadow-brand-orange/20 hover:shadow-lg'
                              : 'border-2 border-brand-blue-deep text-brand-blue-deep hover:bg-brand-blue-deep hover:text-white'
                          }`}
                          onClick={() => {
                            setSelectedVehicle(vehicle.name);
                            setPersons(vehicle.maxCap);
                            window.dataLayer?.push({
                              event: "inquire_vehicle",
                              tour: data.title,
                              vehicle: vehicle.name,
                            });
                            document
                              .getElementById("sidebar-booking-form")
                              ?.scrollIntoView({ behavior: "smooth" });
                            setTimeout(() => {
                              const input = document.getElementById("booking-name-input");
                              if (input) (input as HTMLElement).focus();
                            }, 500);
                          }}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Selected</span>
                            </>
                          ) : isRecommended ? (
                            <>
                              <span>Choose Recommended</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          ) : (
                            <span>Choose Vehicle</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Vehicle Comparison Table */}
          <section>
            <button 
              onClick={() => setShowCompare(!showCompare)}
              className="w-full flex items-center justify-between text-left group"
            >
              <h3 className="text-2xl font-bold text-brand-blue-deep group-hover:text-brand-orange transition-colors">Compare Vehicles</h3>
              <svg 
                className={`w-6 h-6 text-brand-blue-deep transition-transform duration-300 ${showCompare ? "rotate-180" : ""}`} 
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showCompare && (
              <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm mt-6">
                <table className="w-full text-left border-collapse bg-white whitespace-nowrap">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                      <th className="p-4 font-semibold">Vehicle</th>
                      <th className="p-4 font-semibold">Capacity</th>
                      <th className="p-4 font-semibold">Comfort</th>
                      <th className="p-4 font-semibold">Luggage</th>
                      <th className="p-4 font-semibold">Best For</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm text-gray-800">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium">Swift Dzire</td>
                      <td className="p-4">1–4</td>
                      <td className="p-4 text-brand-orange">★★★★☆</td>
                      <td className="p-4">Medium</td>
                      <td className="p-4">Couples</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium">Ertiga</td>
                      <td className="p-4">5–7</td>
                      <td className="p-4 text-brand-orange">★★★★☆</td>
                      <td className="p-4">Large</td>
                      <td className="p-4">Families</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium">Innova Crysta</td>
                      <td className="p-4">5–7</td>
                      <td className="p-4 text-brand-orange">★★★★★</td>
                      <td className="p-4">Large</td>
                      <td className="p-4">Premium Family Tours</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium">Urbania 12</td>
                      <td className="p-4">8–12</td>
                      <td className="p-4 text-brand-orange">★★★★★</td>
                      <td className="p-4">Extra Large</td>
                      <td className="p-4">Group Tours</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium">Urbania 16</td>
                      <td className="p-4">13–16</td>
                      <td className="p-4 text-brand-orange">★★★★★</td>
                      <td className="p-4">Extra Large</td>
                      <td className="p-4">Large Groups</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Trust Section */}
          <section>
            <button 
              onClick={() => setShowTrust(!showTrust)}
              className="w-full flex items-center justify-between text-left group"
            >
              <h3 className="text-2xl font-bold text-brand-blue-deep group-hover:text-brand-orange transition-colors">Why Our Vehicles?</h3>
              <svg 
                className={`w-6 h-6 text-brand-blue-deep transition-transform duration-300 ${showTrust ? "rotate-180" : ""}`} 
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showTrust && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                {[
                  "Professional Drivers", "Sanitized Before Every Trip", "GPS Enabled",
                  "24×7 Roadside Support", "Comfortable Long-Distance Travel", "Well Maintained Fleet"
                ].map((trust, idx) => (
                  <div key={idx} className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="bg-brand-green/10 p-2 rounded-full text-brand-green shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-800">{trust}</span>
                  </div>
                ))}
              </div>
            )}
          </section>


          {/* Internal Linking Components */}
          <RelatedTours tours={data.relatedTours} />
          <RelatedBlogs blogs={data.relatedBlogs} />
        </div>

        <div className="lg:col-span-1">
          {/* Sidebar Booking Form */}
          <div
            id="sidebar-booking-form"
            className="sticky top-24 bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm"
          >
            {success ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 bg-brand-green/5 rounded-2xl border border-brand-green/20 text-center">
                <div className="w-12 h-12 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-brand-green-dark"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-brand-blue-deep mb-2">
                  {lang === "mr" ? "बुकिंग प्राप्त झाले!" : "Booking Received!"}
                </h3>
                <p className="text-slate-600 text-sm mb-6 max-w-sm">
                  {lang === "mr"
                    ? "आम्हाला तुमची बुकिंग विनंती मिळाली आहे. आम्ही लवकरच तुमच्याशी संपर्क साधू."
                    : "We have received your booking request and will contact you shortly to confirm."}
                </p>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setName("");
                    setPhone("");
                    setTravelDate("");
                    setPersons(1);
                  }}
                  className="px-6 py-2 bg-brand-blue-deep text-white text-sm rounded-xl font-bold hover:bg-brand-blue transition-colors cursor-pointer"
                >
                  {lang === "mr" ? "नवीन बुकिंग करा" : "Make Another Booking"}
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t.tourCustomQuote || "Request a Custom Quote"}
                </h3>
                {selectedVehicle && (
                  <div className="mb-6 bg-brand-orange/10 border border-brand-orange/20 px-4 py-3 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs text-brand-orange-dark font-bold uppercase tracking-wider mb-0.5">Selected Vehicle</p>
                      <p className="text-sm font-bold text-gray-900">{selectedVehicle}</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setSelectedVehicle("")}
                      className="text-xs text-gray-500 hover:text-gray-700 underline"
                    >
                      Clear
                    </button>
                  </div>
                )}
                <form
                  onKeyDown={handleFormKeyDown}
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    try {
                      const bookingData = {
                        name: name.trim(),
                        phone: phone.trim(),
                        tripName: data.title,
                        persons,
                        travelDate,
                        vehicle: selectedVehicle || "Not specified",
                      };
                      await createBookingFn({ data: bookingData });
                      setSuccess(true);
                    } catch (err: any) {
                      alert(err.message || "Failed to submit booking. Please try again.");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t.formName || "Full Name"}
                    </label>
                    <input
                      id="booking-name-input"
                      type="text"
                      name="name"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-shadow text-slate-800"
                      placeholder={t.formNamePlace || "Your Name"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t.formContact || "Phone Number"}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="tour-phone"
                      autoComplete="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-shadow text-slate-800"
                      placeholder="+91"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {lang === "mr" ? "प्रवासी संख्या" : "Number of Persons"}
                    </label>
                    <select
                      name="persons"
                      id="tour-persons"
                      autoComplete="off"
                      value={persons}
                      onChange={(e) => {
                        const num = Number(e.target.value);
                        setPersons(num);
                        if (num === 17) {
                          setSelectedVehicle("");
                        } else {
                          const best = activeVehicles.find(v => num >= v.minCap && num <= v.maxCap) || activeVehicles[0];
                          setSelectedVehicle(best?.name || "");
                        }
                      }}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-shadow cursor-pointer text-slate-800"
                    >
                      {Array.from(new Set(activeVehicles.map(v => `${v.minCap}-${v.maxCap}|${v.capacityStr}`))).map(opt => {
                        const [range, label] = opt.split('|');
                        const min = parseInt(range.split('-')[0]);
                        return <option key={opt} value={min}>{label}</option>;
                      })}
                      <option value={17}>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {"Travel Date"}
                    </label>
                    {validDates && validDates.length > 0 && travelDate !== "CUSTOM" ? (
                      <select
                        name="travelDate"
                        id="tour-travel-date"
                        autoComplete="off"
                        required
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-shadow cursor-pointer text-slate-800"
                      >
                        <option value="">{t.tourSelectDate || "Select a date"}</option>
                        {validDates.map((date: string) => (
                          <option key={date} value={date}>
                            {date}
                          </option>
                        ))}
                        <option value="CUSTOM">Custom Date</option>
                      </select>
                    ) : (
                      <div className="flex flex-col w-full">
                        <input
                          type="date"
                          name="travelDate"
                          id="tour-travel-date"
                          autoComplete="off"
                          required
                          value={travelDate === "CUSTOM" ? "" : travelDate}
                          onChange={(e) => setTravelDate(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-shadow text-slate-800"
                        />
                        {validDates && validDates.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setTravelDate("")}
                            className="text-[12px] font-bold text-brand-orange mt-2 text-left hover:underline"
                          >
                            ← Pick a scheduled date
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 mt-2 bg-brand-blue-deep hover:bg-brand-blue text-white font-bold rounded-lg transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        {lang === "mr" ? "सादर करत आहे..." : "Submitting..."}
                      </>
                    ) : (
                      t.tourSubmit || "Submit Request"
                    )}
                  </button>
                  <p className="text-xs text-center text-gray-500 mt-4">
                    {t.tourContactSoon || "We will contact you within 24 hours."}
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    </main >
  );
}
