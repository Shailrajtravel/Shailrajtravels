import clientPromise from "./db";
import { ObjectId } from "mongodb";

export type WhatsAppStatus = "Disconnected" | "Awaiting QR" | "Connected" | "Error";

let client: any = null;
let currentQR: string | null = null;
let currentStatus: WhatsAppStatus = "Disconnected";
let initializationPromise: Promise<void> | null = null;

const ADMIN_PHONE = "919359570497"; // Admin number

// Initialize the WhatsApp Client
export async function initWhatsApp() {
  if (client || initializationPromise) return initializationPromise;

  currentStatus = "Disconnected";
  initializationPromise = new Promise(async (resolve, reject) => {
    try {
      // Release any locks held by stale Chrome processes before starting
      await killStaleChrome();

      console.log("[WhatsApp] Initializing client...");
      import("whatsapp-web.js")
        .then(async ({ default: pkg, Client, LocalAuth }) => {
          const C = Client || pkg?.Client;
          const LA = LocalAuth || pkg?.LocalAuth;

          const os = await import("os");
          const path = await import("path");
          const fs = await import("fs");

          const cachePath = path.join(
            os.homedir(),
            ".cache",
            "puppeteer",
            "chrome",
            "win64-149.0.7827.22",
            "chrome-win64",
            "chrome.exe",
          );
          let executablePath: string | undefined = undefined;

          if (fs.existsSync(cachePath)) {
            executablePath = cachePath;
            console.log("[WhatsApp] Using cached Chrome:", executablePath);
          } else {
            const winChromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
            const winChromePathX86 =
              "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
            if (fs.existsSync(winChromePath)) {
              executablePath = winChromePath;
              console.log("[WhatsApp] Using Windows system Chrome:", executablePath);
            } else if (fs.existsSync(winChromePathX86)) {
              executablePath = winChromePathX86;
              console.log("[WhatsApp] Using Windows x86 system Chrome:", executablePath);
            }
          }

          client = new C({
            authStrategy: new LA(),
            puppeteer: {
              headless: true,
              executablePath,
              args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
            },
          });

          client.on("qr", (qr: string) => {
            console.log("[WhatsApp] QR RECEIVED");
            currentQR = qr;
            currentStatus = "Awaiting QR";
          });

          client.on("ready", () => {
            console.log("[WhatsApp] Client is ready!");
            currentQR = null;
            currentStatus = "Connected";
            resolve();
          });

          client.on("authenticated", () => {
            console.log("[WhatsApp] Authenticated!");
          });

          client.on("auth_failure", async (msg: any) => {
            console.error("[WhatsApp] Authentication failure", msg);
            currentStatus = "Error";
            await destroyWhatsApp();
            await clearAuthCache();
            reject(new Error(msg));
          });

          client.on("disconnected", async (reason: string) => {
            console.log("[WhatsApp] Client disconnected", reason);
            currentStatus = "Disconnected";
            await destroyWhatsApp();
          });

          client.on("message_create", async (msg: any) => {
            const adminId = `${ADMIN_PHONE}@c.us`;
            console.log(
              `[WhatsApp Debug] message_create fired. from: ${msg.from}, to: ${msg.to}, author: ${msg.author}, body: ${msg.body}`,
            );

            // Only respond to admin
            if (msg.from !== adminId && msg.author !== adminId) {
              console.log(
                `[WhatsApp Debug] Ignoring message because from/author does not match adminId (${adminId})`,
              );
              return;
            }

            // Don't reply if the admin sends this command to a customer
            // "Message Yourself" often uses a @lid address for the destination. Regular customer chats use @c.us.
            const isMessageYourself =
              msg.to === adminId ||
              msg.to.endsWith("@lid") ||
              (client.info && msg.to === client.info.wid._serialized);

            if (msg.from === adminId && !isMessageYourself) {
              console.log(
                `[WhatsApp Debug] Ignoring message because it was sent to a customer (to: ${msg.to})`,
              );
              return;
            }

            const text = msg.body.toLowerCase().trim();

            try {
              if (text.startsWith("get excel ") && text.includes(" to ")) {
                const dateRangeStr = text.replace("get excel ", "").trim();
                const [startStr, endStr] = dateRangeStr.split(" to ").map((s: string) => s.trim());
                msg.reply(`Generating Excel file of bookings from ${startStr} to ${endStr}...`);

                const dbClient = await clientPromise;
                const db = dbClient.db("shailraj");
                const allBookings = await db
                  .collection("bookings")
                  .find({})
                  .sort({ createdAt: -1 })
                  .toArray();

                const startDate = new Date(startStr);
                startDate.setHours(0, 0, 0, 0);
                const endDate = new Date(endStr);
                endDate.setHours(23, 59, 59, 999);

                const isStartValid = !isNaN(startDate.getTime());
                const isEndValid = !isNaN(endDate.getTime());

                const filteredBookings = allBookings.filter((b: any) => {
                  if (isStartValid && isEndValid && b.createdAt) {
                    const cDate = new Date(b.createdAt);
                    if (cDate >= startDate && cDate <= endDate) return true;
                  }
                  if (isStartValid && isEndValid && b.travelDate) {
                    const tDate = new Date(b.travelDate);
                    if (!isNaN(tDate.getTime()) && tDate >= startDate && tDate <= endDate)
                      return true;
                  }
                  return false;
                });

                if (filteredBookings.length === 0) {
                  msg.reply(`No bookings found between ${startStr} and ${endStr}.`);
                } else {
                  const excelBuffer = await generateBookingsExcel(filteredBookings);
                  const { default: pkg, MessageMedia } = await import("whatsapp-web.js");
                  const MM = MessageMedia || pkg?.MessageMedia;
                  const safeName = `bookings_${startStr.replace(/[^a-z0-9]/gi, "_")}_to_${endStr.replace(/[^a-z0-9]/gi, "_")}.xlsx`;
                  const media = new MM(
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    excelBuffer.toString("base64"),
                    safeName,
                  );
                  client!.sendMessage(msg.from, media);
                }
              } else if (text === "get excel") {
                msg.reply("Generating Excel file of all bookings...");
                const excelBuffer = await generateBookingsExcel();
                const { default: pkg, MessageMedia } = await import("whatsapp-web.js");
                const MM = MessageMedia || pkg?.MessageMedia;
                const media = new MM(
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  excelBuffer.toString("base64"),
                  "bookings.xlsx",
                );
                client!.sendMessage(msg.from, media);
              } else if (text.startsWith("get ") && text.endsWith(" invoice")) {
                // e.g., "get 16-06-26 invoice" -> "16-06-26"
                const dateStr = text.replace("get ", "").replace(" invoice", "").trim();
                msg.reply(`Generating PDF and Excel invoice for ${dateStr}...`);

                const bookings = await fetchBookingsForDate(dateStr);
                if (bookings.length === 0) {
                  msg.reply(`No bookings found for date: ${dateStr}`);
                  return;
                }

                const pdfBuffer = await generateInvoicePDF(bookings, dateStr);
                const { default: pkg, MessageMedia } = await import("whatsapp-web.js");
                const MM = MessageMedia || pkg?.MessageMedia;
                const pdfMedia = new MM(
                  "application/pdf",
                  pdfBuffer.toString("base64"),
                  `invoice_${dateStr}.pdf`,
                );
                await client!.sendMessage(msg.from, pdfMedia);

                const excelBuffer = await generateBookingsExcel(bookings);
                const excelMedia = new MM(
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  excelBuffer.toString("base64"),
                  `invoice_${dateStr}.xlsx`,
                );
                await client!.sendMessage(msg.from, excelMedia);
              }
            } catch (error: any) {
              console.error("[WhatsApp] Error handling message:", error);
              msg.reply(`An error occurred: ${error.message}`);
            }
          });

          client.initialize().catch(async (err: any) => {
            console.error("[WhatsApp] Initialization failed", err);
            currentStatus = "Error";
            await destroyWhatsApp();
            await clearAuthCache();
            reject(err);
          });
        })
        .catch(async (err: any) => {
          console.error("[WhatsApp] import error", err);
          currentStatus = "Error";
          await destroyWhatsApp();
          await clearAuthCache();
          reject(err);
        });
    } catch (error) {
      console.error("[WhatsApp] Setup error", error);
      currentStatus = "Error";
      reject(error);
    }
  });

  return initializationPromise;
}

