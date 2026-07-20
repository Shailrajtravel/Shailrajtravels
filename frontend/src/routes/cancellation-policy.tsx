import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { generateSEO } from '@/backend/features/seo';

export const Route = createFileRoute("/cancellation-policy")({
  head: () => ({
    meta: generateSEO({
      title: "Cancellation Policy | Shailraj Travels",
      description:
        "Cancellation Policy for Shailraj Travels. Check our terms for cancelling your booked tour packages.",
      canonicalUrl: "https://www.shailrajtravels.com/cancellation-policy",
    }),
    links: [{ rel: "canonical", href: "https://www.shailrajtravels.com/cancellation-policy" }],
  }),
  component: CancellationPolicyPage,
});

function CancellationPolicyPage() {
  return (
    <main className="w-full bg-white pb-16 pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-extrabold text-brand-blue-deep mb-8">
        Cancellation Policy
      </h1>
      <div className="prose max-w-none text-gray-700 space-y-6">
        <p>
          <strong>Last Updated: 27 June 2026</strong>
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Customer Cancellation</h2>
        <p>Cancellation charges are calculated on the total tour price.</p>
        <div className="overflow-x-auto my-6">
          <table className="min-w-full divide-y divide-gray-200 border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cancellation Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">30+ days before departure</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">90% Refund</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">15–29 days</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">75% Refund</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">7–14 days</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">50% Refund</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Less than 7 days</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">No Refund</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">No Show</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">No Refund</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Tour Started</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">No Refund</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Cancellation Procedure</h2>
        <p>Cancellation requests are valid only if submitted:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>By email to shailrajtravels9999@gmail.com, or</li>
          <li>Through the official customer support number.</li>
        </ul>
        <p>Cancellation becomes effective only after written confirmation from Shailraj Travels.</p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Booking Transfers</h2>
        <p>Bookings are generally non-transferable.</p>
        <p>Transfer requests may be considered at our sole discretion and may attract administrative charges.</p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Medical Emergencies</h2>
        <p>Cancellation due to medical emergencies may be considered only upon submission of valid government-recognized medical documents.</p>
        <p>Approval remains solely at the discretion of Shailraj Travels.</p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. No Show</h2>
        <p>Passengers who fail to report at the designated pickup location and time shall be treated as No Show, and 100% cancellation charges shall apply.</p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Tour Abandonment</h2>
        <p>Passengers voluntarily leaving the tour after departure shall not be entitled to any refund for unused services.</p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Amendment Charges</h2>
        <p>Changes to booking dates, passenger names, or tour packages may attract amendment charges and are subject to availability.</p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Final Decision</h2>
        <p>All refund and cancellation decisions made by Shailraj Travels shall be final, subject to applicable consumer protection laws.</p>
      </div>
    </main>
  );
}
