const { MongoClient } = require('mongodb');
require('dotenv').config({ path: 'website-backend/.env' });

async function clean() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db('shailraj');

  // Remove sample/fake reviews
  const fakeNames = ['Dattatray Shinde', 'Pravin Patil'];
  const res = await db.collection('reviews').deleteMany({ name: { $in: fakeNames } });
  console.log(`Deleted ${res.deletedCount} fake reviews from 'reviews' collection.`);

  // Also remove from any override collections or cache
  await db.collection('reviews_override')?.deleteMany?.({});
  
  const remaining = await db.collection('reviews').find({}).toArray();
  console.log('Remaining reviews in DB:', remaining.map(r => r.name));

  await client.close();
}

clean().catch(console.error);

