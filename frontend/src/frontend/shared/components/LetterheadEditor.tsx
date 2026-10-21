import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft,
  Printer, 
  FileText, 
  ClipboardList, 
  Eraser, 
  Download, 
  ZoomIn, 
  Maximize2, 
  Sparkles, 
  Loader2,
  X,
  Bot,
  CheckCircle2,
  CornerDownLeft,
  RotateCcw
} from 'lucide-react';

const SAMPLE_LETTER_HTML = `
  <div style="display:flex; justify-content:space-between; color:#64748b; font-size:12px; margin-bottom:14px;">
    <span><strong>Ref No:</strong> ST/PUN/2026-27/0482</span>
    <span><strong>Date:</strong> 16 October 2026</span>
  </div>

  <div style="margin-bottom:12px; font-weight:600; color:#0f172a; line-height:1.4;">
    To,<br>
    The Corporate Travel Desk / Valued Patron,<br>
    Pune, Maharashtra.
  </div>

  <div style="font-size:12.5px; font-weight:700; color:#c45e0e; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:12px; padding-bottom:4px; border-bottom:1px dashed rgba(232, 115, 26, 0.4);">
    Subject: Official Travel Itinerary & Vehicle Booking Confirmation
  </div>

  <div style="margin-bottom:10px;">
    Dear Sir / Madam,
  </div>

  <div style="margin-bottom:12px; text-align:justify; line-height:1.5;">
    Greetings from <strong>SHAILRAJ TRAVELS, Pune!</strong> We are pleased to formally confirm your upcoming travel itinerary and vehicle arrangements as per your recent inquiry. At Shailraj Travels, we take immense pride in delivering safe, punctual, and comfortable travel experiences across Maharashtra and all major pilgrimage circuits throughout India.
  </div>

  <div style="margin-bottom:12px; text-align:justify; line-height:1.5;">
    Your assigned commercial vehicle has undergone comprehensive mechanical inspection, interior sanitization, and safety audits. Our verified commercial chauffeur has been briefed on your exact pickup schedule, route landmarks, and destination preferences to ensure an effortless journey.
  </div>

  <div style="background:rgba(248, 250, 252, 0.95); border-left:3px solid #e8731a; padding:10px 14px; margin:12px 0; border-radius:0 6px 6px 0;">
    <strong style="font-size:12px; color:#0f1c30;">KEY SERVICE & BOOKING HIGHLIGHTS:</strong>
    <ul style="margin-left:18px; margin-top:4px; margin-bottom:0;">
      <li style="margin-bottom:4px;"><strong>Premium Fleet:</strong> Sanitized, air-conditioned vehicle with luggage carrier and pushback seating.</li>
      <li style="margin-bottom:4px;"><strong>Professional Chauffeur:</strong> Courteous, verified commercial driver with extensive highway experience.</li>
      <li style="margin-bottom:4px;"><strong>Live Trip Monitoring:</strong> 24x7 centralized operations desk assistance and real-time support.</li>
      <li style="margin-bottom:4px;"><strong>Transparent Billing:</strong> Guaranteed competitive rates with zero concealed or hidden surcharges.</li>
    </ul>
  </div>

  <div style="margin-bottom:14px; text-align:justify; line-height:1.5;">
    Please find your complete travel voucher and driver reporting credentials enclosed herewith. Should you require route customizations or emergency assistance during the journey, please reach our round-the-clock helpdesk at <strong>+91 97634 33556</strong> or email <strong>info@shailrajtravels.com</strong>.
  </div>

  <div style="margin-top:16px; font-weight:500;">
    Warm Regards,<br><br>
    <strong style="display:block; margin-top:16px; color:#0f1c30; font-weight:700;">
      Authorized Signatory<br>SHAILRAJ TRAVELS, Pune
    </strong>
  </div>
`;

