const { MongoClient } = require('mongodb');
require('dotenv').config({ path: 'website-backend/.env' });

const uri = process.env.MONGO_URI;

async function check() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('shailraj');
  const blogs = await db.collection('custom_blogs').find({ slug: /ujjain/ }).toArray();
  for (const b of blogs) {
    console.log('Slug:', b.slug);
    console.log('Author:', b.author);
    console.log('AuthorId:', b.authorId);
    console.log('Title:', b.title);
    console.log('FocusKeyword:', b.focusKeyword);
    console.log('-------------------------');
  }
  await client.close();
}
check().catch(console.error);
