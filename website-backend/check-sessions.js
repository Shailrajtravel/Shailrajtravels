const { MongoClient } = require('mongodb');

const newUri = "mongodb+srv://shailrajtravels_db_user:jvNZSBTFl3qATVPb@shailraj.bcsrsu2.mongodb.net/shailraj?appName=shailraj";

async function checkSessions() {
  const client = new MongoClient(newUri);
  try {
    await client.connect();
    const db = client.db('shailraj');
    
    const sessions = await db.collection('openwa_sessions').find({}).toArray();
    console.log("Sessions:", JSON.stringify(sessions, null, 2));
    
    const webhooks = await db.collection('openwa_webhooks').find({}).toArray();
    console.log("Webhooks:", JSON.stringify(webhooks, null, 2));
    
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

checkSessions();
