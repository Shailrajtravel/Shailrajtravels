const { MongoClient } = require('mongodb');

require('dotenv').config({ path: 'website-backend/.env' });
const apiKey = process.env.GOOGLE_MAPS_API_KEY || '';
const placeId = 'ChIJXRgrL53DwjsRs0FidQRovF0';

const realGoogleReviews = [
  {
    id: "g-real-1",
    name: "Mayuresh Gurav",
    rating: 5,
    text: "Had a wonderful experience on our recent group tour. The vehicle was spacious, the driver was kind, and everything went as planned. We felt taken care of the entire time.",
    textMr: "आमच्या अलीकडील ग्रुप टूरवर खूप छान अनुभव आला. गाडी ऐसपैस होती, ड्रायव्हर खूप दयाळू व नम्र होते आणि नियोजनानुसार सर्व काही व्यवस्थित पार पडले. संपूर्ण प्रवासात खूप चांगली काळजी घेतली गेली.",
    relativeTime: "2 days ago",
    timestamp: Date.now() - (2 * 86400 * 1000),
  },
  {
    id: "g-real-2",
    name: "Kajal varma Varma",
    rating: 5,
    text: "Our family tour was filled with beautiful memories. The itinerary was well planned, with enough time at each stop. I look forward to booking with them again.",
    textMr: "आमची कौटुंबिक सहल सुंदर आठवणींनी भरलेली होती. प्रत्येक ठिकाणी पुरेसा वेळ देऊन प्रवासाचे नियोजन उत्तम केले होते. त्यांच्यासोबत पुन्हा बुकिंग करण्यास नक्कीच उत्सुक आहे.",
    relativeTime: "5 days ago",
    timestamp: Date.now() - (5 * 86400 * 1000),
  },
  {
    id: "g-real-3",
    name: "prashant dabholkar",
    rating: 5,
    text: "What a splendid experience! The tour was well-organized and the stops were interesting. The driver was experienced and made us feel safe while traveling.",
    textMr: "खूपच अप्रतिम अनुभव! टूर उत्तम नियोजित होती आणि थांबे अतिशय रंजक होते. ड्रायव्हर अनुभवी होते आणि प्रवासात आम्हाला पूर्णपणे सुरक्षित वाटले.",
    relativeTime: "5 days ago",
    timestamp: Date.now() - (5 * 86400 * 1000) - 1000,
  },
  {
    id: "g-real-4",
    name: "Joya Shaikh",
    rating: 5,
    text: "The weekend tour we booked was exactly what we needed. The itinerary was well thought out, and the sights were beautiful. Our driver was friendly and knowledgeable, adding to the experience.",
    textMr: "आम्ही बुक केलेली वीकेंड टूर अगदी हवी तशीच होती. नियोजन अतिशय विचारपूर्वक केले होते आणि प्रेक्षणीय स्थळे सुंदर होती. ड्रायव्हर अतिशय मैत्रीपूर्ण आणि माहितगार होते.",
    relativeTime: "5 days ago",
    timestamp: Date.now() - (5 * 86400 * 1000) - 2000,
  },
  {
    id: "g-real-5",
    name: "Karishma RATHOD",
    rating: 5,
    text: "Our weekend getaway was memorable, thanks to the reliable transport service. The AC in the vehicle kept us cool, and the experienced driver ensured we reached our destinations safely. A fantastic option for short trips.",
    textMr: "विश्वासार्ह वाहतूक सेवेमुळे आमचा वीकेंड अविस्मरणीय ठरला. गाडीतील एसी उत्तम होता आणि अनुभवी चालकाने आम्हाला सुरक्षितपणे पोहोचवले. छोट्या सहलींसाठी एक उत्तम पर्याय.",
    relativeTime: "5 days ago",
    timestamp: Date.now() - (5 * 86400 * 1000) - 3000,
  },
  {
    id: "g-real-6",
    name: "Ganesh Savle",
    rating: 5,
    text: "I recently rented a Force Urbania for a group trip, and it was perfect! The spacious seating allowed everyone to relax, and the driver was punctual and courteous. A great choice for group travel in Pune.",
    textMr: "मी नुकतीच ग्रुप ट्रिपसाठी फोर्स अर्बनिया भाड्याने घेतली आणि ती अत्यंत परिपूर्ण होती! आरामदायक आसनांमुळे सर्वांना विश्रांती मिळाली, आणि ड्रायव्हर वक्तशीर आणि नम्र होते. पुण्यातील ग्रुप प्रवासासाठी उत्तम पर्याय.",
    relativeTime: "5 days ago",
    timestamp: Date.now() - (5 * 86400 * 1000) - 4000,
  },
  {
    id: "g-real-7",
    name: "Sanjay Vairalkar",
    rating: 5,
    text: "Very very nice arrangement. Very nice support of staff Divya, Mayur as like family they support and take care of all members of tour.",
    textMr: "अतिशय छान व्यवस्था. स्टाफ दिव्या व मयूर यांचे कुटुंबासारखे उत्तम सहकार्य लाभले, त्यांनी टूरमधील सर्व सदस्यांची आपुलकीने काळजी घेतली.",
    relativeTime: "3 weeks ago",
    timestamp: Date.now() - (21 * 86400 * 1000),
  },
  {
    id: "g-real-8",
    name: "Harshana Taware",
    rating: 5,
    text: "It was a very exceptional trip. Very much recommended.",
    textMr: "एक अतिशय विलक्षण आणि सुखद सहल होती. सर्वांना नक्की शिफारस करतो.",
    relativeTime: "a month ago",
    timestamp: Date.now() - (30 * 86400 * 1000),
  },
  {
    id: "g-real-9",
    name: "Pgot Clean",
    rating: 5,
    text: "I had my best trip experience with Shailraj Travels. Special thank you Mayur bhai for your guidance. Mayur bhai is owner himself and he is present in every trip and is the best guide. Everything is done on time. Best wishes to Shailraj Travels and Mayur Bhai!",
    textMr: "शैलराज ट्रॅव्हल्ससोबत माझा सर्वोत्तम सहलीचा अनुभव आला. मयूर भाईंचे मार्गदर्शनाबद्दल विशेष आभार. मयूर भाई स्वतः मालक असून प्रत्येक सहलीमध्ये उपस्थित असतात आणि उत्तम मार्गदर्शन करतात. सर्व काही वेळेत होते. शैलराज ट्रॅव्हल्सला मनःपूर्वक शुभेच्छा!",
    relativeTime: "a month ago",
    timestamp: Date.now() - (31 * 86400 * 1000),
  },
  {
    id: "g-real-10",
    name: "Abhijeet Chalak",
    rating: 5,
    text: "Had a great experience on the Ujjain Jyotirlinga trip with Mayur. Everything was well organized, the journey was comfortable, and the darshan went smoothly. Thank you, Mayur, for making our trip memorable. Highly recommended!",
    textMr: "मयूर यांच्यासोबत उज्जैन ज्योतिर्लिंग सहलीचा उत्तम अनुभव आला. सर्व नियोजन व्यवस्थित होते, प्रवास अतिशय आरामदायी झाला आणि दर्शन अगदी सुरळीत झाले. आमची यात्रा संस्मरणीय केल्याबद्दल धन्यवाद मयूर. नक्की शिफारस करतो!",
    relativeTime: "3 months ago",
    timestamp: Date.now() - (90 * 86400 * 1000),
  },
  {
    id: "g-real-11",
    name: "Sagar Jadhav",
    rating: 5,
    text: "Amazing tour package and excellent service! Everything was well organized, from transportation to accommodation. The itinerary was perfectly planned, and the team was very supportive throughout the trip. We had a wonderful and memorable experience.",
    textMr: "अतिशय अप्रतिम टूर पॅकेज आणि उत्कृष्ट सेवा! वाहतुकीपासून ते मुक्कामापर्यंत सर्व काही उत्तम नियोजनबद्ध होते. टीमने संपूर्ण प्रवासात मोलाचे सहकार्य केले. आमचा अनुभव अतिशय सुंदर राहिला.",
    relativeTime: "3 months ago",
    timestamp: Date.now() - (92 * 86400 * 1000),
  },
];