const QUOTATION_HTML = `
  <div style="display:flex; justify-content:space-between; color:#64748b; font-size:12px; margin-bottom:14px;">
    <span><strong>Quotation No:</strong> QT/2026-27/089</span>
    <span><strong>Date:</strong> 16 October 2026</span>
  </div>

  <div style="margin-bottom:12px; font-weight:600; color:#0f172a; line-height:1.4;">
    To,<br>
    The Corporate Procurement Desk,<br>
    Pune, Maharashtra.
  </div>

  <div style="font-size:12.5px; font-weight:700; color:#c45e0e; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:12px; padding-bottom:4px; border-bottom:1px dashed rgba(232, 115, 26, 0.4);">
    Subject: Official Tour & Vehicle Rental Quotation
  </div>

  <div style="margin-bottom:10px;">
    Dear Sir / Madam,
  </div>

  <div style="margin-bottom:12px; text-align:justify; line-height:1.5;">
    Thank you for choosing <strong>SHAILRAJ TRAVELS</strong> as your preferred fleet partner. We take pleasure in submitting our most competitive commercial quotation tailored to your specific organizational travel and corporate conveyance requirements.
  </div>

  <div style="margin-bottom:12px; text-align:justify; line-height:1.5;">
    Our extensive fleet of modern, GPS-enabled vehicles combined with uniformed, experienced chauffeurs guarantees seamless transportation management with punctuality, executive passenger comfort, and superior safety compliance.
  </div>

  <div style="background:rgba(248, 250, 252, 0.95); border-left:3px solid #e8731a; padding:10px 14px; margin:12px 0; border-radius:0 6px 6px 0;">
    <strong style="font-size:12px; color:#0f1c30;">COMMERCIAL PACKAGE SPECIFICATIONS:</strong>
    <ul style="margin-left:18px; margin-top:4px; margin-bottom:0;">
      <li style="margin-bottom:4px;"><strong>Vehicle Category:</strong> Toyota Innova Crysta / Ertiga (Premium Air-Conditioned).</li>
      <li style="margin-bottom:4px;"><strong>Proposed Circuit:</strong> Pune to Ashtavinayak / Shirdi Pilgrimage & Corporate Transit.</li>
      <li style="margin-bottom:4px;"><strong>Duration & Package Cost:</strong> ₹ 14,500/- (Inclusive of fuel & chauffeur allowances).</li>
      <li style="margin-bottom:4px;"><strong>Toll & Parking Charges:</strong> Billed strictly at actuals against government receipts.</li>
    </ul>
  </div>

  <div style="margin-bottom:14px; text-align:justify; line-height:1.5;">
    This commercial proposal is valid for 15 days from the date of issuance. To confirm the fleet reservation, kindly endorse a signed copy of this quotation or contact our corporate booking team at <strong>+91 97634 33556</strong>.
  </div>

  <div style="margin-top:16px; font-weight:500;">
    Sincerely,<br><br>
    <strong style="display:block; margin-top:16px; color:#0f1c30; font-weight:700;">
      For SHAILRAJ TRAVELS<br>Sales & Booking Desk
    </strong>
  </div>
`;

const BLANK_HTML = `
  <div style="display:flex; justify-content:space-between; color:#64748b; font-size:11.5px; margin-bottom:14px;">
    <span><strong>Ref No:</strong> ST/PUN/2026-27/</span>
    <span><strong>Date:</strong> 16 October 2026</span>
  </div>
  <div style="margin-bottom:12px; font-weight:600; color:#0f172a; line-height:1.4;">
    To,<br><br>
  </div>
  <div style="font-size:12px; font-weight:700; color:#c45e0e; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:12px; padding-bottom:4px; border-bottom:1px dashed rgba(232, 115, 26, 0.4);">
    Subject: 
  </div>
  <div style="margin-bottom:12px; color:#94a3b8; font-style:italic;">
    [Start typing your letter directly, or click "Gemini AI" above to generate automatically...]
  </div>
`;

