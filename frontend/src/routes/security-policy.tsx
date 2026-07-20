import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { generateSEO } from '@/backend/features/seo';

export const Route = createFileRoute("/security-policy")({
  head: () => ({
    meta: generateSEO({
      title: "Security Policy | Shailraj Travels",
      description:
        "Security Policy for Shailraj Travels. Learn how we ensure the security of your data and transactions.",
      canonicalUrl: "https://www.shailrajtravels.com/security-policy",
    }),
    links: [{ rel: "canonical", href: "https://www.shailrajtravels.com/security-policy" }],
  }),
  component: SecurityPolicyPage,
});

function SecurityPolicyPage() {
  return (
    <main className="w-full bg-white pb-16 pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-extrabold text-brand-blue-deep mb-8">
        Security Policy
      </h1>
      <div className="prose max-w-none text-gray-700 space-y-6">
        <p>
          <strong>Last Updated: 27 June 2026</strong>
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Commitment to Security</h2>
        <p>
          At Shailraj Travels, the security of our customers' data and financial transactions is our top priority. We utilize industry-standard security measures to ensure that your interactions with our website are safe and secure.
        </p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Data Encryption</h2>
        <p>
          All sensitive information exchanged between your web browser and our website, including personal details and payment information, is encrypted using Secure Socket Layer (SSL) technology.
        </p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Payment Security</h2>
        <p>
          We do not store your credit card numbers, CVV, or banking passwords on our servers. All online transactions are processed securely through our authorized payment gateway partners, which are PCI-DSS compliant.
        </p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Protection Against Fraud</h2>
        <p>
          We employ robust monitoring systems to detect and prevent fraudulent activities. In the event of suspicious activity, we may temporarily suspend access or require additional verification to protect our users.
        </p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Contact</h2>
        <p>
          If you have any questions or concerns about our security practices, please contact our security team at:<br />
          Email: shailrajtravels9999@gmail.com
        </p>
      </div>
    </main>
  );
}
