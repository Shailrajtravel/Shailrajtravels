/**
 * Standalone Admin PWA Authentication & Session Persistence
 * Encrypts and stores admin credentials in localStorage using native Web Crypto API (AES-256-GCM).
 * Provides Instagram-like seamless auto-login on app launch without repeated password entry.
 */

import React, { useState, useEffect } from 'react';

const STORAGE_KEY = '__shailraj_admin_session_v1';
const APP_SECRET_SALT = 'shailraj_travels_admin_pwa_secure_vault_2026';

// Helper to convert ArrayBuffer to Base64 and back
function bufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBuffer(b64: string): ArrayBuffer {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Derive a cryptographic key unique to this device/browser
async function getEncryptionKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const deviceEntropy = typeof window !== 'undefined'
    ? `${navigator.userAgent || ''}-${screen?.width || 0}x${screen?.height || 0}-${location.hostname}`
    : 'default-entropy';
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(APP_SECRET_SALT + deviceEntropy),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(APP_SECRET_SALT),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export interface AdminSavedSession {
  email: string;
  password?: string;
  token?: string;
  savedAt: number;
}

/**
 * Save encrypted admin credentials to persistent local storage
 */
export async function saveAdminSession(session: {
  email: string;
  password?: string;
  token?: string;
}): Promise<boolean> {
  if (typeof window === 'undefined' || !crypto?.subtle) return false;
  try {
    const key = await getEncryptionKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const payload: AdminSavedSession = {
      ...session,
      savedAt: Date.now(),
    };
    
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      enc.encode(JSON.stringify(payload))
    );

    const record = {
      iv: bufferToBase64(iv.buffer),
      data: bufferToBase64(ciphertext),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    return true;
  } catch (err) {
    console.error('Failed to save encrypted admin session:', err);
    return false;
  }
}

/**
 * Decrypt and retrieve the saved admin session from local storage
 */
export async function loadAdminSession(): Promise<AdminSavedSession | null> {
  if (typeof window === 'undefined' || !crypto?.subtle) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const record = JSON.parse(raw);
    if (!record.iv || !record.data) return null;

    const key = await getEncryptionKey();
    const iv = new Uint8Array(base64ToBuffer(record.iv));
    const ciphertext = base64ToBuffer(record.data);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    const dec = new TextDecoder();
    const parsed: AdminSavedSession = JSON.parse(dec.decode(decrypted));
    return parsed;
  } catch (err) {
    console.warn('Failed to decrypt admin session, may need re-login:', err);
    clearAdminSession();
    return null;
  }
}

/**
 * Check synchronously whether a saved session blob exists
 */
export function hasAdminSession(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(STORAGE_KEY);
}

/**
 * Clear all persistent admin credentials and tokens on manual logout
 */
export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem('adminToken');
  } catch (e) {
    console.error('Error clearing admin session:', e);
  }
}

/**
 * Register Service Worker for Admin Portal
 */
export function registerAdminServiceWorker(): void {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/admin/sw.js', { scope: '/admin/' })
        .then((reg) => {
          console.log('Admin PWA ServiceWorker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('Admin ServiceWorker registration failed:', err);
        });
    });
  }
}

/**
 * Register Service Worker for Main Site
 */
export function registerMainServiceWorker(): void {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          console.log('Main PWA ServiceWorker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('Main ServiceWorker registration failed:', err);
        });
    });
  }
}

/**
 * Component to dynamically switch to the Admin PWA manifest and icons on /admin and /login routes
 */
export function AdminPwaSetup() {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Switch manifest link to admin manifest
    let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement | null;
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      document.head.appendChild(manifestLink);
    }
    manifestLink.href = '/admin/manifest.webmanifest';

    // Switch apple touch icon
    let appleIcon = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement | null;
    if (!appleIcon) {
      appleIcon = document.createElement('link');
      appleIcon.rel = 'apple-touch-icon';
      document.head.appendChild(appleIcon);
    }
    appleIcon.href = '/admin/icons/admin-apple-touch-icon.png';

    // Switch theme color
    let themeMeta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    if (themeMeta) {
      themeMeta.content = '#0F172A';
    }

    // Register admin service worker
    registerAdminServiceWorker();
  }, []);

  return null;
}

/**
 * Hook to handle PWA installation prompt specifically for the Admin app
 */
export function usePwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if running in standalone display mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return;
    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult?.outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
      }
    } catch (err) {
      console.warn('Install prompt failed:', err);
    } finally {
      setDeferredPrompt(null);
    }
  };

  return { isInstallable, isInstalled, promptInstall };
}
