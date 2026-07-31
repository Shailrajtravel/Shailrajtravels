const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://shailrajtravels:shailrajtravels9999@cluster0.5jmdhjm.mongodb.net/shailraj?appName=Cluster0";

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    
    const db = client.db('shailraj');
    const collections = await db.collections();
    
    console.log(`Found ${collections.length} collections.`);
    
    for (let collection of collections) {
      try {
        const stats = await db.command({ collStats: collection.collectionName });
        console.log(`Collection: ${collection.collectionName}`);
        console.log(` - Count: ${stats.count}`);
        console.log(` - Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
        console.log(` - Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
      } catch(e) {
        console.log(`Failed to get stats for ${collection.collectionName}`);
      }
    }

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();
