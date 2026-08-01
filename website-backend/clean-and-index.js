const { MongoClient } = require('mongodb');

const clusters = [
  { name: 'Cluster 1 (Primary)', uri: "mongodb+srv://shailrajtravels:shailrajtravels9999@cluster0.5jmdhjm.mongodb.net/shailraj?appName=Cluster0" },
  { name: 'Cluster 2 (Secondary)', uri: "mongodb+srv://shailrajtravels_db_user:jvNZSBTFl3qATVPb@shailraj.bcsrsu2.mongodb.net/shailraj?appName=shailraj" }
];

async function cleanAndIndex() {
  for (const cluster of clusters) {
    console.log(`\n======================================================`);
    console.log(`🔌 Connecting to ${cluster.name}...`);
    const client = new MongoClient(cluster.uri);
    
    try {
      await client.connect();
      const db = client.db('shailraj');
      
      // 1. Clean offline_queue
      console.log(`\n🧹 Checking 'offline_queue'...`);
      const offlineQueue = db.collection('offline_queue');
      const queueCount = await offlineQueue.countDocuments({});
      console.log(` -> Found ${queueCount} old/stale documents in offline_queue.`);
      if (queueCount > 0) {
        const res = await offlineQueue.deleteMany({});
        console.log(` -> Deleted ${res.deletedCount} documents from offline_queue to free up space!`);
      }
      // Create TTL Index (3 days = 259200 seconds)
      await offlineQueue.createIndex({ createdAt: 1 }, { expireAfterSeconds: 259200, name: 'idx_offline_queue_ttl' });
      console.log(` -> Created 3-day auto-delete TTL Index on offline_queue!`);

      // 2. Clean openwa_received_webhooks
      console.log(`\n🧹 Checking 'openwa_received_webhooks'...`);
      const receivedWebhooks = db.collection('openwa_received_webhooks');
      const webhookCount = await receivedWebhooks.countDocuments({});
      console.log(` -> Found ${webhookCount} old debug logs in openwa_received_webhooks.`);
      if (webhookCount > 0) {
        const res = await receivedWebhooks.deleteMany({});
        console.log(` -> Deleted ${res.deletedCount} logs from openwa_received_webhooks to free up space!`);
      }
      // Create TTL Index (1 day = 86400 seconds)
      await receivedWebhooks.createIndex({ createdAt: 1 }, { expireAfterSeconds: 86400, name: 'idx_webhooks_ttl' });
      console.log(` -> Created 24-hour auto-delete TTL Index on openwa_received_webhooks!`);

    } catch (err) {
      console.error(`❌ Error on ${cluster.name}:`, err.message);
    } finally {
      await client.close();
      console.log(`🔒 Disconnected from ${cluster.name}.`);
    }
  }
  console.log(`\n✨ Database cleaning and auto-cleaning TTL setup completed successfully! ✨`);
}

cleanAndIndex();
