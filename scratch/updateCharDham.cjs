const { MongoClient } = require("mongodb");
const uri =
  "mongodb://sanketsatras2131_db_user:P6vTV7cXAJFEauRB@ac-xn6ryey-shard-00-00.kj85wan.mongodb.net:27017,ac-xn6ryey-shard-00-01.kj85wan.mongodb.net:27017,ac-xn6ryey-shard-00-02.kj85wan.mongodb.net:27017/shailraj?replicaSet=atlas-n1co66-shard-0&ssl=true&authSource=admin&appName=Cluster0";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("shailraj");
    const collection = db.collection("tours");
    const result = await collection.updateOne(
      { title: /Char Dham/i },
      { $set: { "heroContent.image": "/images/chardham.jpg" } },
    );
    console.log("Updated", result.modifiedCount);
  } finally {
    await client.close();
  }
}
run();
