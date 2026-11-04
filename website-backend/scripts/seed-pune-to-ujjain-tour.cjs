const { MongoClient } = require('mongodb');

const uris = [
  'mongodb+srv://shailrajtravels_db_user:jvNZSBTFl3qATVPb@shailraj.bcsrsu2.mongodb.net/shailraj?appName=shailraj',
  'mongodb+srv://shailrajtravels:shailrajtravels9999@cluster0.5jmdhjm.mongodb.net/shailraj?appName=Cluster0'
];

// Generate upcoming Friday and weekend departure dates for 2026-2027
function generateUpcomingFridayDates(count = 24) {
  const dates = [];
  const now = new Date();
  // Find next Friday
  const current = new Date(now);
  const dayOfWeek = current.getDay();
  const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7;
  current.setDate(current.getDate() + daysUntilFriday);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 0; i < count; i++) {
    const d = new Date(current);
    d.setDate(current.getDate() + (i * 7));
    const dayStr = days[d.getDay()];
    const dateNum = String(d.getDate()).padStart(2, '0');
    const monthStr = months[d.getMonth()];
    const yearStr = d.getFullYear();
    dates.push(`${dayStr} ${dateNum} ${monthStr} ${yearStr}`);
  }
  return dates;
}

const upcomingDates = generateUpcomingFridayDates(24);

