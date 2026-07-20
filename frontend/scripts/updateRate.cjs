const { MongoClient, ObjectId } = require('mongodb'); 
async function run() { 
  const client = new MongoClient('mongodb+srv://shailrajtravels:shailrajtravels9999@cluster0.5jmdhjm.mongodb.net/shailraj?appName=Cluster0'); 
  await client.connect(); 
  const db = client.db('shailraj'); 
  const res = await db.collection('bookings_2026').updateOne(
    { _id: new ObjectId('6a5922d0e97f580342bddf88') }, 
    { $set: { 'invoiceCustomData.rate': 5000 } }
  ); 
  console.log(res); 
  await client.close(); 
} 
run().catch(console.error);
