// @ts-ignore - Vinxi is a transitive dependency from TanStack Start
import { getEvent } from 'vinxi/http';

export function getEnv(key: string): string | undefined {
  // 1. Try standard process.env
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key];
  }
  
  // 2. Try Cloudflare Workers env via Vinxi event context
  try {
    const event = getEvent();
    if (event && event.context && event.context.cloudflare && event.context.cloudflare.env) {
      return event.context.cloudflare.env[key];
    }
  } catch (e) {
    // getEvent() might throw if not inside a request context
  }
  
  return undefined;
}

export function getAdminToken() {
  const pwdOrHash = getEnv("ADMIN_PASSWORD_HASH") || getEnv("ADMIN_PASSWORD");
  const email = getEnv("ADMIN_EMAIL") || "khudeshivam@gmail.com";
  if (!pwdOrHash) {
    console.warn("Neither ADMIN_PASSWORD_HASH nor ADMIN_PASSWORD is set in environment variables");
    return null;
  }
  return Buffer.from(email + ":" + pwdOrHash + "_ADMIN_SALT").toString("base64");
}
