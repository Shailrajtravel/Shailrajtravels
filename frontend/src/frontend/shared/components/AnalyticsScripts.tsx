import React, { useEffect, useState } from 'react';
import { ANALYTICS_CONFIG } from '@/frontend/shared/config/analytics';

// Only load analytics when real IDs have been configured
const isGAConfigured =
  ANALYTICS_CONFIG.GA_MEASUREMENT_ID &&
  !ANALYTICS_CONFIG.GA_MEASUREMENT_ID.includes("XXXXXXXXXX");
const isGTMConfigured =
  ANALYTICS_CONFIG.GTM_CONTAINER_ID &&
  !ANALYTICS_CONFIG.GTM_CONTAINER_ID.includes("XXXXXXX");

export function AnalyticsScripts() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!isGAConfigured && !isGTMConfigured) return;

    let timeoutId: number;

    const loadAnalytics = () => {
      setShouldLoad(true);
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('scroll', loadAnalytics);
      window.removeEventListener('touchstart', loadAnalytics);
      window.removeEventListener('pointerdown', loadAnalytics);
      if (timeoutId) clearTimeout(timeoutId);
    };

    // Progressive loading strategy
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => {
        timeoutId = setTimeout(loadAnalytics, 2000) as unknown as number;
      });
    } else {
      timeoutId = setTimeout(loadAnalytics, 3000) as unknown as number;
    }

    // Load on first interaction
    window.addEventListener('scroll', loadAnalytics, { passive: true, once: true });
    window.addEventListener('touchstart', loadAnalytics, { passive: true, once: true });
    window.addEventListener('pointerdown', loadAnalytics, { passive: true, once: true });

    return cleanup;
  }, []);

  if (!shouldLoad) return null;

  return (
    <>
      {/* Google Tag Manager */}
      {isGTMConfigured && (
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${ANALYTICS_CONFIG.GTM_CONTAINER_ID}');`,
          }}
        />
      )}
      {/* Google Analytics (GA4) */}
      {isGAConfigured && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.GA_MEASUREMENT_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ANALYTICS_CONFIG.GA_MEASUREMENT_ID}');`,
            }}
          />
        </>
      )}
    </>
  );
}

// Global typing for dataLayer
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
