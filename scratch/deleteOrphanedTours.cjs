const { MongoClient } = require('mongodb');

async function run() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
  console.log('Connecting to MongoDB...');
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('shailraj');
    const collection = db.collection('tours');

    const slugsToDelete = ['pandharpur-wari', 'shirdi-tour'];

    const result = await collection.deleteMany({
      slug: { $in: slugsToDelete }
    });

    console.log(`Deleted ${result.deletedCount} orphaned tour documents for slugs: ${slugsToDelete.join(', ')}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

run();
