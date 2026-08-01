import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TraceIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Check for existing trace headers from Cloudflare CDN or frontend, or generate a fresh correlation identifier
    const traceId = (req.headers['x-request-id'] || req.headers['x-trace-id'] || `trc-${Math.random().toString(36).substring(2, 10)}`) as string;
    
    // Attach to request object for unified downstream logging and debugging
    (req as any).traceId = traceId;

    // Attach to response headers for frontend error tracking and network monitoring
    res.setHeader('X-Request-ID', traceId);
    res.setHeader('X-Trace-ID', traceId);

    next();
  }
}
