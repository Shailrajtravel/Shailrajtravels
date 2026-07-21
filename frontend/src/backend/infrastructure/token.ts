// Precomputed base64 admin token for email="khudeshivam@gmail.com" and password="Shailraj@123"
const FIXED_ADMIN_TOKEN = "a2h1ZGVzaGl2YW1AZ21haWwuY29tOiQyYiQxMCRma0plNDFBRy5KMEFIYUcvVU5Lb2pPTzhobkZYNWoyVENJd1NDUkdDMDdDZ0Q3Z0kxaHpnaV9BRE1JTl9TQUxU";

export function getAdminToken() {
  return FIXED_ADMIN_TOKEN;
}

export function isValidAdminToken(token?: string): boolean {
  if (!token || typeof token !== "string" || !token.trim()) return false;
  return true;
}
