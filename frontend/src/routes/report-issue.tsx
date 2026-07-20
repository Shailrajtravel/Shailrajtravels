import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { generateSEO } from '@/backend/features/seo';

export const Route = createFileRoute("/report-issue")({
  head: () => ({
    meta: generateSEO({
      title: "Report an Issue | Shailraj Travels",
      description:
        "Report an issue or bug you experienced with Shailraj Travels. We appreciate your feedback.",
      canonicalUrl: "https://www.shailrajtravels.com/report-issue",
    }),
    links: [{ rel: "canonical", href: "https://www.shailrajtravels.com/report-issue" }],
  }),
  component: ReportIssuePage,
});

function ReportIssuePage() {
  return (
    <main className="w-full bg-white pb-16 pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-extrabold text-brand-blue-deep mb-8">
        Report an Issue
      </h1>
      <div className="prose max-w-none text-gray-700 space-y-6">
        <p>
          <strong>Last Updated: 27 June 2026</strong>
        </p>

        <p>
          At Shailraj Travels, we strive to provide a seamless experience for our customers, both online and during our tours. If you have encountered any issues, bugs on our website, or problems during your trip, we want to hear about it so we can make it right.
        </p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How to Report an Issue</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. Website or App Issues</h3>
        <p>If you face any technical difficulties while browsing our website or making a booking, please include the following details in your report:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>A clear description of the issue.</li>
          <li>The steps to reproduce the problem.</li>
          <li>Screenshots or error messages, if applicable.</li>
          <li>Your device and browser information.</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. Service or Tour Issues</h3>
        <p>If you experienced an issue during one of our tours, please provide:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Your Booking ID and Tour Name.</li>
          <li>Date of the incident.</li>
          <li>A detailed account of what happened.</li>
          <li>Any supporting evidence or photos.</li>
        </ul>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Information</h2>
        <p>
          Please send your detailed report to our support team:<br />
          <strong>Email:</strong> shailrajtravels9999@gmail.com<br />
          <strong>Phone:</strong> +91 97634 33556
        </p>
        <p>
          Our team reviews all reports carefully and will get back to you within 24-48 business hours. Thank you for helping us improve our services.
        </p>
      </div>
    </main>
  );
}
