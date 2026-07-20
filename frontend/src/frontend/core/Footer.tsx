import React, { useState, useEffect } from 'react';
import { getToursFn } from '@/backend/features/tours';
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube, ArrowRight, X } from 'lucide-react';
import { translations } from '@/frontend/core/i18n';
import { BrandHighlight } from '@/frontend/core/BrandHighlight';
import { Link } from '@tanstack/react-router';

export function FooterSection({ t, lang = "en" }: { t: typeof translations.mr; lang?: string }) {
  const [popularTours, setPopularTours] = useState<{ label: string; href: string }[]>([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    getToursFn({ data: { lang } })
      .then((tours: any[]) => {
        if (tours) {
          setPopularTours(
            tours
              .reverse()
              .slice(0, 6)
              .map((t) => ({
                label: t.title,
                href: `/tours/${t.slug}`,
              })),
          );
        }
      })
      .catch(console.error);
  }, []);

  return (
    <footer
      id="contact"
      className="w-full bg-[#0a192f] text-slate-300 pt-20 pb-8 md:pt-24 md:pb-10 relative overflow-hidden scroll-mt-28 md:scroll-mt-32"
    >
      {/* Premium subtle top gradient border */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-green/30 to-transparent" />

      {/* Background subtle glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[300px] bg-brand-green/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-[1440px] px-6 md:px-10 relative z-10">
        {/* Main Grid: Custom 5-cols on desktop, 6-cols on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-6 xl:grid-cols-[2fr_1fr_1fr_1.5fr_1.5fr] gap-y-8 gap-x-8 xl:gap-x-16 mb-16 md:mb-20">
          {/* 1. Brand & About */}
          <div className="col-span-1 md:col-span-2 xl:col-span-1 flex flex-col items-center md:items-start text-center md:text-left gap-6 xl:pr-6">
            <div className="flex flex-col items-center md:items-start">
              <span className="leading-none">
                <span className="block font-display text-[32px] font-extrabold text-[#FF5C5C] tracking-tight">
                  Shailraj
                </span>
                <span className="block text-[11px] font-bold uppercase tracking-[0.35em] text-brand-green mt-1.5 ml-0.5">
                  Travels
                </span>
              </span>
            </div>
            <p className="text-slate-400 text-[15px] leading-relaxed max-w-sm md:max-w-none">
              {t.footerAbout}
            </p>

            {/* Follow Us */}
            <div className="mt-2 flex flex-col items-center md:items-start gap-4">
              <span className="text-[13px] font-bold text-white tracking-wider uppercase opacity-90">
                {t.footerFollowUs || "Follow Us"}
              </span>
              <div className="flex items-center gap-4">
                {/* Facebook */}
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-full bg-[#3B5998] flex items-center justify-center text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-md shadow-[#3B5998]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a192f] cursor-pointer"
                >
                  <span className="sr-only">Facebook</span>
                  <Facebook className="w-5 h-5" />
                </a>
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/wings_of_mayur_9999/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full bg-[#E1306C] flex items-center justify-center text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-md shadow-[#E1306C]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a192f] cursor-pointer"
                >
                  <span className="sr-only">Instagram</span>
                  <Instagram className="w-5 h-5" />
                </a>
                {/* YouTube */}
                <a
                  href="#"
                  aria-label="YouTube"
                  className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-md shadow-[#FF0000]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a192f] cursor-pointer"
                >
                  <span className="sr-only">YouTube</span>
                  <Youtube className="w-5 h-5 fill-current" />
                </a>
              </div>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div className="col-span-1 md:col-span-2 xl:col-span-1 flex flex-col gap-6">
            <h3 className="text-[17px] font-bold text-white font-display tracking-wide relative inline-block pb-2 self-start">
              {t.footerQuickLinks || "Quick Links"}
              <span className="absolute bottom-0 left-0 w-8 h-[2px] bg-brand-green rounded-full"></span>
            </h3>
            <ul className="flex flex-col gap-3.5">
              {[
                { label: t.navHome || "Home", href: "/" },
                { label: t.navAbout || "About", href: "/#about" },
                { label: t.navPilgrimage || "Packages", href: "/tours" },
                { label: t.navGallery || "Gallery", href: "/#gallery" },
                { label: t.navReviews || "Reviews", href: "/#reviews" },
                { label: t.navBlog || "Blog", href: "/blog" },
                { label: t.navContact || "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("/#") ? (
                    <Link
                      to="/"
                      hash={link.href.replace("/#", "")}
                      className="group inline-flex items-center text-[15px] text-slate-400 hover:text-white transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green rounded-sm"
                    >
                      <ArrowRight className="w-3.5 h-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 text-brand-green transition-all duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.label}
                      </span>
                    </Link>
                  ) : (
                    <Link
                      to={link.href as any}
                      className="group inline-flex items-center text-[15px] text-slate-400 hover:text-white transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green rounded-sm"
                    >
                      <ArrowRight className="w-3.5 h-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 text-brand-green transition-all duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.label}
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Popular Tours */}
          <div className="col-span-1 md:col-span-2 xl:col-span-1 flex flex-col gap-6">
            <h3 className="text-[17px] font-bold text-white font-display tracking-wide relative inline-block pb-2 self-start">
              {t.footerPopularTours || "Popular Tours"}
              <span className="absolute bottom-0 left-0 w-8 h-[2px] bg-brand-green rounded-full"></span>
            </h3>
            <ul className="flex flex-col gap-3.5">
              {popularTours.length > 0 ? (
                popularTours.map((tour) => (
                  <li key={tour.label}>
                    <Link
                      to={tour.href as any}
                      className="group inline-flex items-center text-[15px] text-slate-400 hover:text-white transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green rounded-sm"
                    >
                      <ArrowRight className="w-3.5 h-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 text-brand-green transition-all duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {tour.label}
                      </span>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-[15px] text-slate-400">Loading tours...</li>
              )}
            </ul>
          </div>

          {/* 4. Contact Us */}
          <div className="col-span-1 md:col-span-3 xl:col-span-1 flex flex-col gap-6">
            <h3 className="text-[17px] font-bold text-white font-display tracking-wide relative inline-block pb-2 self-start">
              {t.footerContact || "Contact Us"}
              <span className="absolute bottom-0 left-0 w-8 h-[2px] bg-brand-green rounded-full"></span>
            </h3>
            <ul className="flex flex-col gap-5 text-[15px] text-slate-400">
              <li className="flex items-start gap-3.5 group">
                <div className="w-8 h-8 rounded-full bg-slate-800/50 flex items-center justify-center shrink-0 group-hover:bg-brand-green/20 transition-colors">
                  <MapPin className="w-4 h-4 text-brand-green" />
                </div>
                <span className="mt-1 leading-relaxed">{t.footerAddress}</span>
              </li>
              <li className="flex items-center gap-3.5 group">
                <div className="w-8 h-8 rounded-full bg-slate-800/50 flex items-center justify-center shrink-0 group-hover:bg-brand-green/20 transition-colors">
                  <Phone className="w-4 h-4 text-brand-green" />
                </div>
                <a
                  href="tel:+919763433556"
                  className="whitespace-nowrap hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green rounded-sm"
                >
                  +91 97634 33556
                </a>
              </li>
              <li className="flex items-center gap-3.5 group">
                <div className="w-8 h-8 rounded-full bg-slate-800/50 flex items-center justify-center shrink-0 group-hover:bg-brand-green/20 transition-colors">
                  <Mail className="w-4 h-4 text-brand-green" />
                </div>
                <a
                  href="mailto:shailrajtravels9999@gmail.com"
                  className="whitespace-nowrap hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green rounded-sm overflow-hidden text-ellipsis"
                >
                  shailrajtravels9999@gmail.com
                </a>
              </li>
              <li className="mt-2 rounded-xl overflow-hidden h-[150px] border border-slate-700/50 shadow-lg relative group">
                <iframe
                  src="https://maps.google.com/maps?q=Shailraj%20Travels%2C%20Gopal%20Patti%2C%20Manjri%20budruk%2C%20Hadapsar%2C%20Pune%2C%20Maharashtra%20412307&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Shailraj Travels Location Map"
                  className="opacity-80 group-hover:opacity-100 transition-opacity"
                ></iframe>
              </li>
            </ul>
          </div>

          {/* 5. Legal & Security */}
          <div className="col-span-1 md:col-span-3 xl:col-span-1 flex flex-col gap-10">
            {/* Legal */}
            <div className="flex flex-col gap-6">
              <h3 className="text-[17px] font-bold text-white font-display tracking-wide relative inline-block pb-2 self-start">
                {t.footerLegal || "Legal"}
                <span className="absolute bottom-0 left-0 w-8 h-[2px] bg-brand-green rounded-full"></span>
              </h3>
              <ul className="flex flex-col gap-3.5">
                {[
                  { label: t.footerPrivacy || "Privacy Policy", href: "/privacy-policy" },
                  { label: t.footerTerms || "Terms & Conditions", href: "/terms" },
                  { label: t.footerRefund || "Refund Policy", href: "/refund-policy" },
                  { label: t.footerCancel || "Cancellation Policy", href: "/cancellation-policy" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href as any}
                      className="group inline-flex items-center text-[15px] text-slate-400 hover:text-white transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green rounded-sm whitespace-nowrap"
                    >
                      <ArrowRight className="w-3.5 h-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 text-brand-green transition-all duration-300 shrink-0" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Security */}
            <div className="flex flex-col gap-6">
              <h3 className="text-[17px] font-bold text-white font-display tracking-wide relative inline-block pb-2 self-start">
                {t.footerSecurity || "Security"}
                <span className="absolute bottom-0 left-0 w-8 h-[2px] bg-brand-green rounded-full"></span>
              </h3>
              <ul className="flex flex-col gap-3.5">
                <li>
                  <Link
                    to="/security-policy"
                    className="group inline-flex items-center text-[15px] text-slate-400 hover:text-white transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green rounded-sm whitespace-nowrap"
                  >
                    <ArrowRight className="w-3.5 h-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 text-brand-green transition-all duration-300 shrink-0" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {t.footerSecurityPolicy || "Security Policy"}
                    </span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="group inline-flex items-center text-[15px] text-slate-400 hover:text-white transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green rounded-sm whitespace-nowrap text-left"
                  >
                    <ArrowRight className="w-3.5 h-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 text-brand-green transition-all duration-300 shrink-0" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {t.footerReportIssue || "Report Issue"}
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Copyright */}
        <div className="border-t border-slate-800/80 pt-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-4 text-[14px] text-slate-400 text-center md:text-left">
          <p className="font-medium tracking-wide">
            © {new Date().getFullYear()} <span className="font-display font-bold text-[#FF5C5C]">Shailraj</span> <span className="text-brand-green">Travels</span>.{" "}
            {t.footerRights || "All Rights Reserved."}
          </p>
          <p className="flex items-center gap-1.5">
            {t.footerDesignedBy || "Designed & Developed by"}{" "}
            <span className="text-slate-300 font-semibold">Axenor Studio</span>
          </p>
        </div>
      </div>

      {/* Report Issue Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0a192f]/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#0a192f] p-5 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white font-display tracking-wide m-0">Report an Issue</h3>
              <button onClick={() => setIsReportModalOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form 
              className="p-6 flex flex-col gap-5 text-slate-800"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you for your report. Our team will look into it shortly.");
                setIsReportModalOpen(false);
              }}
            >
              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="report-name" className="text-[13px] font-bold text-slate-600 uppercase tracking-wide">Full Name</label>
                <input required type="text" id="report-name" className="px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green w-full bg-slate-50 hover:bg-white transition-colors" placeholder="John Doe" />
              </div>
              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="report-email" className="text-[13px] font-bold text-slate-600 uppercase tracking-wide">Email Address</label>
                <input required type="email" id="report-email" className="px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green w-full bg-slate-50 hover:bg-white transition-colors" placeholder="john@example.com" />
              </div>
              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="report-type" className="text-[13px] font-bold text-slate-600 uppercase tracking-wide">Issue Type</label>
                <select required id="report-type" defaultValue="" className="px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green w-full bg-slate-50 hover:bg-white transition-colors text-slate-700">
                  <option value="" disabled>Select an issue type...</option>
                  <option value="website">Website / App Bug</option>
                  <option value="booking">Booking Issue</option>
                  <option value="tour">Tour Experience Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="report-desc" className="text-[13px] font-bold text-slate-600 uppercase tracking-wide">Description</label>
                <textarea required id="report-desc" rows={4} className="px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green w-full resize-none bg-slate-50 hover:bg-white transition-colors" placeholder="Please describe the issue in detail..."></textarea>
              </div>
              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="report-screenshot" className="text-[13px] font-bold text-slate-600 uppercase tracking-wide">Screenshot (Optional)</label>
                <input type="file" id="report-screenshot" accept="image/*" className="px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green w-full bg-slate-50 hover:bg-white transition-colors text-sm text-slate-600 file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-[#0a192f] file:text-white hover:file:bg-[#0a192f]/90 file:cursor-pointer cursor-pointer" />
              </div>
              <button type="submit" className="mt-2 w-full py-3.5 bg-[#FF5C5C] hover:bg-[#ff4747] text-white font-bold rounded-lg transition-colors shadow-lg shadow-[#FF5C5C]/20 flex items-center justify-center gap-2 group">
                Submit Report
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
}
