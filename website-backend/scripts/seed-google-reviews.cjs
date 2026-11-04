const { MongoClient } = require('mongodb');
require('dotenv').config({ path: 'website-backend/.env' });

const seedReviews = [
  {
    name: 'Abhijeet Chalak',
    rating: 5,
    textEn: 'Had a great experience on the Ujjain Jyotirlinga trip with Mayur. Everything was well organized, the journey was comfortable, and the darshan went smoothly. Thank you, Mayur, for making our trip memorable. Highly recommended!',
    textMr: 'मयूर यांच्यासोबत उज्जैन ज्योतिर्लिंग सहलीचा उत्तम अनुभव आला. सर्व नियोजन व्यवस्थित होते, प्रवास अतिशय आरामदायी झाला आणि दर्शन अगदी सुरळीत झाले. आमची यात्रा संस्मरणीय केल्याबद्दल धन्यवाद मयूर. नक्की शिफारस करतो!',
    date: new Date('2026-07-22T16:52:42.894Z'),
    source: 'google',
    relativePublishTimeDescription: '3 months ago',
    __v: 1
  },
  {
    name: 'Sagar Jadhav',
    rating: 5,
    textEn: 'Amazing tour package and excellent service! Everything was well organized, from transportation to accommodation. The itinerary was perfectly planned, and the team was very supportive throughout the trip. We had a wonderful and memorable experience.',
    textMr: 'अतिशय अप्रतिम टूर पॅकेज आणि उत्कृष्ट सेवा! वाहतुकीपासून ते मुक्कामापर्यंत सर्व काही उत्तम नियोजनबद्ध होते. टीमने संपूर्ण प्रवासात मोलाचे सहकार्य केले. आमचा अनुभव अतिशय सुंदर राहिला.',
    date: new Date('2026-07-22T13:39:53.570Z'),
    source: 'google',
    relativePublishTimeDescription: '3 months ago',
    __v: 1
  },
  {
    name: 'Shivam Khude',
    rating: 5,
    textEn: 'Best pilgrimage travel agency in Pune! We booked Ashtavinayak Yatra with family. Chauffeur was very polite, Force Urbania was immaculate and comfortable for parents.',
    textMr: 'पुण्यातील सर्वोत्तम तीर्थयात्रा ट्रॅव्हल्स! आम्ही कुटुंबासह अष्टविनायक यात्रा बुक केली होती. ड्रायव्हर अतिशय नम्र होते आणि फोर्स अर्बनिया गाडी पालकांसाठी अत्यंत आरामदायी होती.',
    date: new Date('2026-10-22T13:22:01.734Z'),
    source: 'google',
    relativePublishTimeDescription: '2 weeks ago',
    __v: 1
  }
];

async function seed() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db('shailraj');
  
  for (const rev of seedReviews) {
    await db.collection('reviews').updateOne(
      { name: rev.name },
      { $set: rev },
      { upsert: true }
    );
  }
  const count = await db.collection('reviews').countDocuments();
  console.log('Verified reviews in DB now:', count);
  await client.close();
}
seed().catch(console.error);