const ujjainTourData = {
  slug: "pune-to-ujjain-tour-package",
  lang: "en",
  title: "Pune to Ujjain Tour Package",
  subtitle: "3 Days / 2 Nights Spiritual Jyotirlinga Tour (Mahakaleshwar, Omkareshwar & Maheshwar)",
  metaTitle: "Pune to Ujjain Tour Package | Best Tours & Travels in Pune | Shailraj Travels",
  metaDescription: "Looking for the best travels from Pune to Ujjain? Book Shailraj Travels' premier Pune to Ujjain tour and travels package. AC Force Urbania, Mahakal Bhasma Aarti, Omkareshwar & 3-star stay. Call 24/7.",
  keywords: [
    "pune to ujjain bus travels",
    "pune to ujjain bus",
    "pune to ujjain travels",
    "pune to ujjain bus booking",
    "pune to ujjain sleeper bus travels",
    "pune to ujjain luxury bus travels",
    "ujjain bus travels",
    "pune to ujjain ac bus travels",
    "pune to ujjain force urbania travels",
    "pune ujjain bus ticket booking",
    "pune to ujjain best travels",
    "pune to ujjain tour and travels",
    "pune to ujjain tours and travels",
    "pune to ujjain tour package",
    "pune to ujjain travels",
    "ujjain tour package from pune",
    "best travels for ujjain yatra",
    "ujjain yatra best travels",
    "pune to ujjain cab",
    "pune to ujjain force urbania",
    "pune to ujjain tour package for family",
    "pune to ujjain travel agency",
    "pune travels",
    "best travels in pune",
    "hadapsar travels",
    "shailraj travels",
    "shailraj travels pune"
  ],
  canonicalUrl: "https://www.shailrajtravels.com/tours/pune-to-ujjain-tour-package",
  heroContent: {
    image: "https://res.cloudinary.com/dquecn5qj/image/upload/v1789110978/tours/rpir5cxo58n4lcti44hv.webp",
    description: "Rated Pune's best travels for Ujjain tour and travels. 3 Days / 2 Nights Tri-Jyotirlinga circuit with luxury AC Force Urbania, Mahakaleshwar Bhasma Aarti guidance, pure veg meals & 3-star AC hotel stays."
  },
  overview: `<p>Searching for the <strong>best travels for Pune to Ujjain</strong> or the most reliable <strong>Pune to Ujjain tour and travels</strong> package? <strong>Shailraj Travels</strong> (Hadapsar, Pune) welcomes you to Maharashtra's highest-rated spiritual pilgrimage to <strong>Shri Mahakaleshwar Jyotirlinga (Ujjain)</strong>, <strong>Omkareshwar Jyotirlinga</strong>, <strong>Mamleshwar</strong>, <strong>Maheshwar Ahilya Fort & Ghats</strong>, and <strong>Grishneshwar Jyotirlinga</strong>.</p>
<p>With over 15 years of excellence and 10,000+ satisfied yatris across Pune and Maharashtra, our <strong>Pune to Ujjain Tour Package (3 Days / 2 Nights)</strong> is crafted specifically for families, senior citizens, and devotional groups seeking a seamless, sacred experience without highway fatigue or darshan hassles.</p>
<h3>Why Shailraj Travels is the Best Travels for Pune to Ujjain:</h3>
<ul>
  <li><strong>Luxury AC Force Urbania & Innova Crysta:</strong> Travel in state-of-the-art push-back recliner seats, individual AC vents, panoramic viewing windows, and USB charging ports.</li>
  <li><strong>Mahakaleshwar Bhasma Aarti & Sheegra Darshan Guidance:</strong> Expert assistance with official online token reservations, traditional Solah/Saree dress code guidance, and entry protocol at Gate 4/Nandi Hall.</li>
  <li><strong>Complete Tri-Jyotirlinga & Shaktipeeth Circuit:</strong> Visit Dakshinmukhi Mahakaleshwar (Ujjain), Omkareshwar on Mandhata island, Harsiddhi Mata (Shaktipeeth), Kaal Bhairav, and Grishneshwar (Ellora).</li>
  <li><strong>Pure Vegetarian Dining & Verified 3-Star AC Hotels:</strong> Hygienic, clean twin/triple-sharing AC rooms near the temple complex and verified sattvic vegetarian food stops along NH 60/52.</li>
  <li><strong>Doorstep Pune Pickup & 24/7 Yatra Support:</strong> Convenient boarding points across Hadapsar, Swargate, Pune Station, Wakad, Bhosari, and Chakan.</li>
</ul>`,
  highlights: [
    "Luxury AC Force Urbania & Premium Innova Crysta Highway Travel",
    "Confirmed Mahakaleshwar Bhasma Aarti & Sheegra Darshan Assistance",
    "Sacred Narmada River Boat Parikrama at Omkareshwar & Mamleshwar",
    "Heritage Exploration at Maheshwar Ahilya Fort & Narmada Ghats",
    "Darshan at Baba Kaal Bhairav & Harsiddhi Mata 51 Shaktipeeth",
    "Verified 3-Star AC Hotel Accommodation & Sattvic Pure Veg Meals",
    "Experienced Professional Highway Chauffeurs & 24/7 Dedicated Support"
  ],
  destinations: [
    "Pune",
    "Nashik",
    "Dhule",
    "Sendhwa",
    "Maheshwar",
    "Omkareshwar",
    "Ujjain",
    "Grishneshwar",
    "Pune"
  ],
  dates: upcomingDates,
  packages: [
    {
      title: "3D / 2N All-Inclusive",
      price: "6,999",
      inclusions: [
        "Luxury AC Force Urbania / Tempo Traveller Travel",
        "2 Nights Premium 3-Star AC Hotel Stay (Twin/Triple Sharing)",
        "Daily Pure Vegetarian Breakfast",
        "All Highway Tolls, Parking, Inter-State Permits & Driver Allowances",
        "Complete Temple Sightseeing in Ujjain, Omkareshwar & Maheshwar",
        "Bhasma Aarti & VIP Sheegra Darshan Booking Guidance"
      ],
      exclusions: [
        "Personal expenses, shopping, and laundry",
        "Special VIP puja tickets or abhishekam counter fees",
        "Meals other than specified in inclusions"
      ]
    }
  ],
  faq: [
    {
      question: "Why is Shailraj Travels rated the best travels for Pune to Ujjain tour and travels?",
      answer: "Shailraj Travels is Pune's leading pilgrimage tour operator based in Hadapsar with a 4.9★ rating. We specialize in Pune to Ujjain tours using luxury AC Force Urbania vans, verified pure vegetarian restaurants, comfortable 3-star AC hotel stays, and expert Bhasma Aarti and Sheegra Darshan guidance."
    },
    {
      question: "How long is the journey from Pune to Ujjain by road?",
      answer: "The road distance from Pune to Ujjain via the Nashik - Dhule - Sendhwa - Indore Bypass route (NH 60 & NH 52) is approximately 640 km. In our smooth AC Force Urbania or Innova Crysta, it takes approximately 11 to 12.5 hours with hygienic breakfast, lunch, and tea breaks."
    },
    {
      question: "How do you help with Mahakaleshwar Bhasma Aarti booking from Pune?",
      answer: "We guide all booked pilgrims through the official online portal (shrimahakaleshwar.com) 30 days in advance, ensure compliance with the strict traditional dress code (Dhoti/Solah for men, Saree for women), and coordinate entry timings at the temple gate."
    },
    {
      question: "Can we visit Omkareshwar and Maheshwar along with Ujjain on this tour?",
      answer: "Yes! Our Pune to Ujjain tour package is a comprehensive 3-Day / 2-Night spiritual circuit covering Shri Mahakaleshwar, Kaal Bhairav, Harsiddhi Mata Shaktipeeth, Omkareshwar Jyotirlinga, Mamleshwar, and the Queen Ahilyabai Holkar Fort & Ghats in Maheshwar."
    },
    {
      question: "Where are the pickup points in Pune for the Ujjain tour?",
      answer: "We offer convenient pickup points across Pune including Hadapsar (Shailraj Travels Office), Swargate, Pune Railway Station, Sangamwadi, Wakad, Bhosari, and Chakan."
    },
    {
      question: "What is the cost of the Pune to Ujjain tour package?",
      answer: "Our group departure packages in AC Force Urbania start from ₹6,999 per person for 3 Days / 2 Nights including luxury transport, 3-star AC hotel stay, breakfast, toll taxes, and darshan assistance. Custom private packages for family groups in Innova Crysta and Urbania are also available."
    }
  ],
  relatedTours: [
    "pune-mumbai-to-3-jyotirlinga-darshan",
    "pune-to-ashtavinayak-darshan",
    "pune-to-tirupati-balaji-darshan-tour"
  ],
  relatedBlogs: [
    "pune-to-ujjain-tour-guide-mahakal-darshan-itinerary",
    "pune-to-ujjain-road-trip-itinerary"
  ],
  updatedAt: new Date()
};

