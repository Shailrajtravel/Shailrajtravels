import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { generateSEO } from '@/backend/features/seo';

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: generateSEO({
      title: "Refund Policy | Shailraj Travels",
      description:
        "Refund Policy for Shailraj Travels. Understand our timeline and process for tour payment refunds.",
      canonicalUrl: "https://www.shailrajtravels.com/refund-policy",
    }),
    links: [{ rel: "canonical", href: "https://www.shailrajtravels.com/refund-policy" }],
  }),
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  return (
    <main className="w-full bg-white pb-16 pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-extrabold text-brand-blue-deep mb-8">
        Refund Policy
      </h1>
      <div className="prose max-w-none text-gray-700 space-y-6">
        <p>
          <strong>Last Updated: 27 June 2026</strong>
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. General</h2>
        <p>Refunds shall only be processed in accordance with this Refund Policy and the Cancellation Policy.</p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Eligible Refunds</h2>
        <p>Refunds are available only for:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Eligible customer cancellations.</li>
          <li>Tour cancellations initiated by Shailraj Travels.</li>
        </ul>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Non-Refundable Items</h2>
        <p>The following are non-refundable unless otherwise stated:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Booking fees</li>
          <li>Convenience fees</li>
          <li>Payment gateway charges</li>
          <li>GST already deposited where applicable</li>
          <li>Visa fees (if any)</li>
          <li>Insurance charges</li>
          <li>VIP Darshan charges</li>
          <li>Hotel upgrade charges</li>
        </ul>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Processing Time</h2>
        <p>Approved refunds shall be processed within 7–10 business days after approval.</p>
        <p>Processing time may vary depending on banks or payment providers.</p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Mode of Refund</h2>
        <p>Refunds shall be credited only to the original payment method.</p>
        <p>Cash refunds will not be issued for online payments.</p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Cancellation by Shailraj Travels</h2>
        <p>If Shailraj Travels cancels a tour due to operational reasons, passengers may choose either:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Full refund of the amount paid, or</li>
          <li>Credit toward another available tour.</li>
        </ul>
        <p>No compensation shall be payable for incidental expenses such as travel to pickup points, hotel bookings, or leave from work.</p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Contact</h2>
        <p>Email:<br />shailrajtravels9999@gmail.com</p>
      </div>
    </main>
  );
}
