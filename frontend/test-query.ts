import { mongoAdapter } from './src/backend/shared/database/MongoAdapter.js';

async function query() {
    try {
        const db = await mongoAdapter.getDbAsync("cluster1");
        const toursCount = await db.collection("tours").countDocuments();
        console.log("Tours count:", toursCount);
        
        const packagesCount = await db.collection("packages").countDocuments();
        console.log("Packages count:", packagesCount);
        
        const auditCount = await db.collection("audit_logs").countDocuments();
        console.log("Audit Logs count:", auditCount);
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

query();
