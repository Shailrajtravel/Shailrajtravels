const { MongoClient } = require('mongodb');

const oldUri = "mongodb+srv://shailrajtravels:shailrajtravels9999@cluster0.5jmdhjm.mongodb.net/shailraj?appName=Cluster0";
const newUri = "mongodb+srv://shailrajtravels_db_user:jvNZSBTFl3qATVPb@shailraj.bcsrsu2.mongodb.net/shailraj?appName=shailraj";

async function testConnections() {
  console.log("Testing Old DB Connection...");
  const oldClient = new MongoClient(oldUri);
  try {
    await oldClient.connect();
    console.log("Old DB Connected Successfully!");
  } catch (err) {
    console.error("Old DB Error:", err.message);
  } finally {
    await oldClient.close();
  }

  console.log("\nTesting New DB Connection...");
  const newClient = new MongoClient(newUri);
  try {
    await newClient.connect();
    console.log("New DB Connected Successfully!");
  } catch (err) {
    console.error("New DB Error:", err.message);
  } finally {
    await newClient.close();
  }
}

testConnections();
