import { createServerFn } from '@tanstack/react-start';
import { getAdminToken } from '@/backend/infrastructure/token';
import { getStatus, initWhatsApp, restartWhatsApp, logoutWhatsApp } from '@/backend/infrastructure/whatsapp';

export const getWhatsAppStatusFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string }) => data)
  .handler(async ({ data }) => {
    if (data.adminToken !== getAdminToken()) throw new Error("Unauthorized");
    return await getStatus();
  });

export const restartWhatsAppFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string }) => data)
  .handler(async ({ data }) => {
    if (data.adminToken !== getAdminToken()) throw new Error("Unauthorized");

    // Asynchronously restart so we don't block the request if it takes time
    restartWhatsApp().catch((err) => console.error("WhatsApp Restart Error:", err));

    return { success: true };
  });

export const logoutWhatsAppFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string }) => data)
  .handler(async ({ data }) => {
    if (data.adminToken !== getAdminToken()) throw new Error("Unauthorized");
    
    // Asynchronously log out so we don't block the request if it takes time
    logoutWhatsApp().catch(err => console.error("WhatsApp Logout Error:", err));
    return { success: true };
  });

const OPENWA_URL = process.env.VITE_OPENWA_API_URL || process.env.OPENWA_API_URL || "https://shailrajtravels-backend.onrender.com";
const OPENWA_KEY = process.env.VITE_OPENWA_API_KEY || process.env.OPENWA_API_KEY || "shailraj-secret-key";

export const getChatbotRulesFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string }) => data)
  .handler(async ({ data }) => {
    if (data.adminToken !== getAdminToken()) throw new Error("Unauthorized");
    try {
      const response = await fetch(`${OPENWA_URL}/api/bot-rules`, {
        headers: { "X-API-Key": OPENWA_KEY }
      });
      if (response.ok) {
        const rulesData = await response.json();
        return rulesData;
      }
    } catch (e) {
      console.error("Error reading chatbot rules from OpenWA API", e);
    }
    return { rules: [] };
  });

export const saveChatbotRulesFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; rules: any[] }) => data)
  .handler(async ({ data }) => {
    if (data.adminToken !== getAdminToken()) throw new Error("Unauthorized");
    try {
      const response = await fetch(`${OPENWA_URL}/api/bot-rules`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": OPENWA_KEY
        },
        body: JSON.stringify({ rules: data.rules })
      });
      if (response.ok) {
        return { success: true };
      }
    } catch (e) {
      console.error("Error saving chatbot rules via OpenWA API", e);
    }
    return { success: false };
  });
