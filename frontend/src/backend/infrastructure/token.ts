// Hardcoded defaults — bcrypt hash of "Shailraj@123"
const DEFAULT_HASH = "$2b$10$fkJe41AG.J0AHaG/UNKojOO8hnFX5j2TCIwSCRGC07CgD7gI1hzgi";
const DEFAULT_EMAIL = "khudeshivam@gmail.com";
const FIXED_ADMIN_TOKEN = Buffer.from(DEFAULT_EMAIL + ":" + DEFAULT_HASH + "_ADMIN_SALT").toString("base64");

export function getAdminToken() {
  return FIXED_ADMIN_TOKEN;
}