const ujjainPackageData = {
  title: "Pune to Ujjain Tour Package",
  slug: "pune-to-ujjain-tour-package",
  subtitle: "3 Days / 2 Nights Spiritual Jyotirlinga Tour (Mahakaleshwar & Omkareshwar)",
  durationBadge: "3D / 2N",
  location: "Ujjain, Omkareshwar, Maheshwar, Grishneshwar",
  price: "₹6,999",
  schedule: "Every Friday & Weekend Departures",
  frequency: "Weekly",
  image: "https://res.cloudinary.com/dquecn5qj/image/upload/v1789110978/tours/rpir5cxo58n4lcti44hv.webp",
  images: [
    "https://res.cloudinary.com/dquecn5qj/image/upload/v1789110978/tours/rpir5cxo58n4lcti44hv.webp"
  ],
  route: ["Pune", "Nashik", "Dhule", "Sendhwa", "Maheshwar", "Omkareshwar", "Ujjain", "Grishneshwar", "Pune"],
  tags: [
    "pune to ujjain best travels",
    "pune to ujjain tour and travels",
    "pune to ujjain tour package",
    "pune to ujjain travels",
    "Jyotirlinga",
    "Ujjain",
    "Omkareshwar",
    "Temple Tour",
    "Spiritual Tour"
  ],
  seatsAvailable: 14,
  seatsTotal: 17,
  includes: [
    "AC Urbania Service",
    "3-Star AC Hotel Accommodation",
    "Vegetarian Breakfast",
    "Mahakaleshwar Bhasma Aarti Guidance",
    "All Tolls, Parking & Driver Allowance"
  ],
  itinerary: [
    {
      day: "Day 1",
      title: "Depart Pune (4:30 AM) → Highway breakfast → Maheshwar Ahilya Fort & Ghats → Arrive in Ujjain → Harsiddhi Mata Aarti & Mahakal Lok → Overnight Ujjain"
    },
    {
      day: "Day 2",
      title: "Early Morning Mahakaleshwar Bhasma Aarti → Kaal Bhairav & Sandipani Ashram → Drive to Omkareshwar → Narmada Boat Parikrama & Mamleshwar → Overnight stay"
    },
    {
      day: "Day 3",
      title: "Morning Darshan → Return journey via Grishneshwar Jyotirlinga (Ellora) → Arrive back in Pune by late evening"
    }
  ],
  dates: upcomingDates,
  updatedAt: new Date()
};

