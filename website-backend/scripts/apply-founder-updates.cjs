const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const frontendDir = path.join(__dirname, '..', '..', 'frontend');

// 1. Update business.ts
const businessPath = path.join(frontendDir, 'src', 'frontend', 'shared', 'config', 'business.ts');
let businessContent = `export const businessConfig = {
  establishedYear: 2021,
  totalToursConducted: 850,
  happyTravelers: 5000,
  citiesServed: 15,
  pilgrimageDestinations: 25,
  fleetSize: 45,
  founderName: "Mayur Patil",
  coFounderName: "Shaila Mayur Patil",
  supportPhone: "+91 97644 13556",
  supportEmail: "info@shailrajtravels.com",
  headOffice: "Gopal Patti, Manjri Budruk, Hadapsar, Pune, Maharashtra 412307",
  // Centralized review stats corresponding to real Google Maps verified reviews
  reviewRating: "5.0",
  reviewCount: "12",
};
`;
fs.writeFileSync(businessPath, businessContent, 'utf8');
console.log('✓ Updated business.ts with Founder Mayur Patil, Co-Founder Shaila Mayur Patil, Founded 2021');

// 2. Update authors.ts
const authorsPath = path.join(frontendDir, 'src', 'frontend', 'shared', 'data', 'authors.ts');
let authorsContent = `import { Author } from "../types/author";

export const authors: Record<string, Author> = {
  "mayur-patil": {
    id: "mayur-patil",
    name: "Mayur Patil",
    role: "Founder & Chief Pilgrimage Guide",
    yearsOfExperience: 5,
    bio: "Mayur Patil is the Founder of Shailraj Travels, established in 2021. With deep devotion and on-ground operational expertise, he pioneered premier spiritual tours from Pune including the Ujjain Mahakaleshwar & Omkareshwar Tour, Ashtavinayak Darshan, and Maharashtra Jyotirlinga circuits using luxury AC Force Urbania coaches. He personally oversees route safety, temple darshan arrangements, and yatri comfort.",
    avatarUrl: "/images/authors/mayur-patil.jpg",
    expertiseAreas: [
      "Ujjain & Omkareshwar Pilgrimage Tours",
      "Ashtavinayak Yatra",
      "Pan-India Jyotirlinga Circuits",
      "Luxury Fleet & Force Urbania Travel",
      "Senior Citizen Pilgrimage Planning",
    ],
    regionsCovered: ["Maharashtra", "Madhya Pradesh", "Gujarat", "Andhra Pradesh", "Uttarakhand"],
    languages: ["Marathi", "Hindi", "English"],
    contactProfileUrl: "/about-shailraj-travels",
    socialLinks: {
      instagram: "https://www.instagram.com/wings_of_mayur_9999/",
    },
  },
  "shaila-mayur-patil": {
    id: "shaila-mayur-patil",
    name: "Shaila Mayur Patil",
    role: "Co-Founder & Yatri Hospitality Director",
    yearsOfExperience: 5,
    bio: "Shaila Mayur Patil is the Co-Founder of Shailraj Travels. Guiding the yatri care and hospitality vision since 2021, she ensures all pilgrimage packages feature hygienic 3-star AC accommodations, authentic pure vegetarian sattvic meals, and personalized care for elderly pilgrims and family groups.",
    avatarUrl: "/images/authors/shaila-mayur-patil.jpg",
    expertiseAreas: [
      "Pilgrim Care & Hospitality",
      "Pure Vegetarian Dining Coordination",
      "Family Pilgrimage Planning",
      "Senior Citizen Assistance",
    ],
    regionsCovered: ["Maharashtra", "Madhya Pradesh", "Gujarat"],
    languages: ["Marathi", "Hindi"],
    contactProfileUrl: "/about-shailraj-travels",
  },
  // Legacy aliases for backward compatibility with existing links
  "shailesh-raj": {
    id: "mayur-patil",
    name: "Mayur Patil",
    role: "Founder & Chief Pilgrimage Guide",
    yearsOfExperience: 5,
    bio: "Mayur Patil is the Founder of Shailraj Travels, established in 2021. With deep devotion and on-ground operational expertise, he pioneered premier spiritual tours from Pune including the Ujjain Mahakaleshwar & Omkareshwar Tour, Ashtavinayak Darshan, and Maharashtra Jyotirlinga circuits using luxury AC Force Urbania coaches.",
    avatarUrl: "/images/authors/mayur-patil.jpg",
    expertiseAreas: [
      "Ujjain & Omkareshwar Pilgrimage Tours",
      "Ashtavinayak Yatra",
      "Pan-India Jyotirlinga Circuits",
      "Luxury Fleet & Force Urbania Travel",
    ],
    regionsCovered: ["Maharashtra", "Madhya Pradesh", "Gujarat"],
    languages: ["Marathi", "Hindi", "English"],
    contactProfileUrl: "/about-shailraj-travels",
    socialLinks: {
      instagram: "https://www.instagram.com/wings_of_mayur_9999/",
    },
  },
  "priya-deshmukh": {
    id: "shaila-mayur-patil",
    name: "Shaila Mayur Patil",
    role: "Co-Founder & Yatri Hospitality Director",
    yearsOfExperience: 5,
    bio: "Shaila Mayur Patil is the Co-Founder of Shailraj Travels. Guiding the yatri care and hospitality vision since 2021, she ensures all pilgrimage packages feature hygienic 3-star AC accommodations and personalized yatri care.",
    avatarUrl: "/images/authors/shaila-mayur-patil.jpg",
    expertiseAreas: ["Pilgrim Care", "Hospitality", "Family Travel"],
    regionsCovered: ["Maharashtra", "Madhya Pradesh"],
    languages: ["Marathi", "Hindi"],
    contactProfileUrl: "/about-shailraj-travels",
  },
};
`;
fs.writeFileSync(authorsPath, authorsContent, 'utf8');
console.log('✓ Updated authors.ts with Mayur Patil & Shaila Mayur Patil');

