import { mongoAdapter } from './src/backend/shared/database/MongoAdapter.js';

async function test() {
    console.log("Testing MongoAdapter...");
    try {
        const db = await mongoAdapter.getDbAsync("cluster1");
        console.log("DB received from MongoAdapter:");
        console.log("DB name:", db.databaseName);
        console.log("Is it LocalDb?", db.constructor.name === "LocalDb");
        
        const stats = await mongoAdapter.getStorageStats("cluster1");
        console.log("Stats:", stats);
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
