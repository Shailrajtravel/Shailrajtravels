const { MongoClient } = require('mongodb');
require('dotenv').config({ path: 'website-backend/.env' });

async function fixBrokenImages() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db('shailraj');

  const ujjainImg = "https://res.cloudinary.com/dquecn5qj/image/upload/v1789154040/blogs/spy42xnlvgry5xoznqzn.png";
  const ashtaImg = "https://res.cloudinary.com/dquecn5qj/image/upload/v1792764848/blogs/avej2lsveggdqan1spor.png";

  const collections = ['tours', 'packages', 'trip_options', 'custom_blogs'];

  for (const colName of collections) {
    const col = db.collection(colName);
    
    // Update ujjain broken unsplash image
    const res1 = await col.updateMany(
      { image: { $regex: 'photo-1698223126743' } },
      { $set: { image: ujjainImg } }
    );
    const res1b = await col.updateMany(
      { 'heroContent.image': { $regex: 'photo-1698223126743' } },
      { $set: { 'heroContent.image': ujjainImg } }
    );
    const res1c = await col.updateMany(
      { featuredImage: { $regex: 'photo-1698223126743' } },
      { $set: { featuredImage: ujjainImg, ogImage: ujjainImg } }
    );

    // Update ashtavinayak broken unsplash image
    const res2 = await col.updateMany(
      { image: { $regex: 'photo-1567591414240' } },
      { $set: { image: ashtaImg } }
    );
    const res2b = await col.updateMany(
      { 'heroContent.image': { $regex: 'photo-1567591414240' } },
      { $set: { 'heroContent.image': ashtaImg } }
    );
    const res2c = await col.updateMany(
      { featuredImage: { $regex: 'photo-1567591414240' } },
      { $set: { featuredImage: ashtaImg, ogImage: ashtaImg } }
    );

    console.log(`Collection ${colName}:`, {
      ujjainFixed: res1.modifiedCount + res1b.modifiedCount + res1c.modifiedCount,
      ashtaFixed: res2.modifiedCount + res2b.modifiedCount + res2c.modifiedCount
    });
  }

  await client.close();
  console.log('Finished updating MongoDB images!');
}

fixBrokenImages().catch(console.error);