// 3. Update blogs.ts authorId / reviewerId
const blogsPath = path.join(frontendDir, 'src', 'frontend', 'shared', 'data', 'blogs.ts');
let blogsContent = fs.readFileSync(blogsPath, 'utf8');
blogsContent = blogsContent.replace(/authorId: "shailesh-raj"/g, 'authorId: "mayur-patil"');
blogsContent = blogsContent.replace(/reviewerId: "priya-deshmukh"/g, 'reviewerId: "shaila-mayur-patil"');
fs.writeFileSync(blogsPath, blogsContent, 'utf8');
console.log('✓ Updated blogs.ts to reference mayur-patil and shaila-mayur-patil');

// 4. Update about-shailraj-travels.tsx
const aboutPath = path.join(frontendDir, 'src', 'routes', 'about-shailraj-travels.tsx');
let aboutContent = fs.readFileSync(aboutPath, 'utf8');

// Update header summary list
const oldList = `<ul className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <li>
              <strong className="text-brand-blue-deep">Established:</strong>{" "}
              {businessConfig.establishedYear}
            </li>
            <li>
              <strong className="text-brand-blue-deep">Total Tours:</strong>{" "}
              {businessConfig.totalToursConducted}+
            </li>
            <li>
              <strong className="text-brand-blue-deep">Happy Yatris:</strong>{" "}
              {businessConfig.happyTravelers}+
            </li>
            <li>
              <strong className="text-brand-blue-deep">Founder:</strong>{" "}
              {businessConfig.founderName}
            </li>
          </ul>`;

const newList = `<ul className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-sm">
            <li>
              <strong className="text-brand-blue-deep">Founded:</strong>{" "}
              {businessConfig.establishedYear}
            </li>
            <li>
              <strong className="text-brand-blue-deep">Total Tours:</strong>{" "}
              {businessConfig.totalToursConducted}+
            </li>
            <li>
              <strong className="text-brand-blue-deep">Happy Yatris:</strong>{" "}
              {businessConfig.happyTravelers}+
            </li>
            <li>
              <strong className="text-brand-blue-deep">Founder:</strong>{" "}
              {businessConfig.founderName}
            </li>
            <li>
              <strong className="text-brand-blue-deep">Co-Founder:</strong>{" "}
              {businessConfig.coFounderName}
            </li>
          </ul>`;

if (aboutContent.includes(oldList)) {
  aboutContent = aboutContent.replace(oldList, newList);
} else {
  aboutContent = aboutContent.replace(
    /<li>\s*<strong className="text-brand-blue-deep">Founder:<\/strong>[\s\S]*?<\/li>/,
    `<li>\n              <strong className="text-brand-blue-deep">Founder:</strong>{" "}\n              {businessConfig.founderName}\n            </li>\n            <li>\n              <strong className="text-brand-blue-deep">Co-Founder:</strong>{" "}\n              {businessConfig.coFounderName}\n            </li>`
  );
}

// Update story
aboutContent = aboutContent.replace(
  'Founded in {businessConfig.establishedYear} by {businessConfig.founderName}, Shailraj',
  'Founded in {businessConfig.establishedYear} by {businessConfig.founderName} and Co-Founder {businessConfig.coFounderName}, Shailraj'
);

// Update Pilgrimage Expertise to include Ujjain Darshan Tour
const oldExpertise = `<ul>
              <li>
                <strong>Ashtavinayak Yatra:</strong> Masterfully routed 2-day itineraries covering
                all 8 Ganesha temples.
              </li>`;

const newExpertise = `<ul>
              <li>
                <strong>Ujjain Darshan Tour:</strong> Sacred Mahakaleshwar Bhasma Aarti, Kaal Bhairav, and Omkareshwar Jyotirlinga pilgrimage circuits from Pune with luxury AC Force Urbania travel.
              </li>
              <li>
                <strong>Ashtavinayak Yatra:</strong> Masterfully routed 2-day itineraries covering
                all 8 Ganesha temples.
              </li>`;

