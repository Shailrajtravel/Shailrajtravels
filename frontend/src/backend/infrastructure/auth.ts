import { createServerFn } from '@tanstack/react-start';
import { logAuditAction } from '@/backend/shared/audit';
import { getAdminToken } from '@/backend/infrastructure/token';
import { z } from 'zod';

const DEFAULT_EMAIL = "khudeshivam@gmail.com";
const DEFAULT_PASSWORD = "Shailraj@123";

const adminAuthSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().optional(),
  token: z.string().optional(),
});

export const verifyAdminFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => adminAuthSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const validToken = getAdminToken();
      if (!validToken) {
        return { success: false, message: "Admin credentials not configured on server." };
      }

      if (data.token) {
        return { success: true, token: validToken };
      }

      if (data.email && data.password) {
        const expectedEmail = DEFAULT_EMAIL;
        
        // Remove bcryptjs, check plaintext directly since Cloudflare Pages fails with bcryptjs
        const isMatch = data.password === DEFAULT_PASSWORD;
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
    const isMatch = data.password === DEFAULT_PASSWORD;

    if (isMatch) {
      await logAuditAction({
        data: {
          action: "Unlock Invoice",
          entityType: "Invoice",
          details: `Invoice unlocked using admin password`,
        },
      });
      return { success: true };
    }

    return { success: false, message: "Incorrect Admin Password" };
  });

