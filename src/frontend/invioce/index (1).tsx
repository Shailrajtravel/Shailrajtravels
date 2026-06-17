import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Globe, Printer, Edit, Save } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "@/frontend/assets/shailraj-logo.png";
import vehicle from "@/frontend/assets/force-urbania.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shailraj Travels — Invoice" },
      { name: "description", content: "Force Urbania Luxury Tour Services invoice." },
    ],
  }),
  component: Index,
});

const defaultData = {
  invoiceNo: "INV-2026-EC9ED6",
  invoiceDate: "15 Jun 2026",
  bookingId: "18EC9ED6",
  dueDate: "10 Jun 2026",
  billToName: "Rahul Sharma",
  billToMobile: "+91 98765 43210",
  billToEmail: "rahulsharma@gmail.com",
  packageName: "Custom Trip",
  duration: "3 Days / 2 Nights",
  travelDate: "10 Jun 2026, 14:46",
  vehicleType: "Force Urbania AC",
  pickupPoint: "Pune",
  itemDesc: "Package Price (Per Person)",
  itemQty: "2",
  itemRate: "6,000",
  itemAmount: "12,000",
  totalAmount: "12,000",
  paymentMode: "Cash / Online",
  paidAmount: "₹ 12,000",
  balanceAmount: "₹ 0",
  paymentStatus: "PENDING"
};

function Index() {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(defaultData);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("invoice_data");
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {}
    }
    setLoaded(true);
  }, []);

  const handleSave = () => {
    localStorage.setItem("invoice_data", JSON.stringify(data));
    setIsEditing(false);
  };

  if (!loaded) return null;

  return (
    <div className="min-h-screen bg-[#eef0f3] py-6 print:p-0 print:bg-white">
      <style>{`
        @page { size: A4 portrait; margin: 0; }
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
        }
        .script { font-family: 'Brush Script MT', 'Lucida Handwriting', cursive; }
      `}</style>

      <div className="mx-auto flex w-[210mm] justify-end gap-3 mb-4 no-print">
        {isEditing ? (
          <button onClick={handleSave} className="flex items-center gap-2 rounded bg-green-600 px-4 py-2 font-bold text-white shadow hover:bg-green-700 transition">
            <Save className="h-4 w-4" /> Save Invoice
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 rounded bg-[#0B3D91] px-4 py-2 font-bold text-white shadow hover:bg-blue-800 transition">
            <Edit className="h-4 w-4" /> Edit Invoice
          </button>
        )}
        <button onClick={() => window.print()} className="flex items-center gap-2 rounded bg-slate-800 px-4 py-2 font-bold text-white shadow hover:bg-slate-900 transition">
          <Printer className="h-4 w-4" /> Print
        </button>
      </div>

      <Invoice data={data} setData={setData} isEditing={isEditing} />
    </div>
  );
}

const BLUE = "#0B3D91";
const DARK = "#082F70";
const BORDER = "#1E4D9E";
const GREEN = "#1E8E3E";

