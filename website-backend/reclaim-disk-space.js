const { MongoClient } = require('mongodb');

const clusters = [
  { name: 'Cluster 1 (Primary - oldUri)', uri: "mongodb+srv://shailrajtravels:shailrajtravels9999@cluster0.5jmdhjm.mongodb.net/shailraj?appName=Cluster0" },
  { name: 'Cluster 2 (Secondary - newUri)', uri: "mongodb+srv://shailrajtravels_db_user:jvNZSBTFl3qATVPb@shailraj.bcsrsu2.mongodb.net/shailraj?appName=shailraj" }
];

async function reclaimDiskSpace() {
  for (const cluster of clusters) {
    console.log(`\n======================================================`);
    console.log(`🔌 Connecting to ${cluster.name}...`);
    const client = new MongoClient(cluster.uri);
    
    try {
      await client.connect();
      const db = client.db('shailraj');
      
      // 1. DROP offline_queue to completely reclaim disk storage space
      console.log(`\n🧹 Dropping 'offline_queue' to wipe out allocated disk files...`);
      try {
        await db.collection('offline_queue').drop();
        console.log(` -> Successfully dropped 'offline_queue' collection! Disk space reclaimed!`);
      } catch (err) {
        console.log(` -> Note on offline_queue drop: ${err.message}`);
      }

      // Re-create offline_queue with clean indexes
      const offlineQueue = await db.createCollection('offline_queue');
      await offlineQueue.createIndex({ status: 1, queueType: 1, messageTimestamp: 1 }, { name: 'idx_status_queue_time' });
      await offlineQueue.createIndex({ sessionId: 1, messageId: 1 }, { unique: true, name: 'idx_session_msg_unique' });
      await offlineQueue.createIndex({ createdAt: 1 }, { expireAfterSeconds: 259200, name: 'idx_offline_queue_ttl' });
      console.log(` -> Recreated fresh 'offline_queue' with 3-day TTL and operational indexes (size reset to ~36 KB)!`);

      // 2. DROP openwa_received_webhooks to completely reclaim disk storage space
      console.log(`\n🧹 Dropping 'openwa_received_webhooks' to wipe out allocated disk files...`);
      try {
        await db.collection('openwa_received_webhooks').drop();
        console.log(` -> Successfully dropped 'openwa_received_webhooks' collection! Disk space reclaimed!`);
      } catch (err) {
        console.log(` -> Note on openwa_received_webhooks drop: ${err.message}`);
      }

      // Re-create openwa_received_webhooks with clean index
      const receivedWebhooks = await db.createCollection('openwa_received_webhooks');
      await receivedWebhooks.createIndex({ createdAt: 1 }, { expireAfterSeconds: 86400, name: 'idx_webhooks_ttl' });
      console.log(` -> Recreated fresh 'openwa_received_webhooks' with 24-hour TTL index (size reset to ~36 KB)!`);

    } catch (err) {
      console.error(`❌ Error on ${cluster.name}:`, err.message);
    } finally {
      await client.close();
      console.log(`🔒 Disconnected from ${cluster.name}.`);
    }
  }
  console.log(`\n✨ Physical disk storage reclamation completed! Your database cluster size is now completely reset! ✨`);
}

reclaimDiskSpace();