export async function destroyWhatsApp() {
  if (client) {
    try {
      console.log("[WhatsApp] Destroying existing client...");
      await client.destroy();
    } catch (e) {
      console.error("[WhatsApp] Error destroying client:", e);
    }
    client = null;
  }
  initializationPromise = null;
  currentQR = null;
}

export async function killStaleChrome() {
  try {
    const { execSync } = await import("child_process");
    const os = await import("os");
    if (os.platform() !== "win32") return;

    console.log("[WhatsApp] Checking for stale Chrome processes to release locks...");
    const cmd = `powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \\"Name = 'chrome.exe'\\" | ForEach-Object { if ($_.CommandLine -like '*\\.wwebjs_auth*') { Stop-Process -Id $_.ProcessId -Force; Write-Host $_.ProcessId } }"`;
    const output = execSync(cmd, { encoding: "utf8" });
    if (output.trim()) {
      console.log(
        "[WhatsApp] Killed stale Chrome instances PIDs:",
        output.trim().replace(/\r?\n/g, ", "),
      );
      // Give the OS 1 second to release the locks completely
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } else {
      console.log("[WhatsApp] No stale Chrome processes found.");
    }
  } catch (err: any) {
    console.warn("[WhatsApp] Warning: failed to kill stale Chrome processes:", err.message);
  }
}

