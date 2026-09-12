const { MongoClient } = require('mongodb');

const uris = [
  'mongodb+srv://shailrajtravels_db_user:jvNZSBTFl3qATVPb@shailraj.bcsrsu2.mongodb.net/shailraj?appName=shailraj',
  'mongodb+srv://shailrajtravels:shailrajtravels9999@cluster0.5jmdhjm.mongodb.net/shailraj?appName=Cluster0'
];

const defaultOffer = {
  slug: "pune-to-lalbag-raja-darshan",
  isActive: true,
  badge: "ONE DAY TRIP",
  title: "Pune to Lalbag Raja Darshan",
  subtitle: "Faith | Travel | Blessings - Special One Day Trip",
  bannerImageUrl: "/images/offers/lalbag-raja-pune-offer.jpg",
  offerPrice: "999",
  originalPrice: "1,499",
  priceUnit: "per person",
  urgencyText: "Limited Seats in Luxury Force Urbania! 14th Sep Late Night Departure",
  vehicleName: "Luxury AC Force Urbania",
  highlights: [
    "Comfortable AC Travel",
    "Group Travel Friendly",
    "Safe & Reliable Chauffeurs",
    "Hassle-Free Darshan",
    "Spacious Seating",
    "Fully Air Conditioned",
    "Ample Luggage Space",
    "Ideal for Families, Friends & Devotees"
  ],
  schedule: [
    {
      time: "14th Sep (Late Night)",
      title: "Departure from Pune",
      description: "Night journey from Pune pickup points via Mumbai-Pune Expressway in luxury AC Force Urbania."
    },
    {
      time: "15th Sep (Early Morning)",
      title: "Reach Mumbai",
      description: "Arrive in Mumbai fresh and energized near Lalbaug before dawn."
    },
    {
      time: "15th Sep (Morning)",
      title: "Lalbaug Raja Darshan",
      description: "Holy darshan and blessings of Navsacha Lalbaugcha Raja with your loved ones."
    },
    {
      time: "15th Sep (Afternoon)",
      title: "Return to Pune",
      description: "Board vehicle with sacred memories and reach Pune comfortably by evening."
    }
  ],
  route: "Pune ➔ Mumbai-Pune Expressway ➔ Mumbai (Lalbag Raja) ➔ Pune",
  pickupPoints: [
    "Swargate",
    "Pune Station",
    "Shivajinagar",
    "Aundh",
    "Chandani Chowk",
    "Hinjawadi Flyover",
    "Wakad",
    "Nigdi Bhakti-Shakti"
  ],
  inclusions: [
    "Round-trip travel in Luxury AC Force Urbania",
    "Experienced and courteous highway driver",
    "All highway tolls, Mumbai entry taxes & parking fees included",
    "Complimentary packaged drinking water bottle",
    "Clean sanitised pure-veg highway halts for refresh"
  ],
  exclusions: [
    "VIP Darshan pass / coconut / floral offerings",
    "Meals, breakfast & personal expenses"
  ],
  ctaText: "Book Your Seat Now",
  whatsappMessage: "Hello Shailraj Travels, I want to book seats for Pune to Lalbag Raja Darshan One Day Trip at ₹999 per person in Force Urbania. Please confirm availability.",
  terms: "Advance booking of 50% required to confirm seat reservation. Remaining payment on boarding.",
  updatedAt: new Date().toISOString()
};

async function seed() {
  for (const uri of uris) {
    const client = new MongoClient(uri);
    try {
      await client.connect();
      const db = client.db();
      console.log('Connected to:', uri.split('@')[1].split('/')[0]);
      await db.collection('promotional_offers').deleteMany({ slug: defaultOffer.slug });
      await db.collection('promotional_offers').insertOne(defaultOffer);
      const count = await db.collection('promotional_offers').countDocuments();
      console.log('Total promotional_offers in DB:', count);
    } catch (err) {
      console.error('Error on uri:', uri, err.message);
    } finally {
      await client.close();
    }
  }
}

seed();
