import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { generateSEO } from '@/backend/features/seo';

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: generateSEO({
      title: "Terms & Conditions | Shailraj Travels",
      description:
        "Terms and Conditions for Shailraj Travels. Please read these terms carefully before booking your pilgrimage tour.",
      canonicalUrl: "https://www.shailrajtravels.com/terms",
    }),
    links: [{ rel: "canonical", href: "https://www.shailrajtravels.com/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <main className="w-full bg-white pb-16 pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-extrabold text-brand-blue-deep mb-8">
        Terms & Conditions
      </h1>
      <div className="prose max-w-none text-gray-700 space-y-6">
        <p>
          <strong>Last Updated: 27 June 2026</strong>
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance</h2>
        <p>By booking any tour with Shailraj Travels, you acknowledge that you have read, understood, and agreed to these Terms & Conditions.</p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Booking Confirmation</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Bookings are confirmed only after receipt of the required advance payment.</li>
          <li>Confirmation is subject to seat availability.</li>
          <li>Full payment must be completed before departure.</li>
          <li>Failure to complete payment may result in automatic cancellation without notice.</li>
        </ul>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Pricing</h2>
        <p>Tour prices include only the services specifically mentioned in the itinerary.</p>
        <p>Unless specifically stated, prices do not include:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Personal expenses</li>
          <li>Extra meals</li>
          <li>Shopping</li>
          <li>Entry fees</li>
          <li>VIP Darshan charges</li>
          <li>Medical expenses</li>
          <li>Insurance</li>
          <li>Additional transportation</li>
          <li>Porter charges</li>
          <li>Tips or gratuities</li>
        </ul>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Passenger Responsibilities</h2>
        <p>Passengers must:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Carry valid government-issued photo identification.</li>
          <li>Report on time at the designated pickup point.</li>
          <li>Follow instructions provided by the tour coordinator.</li>
          <li>Maintain respectful behaviour toward fellow passengers.</li>
          <li>Follow temple and local authority rules.</li>
        </ul>
        <p>Passengers under the influence of alcohol, drugs, or engaging in abusive behaviour may be removed from the tour without refund.</p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Health & Fitness</h2>
        <p>Passengers are responsible for ensuring they are medically fit to travel.</p>
        <p>Shailraj Travels is not responsible for any illness, injury, or medical emergency occurring during the tour.</p>
        <p>Medical expenses shall be borne solely by the passenger.</p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Tour Changes</h2>
        <p>Shailraj Travels reserves the right to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Change hotels</li>
          <li>Modify routes</li>
          <li>Change departure timings</li>
          <li>Replace vehicles</li>
          <li>Rearrange sightseeing</li>
          <li>Cancel or postpone tours</li>
        </ul>
        <p>due to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Weather</li>
          <li>Natural disasters</li>
          <li>Road closures</li>
          <li>Government orders</li>
          <li>Temple restrictions</li>
          <li>VIP movements</li>
          <li>Strikes</li>
          <li>Vehicle breakdown</li>
          <li>Law & Order situations</li>
          <li>Force Majeure events</li>
        </ul>
        <p>Such changes shall not entitle passengers to compensation unless otherwise stated.</p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Delays</h2>
        <p>Shailraj Travels shall not be liable for delays caused by:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Traffic</li>
          <li>Weather</li>
          <li>Mechanical failures</li>
          <li>Road conditions</li>
          <li>Government restrictions</li>
          <li>Temple management decisions</li>
        </ul>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Accommodation</h2>
        <p>Hotels are provided subject to availability.</p>
        <p>Equivalent accommodation may be substituted when necessary.</p>
        <p>Room allocation is governed by hotel policies.</p>
        <p>Early check-in and late check-out cannot be guaranteed.</p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Luggage</h2>
        <p>Passengers are solely responsible for their luggage and valuables.</p>
        <p>Shailraj Travels shall not be liable for:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Loss</li>
          <li>Theft</li>
          <li>Damage</li>
          <li>Misplacement</li>
        </ul>
        <p>of any personal belongings.</p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Photography</h2>
        <p>Passengers grant permission for photographs or videos taken during tours to be used for promotional purposes unless they notify us in writing before the tour.</p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Limitation of Liability</h2>
        <p>Our liability shall be limited only to the amount paid for the tour.</p>
        <p>We are not liable for:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Personal injury</li>
          <li>Death</li>
          <li>Theft</li>
          <li>Loss of belongings</li>
          <li>Missed connections</li>
          <li>Hotel issues</li>
          <li>Temple management decisions</li>
          <li>Acts of third parties</li>
        </ul>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Force Majeure</h2>
        <p>Shailraj Travels shall not be liable for cancellation, delay, interruption, or modification caused by events beyond our reasonable control including:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Floods</li>
          <li>Earthquakes</li>
          <li>Pandemics</li>
          <li>Epidemics</li>
          <li>Government Restrictions</li>
          <li>War</li>
          <li>Terrorism</li>
          <li>Civil Unrest</li>
          <li>Riots</li>
          <li>Strikes</li>
          <li>Road Blockages</li>
          <li>Weather Conditions</li>
        </ul>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. Governing Law</h2>
        <p>These Terms shall be governed by the laws of India.</p>
        <p>All disputes shall be subject to the exclusive jurisdiction of the competent courts located in Pune, Maharashtra.</p>
      </div>
    </main>
  );
}