async function seedDatabase(uri) {
  console.log(`\n========================================`);
  console.log(`Connecting to: ${uri.replace(/:([^:@]+)@/, ':****@')}`);
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('shailraj');

    // 1. Upsert official Pune to Ujjain Tour into 'tours' collection
    console.log(`Upserting official tour 'pune-to-ujjain-tour-package'...`);
    await db.collection('tours').updateOne(
      { slug: "pune-to-ujjain-tour-package", lang: "en" },
      {
        $set: {
          ...ujjainTourData,
          updatedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
    console.log(`✓ Tour upserted: /tours/pune-to-ujjain-tour-package`);

    // 2. Also upsert alias tour for legacy slug 'ujjain-omkareshwar-Ghrishneshwar-maheshwar-tour'
    // so any older bookmark, cache, or API query also returns full details!
    console.log(`Upserting legacy alias tour 'ujjain-omkareshwar-Ghrishneshwar-maheshwar-tour'...`);
    await db.collection('tours').updateOne(
      { slug: "ujjain-omkareshwar-Ghrishneshwar-maheshwar-tour", lang: "en" },
      {
        $set: {
          ...ujjainTourData,
          slug: "ujjain-omkareshwar-Ghrishneshwar-maheshwar-tour",
          canonicalUrl: "https://www.shailrajtravels.com/tours/pune-to-ujjain-tour-package",
          updatedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
    console.log(`✓ Legacy alias tour upserted: /tours/ujjain-omkareshwar-Ghrishneshwar-maheshwar-tour`);

    // 3. Upsert tour package in 'packages' collection
    console.log(`Upserting package 'Pune to Ujjain Tour Package'...`);
    // Delete any old conflicting unslugged or duplicate entry
    await db.collection('packages').deleteMany({
      $or: [
        { title: "Ujjain – Omkareshwar – Ghrishneshwar Jyotirlinga Tour" },
        { title: "Ujjain - Omkareshwar - Dhoomeshwar Jyotirlinga Tour" },
        { title: "Ujjain - Omkareshwar - Dhoomeshwar - Maheshwar Tour" },
        { slug: "pune-to-ujjain-tour-package" }
      ]
    });

    await db.collection('packages').insertOne({
      ...ujjainPackageData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log(`✓ Package inserted: Pune to Ujjain Tour Package`);

    // 4. Update custom_blogs to link properly to /tours/pune-to-ujjain-tour-package
    console.log(`Updating custom_blogs internal links and SEO keywords...`);
    await db.collection('custom_blogs').updateOne(
      { slug: "pune-to-ujjain-tour-guide-mahakal-darshan-itinerary" },
      {
        $set: {
          metaTitle: "Pune to Ujjain Tour Guide | Best Travels, Cab & Mahakal Darshan",
          metaDescription: "Looking for the best travels from Pune to Ujjain? Complete travel guide: Road distance (~640 km), highway route, AC Force Urbania cab booking, Bhasma Aarti rules & 3-day itinerary.",
          focusKeyword: "pune to ujjain best travels",
          relatedTourSlugs: ["pune-to-ujjain-tour-package", "pune-mumbai-to-3-jyotirlinga-darshan"],
          updatedAt: new Date().toISOString()
        }
      }
    );

    await db.collection('custom_blogs').updateOne(
      { slug: "pune-to-ujjain-road-trip-itinerary" },
      {
        $set: {
          metaTitle: "Pune to Ujjain Road Trip | Best Tour & Travels 2-Day Tri-Jyotirlinga Guide",
          metaDescription: "Complete 2-day Pune to Ujjain road trip guide: Cover Mahakaleshwar, Omkareshwar & Grishneshwar Jyotirlingas, Maheshwar Ghats with Shailraj Travels AC Force Urbania.",
          focusKeyword: "pune to ujjain tour and travels",
          relatedTourSlugs: ["pune-to-ujjain-tour-package", "pune-mumbai-to-3-jyotirlinga-darshan"],
          updatedAt: new Date().toISOString()
        }
      }
    );
    console.log(`✓ Custom blogs updated!`);

    // Verify
    const tourCount = await db.collection('tours').countDocuments();
    const pkgCount = await db.collection('packages').countDocuments();
    console.log(`Database count: ${tourCount} tours, ${pkgCount} packages.`);

  } catch (err) {
    console.error(`Error with ${uri}:`, err);
  } finally {
    await client.close();
  }
}

async function main() {
  for (const uri of uris) {
    await seedDatabase(uri);
  }
  console.log(`\nALL DATABASES SUCCESSFULLY UPDATED WITH PUNE TO UJJAIN TOUR!`);
}

main().catch(console.error);

