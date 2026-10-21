import { createFileRoute } from '@tanstack/react-router';
import { LetterheadEditor } from '@/frontend/shared/components/LetterheadEditor';
import { generateSEO } from '@/backend/features/seo';

export const Route = createFileRoute("/letterhead")({
  head: () => ({
    meta: generateSEO({
      title: "Official Letterhead & Document Generator | Shailraj Travels",
      description:
        "Official Shailraj Travels Letterhead Editor and PDF generator. Create, customize, and export professional itineraries, quotations, and official letters.",
      canonicalUrl: "https://www.shailrajtravels.com/letterhead",
    }),
    links: [{ rel: "canonical", href: "https://www.shailrajtravels.com/letterhead" }],
  }),
  component: LetterheadPage,
});

function LetterheadPage() {
  return (
    <main className="w-full min-h-screen bg-[#eceef2]">
      <LetterheadEditor />
    </main>
  );
}
