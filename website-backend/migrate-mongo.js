const { MongoClient } = require('mongodb');

const oldUri = "mongodb+srv://shailrajtravels:shailrajtravels9999@cluster0.5jmdhjm.mongodb.net/shailraj?appName=Cluster0";
const newUri = "mongodb+srv://shailrajtravels_db_user:jvNZSBTFl3qATVPb@shailraj.bcsrsu2.mongodb.net/shailraj?appName=shailraj";

async function migrate() {
  const oldClient = new MongoClient(oldUri);
  const newClient = new MongoClient(newUri);
  
  try {
    await oldClient.connect();
    await newClient.connect();
    console.log("Connected to both databases for migration...");
    
    const oldDb = oldClient.db('shailraj');
    const newDb = newClient.db('shailraj');
    
    const collections = await oldDb.listCollections().toArray();
    
    for (const collInfo of collections) {
      const collName = collInfo.name;
      
      // Skip the huge offline_queue collection (511MB) so we don't bring the bloated junk to the new DB!
      // We also skip baileys_keys to start the WhatsApp connection fresh.
      if (collName === 'offline_queue' || collName === 'baileys_keys') {
        console.log(`Skipping ${collName} to save space!`);
        continue;
      }
      
      console.log(`Migrating collection: ${collName}`);
      const oldColl = oldDb.collection(collName);
      const newColl = newDb.collection(collName);
      
      // Clear target collection before insertion to avoid duplicates
      await newColl.deleteMany({});
      
      let attempts = 0;
      let success = false;
      while (attempts < 3 && !success) {
        try {
          const cursor = oldColl.find({});
          let batch = [];
          let totalCopied = 0;
          
          while (await cursor.hasNext()) {
            const doc = await cursor.next();
            batch.push(doc);
            
            if (batch.length === 500) {
              await newColl.insertMany(batch);
              totalCopied += batch.length;
              batch = [];
            }
          }
          
          if (batch.length > 0) {
            await newColl.insertMany(batch);
            totalCopied += batch.length;
          }
          
          console.log(` -> Copied ${totalCopied} documents.`);
          success = true;
        } catch (e) {
          attempts++;
          console.error(` -> Attempt ${attempts} failed for ${collName}: ${e.message}`);
          if (attempts >= 3) {
            throw e;
          }
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
    
    console.log("\nMigration Complete Successfully!");
  } catch (err) {
    console.error("Migration Error:", err);
  } finally {
    await oldClient.close();
    await newClient.close();
  }
}

migrate();
