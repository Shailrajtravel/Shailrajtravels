// Hardcoded defaults — bcrypt hash of "Shailraj@123"
const DEFAULT_HASH = "$2b$10$fkJe41AG.J0AHaG/UNKojOO8hnFX5j2TCIwSCRGC07CgD7gI1hzgi";
const DEFAULT_EMAIL = "khudeshivam@gmail.com";

export function getAdminToken() {
  const pwdOrHash = process.env.VITE_ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD || DEFAULT_HASH;
  const email = process.env.VITE_ADMIN_EMAIL || process.env.ADMIN_EMAIL || DEFAULT_EMAIL;
  if (!pwdOrHash) {
    console.warn("Neither ADMIN_PASSWORD_HASH nor ADMIN_PASSWORD is set in environment variables");
    return null;
  }
  return Buffer.from(email + ":" + pwdOrHash + "_ADMIN_SALT").toString("base64");
}