if (aboutContent.includes(oldExpertise)) {
  aboutContent = aboutContent.replace(oldExpertise, newExpertise);
}

// Update Our Core Team to show founder image
const oldCoreTeam = `<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              {Object.values(authors).map((author) => (
                <div
                  key={author.id}
                  className="border border-slate-200 rounded-xl p-6 bg-slate-50 flex flex-col items-center text-center"
                >
                  <h3 className="font-bold text-lg text-brand-blue-deep">{author.name}</h3>
                  <p className="text-sm font-medium text-brand-orange mb-3">{author.role}</p>
                  <p className="text-sm text-slate-600 line-clamp-3">{author.bio}</p>
                  <Link
                    to={\`/author/\${author.id}\`}
                    className="mt-4 text-sm font-semibold text-brand-blue-deep hover:text-brand-orange transition-colors"
                  >
                    View Profile &rarr;
                  </Link>
                </div>
              ))}
            </div>`;

const newCoreTeam = `<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              {[authors["mayur-patil"], authors["shaila-mayur-patil"]].map((author) => (
                <div
                  key={author.id}
                  className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
                >
                  <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border-4 border-brand-orange/20 shadow-md bg-slate-100 shrink-0">
                    <img
                      src={author.avatarUrl}
                      alt={author.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjY2JkNWUxIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIwIDIxdi0yYTRgNCAwIDAgMC00LTRoLThhNCA0IDAgMCAwLTQgNHYyIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSI3IiByPSI0Ii8+PC9zdmc+";
                      }}
                    />
                  </div>
                  <h3 className="font-bold text-xl text-brand-blue-deep">{author.name}</h3>
                  <p className="text-sm font-semibold text-brand-orange mb-3">{author.role}</p>
                  <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">{author.bio}</p>
                  <Link
                    to={\`/author/\${author.id}\`}
                    className="mt-auto text-sm font-bold text-brand-blue-deep hover:text-brand-orange transition-colors"
                  >
                    View Profile &rarr;
                  </Link>
                </div>
              ))}
            </div>`;

if (aboutContent.includes(oldCoreTeam)) {
  aboutContent = aboutContent.replace(oldCoreTeam, newCoreTeam);
} else {
  aboutContent = aboutContent.replace(
    /<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">[\s\S]*?<\/div>\s*<\/section>/,
    `${newCoreTeam}\n          </section>`
  );
}

fs.writeFileSync(aboutPath, aboutContent, 'utf8');
console.log('✓ Updated about-shailraj-travels.tsx with founder image, team, and Ujjain Darshan Tour');

// 5. Update authors.tsx
const authorsRoutePath = path.join(frontendDir, 'src', 'routes', 'authors.tsx');
let authorsRouteContent = fs.readFileSync(authorsRoutePath, 'utf8');
authorsRouteContent = authorsRouteContent.replace(
  '{Object.values(authors).map((author) => (',
  '{[authors["mayur-patil"], authors["shaila-mayur-patil"]].map((author) => ('
);
fs.writeFileSync(authorsRoutePath, authorsRouteContent, 'utf8');
console.log('✓ Updated authors.tsx');

// 6. Update author/$authorSlug.tsx
const authorSlugPath = path.join(frontendDir, 'src', 'routes', 'author', '$authorSlug.tsx');
let authorSlugContent = fs.readFileSync(authorSlugPath, 'utf8');
authorSlugContent = authorSlugContent.replace(
  'const author = authors[params.authorSlug];',
  'const author = authors[params.authorSlug] || (params.authorSlug === "shailesh-raj" ? authors["mayur-patil"] : authors["mayur-patil"]);'
);
fs.writeFileSync(authorSlugPath, authorSlugContent, 'utf8');
console.log('✓ Updated author/$authorSlug.tsx');

// 7. Update authorName in MongoDB custom_blogs
const uris = [
  'mongodb+srv://shailrajtravels_db_user:jvNZSBTFl3qATVPb@shailraj.bcsrsu2.mongodb.net/shailraj?appName=shailraj',
  'mongodb+srv://shailrajtravels:shailrajtravels9999@cluster0.5jmdhjm.mongodb.net/shailraj?appName=Cluster0'
];

async function updateDbAuthors() {
  for (const uri of uris) {
    const client = new MongoClient(uri);
    try {
      await client.connect();
      const db = client.db('shailraj');
      await db.collection('custom_blogs').updateMany(
        {},
        {
          $set: {
            authorName: "Mayur Patil",
            updatedAt: new Date().toISOString()
          }
        }
      );
      console.log('✓ Updated MongoDB custom_blogs authorName to Mayur Patil for URI:', uri.replace(/:([^:@]+)@/, ':****@'));
    } catch (e) {
      console.error('Error updating DB author:', e);
    } finally {
      await client.close();
    }
  }
}

updateDbAuthors().catch(console.error);