export async function clearAuthCache() {
  // Terminate any locking Chrome processes first
  await killStaleChrome();

  try {
    const path = await import("path");
    const fs = await import("fs");
    const authDir = path.join(process.cwd(), ".wwebjs_auth");
    const cacheDir = path.join(process.cwd(), ".wwebjs_cache");

    if (fs.existsSync(authDir)) {
      console.log("[WhatsApp] Removing .wwebjs_auth directory...");
      fs.rmSync(authDir, { recursive: true, force: true });
    }
    if (fs.existsSync(cacheDir)) {
      console.log("[WhatsApp] Removing .wwebjs_cache directory...");
      fs.rmSync(cacheDir, { recursive: true, force: true });
    }
  } catch (err) {
    console.error("[WhatsApp] Failed to clear session directories:", err);
  }
}

export async function restartWhatsApp() {
  console.log("[WhatsApp] Restarting WhatsApp client (reusing session)...");
  await destroyWhatsApp();
  currentStatus = "Disconnected";
  return initWhatsApp();
}

export async function logoutWhatsApp() {
  console.log("[WhatsApp] Explicit logout requested, clearing session cache...");
  await destroyWhatsApp();
  await clearAuthCache();
  currentStatus = "Disconnected";
}

export function getStatus() {
  return { status: currentStatus, qr: currentQR };
}

export async function sendAdminNotification(message: string) {
  if (currentStatus !== "Connected" || !client) {
    console.warn("[WhatsApp] Cannot send message, client not connected");
    return false;
  }
  try {
    const adminId = `${ADMIN_PHONE}@c.us`;
    await client.sendMessage(adminId, message);
    return true;
  } catch (error) {
    console.error("[WhatsApp] Failed to send notification:", error);
    return false;
  }
}

export async function sendWhatsAppMessage(phone: string, message: string) {
  if (currentStatus !== "Connected" || !client) {
    console.warn("[WhatsApp] Cannot send message, client not connected");
    return false;
  }
  try {
    // Sanitize the phone number
    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = cleaned.substring(1);
    }
    if (cleaned.length === 10) {
      cleaned = "91" + cleaned;
    }

    let targetId = `${cleaned}@c.us`;
    try {
      const numberId = await client.getNumberId(cleaned);
      if (numberId && numberId._serialized) {
        targetId = numberId._serialized;
      }
    } catch (e) {
      console.warn("[WhatsApp] getNumberId failed, falling back to raw JID:", e);
    }

    await client.sendMessage(targetId, message);
    console.log(`[WhatsApp] Sent notification to ${targetId}`);
    return true;
  } catch (error) {
    console.error("[WhatsApp] Failed to send message:", error);
    return false;
  }
}

