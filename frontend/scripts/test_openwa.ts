import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
import {
  initWhatsApp,
  getStatus,
  sendWhatsAppMessage,
} from "../src/backend/infrastructure/whatsapp";

async function runTests() {
  console.log("==================================");
  console.log("Starting OpenWA REST API Test Suite");
  console.log("==================================");
  console.log("");

  // 1. Service Check
  try {
    console.log("-> Running Test 1: Service Check");
    console.log("   (Verifying connection to standalone OpenWA server on port 2785)");
    
    // Add a 60 second timeout wrapper to initWhatsApp
    await Promise.race([
      initWhatsApp("shailraj-bot"),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout initializing WhatsApp via API (Is the OpenWA server running on port 2785?)")), 60000))
    ]);

    const status = getStatus();
    if (status.status !== "Connected") {
      throw new Error(`Client is in state: ${status.status}`);
    }
    console.log("   [PASS] API Gateway is reachable and session created!\n");
  } catch (err: any) {
    console.error("   [FAIL] Service Check Failed!");
    console.error(`          ${err.message}`);
    console.error("          -> Did you start OpenWA with 'npm run dev' in the OpenWA folder?");
    process.exit(1);
  }

  // 2. Messaging Check
  try {
    console.log("-> Running Test 2: Message Check");
    console.log("   (Note: If the session is not paired yet, this will gracefully fail with a 409 Conflict. This is expected!)");
    
    // Test sending to dummy number.
    const success = await sendWhatsAppMessage("919999999999", "Automated Self-Test Ping from Shailraj Server");
    
    if (success) {
      console.log("   [PASS] Successfully pinged the REST API with a message request!\n");
    } else {
      console.log("   [WARN] Message send returned false (Likely because you haven't scanned the QR yet). API is still reachable!\n");
    }
  } catch (err: any) {
    console.error("   [FAIL] Message Check Failed!");
    console.error(`          ${err.message}`);
    process.exit(1);
  }

  console.log("==================================");
  console.log("All Tests Passed (or gracefully skipped)!");
  console.log("==================================");
  process.exit(0);
}

runTests();
