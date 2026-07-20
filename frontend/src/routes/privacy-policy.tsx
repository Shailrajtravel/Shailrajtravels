import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { generateSEO } from '@/backend/features/seo';

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: generateSEO({
      title: "Privacy Policy | Shailraj Travels",
      description:
        "Privacy Policy for Shailraj Travels. Learn how we collect, use, and protect your personal information.",
      canonicalUrl: "https://www.shailrajtravels.com/privacy-policy",
    }),
    links: [{ rel: "canonical", href: "https://www.shailrajtravels.com/privacy-policy" }],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <main className="w-full bg-white pb-16 pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-extrabold text-brand-blue-deep mb-8">
        Privacy Policy
      </h1>
      <div className="prose max-w-none text-gray-700 space-y-6">
        <p>
          <strong>Last Updated: 27 June 2026</strong>
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
        <p>
          Welcome to Shailraj Travels ("we", "our", "us"). We are committed to protecting your privacy and handling your personal information responsibly. This Privacy Policy explains how we collect, use, disclose, store, and protect your information when you visit our website, contact us, or book any of our tour packages.
        </p>
        <p>
          By using our website or services, you agree to the practices described in this Privacy Policy.
        </p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>
        <p>We may collect the following information:</p>
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Personal Information</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Full Name</li>
          <li>Mobile Number</li>
          <li>Email Address</li>
          <li>Residential Address</li>
          <li>Emergency Contact Details (if required)</li>
          <li>Government-issued ID details where required for travel or accommodation bookings</li>
        </ul>
        
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Booking Information</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Tour Package Selected</li>
          <li>Travel Dates</li>
          <li>Number of Passengers</li>
          <li>Pickup Location</li>
          <li>Special Requests</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Payment Information</h3>
        <p>
          Payments are processed securely through authorized third-party payment gateways.<br />
          Shailraj Travels does not store debit card, credit card, UPI PIN, CVV, or banking passwords.
        </p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Process tour bookings</li>
          <li>Confirm reservations</li>
          <li>Contact you regarding your booking</li>
          <li>Provide customer support</li>
          <li>Send itinerary updates</li>
          <li>Process refunds</li>
          <li>Comply with legal obligations</li>
          <li>Improve our services</li>
          <li>Prevent fraud and misuse</li>
        </ul>
        <p>We will not sell your personal information to third parties.</p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Information Sharing</h2>
        <p>Your information may be shared only when necessary with:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Hotels</li>
          <li>Transport Operators</li>
          <li>Temple Trusts (if required)</li>
          <li>Government Authorities</li>
          <li>Payment Service Providers</li>
          <li>Insurance Providers (if applicable)</li>
        </ul>
        <p>We only share information necessary for providing the booked services.</p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Cookies</h2>
        <p>Our website may use cookies to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Improve website performance</li>
          <li>Remember user preferences</li>
          <li>Analyze website traffic</li>
          <li>Enhance user experience</li>
        </ul>
        <p>You may disable cookies through your browser settings.</p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Data Security</h2>
        <p>We implement reasonable administrative, technical, and physical safeguards to protect your information.</p>
        <p>However, no internet transmission or electronic storage method is completely secure, and we cannot guarantee absolute security.</p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Data Retention</h2>
        <p>We retain booking records and personal information only for as long as necessary to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide services</li>
          <li>Meet legal requirements</li>
          <li>Resolve disputes</li>
          <li>Prevent fraud</li>
        </ul>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Your Rights</h2>
        <p>You may request to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Access your information</li>
          <li>Correct inaccurate information</li>
          <li>Delete information where legally permissible</li>
          <li>Withdraw consent where applicable</li>
        </ul>
        <p>Requests may be sent to:<br />Email: shailrajtravels9999@gmail.com</p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Third-Party Websites</h2>
        <p>Our website may contain links to third-party websites. We are not responsible for their privacy practices.</p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Policy Updates</h2>
        <p>We reserve the right to modify this Privacy Policy at any time. Updated versions become effective immediately upon publication on our website.</p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Contact</h2>
        <p>
          Shailraj Travels<br />
          Email: shailrajtravels9999@gmail.com<br />
          Phone: +91 97634 33556
        </p>
      </div>
    </main>
  );
}