// -------------------------
// Helpers
// -------------------------

async function fetchBookingsForDate(dateStr: string) {
  const dbClient = await clientPromise;
  const db = dbClient.db("shailraj");

  // Date format could be various things. Let's try to match it against createdAt or travelDate.
  // The user might type "16-06-26" meaning YYYY-MM-DD or DD-MM-YY.
  // We'll just do a broad search in stringified dates or precise if we know the schema.
  // For simplicity, we'll fetch all and filter in JS if complex, or try a regex.
  const allBookings = await db.collection("bookings").find({}).toArray();

  return allBookings.filter((b: any) => {
    // Check if the date string is in the travelDate or createdAt
    const cd = new Date(b.createdAt).toISOString().split("T")[0];
    const td = b.travelDate ? String(b.travelDate) : "";

    return (
      cd.includes(dateStr) ||
      td.includes(dateStr) ||
      new Date(b.createdAt).toLocaleDateString("en-GB").replace(/\//g, "-").includes(dateStr)
    );
  });
}

export async function generateBookingsExcel(bookingsData?: any[]): Promise<Buffer> {
  let data = bookingsData;
  if (!data) {
    const dbClient = await clientPromise;
    const db = dbClient.db("shailraj");
    data = await db.collection("bookings").find({}).sort({ createdAt: -1 }).toArray();
  }

  const xlsx = await import("xlsx");

  const worksheet = xlsx.utils.json_to_sheet(
    data!.map((b: any) => ({
      ID: b._id.toString(),
      Name: b.name || "N/A",
      Phone: b.phone || "N/A",
      Email: b.email || "N/A",
      Date: b.date || "N/A",
      Adults: b.numAdults || 0,
      Children: b.numChildren || 0,
      Status: b.status || "Pending",
      Payment: b.paymentStatus || "Pending",
      Total: b.totalPrice || 0,
      Created: b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "N/A",
    })),
  );

  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Bookings");
  return xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });
}

export async function generateInvoicePDF(bookings: any[], dateStr: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      import("pdfkit")
        .then(({ default: PDFDocument }) => {
          const doc = new PDFDocument({ margin: 50 });
          const buffers: Buffer[] = [];
          doc.on("data", buffers.push.bind(buffers));
          doc.on("end", () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
          });

          doc.fontSize(20).text("Shailraj Travels Invoice Summary", { align: "center" });
          doc.moveDown();
          doc.fontSize(14).text(`Date: ${dateStr}`, { align: "center" });
          doc.moveDown(2);

          let totalPersons = 0;

          bookings.forEach((b, i) => {
            doc
              .fontSize(12)
              .font("Helvetica-Bold")
              .text(`Booking #${i + 1} - ${b.name}`);
            doc.font("Helvetica").fontSize(10);
            doc.text(`Phone: ${b.phone || "N/A"}`);
            doc.text(`Trip: ${b.tripName || b.customDestination || "N/A"}`);
            doc.text(`Travel Date: ${b.travelDate || "N/A"}`);
            doc.text(`Persons: ${b.persons || 1}`);
            doc.text(`Status: ${b.status || "Pending"}`);
            doc.moveDown();

            totalPersons += Number(b.persons || 1);
          });

          doc.moveDown();
          doc.fontSize(14).font("Helvetica-Bold").text(`Total Bookings: ${bookings.length}`);
          doc.text(`Total Persons: ${totalPersons}`);

          doc.end();
        })
        .catch(reject);
    } catch (error) {
      reject(error);
    }
  });
}