function Invoice({ data, setData, isEditing }: any) {
  const updateData = (key: string, value: string) => {
    setData((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div
      className="mx-auto bg-white text-[#222] shadow-lg print:shadow-none"
      style={{ width: "210mm", minHeight: "297mm", padding: "10mm 10mm 0" }}
    >
      {/* HEADER */}
      <div className="grid grid-cols-[110px_1fr_230px] items-center gap-4">
        <img src={logo} alt="Shailraj Travel" width={110} height={110} className="h-[110px] w-[110px] object-contain" />
        <div className="pl-1">
          <h1
            className="font-extrabold uppercase leading-none"
            style={{ color: DARK, fontSize: "46px", letterSpacing: "-0.5px" }}
          >
            Shailraj Travels
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-[2px] w-6" style={{ background: GREEN }} />
            <span className="text-[14px] font-semibold uppercase tracking-wide" style={{ color: GREEN }}>
              Force Urbania Luxury Tour Services
            </span>
            <span className="h-[2px] w-6" style={{ background: GREEN }} />
          </div>
        </div>
        <div className="relative h-[110px] overflow-hidden">
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-white via-transparent to-transparent" />
          <img src={vehicle} alt="Force Urbania" width={230} height={110} className="h-full w-full object-cover" />
        </div>
      </div>

      {/* CONTACT ROW */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[13px] font-medium" style={{ color: "#222" }}>
        <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" style={{ color: DARK }} /> Pune, Maharashtra, India</span>
        <span style={{ color: "#bbb" }}>|</span>
        <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" style={{ color: DARK }} /> +91 97634 33556</span>
      </div>
      <div className="mt-1 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[13px] font-medium">
        <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" style={{ color: DARK }} /> shailrajtravels9999@gmail.com</span>
        <span style={{ color: "#bbb" }}>|</span>
        <span className="flex items-center gap-1.5"><Globe className="h-4 w-4" style={{ color: DARK }} /> www.shailrajtravels.com</span>
      </div>

      {/* INVOICE BADGE */}
      <div className="mt-5 flex justify-center">
        <div
          className="rounded-[10px] px-16 py-2 text-white"
          style={{ background: DARK, boxShadow: "0 6px 14px rgba(8,47,112,0.25)" }}
        >
          <span className="text-[36px] font-extrabold uppercase tracking-wide">Invoice</span>
        </div>
      </div>

      {/* INVOICE INFO CARD */}
      <div className="mt-4 rounded-[10px] border" style={{ borderColor: BORDER }}>
        <div className="grid grid-cols-2">
          <div className="border-r px-6 py-4" style={{ borderColor: BORDER }}>
            <InfoLine label="Invoice No." value={data.invoiceNo} isEditing={isEditing} onChange={(v: string) => updateData("invoiceNo", v)} />
            <div className="h-3" />
            <InfoLine label="Invoice Date" value={data.invoiceDate} isEditing={isEditing} onChange={(v: string) => updateData("invoiceDate", v)} />
          </div>
          <div className="px-6 py-4">
            <InfoLine label="Booking ID" value={data.bookingId} isEditing={isEditing} onChange={(v: string) => updateData("bookingId", v)} />
            <div className="h-3" />
            <InfoLine label="Travel Date" value={data.dueDate} isEditing={isEditing} onChange={(v: string) => updateData("dueDate", v)} />
          </div>
        </div>
      </div>

      {/* BILL TO + TRIP DETAILS */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <Card title="BILL TO">
          <DetailRow label="Name" value={data.billToName} isEditing={isEditing} onChange={(v: string) => updateData("billToName", v)} />
          <DetailRow label="Mobile" value={data.billToMobile} isEditing={isEditing} onChange={(v: string) => updateData("billToMobile", v)} />
          <DetailRow label="Email" value={data.billToEmail} isEditing={isEditing} onChange={(v: string) => updateData("billToEmail", v)} />
          <div className="h-16" />
        </Card>
        <Card title="TRIP DETAILS">
          <DetailRow label="Package Name" value={data.packageName} isEditing={isEditing} onChange={(v: string) => updateData("packageName", v)} />
          <DetailRow label="Duration" value={data.duration} isEditing={isEditing} onChange={(v: string) => updateData("duration", v)} />
          <DetailRow label="Travel Date" value={data.travelDate} isEditing={isEditing} onChange={(v: string) => updateData("travelDate", v)} />
          <DetailRow label="Vehicle Type" value={data.vehicleType} isEditing={isEditing} onChange={(v: string) => updateData("vehicleType", v)} />
          <DetailRow label="Pickup Point" value={data.pickupPoint} isEditing={isEditing} onChange={(v: string) => updateData("pickupPoint", v)} />
        </Card>
      </div>

      {/* TABLE */}
      <div className="mt-4 overflow-hidden rounded-[6px] border" style={{ borderColor: BORDER }}>
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr style={{ background: DARK, color: "white" }}>
              <th className="px-5 py-3 text-left text-[13px] font-bold uppercase">Description</th>
              <th className="w-[120px] px-5 py-3 text-center text-[13px] font-bold uppercase">Qty</th>
              <th className="w-[140px] px-5 py-3 text-center text-[13px] font-bold uppercase">Rate (₹)</th>
              <th className="w-[160px] px-5 py-3 text-right text-[13px] font-bold uppercase">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t" style={{ borderColor: BORDER }}>
              <td className="px-5 py-3">
                {isEditing ? <input className="w-full border border-slate-300 rounded px-1 py-0.5 outline-none focus:ring-1 focus:ring-brand-blue" value={data.itemDesc} onChange={e => updateData("itemDesc", e.target.value)} /> : data.itemDesc}
              </td>
              <td className="px-5 py-3 text-center">
                {isEditing ? <input className="w-full text-center border border-slate-300 rounded px-1 py-0.5 outline-none focus:ring-1 focus:ring-brand-blue" value={data.itemQty} onChange={e => updateData("itemQty", e.target.value)} /> : data.itemQty}
              </td>
              <td className="px-5 py-3 text-center">
                {isEditing ? <input className="w-full text-center border border-slate-300 rounded px-1 py-0.5 outline-none focus:ring-1 focus:ring-brand-blue" value={data.itemRate} onChange={e => updateData("itemRate", e.target.value)} /> : data.itemRate}
              </td>
              <td className="px-5 py-3 text-right">
                {isEditing ? <input className="w-full text-right border border-slate-300 rounded px-1 py-0.5 outline-none focus:ring-1 focus:ring-brand-blue" value={data.itemAmount} onChange={e => updateData("itemAmount", e.target.value)} /> : data.itemAmount}
              </td>
            </tr>
            <tr className="border-t" style={{ borderColor: BORDER }}><td className="px-5 py-5">&nbsp;</td><td /><td /><td /></tr>
            <tr className="border-t" style={{ borderColor: BORDER }}><td className="px-5 py-5">&nbsp;</td><td /><td /><td /></tr>
            <tr className="border-t" style={{ borderColor: BORDER }}>
              <td className="px-5 py-4" colSpan={2} />
              <td className="px-5 py-4 text-right text-[15px] font-bold uppercase" style={{ color: DARK }}>Total Amount</td>
              <td className="px-5 py-4 text-right text-[26px] font-extrabold" style={{ color: DARK }}>
                {isEditing ? (
                  <div className="flex items-center justify-end gap-1">
                    <span>₹</span>
                    <input className="w-32 text-right border border-slate-300 rounded px-1 py-0.5 text-lg font-bold outline-none focus:ring-1 focus:ring-brand-blue" value={data.totalAmount} onChange={e => updateData("totalAmount", e.target.value)} />
                  </div>
                ) : (
                  <>₹ {data.totalAmount}</>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* PAYMENT + SIGNATURE */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <Card title="PAYMENT DETAILS">
          <DetailRow label="Payment Mode" value={data.paymentMode} isEditing={isEditing} onChange={(v: string) => updateData("paymentMode", v)} />
          <DetailRow label="Paid Amount" value={data.paidAmount} isEditing={isEditing} onChange={(v: string) => updateData("paidAmount", v)} />
          <DetailRow label="Balance Amount" value={data.balanceAmount} isEditing={isEditing} onChange={(v: string) => updateData("balanceAmount", v)} />
          <div className="mt-2 flex items-center text-[13px]">
            <div className="w-[130px] font-medium">Payment Status</div>
            <div className="w-3">:</div>
            {isEditing ? (
              <input className="ml-2 flex-1 border border-slate-300 rounded px-1 py-0.5 outline-none focus:ring-1 focus:ring-brand-blue" value={data.paymentStatus} onChange={e => updateData("paymentStatus", e.target.value)} />
            ) : (
              <span
                className="ml-2 rounded-md px-4 py-1.5 text-[13px] font-bold uppercase text-white"
                style={{ background: data.paymentStatus?.toLowerCase() === "pending" ? "#F59E0B" : GREEN }}
              >
                {data.paymentStatus}
              </span>
            )}
          </div>
        </Card>
        <Card title="AUTHORIZED SIGNATURE">
          <p className="text-[13px]">For Shailraj Tours and Travels</p>
          <div className="h-12" />
          <div className="mx-auto h-px w-3/4 bg-black" />
          <p className="mt-1 text-center text-[13px]">Authorized Signatory</p>
        </Card>
      </div>

      {/* THANK YOU */}
      <div className="mt-5 flex items-center justify-center gap-3">
        <span style={{ color: GREEN }}>→</span>
        <div className="text-center">
          <div className="script text-[32px] leading-none" style={{ color: DARK }}>Thank You!</div>
          <div className="mt-1 text-[12px]">We look forward to serve you again.</div>
        </div>
        <span style={{ color: GREEN }}>←</span>
      </div>

      {/* FOOTER */}
      <div
        className="-mx-[10mm] mt-4 flex items-center justify-around px-6 py-3 text-[13px] font-medium text-white"
        style={{ background: DARK }}
      >
        <span className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 97634 33556</span>
        <span className="opacity-50">|</span>
        <span className="flex items-center gap-2"><Mail className="h-4 w-4" /> shailrajtravels9999@gmail.com</span>
        <span className="opacity-50">|</span>
        <span className="flex items-center gap-2"><Globe className="h-4 w-4" /> www.shailrajtravels.com</span>
      </div>
    </div>
  );
}

function InfoLine({ label, value, isEditing, onChange }: any) {
  return (
    <div className="flex text-[13px] items-center">
      <div className="w-[120px] font-medium">{label}</div>
      <div className="w-3">:</div>
      <div className="ml-2 font-semibold flex-1">
        {isEditing ? (
          <input className="w-full border border-slate-300 rounded px-1 py-0.5 outline-none focus:ring-1 focus:ring-brand-blue" value={value} onChange={e => onChange(e.target.value)} />
        ) : (
          value
        )}
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[6px] border" style={{ borderColor: BORDER }}>
      <div className="px-5 py-2.5 text-[14px] font-bold uppercase text-white" style={{ background: DARK }}>
        {title}
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function DetailRow({ label, value, isEditing, onChange }: any) {
  return (
    <div className="flex py-1 text-[13px] items-center">
      <div className="w-[130px] font-medium">{label}</div>
      <div className="w-3">:</div>
      <div className="ml-2 flex-1">
        {isEditing ? (
          <input className="w-full border border-slate-300 rounded px-1 py-0.5 outline-none focus:ring-1 focus:ring-brand-blue" value={value} onChange={e => onChange(e.target.value)} />
        ) : (
          value
        )}
      </div>
    </div>
  );
}
