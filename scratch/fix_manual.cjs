const fs = require('fs');

function replaceInFile(path, oldStr, newStr) {
  if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    if (content.includes(oldStr)) {
      content = content.replaceAll(oldStr, newStr);
      fs.writeFileSync(path, content, 'utf8');
      console.log(`Fixed ${path}`);
    }
  }
}

// Fix backend imports referencing itself as ../backend/lib
replaceInFile('src/backend/lib/reviews.ts', '../backend/lib/db', './db');

// Fix frontend components referencing ../frontend
replaceInFile('src/frontend/components/AnalyticsScripts.tsx', '../frontend/config/analytics', '../config/analytics');
replaceInFile('src/frontend/components/RelatedBlogs.tsx', '../frontend/types/tour', '../types/tour');
replaceInFile('src/frontend/components/RelatedTours.tsx', '../frontend/types/tour', '../types/tour');
replaceInFile('src/frontend/data/tours.ts', '../frontend/types/tour', '../types/tour');
replaceInFile('src/frontend/templates/TourPageTemplate.tsx', '../frontend/types/tour', '../types/tour');

// Fix frontend referencing backend incorrectly
replaceInFile('src/frontend/components/SEOBreadcrumbs.tsx', '../backend/lib/schema-generators', '../../backend/lib/schema-generators');
replaceInFile('src/frontend/components/SEOFAQAccordion.tsx', '../backend/lib/schema-generators', '../../backend/lib/schema-generators');
replaceInFile('src/frontend/data/tours.ts', '../backend/lib/schema-generators', '../../backend/lib/schema-generators');
replaceInFile('src/frontend/features/home/Hero.tsx', '../../backend/lib/bookings', '../../../backend/lib/bookings');
replaceInFile('src/frontend/features/reviews/ReviewsSection.tsx', '../../routes/index', '../../../routes/index');
replaceInFile('src/frontend/features/reviews/ReviewsSection.tsx', '../../backend/lib/reviews', '../../../backend/lib/reviews');
replaceInFile('src/frontend/features/tours/ToursSection.tsx', '../../frontend/data/tours', '../../data/tours');
replaceInFile('src/frontend/invioce/__root.tsx', '../backend/lib/lovable-error-reporting', '../../backend/lib/lovable-error-reporting');
replaceInFile('src/frontend/invioce/example.functions.ts', '../config.server', '../../config.server');

// Fix start.ts and server.ts in invoice
replaceInFile('src/frontend/invioce/server.ts', './lib/error-capture', '../../backend/lib/error-capture');
replaceInFile('src/frontend/invioce/server.ts', './lib/error-page', '../../backend/lib/error-page');
replaceInFile('src/frontend/invioce/start.ts', './lib/error-page', '../../backend/lib/error-page');
replaceInFile('src/start.ts', './lib/error-page', './backend/lib/error-page');

// Fix TourPageTemplate
replaceInFile('src/frontend/templates/TourPageTemplate.tsx', '../frontend/components/SEOFAQAccordion', '../components/SEOFAQAccordion');
replaceInFile('src/frontend/templates/TourPageTemplate.tsx', '../frontend/components/SEOBreadcrumbs', '../components/SEOBreadcrumbs');
replaceInFile('src/frontend/templates/TourPageTemplate.tsx', '../frontend/components/SchemaMarkup', '../components/SchemaMarkup');
replaceInFile('src/frontend/templates/TourPageTemplate.tsx', '../backend/lib/schema-generators', '../../backend/lib/schema-generators');
replaceInFile('src/frontend/templates/TourPageTemplate.tsx', '../frontend/components/RelatedTours', '../components/RelatedTours');
replaceInFile('src/frontend/templates/TourPageTemplate.tsx', '../frontend/components/RelatedBlogs', '../components/RelatedBlogs');
