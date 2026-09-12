import React, { useState, useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { verifyAdminFn } from '@/backend/infrastructure/auth';
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck, Download, Smartphone } from 'lucide-react';
// @ts-ignore
import logo from '@/frontend/shared/assets/shailraj-travels-punelogo.png?w=300&format=webp&as=url';
import { LoginSkeleton } from '@/frontend/shared/ui/LoginSkeleton';
import {
  AdminPwaSetup,
  loadAdminSession,
  saveAdminSession,
  clearAdminSession,
  hasAdminSession,
  usePwaInstallPrompt,
} from '@/frontend/features/admin/admin-auth-persistence';

export const Route = createFileRoute("/login")({
  head: () => ({
    links: [
      { rel: "manifest", href: "/admin/manifest.webmanifest?v=4" },
      { rel: "apple-touch-icon", href: "/admin/icons/shailraj-apple-touch-icon.png?v=4" },
    ],
    meta: [
      { name: "theme-color", content: "#0F172A" },
      { name: "apple-mobile-web-app-title", content: "Shailraj Admin" },
    ],
  }),
  pendingComponent: LoginSkeleton,
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoChecking, setAutoChecking] = useState(() => hasAdminSession());
  const [autoCheckMsg, setAutoCheckMsg] = useState("Restoring your secure admin session...");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isInstallable, isInstalled, promptInstall } = usePwaInstallPrompt();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. If already have an active sessionToken in this tab/window, jump directly
    const existingToken = sessionStorage.getItem("adminToken");
    if (existingToken) {
      navigate({ to: "/admin" });
      return;
    }

    // 2. Auto-login from encrypted local cache (like Instagram)
    loadAdminSession().then(async (saved) => {
      if (saved && saved.email && saved.password) {
        setEmail(saved.email);
        setAutoCheckMsg(`Signing in as ${saved.email}...`);
        try {
          const res = await verifyAdminFn({ data: { email: saved.email, password: saved.password } });
          if (res?.success && res.token) {
            sessionStorage.setItem("adminToken", res.token);
            // Refresh saved timestamp
            await saveAdminSession({ email: saved.email, password: saved.password, token: res.token });
            navigate({ to: "/admin" });
            return;
          } else {
            clearAdminSession();
            setError("Saved credentials expired. Please sign in again.");
          }
        } catch (err: any) {
          console.warn("Auto-login failed:", err);
          clearAdminSession();
          setError("Session expired or server unreachable. Please sign in.");
        }
      }
      setAutoChecking(false);
    }).catch(() => {
      setAutoChecking(false);
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError("");

    try {
      const res = await verifyAdminFn({ data: { email, password } });
      if (res?.success && res.token) {
        sessionStorage.setItem("adminToken", res.token);
        // Persist credentials in encrypted local storage (Instagram-like persistence)
        await saveAdminSession({ email, password, token: res.token });
        navigate({ to: "/admin" });
      } else {
        setError(res?.message || "Invalid email or password");
      }
    } catch (err: any) {
      const rawMsg = err.message || "";
      if (
        rawMsg.includes("<!doctype html>") ||
        rawMsg.includes("<html>") ||
        rawMsg.includes("<html")
      ) {
        setError("Login failed due to a server error. Please try again later.");
      } else {
        setError(rawMsg || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      const target = e.target as HTMLElement;
      if (
        (target.tagName === "INPUT" && (target as HTMLInputElement).type !== "button" && (target as HTMLInputElement).type !== "submit") ||
        target.tagName === "SELECT"
      ) {
        const form = e.currentTarget;
        const inputs = Array.from(
          form.querySelectorAll("input:not([type='hidden']):not([disabled]), select:not([disabled]), textarea:not([disabled])")
        ) as HTMLElement[];
        
        const index = inputs.indexOf(target);
        if (index > -1 && index < inputs.length - 1) {
          e.preventDefault();
          inputs[index + 1].focus();
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-6 relative overflow-hidden text-slate-100">
      <AdminPwaSetup />

      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 z-0 pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-reveal">
        {/* Branding */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-3xl bg-slate-800/80 border border-slate-700/80 shadow-2xl shadow-black/40 flex items-center justify-center mb-4 overflow-hidden backdrop-blur-md p-2.5">
            <img 
              src={logo} 
              alt="Shailraj Travels Logo" 
              className="h-full w-full object-contain" 
            />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display tracking-tight text-white">Shailraj Admin</h1>
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-brand-green/20 text-brand-green border border-brand-green/30">
              PWA
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">Standalone Management Console</p>
        </div>

        {/* Install Admin App Banner (if browser supports install prompt and not yet installed) */}
        {isInstallable && !isInstalled && (
          <div className="mb-4 bg-gradient-to-r from-slate-800 to-slate-900 border border-brand-green/40 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-green/15 text-brand-green flex items-center justify-center shrink-0 border border-brand-green/30">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Install Standalone Admin App</p>
                <p className="text-[11px] text-slate-400">Add icon directly to home screen / desktop</p>
              </div>
            </div>
            <button
              onClick={promptInstall}
              className="px-3.5 py-1.5 bg-[#10A34A] hover:bg-[#0D8A3E] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-md shadow-brand-green/20 shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Install
            </button>
          </div>
        )}

        {/* Auto-checking overlay card */}
        {autoChecking ? (
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-[24px] p-8 shadow-2xl backdrop-blur-md text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-green/15 text-brand-green flex items-center justify-center mb-4 border border-brand-green/30 animate-pulse">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-white mb-1">Restoring Admin Session</h2>
            <p className="text-sm text-slate-400 mb-6">{autoCheckMsg}</p>
            <Loader2 className="w-6 h-6 animate-spin text-brand-green mb-6" />
            <button
              type="button"
              onClick={() => {
                clearAdminSession();
                setAutoChecking(false);
              }}
              className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
            >
              Cancel & sign in manually
            </button>
          </div>
        ) : (
          <div className="bg-slate-800/90 rounded-[24px] p-8 shadow-2xl border border-slate-700/80 backdrop-blur-md">
            <form
              onSubmit={handleLogin}
              onKeyDown={handleFormKeyDown}
              className="flex flex-col gap-5"
            >
              {/* Email Address */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Email Address
                </label>
                <div className="group flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/60 px-4 h-[54px] transition focus-within:border-brand-green focus-within:ring-2 focus-within:ring-brand-green/20">
                  <Mail className="h-5 w-5 text-slate-400 shrink-0 transition-colors group-focus-within:text-brand-green" />
                  <input
                    suppressHydrationWarning
                    id="email"
                    name="email"
                    autoComplete="username"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter admin email..."
                    className="w-full bg-transparent text-[15px] font-semibold text-white placeholder:text-slate-500 placeholder:font-normal focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>

              {/* Master Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Master Password
                </label>
                <div className="group flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/60 px-4 h-[54px] transition focus-within:border-brand-green focus-within:ring-2 focus-within:ring-brand-green/20">
                  <Lock className="h-5 w-5 text-slate-400 shrink-0 transition-colors group-focus-within:text-brand-green" />
                  <input
                    suppressHydrationWarning
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password..."
                    className="w-full bg-transparent text-[15px] font-semibold text-white placeholder:text-slate-500 placeholder:font-normal focus:outline-none"
                  />
                </div>
                {error && <p className="text-rose-400 text-xs font-semibold mt-1 animate-pulse">{error}</p>}
              </div>

              {/* Instagram-style persistence badge */}
              <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900/40 p-2.5 rounded-xl border border-slate-700/50">
                <ShieldCheck className="w-4 h-4 text-brand-green shrink-0" />
                <span>Encrypted auto-login enabled. You won&apos;t need to log in again on this device.</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full h-[54px] bg-[#10A34A] hover:bg-[#0D8A3E] text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-1 shadow-lg shadow-[#10A34A]/25 hover:shadow-[#10A34A]/40 hover:-translate-y-0.5 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign In to Admin <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs font-medium text-slate-400 hover:text-brand-green transition-colors"
          >
            &larr; Return to main website
          </a>
        </div>
      </div>
    </div>
  );
}
