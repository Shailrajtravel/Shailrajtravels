export function getAdminToken() {
  const pwdOrHash = process.env.VITE_ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD || import.meta.env.VITE_ADMIN_PASSWORD_HASH;
  const email = process.env.VITE_ADMIN_EMAIL || process.env.ADMIN_EMAIL || import.meta.env.VITE_ADMIN_EMAIL || "khudeshivam@gmail.com";
  if (!pwdOrHash) {
    console.warn("Neither ADMIN_PASSWORD_HASH nor ADMIN_PASSWORD is set in environment variables");
    return null;
  }
  return Buffer.from(email + ":" + pwdOrHash + "_ADMIN_SALT").toString("base64");
}
