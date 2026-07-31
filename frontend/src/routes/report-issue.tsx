import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { generateSEO } from '@/backend/features/seo';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/frontend/shared/ui/alert";

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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'website',
    description: '',
    honeypot: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit issue');
      }

      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        type: 'website',
        description: '',
        honeypot: '',
      });
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full bg-slate-50 min-h-screen py-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-brand-blue-deep p-8 text-white">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Report an Issue</h1>
          <p className="text-brand-blue-light/80 text-lg">
            Experienced a bug or had an issue on a tour? Let us know so we can fix it.
          </p>
        </div>

        <div className="p-8">
          {isSuccess ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Issue Reported Successfully</h2>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Thank you for bringing this to our attention. Our team will look into this immediately.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="bg-brand-blue-deep text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-blue-deep/90 transition"
              >
                Report Another Issue
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-blue-deep focus:border-transparent outline-none transition"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-blue-deep focus:border-transparent outline-none transition"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-blue-deep focus:border-transparent outline-none transition"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-semibold text-slate-700 mb-2">
                    Type of Issue <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-blue-deep focus:border-transparent outline-none transition bg-white"
                  >
                    <option value="website">Website / App Bug</option>
                    <option value="tour">Tour / Service Issue</option>
                    <option value="booking">Booking / Payment Issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">
                  Issue Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-blue-deep focus:border-transparent outline-none transition resize-none"
                  placeholder="Please describe the issue in detail..."
                ></textarea>
              </div>

              {/* Honeypot field for spam prevention */}
              <div className="hidden">
                <label>Do not fill this out</label>
                <input type="text" name="honeypot" value={formData.honeypot} onChange={handleChange} tabIndex={-1} autoComplete="off" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-blue-deep hover:bg-brand-blue-deep/90 text-white font-bold py-4 rounded-xl transition flex justify-center items-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Issue'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
