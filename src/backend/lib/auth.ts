import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { logAuditAction } from "./audit";
import { getAdminToken } from "./token";
import { rateLimiters } from "./redis";
import bcrypt from "bcryptjs";
import { z } from "zod";

const adminAuthSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().optional(),
  token: z.string().optional(),
});

export const verifyAdminFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => adminAuthSchema.parse(data))
  .handler(async ({ data }) => {
    // Rate Limiting Check
    if (rateLimiters.login) {
      const req = getRequest();
      const ip =
        req?.headers.get("x-forwarded-for") ||
        req?.headers.get("x-real-ip") ||
        data.email ||
        "unknown";
      const { success } = await rateLimiters.login.limit(`login:${ip}`);
      if (!success) {
        throw new Error("Too many login attempts. Please try again later.");
      }
    }

    const validToken = getAdminToken();
    if (!validToken) throw new Error("Admin credentials not configured on server.");

    if (data.token) {
      if (data.token === validToken) return { success: true, token: validToken };
      return { success: false };
    }

    if (data.email && data.password) {
      const expectedEmail = process.env.ADMIN_EMAIL || "khudeshivam@gmail.com";
      const hash = process.env.ADMIN_PASSWORD_HASH;

      // Fallback to plain text comparison if no hash exists (for backward compatibility during transition)
      let isMatch = false;
      if (hash) {
        isMatch = bcrypt.compareSync(data.password, hash);
      } else if (process.env.ADMIN_PASSWORD) {
        isMatch = data.password === process.env.ADMIN_PASSWORD;
      }

      if (data.email === expectedEmail && isMatch) {
        await logAuditAction({
          data: {
            action: "Admin Login",
            entityType: "System",
            details: `Successful login for ${data.email}`,
          },
        });
        return { success: true, token: validToken };
      }
      return { success: false, message: "Invalid email or password" };
    }

    return { success: false };
  });
