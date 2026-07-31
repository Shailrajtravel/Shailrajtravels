const { MongoClient } = require('mongodb');

const oldUri = "mongodb+srv://shailrajtravels:shailrajtravels9999@cluster0.5jmdhjm.mongodb.net/shailraj?appName=Cluster0";

async function checkSizes() {
  const oldClient = new MongoClient(oldUri);
  try {
    await oldClient.connect();
    const db = oldClient.db('shailraj');
    
    const collections = await db.listCollections().toArray();
    let totalSize = 0;
    
    console.log("Collection Sizes in Old DB:");
    for (const collInfo of collections) {
      const collName = collInfo.name;
      const stats = await db.command({ collStats: collName });
      
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      totalSize += stats.size;
      
      console.log(`- ${collName}: ${sizeMB} MB (${stats.count} documents)`);
    }
    
    console.log(`\nTotal Size: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await oldClient.close();
  }
}

checkSizes();