function extractInvoiceData(b: any) {
  const custom = b.invoiceCustomData || {};
  const safeDate = (dateStr: any) => {
    if (!dateStr) return new Date();
    let d = new Date(dateStr);
    if (isNaN(d.getTime()) && typeof dateStr === "string") {
      const cleaned = dateStr.replace(/\s*\(.*\)\s*/g, "");
      d = new Date(cleaned);
    }
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const invoiceYear = safeDate(b.createdAt).getFullYear();
  const invoiceSuffix = b._id ? b._id.toString().slice(-6).toUpperCase() : "0001";
  const defaultInvoiceNo = `INV-${invoiceYear}-${invoiceSuffix}`;

  const createdDate = safeDate(b.createdAt || Date.now()).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const bId =
    b.generatedBookingId || b.bookingId || (b._id ? b._id.toString().slice(-8).toUpperCase() : "");

  let formattedTravelDate = "";
  let formattedTravelDateTime = "";
  try {
    const tDate = safeDate(b.travelDate);
    const pad = (n: number) => String(n).padStart(2, "0");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    formattedTravelDate = `${pad(tDate.getDate())} ${months[tDate.getMonth()]} ${tDate.getFullYear()}`;
    formattedTravelDateTime = `${pad(tDate.getDate())} ${months[tDate.getMonth()]} ${tDate.getFullYear()}, ${pad(tDate.getHours())}:${pad(tDate.getMinutes())}`;
  } catch (err) {
    formattedTravelDate = String(b.travelDate || "");
    formattedTravelDateTime = String(b.travelDate || "");
  }

  return {
    invoiceNo: custom.invoiceNo || b.generatedInvoiceNo || defaultInvoiceNo,
    invoiceDate: custom.invoiceDate || createdDate,
    bookingId: custom.bookingId || bId,
    travelDate: custom.travelDate || formattedTravelDate,
    customerName: custom.customerName || b.customerName || b.name || "",
    customerPhone: custom.customerPhone || b.customerPhone || b.phone || "",
    packageName: custom.packageName || b.packageName || b.tripName || "Custom Trip",
    travelDateTime: custom.travelDateTime || formattedTravelDateTime,
    pickupPoint: custom.pickupPoint || b.pickupPoint || "Pune",
    rate:
      custom.rate !== undefined
        ? Number(custom.rate)
        : b.tripName === "custom"
          ? 0
          : b.defaultRate || 6000,
    persons: custom.persons !== undefined ? Number(custom.persons) : b.persons || 1,
    paymentStatus: custom.paymentStatus || b.paymentStatus || "PENDING",
  };
}

export async function generateSingleInvoicePDF(booking: any): Promise<Buffer> {
  const fs = await import("fs");
  const path = await import("path");
  const os = await import("os");
  const puppeteer = await import("puppeteer");

  const data = extractInvoiceData(booking);
  const totalAmount = data.rate * data.persons;

  const assetsDir = path.join(process.cwd(), "src", "frontend", "assets");
  const getBase64 = (fileName: string) => {
    const filePath = path.join(assetsDir, fileName);
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).substring(1);
      const b64 = fs.readFileSync(filePath).toString("base64");
      return `data:image/${ext};base64,${b64}`;
    }
    return "";
  };

  const logoBase64 = getBase64("Shailraj travels-Punelogo.png");
  const onlyNameLogoBase64 = getBase64("only-name-logo.png");
  const stampBase64 = getBase64("stamp1.png");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap');
    body { font-family: 'Roboto', sans-serif; background: white; margin: 0; padding: 0; }
    .script { font-family: 'Brush Script MT', 'Lucida Handwriting', cursive; }
  </style>
