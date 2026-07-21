const { MongoClient } = require('mongodb');

const uri1 = "mongodb+srv://shailrajtravels:shailrajtravels9999@cluster0.5jmdhjm.mongodb.net/shailraj?appName=Cluster0";
const uri2 = "mongodb://shailrajtravels:shailrajtravels9999@ac-csvcnp6-shard-00-00.5jmdhjm.mongodb.net:27017,ac-csvcnp6-shard-00-01.5jmdhjm.mongodb.net:27017,ac-csvcnp6-shard-00-02.5jmdhjm.mongodb.net:27017/shailraj?ssl=true&replicaSet=atlas-9w1vmv-shard-0&authSource=admin&retryWrites=true&w=majority";

async function test(uri, name) {
    console.log(`Testing ${name}...`);
    try {
        const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
        await client.connect();
        await client.db().command({ ping: 1 });
        console.log(`${name} SUCCESS`);
        await client.close();
    } catch (e) {
        console.error(`${name} ERROR:`, e.message);
    }
}

async function run() {
    await test(uri1, "URI 1 (.env)");
    await test(uri2, "URI 2 (direct seed)");
}

run();