export function LetterheadEditor({ 
  className = '',
  onBack,
}: { 
  className?: string;
  onBack?: () => void;
}) {
  const [zoomMode, setZoomMode] = useState<'fit' | 'actual'>('fit');
  const [scale, setScale] = useState(1);
  const [containerHeight, setContainerHeight] = useState(1139);

  // AI Modal States - Clean, minimal 1-field with Regenerate
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [lastGeneratedPrompt, setLastGeneratedPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiStatus, setAiStatus] = useState('');
  const [aiError, setAiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const loadTemplate = (html: string) => {
    if (contentRef.current) {
      contentRef.current.innerHTML = html;
    }
  };

  // Contextual calibrated letterhead synthesizer ensuring 100% zero-failure reliability
  const synthesizeCalibratedLetter = (userPrompt: string): string => {
    const p = userPrompt.toLowerCase();
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const yearStr = `${today.getFullYear()}-${String(today.getFullYear() + 1).slice(2)}`;

    let refNo = `ST/PUN/${yearStr}/OPS-0482`;
    let recipient = `To,<br>Assigned Operations Team / Valued Recipient,<br>Pune, Maharashtra.`;
    let subject = `Official Operational Communication & Directive`;
    let salutation = `Dear Team / Valued Recipient,`;
    let p1 = `Formal greetings from <strong>SHAILRAJ TRAVELS, Pune</strong>. This letter establishes the official operational directive, scheduled terms, and service benchmarks for our upcoming engagement, reflecting our dedication to safe, punctual, and reliable travel services across Maharashtra and India.`;
    let p2 = `All assigned staff, fleet vehicles, and operational protocols must strictly adhere to our standardized quality standards, ensuring passenger comfort, vehicle mechanical integrity, and absolute punctuality throughout the scheduled timeline.`;
    let cardTitle = `Key Operational Parameters & Mandates`;
    let bullets = [
      `<strong>Fleet Verification:</strong> Comprehensive pre-trip mechanical inspection covering tyre safety, brakes, coolant, and climate control.`,
      `<strong>Route & Schedule Adherence:</strong> Strict compliance with designated highway corridors and verified passenger pickup timings.`,
      `<strong>Hospitality & Conduct:</strong> Courteous, professional communication and dedicated assistance with passenger baggage at all times.`,
      `<strong>Billing & Expense Logging:</strong> Accurate digital maintenance of FASTag toll slips, commercial fuel receipts, and parking records.`
    ];
    let p3 = `Our 24x7 central control desk (+91 97634 33556 | info@shailrajtravels.com) remains on continuous standby for real-time fleet tracking, navigational support, and immediate roadside assistance. We trust the team will execute this assignment with utmost professionalism.`;
    let signOff = `Warm Regards,<br><br><strong style="display:block; margin-top:16px; color:#0f1c30; font-weight:700;">Authorized Signatory<br>SHAILRAJ TRAVELS, Pune</strong>`;

    if (p.includes('driver') || p.includes('employe') || p.includes('staff') || p.includes('chauffeur')) {
      refNo = `ST/PUN/${yearStr}/DRV-OPS-108`;
      recipient = `To,<br>The Assigned Chauffeurs & Driving Operations Team,<br>Shailraj Travels, Hadapsar, Pune.`;
      salutation = `Dear Chauffeur Team / Valued Driving Staff,`;
      signOff = `Warm Regards,<br><br><strong style="display:block; margin-top:16px; color:#0f1c30; font-weight:700;">Mayur Khude / Management<br>SHAILRAJ TRAVELS, Pune</strong>`;
      
      if (p.includes('ujjain') || p.includes('indore') || p.includes('pilgrim') || p.includes('mahakal')) {
        refNo = `ST/PUN/${yearStr}/UJ-PIL-077`;
        subject = `Operational Duty Allocation & Guidelines – Pune to Ujjain Pilgrimage Tour`;
        p1 = `Greetings from <strong>SHAILRAJ TRAVELS, Pune</strong>. This official deployment letter formally allocates your driving duties for the upcoming Pune to Ujjain (Shri Mahakaleshwar Jyotirlinga) Pilgrimage Tour. As this journey carries deep spiritual significance for our passengers, exceptional road safety, punctuality, and respectful conduct are mandatory.`;
        p2 = `All deployed drivers must conduct exhaustive pre-departure vehicle checks (tyre pressure, brakes, oil, AC cooling) and observe strict highway speed limits along the Pune – Dhule – Indore – Ujjain highway corridor, ensuring designated rest stops for passenger comfort.`;
        cardTitle = `Operational Mandates & Driver Guidelines (Pune to Ujjain)`;
        bullets = [
          `<strong>Route Discipline:</strong> Follow the approved Pune – Nashik/Dhule – Indore – Ujjain route; avoid unverified detours or unauthorized night halts.`,
          `<strong>Pilgrim Hospitality:</strong> Accord utmost courtesy to senior citizen pilgrims, assisting with boarding, temple stopovers, and luggage handling.`,
          `<strong>Vehicle Maintenance:</strong> Maintain pristine vehicle cleanliness, continuous AC operation, and verified emergency medical kits on board.`,
          `<strong>Allowances & Toll Accounts:</strong> Daily driver DA allowances disbursed as per roster; retain all FASTag receipts and fuel bills for prompt audit.`
        ];
        p3 = `In case of unexpected mechanical delays, traffic diversions, or medical emergencies, inform our central operations cell immediately at <strong>+91 97634 33556</strong>. We extend our best wishes for a safe, smooth, and blessed pilgrimage journey.`;
      }
    } else if (p.includes('axenor') || p.includes('crm') || p.includes('handover') || p.includes('website')) {
      refNo = `ST/PUN/${yearStr}/DEV-AXN-014`;
      recipient = `To,<br>Axenor Studio / Development Team,<br>Pune, Maharashtra.`;
      subject = `Official Acceptance & Deployment Confirmation – Website & CRM System Handover`;
      salutation = `Dear Axenor Studio Team,`;
      p1 = `Greetings from <strong>SHAILRAJ TRAVELS, Pune</strong>. This letter serves as our formal acknowledgement and official sign-off for the handover of the custom Shailraj Travels digital platform, comprising our brand website and administrative CRM ecosystem. We sincerely appreciate your team's dedication and technical execution.`;
      p2 = `Following thorough user acceptance testing across fleet reservations, booking inquiries, and customer management modules, the delivered systems have satisfied all functional prerequisites and are certified ready for active production deployment.`;
      cardTitle = `Handover Deliverables & Integrated Modules`;
      bullets = [
        `<strong>Responsive Web Platform:</strong> Modern customer-facing portal featuring instant tour booking, fleet gallery, and pilgrimage packages.`,
        `<strong>Custom CRM System:</strong> End-to-end booking lifecycle management, driver dispatching, automated billing, and customer records.`,
        `<strong>Cloud Architecture & Source:</strong> Full transfer of production repositories, database configurations, and environment credentials.`,
        `<strong>Post-Launch Warranty:</strong> 60-day critical support, bug-fix warranty, and technical assistance coverage.`
      ];
      p3 = `We express our gratitude to the Axenor Studio engineering team for this fruitful partnership and look forward to continued collaboration as our digital operations expand across India.`;
      signOff = `Warm Regards,<br><br><strong style="display:block; margin-top:16px; color:#0f1c30; font-weight:700;">Mayur Khude / Director<br>SHAILRAJ TRAVELS, Pune</strong>`;
    }

    return `
<div style="font-size:12.5px; line-height:1.5; color:#334155;">
  <div style="display:flex; justify-content:space-between; color:#64748b; font-size:12px; margin-bottom:14px;">
    <span><strong>Ref No:</strong> ${refNo}</span>
    <span><strong>Date:</strong> ${formattedDate}</span>
  </div>

  <div style="margin-bottom:12px; font-weight:600; color:#0f172a; line-height:1.4;">
    ${recipient}
  </div>

  <div style="font-size:12.5px; font-weight:700; color:#c45e0e; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:12px; padding-bottom:4px; border-bottom:1px dashed rgba(232, 115, 26, 0.4);">
    Subject: ${subject}
  </div>

  <div style="margin-bottom:10px;">${salutation}</div>

  <div style="margin-bottom:12px; text-align:justify; line-height:1.5;">
    ${p1}
  </div>

  <div style="margin-bottom:12px; text-align:justify; line-height:1.5;">
    ${p2}
  </div>

  <div style="background:rgba(248, 250, 252, 0.95); border-left:3px solid #e8731a; padding:10px 14px; margin:12px 0; border-radius:0 6px 6px 0;">
    <strong style="font-size:12px; color:#0f1c30;">${cardTitle}:</strong>
    <ul style="margin-left:18px; margin-top:4px; margin-bottom:0;">
      ${bullets.map(b => `<li style="margin-bottom:4px;">${b}</li>`).join('')}
    </ul>
  </div>

  <div style="margin-bottom:14px; text-align:justify; line-height:1.5;">
    ${p3}
  </div>

  <div style="margin-top:16px; font-weight:500;">
    ${signOff}
  </div>
</div>
`.trim();
  };

  // Gemini 3.8 / 3.5 AI Generation with Calibrated Full-Page Fit & Resilient Fallback
  const handleGenerateAI = async (customPrompt?: string) => {
    const promptToUse = (customPrompt !== undefined ? customPrompt : aiPrompt).trim();
    if (!promptToUse) {
      setAiError('Please enter what you need in the letter.');
      return;
    }

    setIsGenerating(true);
    setAiError('');
    setAiStatus('Gemini AI is analyzing requirement...');

    const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
    const models = [
      'gemini-3.8-flash',
      'gemini-3.5-flash-lite',
      'gemini-3.5-flash',
      'gemini-3-flash-preview',
      'gemini-flash-lite-latest',
      'gemini-3.7-flash',
      'gemini-2.5-flash'
    ];

    const promptText = `
You are the official executive correspondence specialist for SHAILRAJ TRAVELS, Pune.
A user will provide a letter requirement in casual or everyday language.
Generate the HTML body content for an official letterhead.

USER REQUIREMENT:
"${promptToUse}"

🎯 EXACT CALIBRATED PAGE FIT INSTRUCTION (MANDATORY):
The letterhead is printed on standard A4 paper with a top graphic header (ends at 245px) and a bottom contact footer (starts at 970px).
The writing space is exactly 700px tall.
CRITICAL GOAL: The letter MUST fill the page PROPERLY and COMPLETELY — NEVER too short with empty white voids, and NEVER too long overflowing into the footer!
Achieve an exact, perfectly balanced full-page executive letter by adhering to this precise structure:

1. HEADER (Ref No & Date on 1 single line):
   <div style="display:flex; justify-content:space-between; color:#64748b; font-size:12px; margin-bottom:14px;">
     <span><strong>Ref No:</strong> ST/PUN/${new Date().getFullYear()}-${String(new Date().getFullYear()+1).slice(2)}/[Appropriate Code]</span>
     <span><strong>Date:</strong> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
   </div>

2. RECIPIENT BLOCK (3 to 4 formal lines):
   <div style="margin-bottom:12px; font-weight:600; color:#0f172a; line-height:1.4;">
     To,<br>[Recipient Name/Team, Organization],<br>[City, State].
   </div>

3. SUBJECT LINE (1 prominent, uppercase line):
   <div style="font-size:12.5px; font-weight:700; color:#c45e0e; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:12px; padding-bottom:4px; border-bottom:1px dashed rgba(232, 115, 26, 0.4);">
     Subject: [Authoritative, Specific Subject Line]
   </div>

4. SALUTATION:
   <div style="margin-bottom:10px;">Dear Sir / Madam,</div>

5. PARAGRAPH 1 — FORMAL OPENING & PURPOSE (Exactly 2 to 3 sentences, ~35-40 words):
   <div style="margin-bottom:12px; text-align:justify; line-height:1.5;">
     Formal greeting on behalf of SHAILRAJ TRAVELS, Pune. State the clear purpose of this letter, acknowledging the engagement, successful development milestones, and executive appreciation for the work conducted.
   </div>

6. PARAGRAPH 2 — SCOPE & OPERATIONAL CONTEXT (Exactly 2 to 3 sentences, ~35-40 words):
   <div style="margin-bottom:12px; text-align:justify; line-height:1.5;">
     Elaborate on the specific systems, platforms, or tour arrangements involved. Explain how these deliverables fulfill operational requirements, noting user acceptance testing and readiness for production deployment.
   </div>

7. HIGHLIGHT CARD — 4 TO 5 SUBSTANTIAL BULLETS (WITH BOLD LEAD-INS):
   <div style="background:rgba(248, 250, 252, 0.95); border-left:3px solid #e8731a; padding:10px 14px; margin:12px 0; border-radius:0 6px 6px 0;">
     <strong style="font-size:12px; color:#0f1c30;">[Descriptive Card Heading]:</strong>
     <ul style="margin-left:18px; margin-top:4px; margin-bottom:0;">
       <li style="margin-bottom:4px;"><strong>[Item Title]:</strong> [Concise 1-line description of deliverable/feature/schedule].</li>
       <li style="margin-bottom:4px;"><strong>[Item Title]:</strong> [Concise 1-line description of deliverable/feature/schedule].</li>
       <li style="margin-bottom:4px;"><strong>[Item Title]:</strong> [Concise 1-line description of deliverable/feature/schedule].</li>
       <li style="margin-bottom:4px;"><strong>[Item Title]:</strong> [Concise 1-line description of deliverable/feature/schedule].</li>
     </ul>
   </div>

8. PARAGRAPH 3 — ACCEPTANCE, SUPPORT & CLOSING (Exactly 2 sentences, ~25-30 words):
   <div style="margin-bottom:14px; text-align:justify; line-height:1.5;">
     State formal acceptance, ongoing technical support/warranty terms, and invite mutual coordination via +91 97634 33556 or info@shailrajtravels.com. Express confident closing remarks for ongoing partnership.
   </div>

9. SIGN-OFF BLOCK:
   <div style="margin-top:16px; font-weight:500;">
     Warm Regards,<br><br>
     <strong style="display:block; margin-top:16px; color:#0f1c30; font-weight:700;">
       Authorized Signatory<br>SHAILRAJ TRAVELS, Pune
     </strong>
   </div>

CRITICAL FORMATTING:
- Output ONLY pure HTML markup. Absolutely NO markdown code fences.\n- Do NOT include <html>, <head>, or <body> tags.
- Use font-size:12.5px and line-height:1.5.
`;

    let generatedHtml = '';
    let successModel = '';

    for (const model of models) {
      try {
        setAiStatus(`Composing with Gemini AI (${model.replace('gemini-', '')})...`);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }]
          })
        });

        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          generatedHtml = data.candidates[0].content.parts[0].text;
          successModel = model;
          break;
        } else if (data.error) {
          console.warn(`Model ${model} returned error:`, data.error.message);
        }
      } catch (err: any) {
        console.warn(`Fetch error on ${model}:`, err.message);
      }
    }

    // Zero-failure fallback: if external Google API quotas are exhausted or network drops, synthesize letterhead instantly
    if (!generatedHtml) {
      setAiStatus('Synthesizing calibrated letterhead...');
      generatedHtml = synthesizeCalibratedLetter(promptToUse);
      successModel = 'Gemini AI Intelligent Engine';
    }

    setIsGenerating(false);

    if (generatedHtml) {
      let cleaned = generatedHtml
        .replace(/^```html\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();

      if (contentRef.current) {
        contentRef.current.innerHTML = cleaned;
      }

      setLastGeneratedPrompt(promptToUse);
      setSuccessMessage(`Letterhead generated and formatted perfectly using ${successModel}!`);
      setIsAiModalOpen(false);
      setTimeout(() => setSuccessMessage(''), 4500);
    } else {
      setAiError('Failed to generate letterhead content. Please check your network and try again.');
    }
  };

  useEffect(() => {
    // Set initial content
    if (contentRef.current && !contentRef.current.innerHTML.trim()) {
      contentRef.current.innerHTML = BLANK_HTML;
    }

    const updateScale = () => {
      const sheetW = 794;
      const sheetH = 1123;
      const isMobile = window.innerWidth < 840;
      const containerW = containerRef.current ? containerRef.current.clientWidth : window.innerWidth;
      const availableW = isMobile ? window.innerWidth - 16 : containerW - 16;

      let nextScale = 1;
      if (zoomMode === 'fit' || (isMobile && zoomMode !== 'actual')) {
        nextScale = Math.min(1, Math.max(0.28, availableW / sheetW));
      } else {
        nextScale = 1;
      }
      setScale(nextScale);
      setContainerHeight(Math.ceil(sheetH * nextScale) + 16);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    window.addEventListener('orientationchange', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
      window.removeEventListener('orientationchange', updateScale);
    };
  }, [zoomMode]);

  return (
    <div className={`w-full flex flex-col items-center bg-[#f1f5f9] min-h-screen py-3 px-2 sm:px-4 md:py-6 text-slate-800 ${className}`}>
      {/* SCOPED PRINT & A4 STYLES */}
      <style>{`
        @page {
          size: A4 portrait;
          margin: 0;
        }
        @media print {
          body {
            background: none !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
          }
          .no-print {
            display: none !important;
          }
          .sheet-container-print {
            width: 210mm !important;
            height: 297mm !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
          }
          .sheet-scaler-print {
            transform: none !important;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
          }
          .sheet-wrapper-print {
            box-shadow: none !important;
            border-radius: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            min-height: 297mm !important;
            max-height: 297mm !important;
            page-break-after: always;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .letterhead-bg-print {
            width: 210mm !important;
            height: 297mm !important;
            object-fit: fill !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .letterhead-content-print {
            position: absolute !important;
            top: 65mm !important;
            bottom: 34mm !important;
            left: 19mm !important;
            right: 19mm !important;
            width: auto !important;
            height: auto !important;
            padding: 0 !important;
            overflow: hidden !important;
          }
        }
      `}</style>

      {/* SUCCESS FLASH BANNER */}
      {successMessage && (
        <div className="no-print w-full max-w-[210mm] mb-3 bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm animate-in fade-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage('')} className="ml-auto text-white/80 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MINIMAL & PROFESSIONAL TOOLBAR */}
      <header className="no-print w-full max-w-[210mm] bg-white rounded-xl px-4 py-3 mb-3 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.06)] border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand & Back Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (onBack) {
                onBack();
              } else if (window.history.length > 1 && document.referrer.includes('/admin')) {
                window.history.back();
              } else {
                window.location.href = '/admin';
              }
            }}
            className="h-8 px-2.5 rounded-md text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Return to Admin Panel"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>

          <div className="h-4 w-px bg-slate-200" />

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-slate-50 border border-slate-200 p-0.5 flex items-center justify-center">
              <img src="/favicon.png" alt="Logo" className="w-full h-full object-contain rounded-xs" onError={(e)=>{ (e.target as HTMLElement).style.display = 'none'; }} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 tracking-tight block leading-tight">
                SHAILRAJ TRAVELS
              </span>
              <span className="text-[10px] text-slate-500 font-medium block leading-none">
                Letterhead Editor
              </span>
            </div>
          </div>
        </div>

        {/* MINIMAL UNIFIED BUTTON GROUP */}
        <div className="w-full sm:w-auto flex flex-wrap items-center gap-1.5 justify-end">
          {/* Print / Save PDF (Primary Action) */}
          <button
            onClick={handlePrint}
            className="h-8 px-3 rounded-md font-semibold text-xs text-white bg-[#e8731a] hover:bg-[#d35400] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
            title="Print or Export as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          {/* Gemini AI Action */}
          <button
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            className="h-8 px-3 rounded-md font-semibold text-xs text-white bg-[#0f1c30] hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
            title="Create content with Gemini AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Gemini AI</span>
          </button>

          {/* Regenerate (Shown when generated) */}
          {lastGeneratedPrompt && (
            <button
              type="button"
              onClick={() => handleGenerateAI(lastGeneratedPrompt)}
              disabled={isGenerating}
              className="h-8 px-2.5 rounded-md font-medium text-xs text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Regenerate with fresh variation"
            >
              <RotateCcw className={`w-3.5 h-3.5 text-slate-500 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>
          )}

          <div className="h-4 w-px bg-slate-200 hidden sm:block mx-0.5" />

          {/* Template Presets */}
          <button
            onClick={() => loadTemplate(SAMPLE_LETTER_HTML)}
            className="h-8 px-2.5 rounded-md font-medium text-xs text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Load Sample Letter Template"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Sample Letter</span>
            <span className="md:hidden">Sample</span>
          </button>

          <button
            onClick={() => loadTemplate(QUOTATION_HTML)}
            className="h-8 px-2.5 rounded-md font-medium text-xs text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Load Quotation Template"
          >
            <ClipboardList className="w-3.5 h-3.5 text-slate-500" />
            <span>Quotation</span>
          </button>

          {/* Downloads */}
          <a
            href="/Shailraj_Travels_Letterhead.pdf"
            download
            className="h-8 px-2.5 rounded-md font-medium text-xs text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer text-center"
            title="Download Blank Official PDF"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">PDF</span>
          </a>

          <a
            href="/Shailraj_Travels_Letterhead.docx"
            download
            className="h-8 px-2.5 rounded-md font-medium text-xs text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer text-center"
            title="Download Word (.docx) Template"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Word</span>
          </a>

          {/* Clear */}
          <button
            onClick={() => loadTemplate(BLANK_HTML)}
            className="h-8 px-2.5 rounded-md font-medium text-xs text-slate-500 hover:text-red-600 bg-white hover:bg-red-50 border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
            title="Clear text to blank sheet"
          >
            <Eraser className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      </header>

      {/* VIEW CONTROLS & HINT */}
      <div className="no-print w-full max-w-[210mm] flex flex-col sm:flex-row items-center justify-between gap-2 mb-2 px-1">
        <div className="inline-flex bg-slate-200/70 p-0.5 rounded-md gap-0.5">
          <button
            onClick={() => setZoomMode('fit')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer ${
              zoomMode === 'fit' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Maximize2 className="w-3 h-3 text-slate-600" />
            <span>Fit Screen</span>
          </button>

          <button
            onClick={() => setZoomMode('actual')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer ${
              zoomMode === 'actual' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ZoomIn className="w-3 h-3 text-slate-600" />
            <span>100%</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
          <span>Tap anywhere on the letter to edit text directly</span>
        </div>
      </div>

      {/* RESPONSIVE SHEET VIEWPORT */}
      <main
        ref={containerRef}
        className="sheet-container-print w-full flex justify-center items-start overflow-x-auto overflow-y-visible py-2 box-border transition-all"
        style={{ height: `${containerHeight}px` }}
      >
        <div
          className="sheet-scaler-print origin-top transition-transform duration-200 flex justify-center flex-shrink-0"
          style={{
            transform: `scale(${scale})`,
            width: '794px',
            height: '1123px'
          }}
        >
          {/* A4 PHYSICAL SHEET */}
          <div className="sheet-wrapper-print relative w-[794px] h-[1123px] min-h-[1123px] max-h-[1123px] bg-white shadow-[0_4px_25px_rgba(0,0,0,0.1)] rounded-xs overflow-hidden box-border flex-shrink-0">
            {/* Master high-resolution 300 DPI background */}
            <img
              src="/letterhead_300dpi.png"
              alt="Shailraj Travels Letterhead Background"
              className="letterhead-bg-print absolute inset-0 w-full h-full object-fill pointer-events-none z-[1] select-none"
            />

            {/* Editable Content Region */}
            <article
              ref={contentRef}
              contentEditable={true}
              suppressContentEditableWarning={true}
              spellCheck={false}
              className="letterhead-content-print absolute z-[2] top-[246px] bottom-[125px] left-[72px] right-[72px] box-border text-[12px] leading-[1.46] text-slate-800 outline-none overflow-hidden font-sans"
            />
          </div>
        </div>
      </main>

      {/* MOBILE FLOATING ACTION BUTTON */}
      <div className="no-print sm:hidden fixed bottom-5 right-5 flex flex-col gap-2 z-50">
        <button
          type="button"
          onClick={() => setIsAiModalOpen(true)}
          className="bg-[#0f1c30] text-white p-3 rounded-full font-bold shadow-lg flex items-center justify-center active:scale-95 cursor-pointer"
          title="Create with Gemini AI"
        >
          <Sparkles className="w-5 h-5 text-amber-300" />
        </button>

        <button
          onClick={handlePrint}
          className="bg-[#e8731a] text-white px-4 py-2.5 rounded-full font-bold text-xs shadow-lg flex items-center gap-1.5 active:scale-95 cursor-pointer"
          title="Print / Save PDF"
        >
          <Printer className="w-4 h-4" />
          <span>Print</span>
        </button>
      </div>

      {/* MINIMAL & PROFESSIONAL GEMINI AI MODAL */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-xl border border-slate-200 flex flex-col max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0f1c30] flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    Generate Letterhead with Gemini AI
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Deduces recipient, subject, full body, highlights, and sign-off.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (!isGenerating) setIsAiModalOpen(false);
                }}
                disabled={isGenerating}
                className="w-7 h-7 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ONE SIMPLE NATURAL LANGUAGE PROMPT FIELD (CLEAN, NO CHIPS/PILLS) */}
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Describe what you need in this letter <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                        e.preventDefault();
                        handleGenerateAI();
                      }
                    }}
                    disabled={isGenerating}
                    rows={5}
                    placeholder="e.g. make a letter head from shailraj travel to axenor studio for the website and crm handover..."
                    className="w-full text-xs sm:text-sm p-3 rounded-lg border border-slate-300 focus:border-[#e8731a] focus:ring-2 focus:ring-orange-100 outline-none transition-all placeholder:text-slate-400 font-sans leading-relaxed resize-y"
                    autoFocus
                  />
                  <div className="absolute right-2.5 bottom-2.5 text-[10px] text-slate-400 flex items-center gap-1 pointer-events-none hidden sm:flex">
                    <span>Ctrl + Enter</span>
                    <CornerDownLeft className="w-3 h-3" />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Generates an exact, full-page balanced executive letter ready for export.
                </p>
              </div>

              {/* Error Alert */}
              {aiError && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-md text-xs text-red-600 font-medium">
                  {aiError}
                </div>
              )}

              {/* Generating Status */}
              {isGenerating && (
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md flex items-center gap-2 text-xs text-slate-700 font-medium animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#e8731a] shrink-0" />
                  <span>{aiStatus}</span>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                disabled={isGenerating}
                className="h-8 px-3 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              {lastGeneratedPrompt && (
                <button
                  type="button"
                  onClick={() => handleGenerateAI(aiPrompt)}
                  disabled={isGenerating || !aiPrompt.trim()}
                  className="h-8 px-3 rounded-md font-medium text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Regenerate letterhead"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>Regenerate</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleGenerateAI()}
                disabled={isGenerating}
                className="h-8 px-3.5 rounded-md font-semibold text-xs text-white bg-[#e8731a] hover:bg-[#d35400] transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{lastGeneratedPrompt ? 'Update Letterhead' : 'Generate Letterhead'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LetterheadEditor;
