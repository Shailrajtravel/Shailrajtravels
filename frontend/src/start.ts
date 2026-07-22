import { createStart, createMiddleware, createCsrfMiddleware } from '@tanstack/react-start';

import { renderErrorPage } from '@/backend/shared/error-page';

const errorMiddleware = createMiddleware().server(async ({ next, request }) => {
  try {
    return await next();
  } catch (error) {
    // If it's a server function (RPC) request, let TanStack Start handle the error serialization natively
    if (request) {
      try {
        const url = new URL(request.url);
        const lowerPath = url.pathname.toLowerCase();
        if (lowerPath.includes("_serverfn") || lowerPath.includes("_server-fn")) {
          throw error;
        }
      } catch (e) {
        if (e === error) throw error;
      }
    }

    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware],
}));
