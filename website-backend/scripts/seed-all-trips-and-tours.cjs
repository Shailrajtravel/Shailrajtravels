const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || "mongodb+srv://shailrajtravels:shailrajtravels9999@cluster0.5jmdhjm.mongodb.net/shailraj?appName=Cluster0";

// Helper to generate upcoming departure dates
function generateUpcomingDates(count = 20, intervalDays = 1, startDayOffset = 1) {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dates = [];
  const base = new Date();
  base.setDate(base.getDate() + startDayOffset);

  for (let i = 0; i < count; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + (i * intervalDays));
    const dayStr = dayNames[d.getDay()];
    const dateNum = d.getDate();
    const monthStr = monthNames[d.getMonth()];
    const yearNum = d.getFullYear();
    dates.push(`${dayStr} ${dateNum} ${monthStr} ${yearNum}`);
  }
  return dates;
}

// Daily dates for the next 30 days
const dailyDates = generateUpcomingDates(30, 1, 1);
// Weekly Friday departures for the next 12 weeks
const weeklyFridayDates = generateUpcomingDates(12, 7, 2);

const dailyServices = [
  {
    name: "Pune – Nashik Daily AC Bus Service",
    schedule: "Daily departures",
    price: "₹600 per seat",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
    dates: dailyDates,
    route: ["Pune", "Nashik", "Pune"],
    includes: [
      "AC Urbania Service",
      "Comfortable Seating",
      "Safe & Reliable Journey",
      "Daily Return Service",
      "Breakfast"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Depart from Pune → Travel to Nashik → Arrive in Nashik → Complete your work/travel → Return Nashik → Pune"
      }
    ],
    recurringPattern: {
      active: true,
      mode: "daily",
      days: [0, 1, 2, 3, 4, 5, 6]
    }
  },
  {
    name: "Pune – Pandharpur Daily Darshan Service",
    schedule: "Daily departures",
    price: "₹1,500 per person",
    image: "https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=1200&q=80",
    dates: dailyDates,
    route: ["Pune", "Pandharpur", "Pune"],
    includes: [
      "AC Urbania Service",
      "Breakfast",
      "Lunch",
      "Pandharpur Darshan",
      "Comfortable Travel",
      "Safe & Reliable Journey"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Depart from Pune → Breakfast → Travel to Pandharpur → Vitthal-Rukmini Darshan → Lunch → Return journey → Arrive in Pune"
      }
    ],
    recurringPattern: {
      active: true,
      mode: "daily",
      days: [0, 1, 2, 3, 4, 5, 6]
    }
  },
  {
    name: "Pune – Satana (Baglan) Daily AC Bus Service",
    schedule: "Daily departures",
    price: "₹932 per seat",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    dates: dailyDates,
    route: ["Pune", "Satana (Baglan)", "Pune"],
    includes: [
      "AC Urbania Service",
      "Breakfast",
      "Comfortable Seating",
      "Safe & Reliable Journey",
      "Daily Return Service"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Depart from Pune → Breakfast → Travel to Satana (Baglan) → Complete your work/travel → Return to Pune"
      }
    ],
    recurringPattern: {
      active: true,
      mode: "daily",
      days: [0, 1, 2, 3, 4, 5, 6]
    }
  }
];

