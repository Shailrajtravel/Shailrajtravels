import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export function FaqSection({ lang, t }: { lang: string; t: any }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData = [
    { q: t.faq1Q, a: t.faq1A },
    { q: t.faq2Q, a: t.faq2A },
    { q: t.faq3Q, a: t.faq3A },
    { q: t.faq4Q, a: t.faq4A },
    { q: t.faq5Q, a: t.faq5A },
    { q: t.faq6Q, a: t.faq6A },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full bg-white py-16 md:py-24 relative border-t border-slate-100 scroll-mt-28 md:scroll-mt-32">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading & Illustration */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold font-display text-brand-blue-deep leading-tight">
                {t.faqHeaderMain}{" "}
                <span className="text-brand-green-dark">{t.faqHeaderSub}</span>
              </h2>
              <p className="text-slate-500 text-sm md:text-base mt-4 leading-relaxed max-w-md">
                {t.faqSubtitle}
              </p>
            </div>
            
            {/* Vector Illustration */}
            <div className="w-full select-none">
              <img
                src="/images/faq_illustration.webp"
                alt="FAQ Illustration"
                width={450}
                height={450}
                loading="lazy"
                className="w-full h-auto max-w-[450px] mx-auto object-contain transform hover:scale-102 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:col-span-7 divide-y divide-slate-100">
            {faqData.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="py-4 py-4.5 first:pt-0 last:pb-0">
                  <button
                    type="button"
                    onClick={() => handleToggle(index)}
                    className="w-full flex items-start gap-4 text-left group cursor-pointer focus:outline-none py-2"
                  >
                    {/* Expand/Collapse Sign on Left */}
                    <div className="mt-1 flex items-center justify-center w-5 h-5 shrink-0 text-brand-blue-deep group-hover:text-brand-blue transition-colors">
                      {isOpen ? (
                        <Minus className="w-4 h-4" strokeWidth={3} />
                      ) : (
                        <Plus className="w-4 h-4" strokeWidth={3} />
                      )}
                    </div>
                    {/* Question text */}
                    <span className="font-bold text-brand-blue-deep group-hover:text-brand-blue text-[15px] sm:text-[17px] leading-snug transition-colors pr-4">
                      {item.q}
                    </span>
                  </button>

                  {/* Answer with smooth height reveal transition */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"}`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed pl-9 pb-2 pr-4">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