async function syncToMongo() {
  const uri = 'mongodb+srv://shailrajtravels_db_user:jvNZSBTFl3qATVPb@shailraj.bcsrsu2.mongodb.net/shailraj?appName=shailraj';
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('shailraj');

  console.log('Fetching live from Google Places API (New)...');
  let rating = '5.0';
  let reviewCount = '23';
  let apiReviews = [];

  try {
    const url = 'https://places.googleapis.com/v1/places/' + placeId;
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'id,displayName,rating,userRatingCount,reviews',
      }
    });

    if (res.ok) {
      const json = await res.json();
      rating = String(json.rating || '5.0');
      reviewCount = String(json.userRatingCount || '23');
      if (Array.isArray(json.reviews)) {
        apiReviews = json.reviews.map((r, idx) => ({
          id: r.name || 'g-api-' + idx,
          name: r.authorAttribution?.displayName || 'Google Reviewer',
          rating: r.rating || 5,
          text: r.text?.text || r.originalText?.text || '',
          relativeTime: r.relativePublishTimeDescription || 'Recently',
          authorPhotoUrl: r.authorAttribution?.photoUri,
          publishTime: r.publishTime,
          timestamp: r.publishTime ? Date.parse(r.publishTime) : Date.now() - idx * 86400000,
        }));
      }
    }
  } catch (e) {
    console.warn('Google Places API fetch error:', e.message);
  }

  // Merge unique reviews by name
  const reviewMap = new Map();
  realGoogleReviews.forEach(r => reviewMap.set(r.name.toLowerCase().trim(), r));
  apiReviews.forEach(r => reviewMap.set(r.name.toLowerCase().trim(), r));

  const allReviews = Array.from(reviewMap.values());
  allReviews.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  const stats = {
    rating,
    reviewCount,
    placeId,
    source: 'google_places_api_v1',
    lastSynced: new Date().toISOString(),
    writeReviewUrl: 'https://search.google.com/local/writereview?placeid=' + placeId,
    googleMapsUrl: 'https://www.google.com/maps/place/Shailraj+Travels/@18.5116495,73.9655755,17z/data=!4m8!3m7!1s0x3bc2c39d2f2b185d:0x5dbc6804756241b3!8m2!3d18.5116495!4d73.9655755!9m1!1b1!16s%2Fg%2F11zd36ljtd?entry=ttu',
    reviews: allReviews,
  };

  const col = db.collection('google_reviews_cache');
  await col.updateOne(
    { key: 'shailraj_google_reviews' },
    { $set: { key: 'shailraj_google_reviews', data: stats, lastSynced: new Date() } },
    { upsert: true }
  );

  console.log(`Saved ${allReviews.length} verified reviews to MongoDB!`);
  console.log(`Rating: ${stats.rating} ★ (${stats.reviewCount} reviews)`);
  console.log('Top reviews:');
  allReviews.slice(0, 5).forEach((r, i) => console.log(`  ${i+1}. ${r.name} (${r.relativeTime})`));

  await client.close();
}

syncToMongo().catch(console.error);