</head>
<body>
  <div class="relative bg-white text-[#222] flex flex-col mx-auto" style="width: 210mm; height: 297mm; padding: 10mm 10mm 50px; box-sizing: border-box;">
    
    <!-- HEADER -->
    <div class="w-full pt-2">
      <div class="absolute top-1 left-1">
        ${logoBase64 ? `<img src="${logoBase64}" class="h-[150px] w-[150px] object-contain scale-[1.3] origin-top-left" />` : ""}
      </div>
      <div class="flex flex-col items-center">
        <div class="h-[140px] flex items-center justify-center w-full">
          ${onlyNameLogoBase64 ? `<img src="${onlyNameLogoBase64}" class="h-[190px] object-contain scale-[2.4] origin-center -ml-12" />` : '<h1 class="text-4xl font-bold" style="color: #082F70">SHAILRAJ TRAVELS</h1>'}
        </div>
        <div class="-mt-5 text-[15px] font-medium text-slate-600 flex items-center justify-center gap-4 w-full">
          <span>Pune, Maharashtra, India</span>
          <span class="opacity-50">|</span>
          <span>+91 97634 33556</span>
        </div>
        <div class="mt-1 text-[15px] font-medium text-slate-600 flex items-center justify-center gap-4 w-full">
          <span>shailrajtravels9999@gmail.com</span>
          <span class="opacity-50">|</span>
          <span>www.shailrajtravels.com</span>
        </div>
      </div>
    </div>

    <!-- INVOICE BADGE -->
    <div class="mt-4 flex justify-center">
      <div class="rounded-[8px] px-10 py-1.5 text-[22px] font-black tracking-widest text-white shadow-sm" style="background: #082F70">
        INVOICE
      </div>
    </div>

    <!-- INVOICE INFO CARD -->
    <div class="mt-6 rounded-[10px] border border-[#1E4D9E]">
      <div class="grid grid-cols-2">
        <div class="p-3 border-r border-[#1E4D9E]">
          <div class="flex text-[13px] items-center">
            <div class="w-[120px] font-medium">Invoice No.</div>
            <div class="w-3">:</div>
            <div class="ml-2 font-semibold flex-1">${data.invoiceNo}</div>
          </div>
          <div class="mt-2"></div>
          <div class="flex text-[13px] items-center">
            <div class="w-[120px] font-medium">Invoice Date</div>
            <div class="w-3">:</div>
            <div class="ml-2 font-semibold flex-1">${data.invoiceDate}</div>
          </div>
        </div>
        <div class="p-3">
          <div class="flex text-[13px] items-center">
            <div class="w-[120px] font-medium">Booking ID</div>
            <div class="w-3">:</div>
            <div class="ml-2 font-semibold flex-1">${data.bookingId}</div>
          </div>
          <div class="mt-2"></div>
          <div class="flex text-[13px] items-center">
            <div class="w-[120px] font-medium">Travel Date</div>
            <div class="w-3">:</div>
            <div class="ml-2 font-semibold flex-1">${data.travelDate}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- BILL TO + TRIP DETAILS -->
    <div class="mt-6 grid grid-cols-2 gap-6">
      <div class="overflow-hidden rounded-[6px] border border-[#1E4D9E] h-full">
        <div class="px-5 py-2.5 text-[14px] font-bold uppercase text-white" style="background: #082F70">BILL TO</div>
        <div class="px-5 py-4 flex flex-col h-full gap-1">
          <div class="flex py-1 text-[13px] items-center">
            <div class="w-[130px] font-medium">Name</div>
            <div class="w-3">:</div>
            <div class="ml-2 flex-1">${data.customerName}</div>
          </div>
          <div class="flex py-1 text-[13px] items-center">
            <div class="w-[130px] font-medium">Mobile</div>
            <div class="w-3">:</div>
            <div class="ml-2 flex-1">${data.customerPhone}</div>
          </div>
        </div>
      </div>
      
      <div class="overflow-hidden rounded-[6px] border border-[#1E4D9E] h-full">
        <div class="px-5 py-2.5 text-[14px] font-bold uppercase text-white" style="background: #082F70">TRIP DETAILS</div>
        <div class="px-5 py-4 flex flex-col h-full gap-1">
          <div class="flex py-1 text-[13px] items-center">
            <div class="w-[130px] font-medium">Package Name</div>
            <div class="w-3">:</div>
            <div class="ml-2 flex-1">${data.packageName}</div>
          </div>
          <div class="flex py-1 text-[13px] items-center">
            <div class="w-[130px] font-medium">Travel Date</div>
            <div class="w-3">:</div>
            <div class="ml-2 flex-1">${data.travelDateTime}</div>
          </div>
          <div class="flex py-1 text-[13px] items-center">
            <div class="w-[130px] font-medium">Pickup Point</div>
            <div class="w-3">:</div>
            <div class="ml-2 flex-1">${data.pickupPoint}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- TABLE -->
    <div class="mt-4 overflow-hidden rounded-[8px] border border-[#1E4D9E] flex flex-col">
      <table class="w-full text-left text-[13px]">
        <thead class="text-white" style="background: #082F70">
          <tr>
            <th class="px-5 py-3 text-left font-bold uppercase tracking-wide text-[12px]">Description</th>
            <th class="px-5 py-3 text-center font-bold uppercase tracking-wide text-[12px] w-[100px]">Qty</th>
            <th class="px-5 py-3 text-center font-bold uppercase tracking-wide text-[12px] w-[140px]">Rate (₹)</th>
            <th class="px-5 py-3 text-center font-bold uppercase tracking-wide text-[12px] w-[160px]">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="px-5 py-4 font-medium text-[#222]">Package Price (Per Person)</td>
            <td class="px-5 py-4 text-center font-medium text-[#222]">${data.persons}</td>
            <td class="px-5 py-4 text-center font-medium text-[#222]">${data.rate.toLocaleString("en-IN")}</td>
            <td class="px-5 py-4 text-center font-medium text-[#222]">${totalAmount.toLocaleString("en-IN")}</td>
          </tr>
        </tbody>
      </table>
      <div class="flex bg-slate-50 border-t border-[#1E4D9E]">
        <div class="flex-1"></div>
        <div class="w-[140px] px-5 py-1 flex items-center justify-center text-[15px] font-bold uppercase tracking-widest text-slate-700">Total</div>
        <div class="w-[160px] px-5 py-1 flex items-center justify-center text-[22px] font-black leading-none" style="color: #082F70">₹ ${totalAmount.toLocaleString("en-IN")}</div>
      </div>
    </div>

    <!-- PAYMENT + SIGNATURE -->
    <div class="mt-4 grid grid-cols-2 gap-4">
      <div class="overflow-hidden rounded-[6px] border border-[#1E4D9E] h-full">
        <div class="px-5 py-2.5 text-[14px] font-bold uppercase text-white" style="background: #082F70">PAYMENT DETAILS</div>
        <div class="px-5 py-4 flex flex-col h-full gap-1">
          <div class="flex py-1 text-[13px] items-center">
            <div class="w-[130px] font-medium">Payment Mode</div>
            <div class="w-3">:</div>
            <div class="ml-2 flex-1">Cash / Online</div>
          </div>
          <div class="flex py-1 text-[13px] items-center">
            <div class="w-[130px] font-medium">Paid Amount</div>
            <div class="w-3">:</div>
            <div class="ml-2 flex-1">₹ ${totalAmount.toLocaleString("en-IN")}</div>
          </div>
          <div class="mt-1 flex items-center text-[13px]">
            <div class="w-[130px] font-medium">Payment Status</div>
            <div class="w-3">:</div>
            <span class="ml-2 rounded-sm px-2 py-0.5 text-[11px] font-bold text-white ${data.paymentStatus.toLowerCase() === "completed" || data.paymentStatus.toLowerCase() === "paid" ? "bg-green-500" : "bg-orange-500"}">
              ${data.paymentStatus.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div class="overflow-hidden rounded-[6px] border border-[#1E4D9E] h-full flex flex-col">
        <div class="px-5 py-2.5 text-[14px] font-bold uppercase text-white shrink-0" style="background: #082F70">AUTHORIZED SIGNATURE</div>
        <div class="px-5 py-4 flex flex-col flex-1 justify-end relative min-h-[170px]">
          ${stampBase64 ? `<div class="absolute bottom-[24px] left-1/2 -translate-x-1/2 w-[44%] opacity-85 pointer-events-none select-none" style="mix-blend-mode: multiply; z-index: 10;"><img src="${stampBase64}" class="w-full h-auto object-contain" /></div>` : ""}
          <div class="relative z-10 w-full mt-auto">
            <div class="mx-auto h-px w-3/4 bg-slate-800"></div>
            <p class="mt-2 text-center text-[12px] text-slate-600">Authorized Signatory</p>
          </div>
        </div>
      </div>
    </div>

    <!-- THANK YOU -->
    <div class="mt-auto flex w-full flex-col items-center pb-2 pt-4">
      <div class="flex w-[80%] items-center gap-6 opacity-60">
        <div class="h-[1px] flex-1" style="background: linear-gradient(to right, transparent, #1E4D9E)"></div>
        <div class="script text-[42px] leading-none" style="color: #082F70">Thank You!</div>
        <div class="h-[1px] flex-1" style="background: linear-gradient(to left, transparent, #1E4D9E)"></div>
      </div>
      <div class="mt-3 flex flex-col items-center text-center">
        <div class="text-[13px] font-bold tracking-widest" style="color: #082F70">Wings_of_mayur_9999</div>
        <div class="mt-1 text-[9px] font-medium tracking-[0.2em] text-slate-400 uppercase">Powered by</div>
        <div class="text-[14px] font-semibold tracking-wider text-slate-600">Shailraj Travels,Pune</div>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="absolute bottom-0 left-0 w-full flex items-center justify-around px-6 py-3 text-[13px] font-medium text-white" style="background: #082F70">
      <span>+91 97634 33556</span>
      <span class="opacity-50">|</span>
      <span>shailrajtravels9999@gmail.com</span>
      <span class="opacity-50">|</span>
      <span>www.shailrajtravels.com</span>
    </div>
  </div>
</body>
</html>
  `;

  const cachePath = path.join(
    os.homedir(),
    ".cache",
    "puppeteer",
    "chrome",
    "win64-149.0.7827.22",
    "chrome-win64",
    "chrome.exe",
  );
  let executablePath: string | undefined = undefined;

  if (fs.existsSync(cachePath)) {
    executablePath = cachePath;
  } else {
    const winChromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
    const winChromePathX86 = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
    if (fs.existsSync(winChromePath)) {
      executablePath = winChromePath;
    } else if (fs.existsSync(winChromePathX86)) {
      executablePath = winChromePathX86;
    }
  }

  const browser = await puppeteer.launch({
    headless: true,
    executablePath,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "load" });
  await new Promise((r) => setTimeout(r, 500));

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "2mm", right: "2mm", bottom: "2mm", left: "2mm" },
  });

  await browser.close();
  return Buffer.from(pdfBuffer);
}

export async function sendBookingInvoicePDF(booking: any): Promise<boolean> {
  if (currentStatus !== "Connected" || !client) {
    console.warn("[WhatsApp] Cannot send invoice, client not connected");
    return false;
  }
  try {
    const pdfBuffer = await generateSingleInvoicePDF(booking);

    // Create WhatsApp media
    const { default: pkg, MessageMedia } = await import("whatsapp-web.js");
    const MM = MessageMedia || pkg?.MessageMedia;

    const invoiceNo =
      booking.invoiceCustomData?.invoiceNo ||
      booking.generatedInvoiceNo ||
      `INV-${new Date(booking.createdAt || Date.now()).getFullYear()}-${booking._id ? booking._id.toString().slice(-6).toUpperCase() : "0001"}`;
    const media = new MM(
      "application/pdf",
      pdfBuffer.toString("base64"),
      `Invoice_${invoiceNo}.pdf`,
    );

    // Sanitize phone number
    let cleaned = booking.phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = cleaned.substring(1);
    }
    if (cleaned.length === 10) {
      cleaned = "91" + cleaned;
    }

    let targetId = `${cleaned}@c.us`;
    try {
      const numberId = await client.getNumberId(cleaned);
      if (numberId && numberId._serialized) {
        targetId = numberId._serialized;
      }
    } catch (e) {
      console.warn("[WhatsApp] getNumberId failed, falling back to raw JID:", e);
    }

    await client.sendMessage(targetId, media);

    // Send standard WhatsApp details text along with it
    const msg = `🙏 *Shailraj Travels Pune* 🙏\n\nHello *${booking.name || "Customer"}*,\n\nWe have received your payment for the trip *${booking.packageName || booking.tripName || "Custom Trip"}* (Date: ${booking.travelDate || "N/A"}).\n\nPlease find attached the official invoice for your booking.\n\nThank you for choosing us for your spiritual journey! Have a blessed trip! 🚩`;
    await client.sendMessage(targetId, msg);

    console.log(`[WhatsApp] Sent invoice PDF and confirmation message to ${targetId}`);
    return true;
  } catch (err) {
    console.error("[WhatsApp] Failed to send booking invoice PDF:", err);
    return false;
  }
}
