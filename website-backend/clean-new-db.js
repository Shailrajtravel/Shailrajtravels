const { MongoClient } = require('mongodb');

const newUri = "mongodb+srv://shailrajtravels_db_user:jvNZSBTFl3qATVPb@shailraj.bcsrsu2.mongodb.net/shailraj?appName=shailraj";

async function cleanNewDb() {
  const newClient = new MongoClient(newUri);
  try {
    await newClient.connect();
    const newDb = newClient.db('shailraj');
    
    console.log("Dropping offline_queue in new DB to free up space...");
    await newDb.collection('offline_queue').drop();
    console.log("Successfully dropped offline_queue.");
    
  } catch (err) {
    if (err.codeName === 'NamespaceNotFound') {
      console.log("offline_queue does not exist.");
    } else {
      console.error("Error:", err);
    }
  } finally {
    await newClient.close();
  }
}

cleanNewDb();
