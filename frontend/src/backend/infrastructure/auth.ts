import { createServerFn } from '@tanstack/react-start';
import { logAuditAction } from '@/backend/shared/audit';
import { getAdminToken, getEnv } from '@/backend/infrastructure/token';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const adminAuthSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().optional(),
  token: z.string().optional(),
});

export const verifyAdminFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => adminAuthSchema.parse(data))
  .handler(async ({ data }) => {
    const isDev = process.env.NODE_ENV === "development";

    const validToken = getAdminToken();
    if (!validToken) {
      console.error("[Auth] getAdminToken() returned null — ADMIN_PASSWORD is not set in .env");
      throw new Error("Admin credentials not configured on server.");
    }

    if (data.token) {
      if (data.token === validToken) return { success: true, token: validToken };
      return { success: false };
    }

    if (data.email && data.password) {
      const expectedEmail = getEnv("ADMIN_EMAIL") || "khudeshivam@gmail.com";
      const hash = getEnv("ADMIN_PASSWORD_HASH");
      const plain = getEnv("ADMIN_PASSWORD");

      let isMatch = false;
      if (hash) {
        isMatch = bcrypt.compareSync(data.password, hash);
      } else if (plain) {
        isMatch = data.password === plain;
      }

      const emailMatch = data.email === expectedEmail;
      if (isDev) {
        console.log(`[Auth] Login attempt — emailMatch:${emailMatch} passwordMatch:${isMatch} hasPassword:${!!plain}`);
      }

      if (emailMatch && isMatch) {
        await logAuditAction({
          data: {
            action: "Admin Login",
            entityType: "System",
            details: `Successful login for ${data.email}`,
          },
        });
        return { success: true, token: validToken };
      }
      return { success: false, message: "Invalid email or password." };
    }

    return { success: false };
  });

export const verifyAdminPasswordFn = createServerFn({ method: "POST" })
  .validator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const expectedEmail = getEnv("ADMIN_EMAIL") || "khudeshivam@gmail.com";
    const hash = getEnv("ADMIN_PASSWORD_HASH");
    const plain = getEnv("ADMIN_PASSWORD");

    let isMatch = false;
    if (hash) {
      isMatch = bcrypt.compareSync(data.password, hash);
    } else if (plain) {
      isMatch = data.password === plain;
    }

    if (isMatch) {
      await logAuditAction({
        data: {
          action: "Unlock Invoice",
          entityType: "Invoice", // AuditLogEntry entityType includes "Invoice"
          details: `Invoice unlocked using admin password for ${expectedEmail}`,
        },
      });
      return { success: true };
    }

    return { success: false, message: "Incorrect Admin Password" };
  });
