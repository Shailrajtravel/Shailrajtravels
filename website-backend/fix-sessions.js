const { MongoClient } = require('mongodb');

const newUri = "mongodb+srv://shailrajtravels_db_user:jvNZSBTFl3qATVPb@shailraj.bcsrsu2.mongodb.net/shailraj?appName=shailraj";

async function fixSessions() {
  const client = new MongoClient(newUri);
  try {
    await client.connect();
    const db = client.db('shailraj');
    
    // 1. Get the session IDs
    const sessions = await db.collection('openwa_sessions').find({}).toArray();
    const defaultSession = sessions.find(s => s.name === 'default');
    const shailrajBot = sessions.find(s => s.name === 'shailraj-bot');
    
    if (defaultSession && shailrajBot) {
      console.log("Found both 'default' and 'shailraj-bot' sessions.");
      
      // 2. Update all webhooks to point to 'shailraj-bot'
      const updateResult = await db.collection('openwa_webhooks').updateMany(
        { sessionId: defaultSession.id },
        { $set: { sessionId: shailrajBot.id } }
      );
      console.log(`Updated ${updateResult.modifiedCount} webhooks to point to shailraj-bot.`);
      
      // 3. Delete the 'default' session
      const deleteResult = await db.collection('openwa_sessions').deleteOne({ _id: defaultSession._id });
      console.log(`Deleted 'default' session. Removed ${deleteResult.deletedCount} session.`);
      
      console.log("Fix complete! You now only have 'shailraj-bot' with all webhooks properly attached.");
    } else {
      console.log("Could not find both sessions. No action taken.");
    }
    
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

fixSessions();