const tourPackages = [
  {
    title: "Ujjain – Omkareshwar – Dhoomeshwar Jyotirlinga Tour",
    subtitle: "2 Nights / 3 Days Spiritual Jyotirlinga Tour",
    durationBadge: "3D / 2N",
    location: "Ujjain, Omkareshwar, Dhoomeshwar",
    price: "₹6,116",
    schedule: "Every Friday & Weekend Departures",
    frequency: "Weekly",
    image: "https://images.unsplash.com/photo-1698223126743-3b10b78df025?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1698223126743-3b10b78df025?auto=format&fit=crop&w=1200&q=80"
    ],
    route: ["Pune", "Ujjain", "Omkareshwar", "Dhoomeshwar", "Pune"],
    tags: ["Jyotirlinga", "Temple Tour", "Spiritual Tour", "3 Days", "AC Travel"],
    seatsAvailable: 14,
    seatsTotal: 17,
    includes: [
      "AC Urbania Service",
      "Comfortable Travel",
      "Safe & Reliable Journey",
      "Temple Darshan",
      "Daily Travel Support"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Depart from Pune → Travel towards Ujjain → Ujjain Mahakaleshwar Darshan → Overnight stay/travel"
      },
      {
        day: "Day 2",
        title: "Ujjain → Omkareshwar → Omkareshwar Jyotirlinga Darshan → Continue towards Dhoomeshwar → Darshan → Overnight stay/travel"
      },
      {
        day: "Day 3",
        title: "Complete remaining darshan → Begin return journey → Arrive in Pune"
      }
    ],
    slug: "ujjain-omkareshwar-dhoomeshwar-jyotirlinga-tour"
  },
  {
    title: "Ujjain – Omkareshwar – Dhoomeshwar – Maheshwar Tour",
    subtitle: "2 Nights / 3 Days Jyotirlinga & Temple Tour",
    durationBadge: "3D / 2N",
    location: "Ujjain, Omkareshwar, Dhoomeshwar, Maheshwar",
    price: "₹6,999",
    schedule: "Every Friday & Weekend Departures",
    frequency: "Weekly",
    image: "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1200&q=80"
    ],
    route: ["Pune", "Ujjain", "Omkareshwar", "Dhoomeshwar", "Maheshwar", "Pune"],
    tags: ["Jyotirlinga", "Temple Tour", "Spiritual Tour", "Maheshwar", "3 Days"],
    seatsAvailable: 12,
    seatsTotal: 17,
    includes: [
      "AC Urbania Service",
      "Comfortable Travel",
      "Safe & Reliable Journey",
      "Temple Darshan",
      "Travel Assistance"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Pune → Ujjain → Mahakaleshwar Darshan → Overnight stay/travel"
      },
      {
        day: "Day 2",
        title: "Ujjain → Omkareshwar → Omkareshwar Darshan → Dhoomeshwar Darshan → Overnight stay/travel"
      },
      {
        day: "Day 3",
        title: "Maheshwar visit → Temple/local sightseeing → Return journey to Pune"
      }
    ],
    slug: "ujjain-omkareshwar-dhoomeshwar-maheshwar-tour"
  },
  {
    title: "Satara to Ujjain Spiritual Tour",
    subtitle: "2 Nights / 3 Days Temple Tour",
    durationBadge: "3D / 2N",
    location: "Satara, Ujjain, Omkareshwar, Dhoomeshwar",
    price: "₹8,115",
    schedule: "Weekly Departures",
    frequency: "Weekly",
    image: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80"
    ],
    route: ["Satara", "Ujjain", "Omkareshwar", "Dhoomeshwar", "Satara"],
    tags: ["Ujjain", "Jyotirlinga", "Temple Tour", "Spiritual Tour", "3 Days"],
    seatsAvailable: 15,
    seatsTotal: 17,
    includes: [
      "AC Urbania Service",
      "Comfortable Travel",
      "Safe & Reliable Journey",
      "Temple Darshan",
      "Travel Assistance"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Depart from Satara → Travel to Ujjain → Mahakaleshwar Darshan → Overnight stay/travel"
      },
      {
        day: "Day 2",
        title: "Ujjain → Omkareshwar → Jyotirlinga Darshan → Dhoomeshwar Darshan → Overnight stay/travel"
      },
      {
        day: "Day 3",
        title: "Complete remaining sightseeing/darshan → Return journey to Satara"
      }
    ],
    slug: "satara-to-ujjain-spiritual-tour"
  },
  {
    title: "Mumbai (Lalbaug) – Ujjain – Omkareshwar – Dhoomeshwar Tour",
    subtitle: "2 Nights / 3 Days Spiritual Jyotirlinga Tour",
    durationBadge: "3D / 2N",
    location: "Mumbai (Lalbaug), Ujjain, Omkareshwar, Dhoomeshwar",
    price: "₹6,999",
    schedule: "Weekly Departures",
    frequency: "Weekly",
    image: "https://images.unsplash.com/photo-1698223126743-3b10b78df025?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1698223126743-3b10b78df025?auto=format&fit=crop&w=1200&q=80"
    ],
    route: ["Mumbai (Lalbaug)", "Ujjain", "Omkareshwar", "Dhoomeshwar", "Mumbai"],
    tags: ["Jyotirlinga", "Temple Tour", "Mumbai", "Ujjain", "Spiritual Tour"],
    seatsAvailable: 13,
    seatsTotal: 17,
    includes: [
      "AC Urbania Service",
      "Comfortable Travel",
      "Safe & Reliable Journey",
      "Temple Darshan",
      "Travel Assistance"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Mumbai → Lalbaug → Continue journey towards Ujjain → Mahakaleshwar Darshan"
      },
      {
        day: "Day 2",
        title: "Ujjain → Omkareshwar → Omkareshwar Darshan → Dhoomeshwar Darshan"
      },
      {
        day: "Day 3",
        title: "Complete sightseeing/darshan → Return journey → Mumbai"
      }
    ],
    slug: "mumbai-lalbaug-ujjain-omkareshwar-dhoomeshwar-tour"
  },
  {
    title: "Pune to Tirupati Balaji Darshan Tour",
    subtitle: "Complete South India Temple Tour",
    durationBadge: "5D / 4N",
    location: "Srisailam, Mahanandi, Padmavati, Kalahasti, Tirupati Balaji, Kolhapur Mahalakshmi",
    price: "₹13,110",
    schedule: "Fixed Departures / Bi-Weekly",
    frequency: "Bi-Weekly",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80"
    ],
    route: ["Pune", "Srisailam", "Mahanandi", "Padmavati", "Kalahasti", "Tirupati Balaji", "Kolhapur Mahalakshmi", "Pune"],
    tags: ["Tirupati Balaji", "Temple Tour", "South India", "Darshan", "Spiritual Tour"],
    seatsAvailable: 10,
    seatsTotal: 17,
    includes: [
      "AC Urbania Service",
      "Comfortable Travel",
      "Safe & Reliable Journey",
      "Temple Darshan",
      "Travel Assistance"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Depart from Pune → Begin journey towards Srisailam"
      },
      {
        day: "Day 2",
        title: "Srisailam Temple Darshan → Mahanandi → Continue towards next destination"
      },
      {
        day: "Day 3",
        title: "Padmavati Temple → Kalahasti Temple Darshan"
      },
      {
        day: "Day 4",
        title: "Tirupati Balaji Darshan → Temple visit and local sightseeing"
      },
      {
        day: "Day 5",
        title: "Kolhapur Mahalakshmi Darshan → Return journey towards Pune"
      }
    ],
    slug: "pune-to-tirupati-balaji-darshan-tour"
  },
  {
    title: "Pune to Kaas Pathar One-Day Trip",
    subtitle: "One-Day Nature & Flower Valley Trip",
    durationBadge: "1 Day",
    location: "Kaas Pathar",
    price: "₹1,499",
    schedule: "Daily & Weekend Departures",
    frequency: "Daily",
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1200&q=80"
    ],
    route: ["Pune", "Kaas Pathar", "Pune"],
    tags: ["Kaas Pathar", "Nature Trip", "One Day Trip", "Flowers", "Weekend Trip"],
    seatsAvailable: 16,
    seatsTotal: 17,
    includes: [
      "Breakfast",
      "AC Urbania Service",
      "Comfortable Travel",
      "Safe & Reliable Journey"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Depart from Pune → Breakfast → Travel to Kaas Pathar → Explore the flower valley and surrounding nature → Return journey → Arrive in Pune"
      }
    ],
    slug: "pune-to-kaas-pathar-one-day-trip"
  },
  {
    title: "Mumbai to Kaas Pathar One-Day Trip",
    subtitle: "One-Day Nature & Flower Valley Trip",
    durationBadge: "1 Day",
    location: "Kaas Pathar",
    price: "₹2,499",
    schedule: "Daily & Weekend Departures",
    frequency: "Daily",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80"
    ],
    route: ["Mumbai", "Kaas Pathar", "Mumbai"],
    tags: ["Kaas Pathar", "Nature Trip", "One Day Trip", "Flowers", "Weekend Trip"],
    seatsAvailable: 14,
    seatsTotal: 17,
    includes: [
      "Breakfast",
      "AC Urbania Service",
      "Comfortable Travel",
      "Safe & Reliable Journey"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Depart from Mumbai → Breakfast → Travel to Kaas Pathar → Explore Kaas Valley and surrounding natural attractions → Return journey → Arrive in Mumbai"
      }
    ],
    slug: "mumbai-to-kaas-pathar-one-day-trip"
  },
  {
    title: "Pune / Mumbai to 3 Jyotirlinga Darshan",
    subtitle: "Bhima Shankar – Trimbakeshwar – Dhoomeshwar",
    durationBadge: "3D / 2N",
    location: "Bhima Shankar, Trimbakeshwar, Dhoomeshwar",
    price: "₹3,999",
    schedule: "Every Weekend Departures",
    frequency: "Weekly",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"
    ],
    route: ["Pune/Mumbai", "Bhima Shankar", "Trimbakeshwar", "Dhoomeshwar", "Pune/Mumbai"],
    tags: ["Jyotirlinga", "Temple Tour", "Spiritual Tour", "Darshan", "3 Jyotirlinga"],
    seatsAvailable: 11,
    seatsTotal: 17,
    includes: [
      "AC Urbania Service",
      "Comfortable Travel",
      "Safe & Reliable Journey",
      "Temple Darshan",
      "Travel Assistance"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Depart from Pune/Mumbai → Bhima Shankar Darshan → Continue towards Trimbakeshwar"
      },
      {
        day: "Day 2",
        title: "Trimbakeshwar Jyotirlinga Darshan → Travel towards Dhoomeshwar"
      },
      {
        day: "Day 3",
        title: "Dhoomeshwar Darshan → Begin return journey → Arrive at Pune/Mumbai"
      }
    ],
    slug: "pune-mumbai-to-3-jyotirlinga-darshan"
  },
  {
    title: "Satana (Baglan) to Ujjain Spiritual Tour",
    subtitle: "2 Nights / 3 Days Jyotirlinga Tour",
    durationBadge: "3D / 2N",
    location: "Satana, Ujjain, Omkareshwar, Dhoomeshwar",
    price: "₹5,000",
    schedule: "Weekly Departures",
    frequency: "Weekly",
    image: "https://images.unsplash.com/photo-1698223126743-3b10b78df025?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1698223126743-3b10b78df025?auto=format&fit=crop&w=1200&q=80"
    ],
    route: ["Satana (Baglan)", "Ujjain", "Omkareshwar", "Dhoomeshwar", "Satana"],
    tags: ["Ujjain", "Jyotirlinga", "Temple Tour", "Spiritual Tour", "3 Days"],
    seatsAvailable: 15,
    seatsTotal: 17,
    includes: [
      "AC Urbania Service",
      "Comfortable Travel",
      "Safe & Reliable Journey",
      "Temple Darshan",
      "Travel Assistance"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Depart from Satana → Travel to Ujjain → Mahakaleshwar Darshan"
      },
      {
        day: "Day 2",
        title: "Ujjain → Omkareshwar → Omkareshwar Darshan → Dhoomeshwar Darshan"
      },
      {
        day: "Day 3",
        title: "Complete sightseeing/darshan → Return journey → Satana"
      }
    ],
    slug: "satana-baglan-to-ujjain-spiritual-tour"
  },
  {
    title: "Nashik to Ujjain – Omkareshwar – Dhoomeshwar",
    subtitle: "2 Nights / 3 Days Spiritual Jyotirlinga Tour",
    durationBadge: "3D / 2N",
    location: "Nashik, Ujjain, Omkareshwar, Dhoomeshwar",
    price: "₹5,432",
    schedule: "Weekly Departures",
    frequency: "Weekly",
    image: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80"
    ],
    route: ["Nashik", "Ujjain", "Omkareshwar", "Dhoomeshwar", "Nashik"],
    tags: ["Jyotirlinga", "Ujjain", "Omkareshwar", "Temple Tour", "Spiritual Tour"],
    seatsAvailable: 13,
    seatsTotal: 17,
    includes: [
      "AC Urbania Service",
      "Comfortable Travel",
      "Safe & Reliable Journey",
      "Temple Darshan",
      "Travel Assistance"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Depart from Nashik → Travel to Ujjain → Mahakaleshwar Darshan"
      },
      {
        day: "Day 2",
        title: "Ujjain → Omkareshwar → Omkareshwar Jyotirlinga Darshan → Dhoomeshwar Darshan"
      },
      {
        day: "Day 3",
        title: "Complete sightseeing/darshan → Return journey → Nashik"
      }
    ],
    slug: "nashik-to-ujjain-omkareshwar-dhoomeshwar-tour"
  },
  {
    title: "Pune to Shakti Peeth Yatra",
    subtitle: "2 Nights / 3 Days Shakti Peeth Temple Tour",
    durationBadge: "3D / 2N",
    location: "Tuljapur, Kolhapur, Mahur, Saptashrungi Gad",
    price: "₹6,116",
    schedule: "Weekly Departures",
    frequency: "Weekly",
    image: "https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=1200&q=80"
    ],
    route: ["Pune", "Tuljapur", "Kolhapur", "Mahur", "Saptashrungi Gad", "Pune"],
    tags: ["Shakti Peeth", "Temple Tour", "Tuljapur", "Kolhapur", "Spiritual Tour"],
    seatsAvailable: 14,
    seatsTotal: 17,
    includes: [
      "AC Urbania Service",
      "Comfortable Travel",
      "Safe & Reliable Journey",
      "Temple Darshan",
      "Travel Assistance"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Depart from Pune → Tuljapur → Tulja Bhavani Darshan → Continue towards Kolhapur"
      },
      {
        day: "Day 2",
        title: "Kolhapur → Mahalaxmi/Ambabai Darshan → Travel towards Mahur → Renuka Devi Darshan"
      },
      {
        day: "Day 3",
        title: "Saptashrungi Gad → Saptashrungi Devi Darshan → Return journey to Pune"
      }
    ],
    slug: "pune-to-shakti-peeth-yatra"
  },
  {
    title: "Pune to Lonavala One-Day Trip",
    subtitle: "One-Day Nature & Sightseeing Trip",
    durationBadge: "1 Day",
    location: "Lonavala",
    price: "₹1,221",
    schedule: "Daily Departures",
    frequency: "Daily",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
    ],
    route: ["Pune", "Lonavala", "Pune"],
    tags: ["Lonavala", "One Day Trip", "Nature Trip", "Weekend Trip", "Sightseeing"],
    seatsAvailable: 15,
    seatsTotal: 17,
    includes: [
      "Breakfast",
      "AC Urbania Service",
      "Comfortable Travel",
      "Safe & Reliable Journey"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Depart from Pune → Breakfast → Lonavala sightseeing → Explore major attractions and scenic locations → Return journey → Pune"
      }
    ],
    slug: "pune-to-lonavala-one-day-trip"
  },
  {
    title: "Mumbai to Lonavala One-Day Trip",
    subtitle: "One-Day Nature & Sightseeing Trip",
    durationBadge: "1 Day",
    location: "Lonavala",
    price: "₹1,311",
    schedule: "Daily Departures",
    frequency: "Daily",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80"
    ],
    route: ["Mumbai", "Lonavala", "Mumbai"],
    tags: ["Lonavala", "One Day Trip", "Nature Trip", "Weekend Trip", "Sightseeing"],
    seatsAvailable: 16,
    seatsTotal: 17,
    includes: [
      "Breakfast",
      "AC Urbania Service",
      "Comfortable Travel",
      "Safe & Reliable Journey"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Depart from Mumbai → Breakfast → Lonavala sightseeing → Explore major attractions → Return journey → Mumbai"
      }
    ],
    slug: "mumbai-to-lonavala-one-day-trip"
  },
  {
    title: "Pune to Ashtavinayak Darshan",
    subtitle: "Complete One-Day Ganpati Temple Tour",
    durationBadge: "1 Day",
    location: "Morgaon, Siddhatek, Pali, Mahad, Theur, Lenyadri, Ozar, Ranjangaon",
    price: "₹3,111",
    schedule: "Daily & Weekend Departures",
    frequency: "Daily",
    image: "https://images.unsplash.com/photo-1567591414240-e2b2f6b8a8b8?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1567591414240-e2b2f6b8a8b8?auto=format&fit=crop&w=1200&q=80"
    ],
    route: ["Pune", "Morgaon", "Siddhatek", "Pali", "Mahad", "Theur", "Lenyadri", "Ozar", "Ranjangaon", "Pune"],
    tags: ["Ashtavinayak", "Ganpati Darshan", "Temple Tour", "One Day Trip", "Spiritual Tour"],
    seatsAvailable: 15,
    seatsTotal: 17,
    includes: [
      "Breakfast",
      "Guide",
      "All Temple Darshan",
      "AC Urbania Service",
      "Same-Day Return Journey",
      "Safe & Reliable Travel"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Pune → Morgaon → Siddhatek → Pali → Mahad → Theur → Lenyadri → Ozar → Ranjangaon → Return to Pune"
      }
    ],
    slug: "pune-to-ashtavinayak-darshan"
  },
  {
    title: "Mumbai to Girnar Spiritual Tour",
    subtitle: "4 Nights / 5 Days Gujarat Temple & Pilgrimage Tour",
    durationBadge: "5D / 4N",
    location: "Dwarka, Bet Dwarka, Somnath, Nageshwar, Rukmini Temple, Girnar",
    price: "₹11,111",
    schedule: "Fixed Departures",
    frequency: "Bi-Weekly",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80"
    ],
    route: ["Mumbai", "Dwarka", "Bet Dwarka", "Nageshwar", "Rukmini Temple", "Somnath", "Girnar", "Mumbai"],
    tags: ["Girnar", "Dwarka", "Somnath", "Gujarat", "Temple Tour", "Pilgrimage"],
    seatsAvailable: 11,
    seatsTotal: 17,
    includes: [
      "AC Urbania Service",
      "Comfortable Travel",
      "Safe & Reliable Journey",
      "Temple Darshan",
      "Travel Assistance"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Depart from Mumbai → Begin journey towards Gujarat"
      },
      {
        day: "Day 2",
        title: "Arrive at Dwarka → Dwarkadhish Temple Darshan → Bet Dwarka visit"
      },
      {
        day: "Day 3",
        title: "Nageshwar Jyotirlinga → Rukmini Temple → Somnath Temple Darshan"
      },
      {
        day: "Day 4",
        title: "Girnar visit → Girnar pilgrimage/sightseeing"
      },
      {
        day: "Day 5",
        title: "Complete remaining sightseeing → Begin return journey → Mumbai"
      }
    ],
    slug: "mumbai-to-girnar-spiritual-tour"
  },
  {
    title: "Pune to Girnar Spiritual Tour",
    subtitle: "4 Nights / 5 Days Gujarat Temple & Pilgrimage Tour",
    durationBadge: "5D / 4N",
    location: "Dwarka, Bet Dwarka, Somnath, Nageshwar, Rukmini Temple, Girnar",
    price: "₹12,111",
    schedule: "Fixed Departures",
    frequency: "Bi-Weekly",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    ],
    route: ["Pune", "Dwarka", "Bet Dwarka", "Nageshwar", "Rukmini Temple", "Somnath", "Girnar", "Pune"],
    tags: ["Girnar", "Dwarka", "Somnath", "Gujarat", "Temple Tour", "Pilgrimage"],
    seatsAvailable: 12,
    seatsTotal: 17,
    includes: [
      "AC Urbania Service",
      "Comfortable Travel",
      "Safe & Reliable Journey",
      "Temple Darshan",
      "Travel Assistance"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Depart from Pune → Begin journey towards Gujarat"
      },
      {
        day: "Day 2",
        title: "Dwarka → Dwarkadhish Temple Darshan → Bet Dwarka"
      },
      {
        day: "Day 3",
        title: "Nageshwar → Rukmini Temple → Somnath Darshan"
      },
      {
        day: "Day 4",
        title: "Girnar pilgrimage and sightseeing"
      },
      {
        day: "Day 5",
        title: "Complete remaining visit → Return journey to Pune"
      }
    ],
    slug: "pune-to-girnar-spiritual-tour"
  }
];

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    const db = client.db('shailraj');

    // 1. Clean up old dummy records
    console.log("Cleaning old dummy test records...");
    await db.collection('trip_options').deleteMany({
      $or: [
        { name: "Pune -Ujjain-Pune" },
        { name: /test/i }
      ]
    });
    await db.collection('packages').deleteMany({
      $or: [
        { title: "Kashmir" },
        { title: /test/i },
        { subtitle: "njfhrjkhfrkj" }
      ]
    });
    await db.collection('tours').deleteMany({
      $or: [
        { slug: "enfjhfi" },
        { title: "mdelje" }
      ]
    });

    // 2. Insert or upsert Daily Services into trip_options
    console.log("Seeding Daily Services into trip_options...");
    for (const service of dailyServices) {
      await db.collection('trip_options').updateOne(
        { name: service.name },
        {
          $set: {
            ...service,
            updatedAt: new Date()
          },
          $setOnInsert: {
            createdAt: new Date()
          }
        },
        { upsert: true }
      );
      console.log(`✓ Daily Service: ${service.name}`);
    }

    // 3. Insert or upsert Tour Packages into packages collection
    console.log("Seeding Tour Packages into packages...");
    for (const pkg of tourPackages) {
      const { slug, ...pkgData } = pkg;
      await db.collection('packages').updateOne(
        { title: pkg.title },
        {
          $set: {
            ...pkgData,
            dates: weeklyFridayDates,
            updatedAt: new Date()
          },
          $setOnInsert: {
            createdAt: new Date()
          }
        },
        { upsert: true }
      );
      console.log(`✓ Package: ${pkg.title}`);
    }

    // 4. Insert or upsert Tours into tours collection (for /tours and /tours/$tourSlug)
    console.log("Seeding Tours into tours collection...");
    for (const pkg of tourPackages) {
      const tourDoc = {
        slug: pkg.slug,
        lang: "en",
        title: pkg.title,
        metaTitle: `${pkg.title} | Shailraj Travels`,
        metaDescription: `Book ${pkg.title}. ${pkg.subtitle}. Comfortable AC Force Urbania travel, guided darshan, affordable pricing at ${pkg.price}.`,
        canonicalUrl: `https://www.shailrajtravels.com/tours/${pkg.slug}`,
        heroContent: {
          image: pkg.image,
          description: `${pkg.subtitle} - Experienced drivers, verified hotels, and seamless temple darshan with Shailraj Travels Pune.`
        },
        overview: `<p>Join Shailraj Travels on the memorable <strong>${pkg.title}</strong> (${pkg.subtitle}). Experience luxurious travel with AC Force Urbania, dedicated tour assistance, and hassle-free darshan across ${pkg.location}.</p>`,
        highlights: [
          "AC Force Urbania Luxury Travel",
          "Confirmed Temple Darshan Assistance",
          "Experienced Professional Drivers & Route Experts",
          "Hygienic Vegetarian Dining Stops",
          "24/7 Dedicated Customer Support"
        ],
        destinations: pkg.route,
        packages: [
          {
            title: pkg.durationBadge,
            price: pkg.price.replace(/[^\d,]/g, ''),
            inclusions: pkg.includes,
            exclusions: ["Personal expenses", "Special VIP puja tickets (unless specified)", "Laundry and telephone charges"]
          }
        ],
        faq: [
          {
            question: `What vehicle is used for the ${pkg.title}?`,
            answer: "We primarily operate premium AC Force Urbania luxury vans and executive mini buses equipped with reclining seats, charging ports, and ample luggage space."
          },
          {
            question: "How do I confirm my booking?",
            answer: "You can book directly via the website booking form or contact our 24/7 helpline on WhatsApp/phone. Our team will verify seat availability and send an instant confirmation."
          },
          {
            question: "Are meals included?",
            answer: pkg.includes.includes("Breakfast") 
              ? "Yes, fresh vegetarian breakfast is included as detailed in the package inclusions."
              : "Food stops are arranged at verified, hygienic vegetarian restaurants along the route."
          }
        ],
        dates: weeklyFridayDates,
        relatedTours: [],
        relatedBlogs: [],
        updatedAt: new Date()
      };

      await db.collection('tours').updateOne(
        { slug: pkg.slug, lang: "en" },
        {
          $set: tourDoc,
          $setOnInsert: {
            createdAt: new Date()
          }
        },
        { upsert: true }
      );
      console.log(`✓ Tour Page: /tours/${pkg.slug}`);
    }

    // Verify final counts
    const finalTrips = await db.collection('trip_options').countDocuments();
    const finalPkgs = await db.collection('packages').countDocuments();
    const finalTours = await db.collection('tours').countDocuments();

    console.log("\n==========================================");
    console.log(`SEEDING COMPLETED SUCCESSFULLY!`);
    console.log(`Total Daily Services (trip_options): ${finalTrips}`);
    console.log(`Total Tour Packages (packages): ${finalPkgs}`);
    console.log(`Total Tour Pages (tours): ${finalTours}`);
    console.log("==========================================");

  } catch (err) {
    console.error("Error during seeding:", err);
  } finally {
    await client.close();
  }
}

seed();
