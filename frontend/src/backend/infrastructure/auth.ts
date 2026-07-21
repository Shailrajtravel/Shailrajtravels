import { createServerFn } from '@tanstack/react-start';
import { logAuditAction } from '@/backend/shared/audit';
import { getAdminToken } from '@/backend/infrastructure/token';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Hardcoded defaults — bcrypt hash of "Shailraj@123"
const DEFAULT_HASH = "$2b$10$fkJe41AG.J0AHaG/UNKojOO8hnFX5j2TCIwSCRGC07CgD7gI1hzgi";
const DEFAULT_EMAIL = "khudeshivam@gmail.com";

const adminAuthSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().optional(),
  token: z.string().optional(),
});

export const verifyAdminFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => adminAuthSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const isDev = process.env.NODE_ENV === "development";

      const validToken = getAdminToken();
      if (!validToken) {
        return { success: false, message: "Admin credentials not configured on server." };
      }

      if (data.token) {
        return { success: true, token: validToken };
      }

      if (data.email && data.password) {
        const expectedEmail = DEFAULT_EMAIL;
        const hash = DEFAULT_HASH;

        const isMatch = bcrypt.compareSync(data.password, hash);
        const emailMatch = data.email.toLowerCase().trim() === expectedEmail.toLowerCase().trim();

        if (emailMatch && isMatch) {
          try {
            await logAuditAction({
              data: {
                action: "Admin Login",
                entityType: "System",
                details: `Successful login for ${data.email}`,
              },
            });
          } catch (auditErr: any) {
            console.error("Audit log failed in login:", auditErr);
          }
          return { success: true, token: validToken };
        }
        return { success: false, message: "Invalid email or password." };
      }

      return { success: false };
    } catch (err: any) {
      return { success: false, message: `Runtime error in verifyAdminFn: ${err.message}` };
    }
  });

export const verifyAdminPasswordFn = createServerFn({ method: "POST" })
  .validator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const expectedEmail = DEFAULT_EMAIL;
    const hash = DEFAULT_HASH;

    const isMatch = bcrypt.compareSync(data.password, hash);

    if (isMatch) {
      await logAuditAction({
        data: {
          action: "Unlock Invoice",
          entityType: "Invoice",
          details: `Invoice unlocked using admin password for ${expectedEmail}`,
        },
      });
      return { success: true };
    }

    return { success: false, message: "Incorrect Admin Password" };
  });

