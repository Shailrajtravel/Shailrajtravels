export function getAdminToken() {
  const pwd = process.env.ADMIN_PASSWORD;
  const email = process.env.ADMIN_EMAIL || "khudeshivam@gmail.com";
  if (!pwd) {
    console.warn("ADMIN_PASSWORD is not set in environment variables");
    return null;
  }
  return Buffer.from(email + ":" + pwd + "_ADMIN_SALT").toString("base64");
}
