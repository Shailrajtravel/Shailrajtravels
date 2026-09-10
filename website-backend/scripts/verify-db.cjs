const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI || "mongodb+srv://shailrajtravels:shailrajtravels9999@cluster0.5jmdhjm.mongodb.net/shailraj?appName=Cluster0";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('shailraj');
    const trips = await db.collection('trip_options').find({}).toArray();
    const pkgs = await db.collection('packages').find({}).toArray();
    const tours = await db.collection('tours').find({}).toArray();
    
    console.log('=== DAILY SERVICES (trip_options: ' + trips.length + ') ===');
    trips.forEach((t, i) => console.log((i + 1) + '. ' + t.name + ' | ' + t.price + ' | Route: ' + (t.route || []).join(' -> ')));
    
    console.log('\n=== TOUR PACKAGES (packages: ' + pkgs.length + ') ===');
    pkgs.forEach((p, i) => console.log((i + 1) + '. ' + p.title + ' | ' + p.price + ' | ' + p.durationBadge + ' | Route: ' + (p.route || []).join(' -> ')));
    
    console.log('\n=== TOUR PAGES (tours: ' + tours.length + ') ===');
    tours.forEach((t, i) => console.log((i + 1) + '. ' + t.title + ' | /tours/' + t.slug + ' | Inclusions: ' + (t.packages?.[0]?.inclusions?.length || 0)));
  } finally {
    await client.close();
  }
}
run();
