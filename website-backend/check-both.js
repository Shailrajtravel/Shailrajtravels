const { MongoClient } = require('mongodb');

const oldUri = "mongodb+srv://shailrajtravels:shailrajtravels9999@cluster0.5jmdhjm.mongodb.net/shailraj?appName=Cluster0";
const newUri = "mongodb+srv://shailrajtravels_db_user:jvNZSBTFl3qATVPb@shailraj.bcsrsu2.mongodb.net/shailraj?appName=shailraj";

async function checkBothDbs() {
  const oldClient = new MongoClient(oldUri);
  const newClient = new MongoClient(newUri);
  
  try {
    await oldClient.connect();
    await newClient.connect();
    
    const oldSessions = await oldClient.db('shailraj').collection('openwa_sessions').find({}).toArray();
    console.log("OLD DB Sessions:", oldSessions.map(s => s.name));
    
    const newSessions = await newClient.db('shailraj').collection('openwa_sessions').find({}).toArray();
    console.log("NEW DB Sessions:", newSessions.map(s => s.name));
    
  } catch(e) {
    console.error(e);
  } finally {
    await oldClient.close();
    await newClient.close();
  }
}
checkBothDbs();
