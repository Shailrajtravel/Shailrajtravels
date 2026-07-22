/**
 * invoice-pdf.ts
 *
 * Puppeteer cannot be bundled on Cloudflare Pages because it relies on Node.js native APIs.
 * This function has been stubbed out. The system will fall back to PDFKit or other means.
 */

export async function generateInvoicePDFViaPuppeteer(
  bookingId: string,
  adminToken: string,
  generatedInvoiceNo: string,
): Promise<Buffer> {
  // Cloudflare Pages Nitro builder fails when attempting to trace import('puppeteer')
  // because it pulls in escalade/sync which requires fs.statSync (not available in unenv mock).
  throw new Error("Puppeteer is disabled on Cloudflare Pages serverless environment");
}
