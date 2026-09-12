import { createServerFn } from "@tanstack/react-start";
import { isValidAdminToken } from '@/backend/infrastructure/token';

export interface VehicleItem {
  id: string;
  name: string;
  capacityStr: string;
  minCap: number;
  maxCap: number;
  badge?: string;
  description: string;
  amenities: string[];
  image: string;
  order: number;
}

export const DEFAULT_RECOMMENDED_VEHICLES: VehicleItem[] = [
  {
    id: "force-urbania-15",
    name: "Force Urbania 15 Seater",
    capacityStr: "10–15 Travelers",
    minCap: 10,
    maxCap: 15,
    badge: "Most Popular • Luxury Van",
    description: "Super-luxury 15-seater Force Urbania with wide reclining push-back seats, powerful dual AC vents, ambient lighting, and massive luggage space. Ideal for pilgrimage yatras & family group tours.",
    amenities: [
      "Dual AC with Individual Vents",
      "Push-back Luxury Reclining Seats",
      "Verified Expert Highway Chauffeur",
      "Massive Luggage Boot Space",
      "Fuel, Tolls & Parking Included",
      "USB Mobile Charging at Every Row",
      "Sanitised Clean Luxury Cabin"
    ],
    image: "/images/vehicles/force-urbania-15-seater.jpg",
    order: 0,
  },
  {
    id: "innova-crysta",
    name: "Innova Crysta",
    capacityStr: "5–7 Travelers",
    minCap: 5,
    maxCap: 7,
    badge: "Premium Choice",
    description: "Top-rated luxury MUV for family vacations and outstation darshan trips with unmatched legroom and supreme highway ride comfort.",
    amenities: [
      "Captain Push-back Seats",
      "Dual Chilled Air Conditioning",
      "Experienced Professional Chauffeur",
      "Spacious Luggage Space",
      "Fuel, Tolls & Parking Included",
      "Clean & Sanitised Cab"
    ],
    image: "/images/vehicles/innova-crysta.jpg",
    order: 1,
  },
  {
    id: "ertiga",
    name: "Ertiga",
    capacityStr: "4–6 Travelers",
    minCap: 4,
    maxCap: 6,
    badge: "Best Value for Family",
    description: "Comfortable and cost-effective 6-seater AC cab perfect for budget family pilgrimages, Ashtavinayak, and weekend getaways from Pune.",
    amenities: [
      "Chilled Air Conditioning",
      "Comfortable Seating",
      "Commercial Chauffeur Included",
      "Luggage Carrier Available",
      "Fuel, Tolls & Parking Included",
      "Well-Maintained Sanitised Vehicle"
    ],
    image: "/images/vehicles/maruti-ertiga.jpg",
    order: 2,
  },
  {
    id: "swift-dzire",
    name: "Swift Dzire",
    capacityStr: "1–4 Travelers",
    minCap: 1,
    maxCap: 4,
    badge: "Economical Sedan",
    description: "Reliable, comfortable AC sedan for couples, small families, airport transfers, and one-day Pune local or outstation trips.",
    amenities: [
      "Chilled Air Conditioning",
      "Comfortable Sedan Seating",
      "Polite Professional Driver",
      "Boot Luggage Space",
      "Fuel, Tolls & Parking Included",
      "Clean & Sanitised Cab"
    ],
    image: "/images/vehicles/swift-dzire.jpg",
    order: 3,
  },
  {
    id: "force-urbania-12",
    name: "Force Urbania 12 Seater",
    capacityStr: "8–12 Travelers",
    minCap: 8,
    maxCap: 12,
    badge: "Executive Group",
    description: "Premium 12-seater Force Urbania offering aircraft-style luxury, panoramic windows, and smooth express-highway ride for executive group yatras.",
    amenities: [
      "Aircraft-style Push-back Seats",
      "Individual AC Vents",
      "Expert Commercial Chauffeur",
      "Large Luggage Space",
      "Fuel, Tolls & Parking Included",
      "Smooth Expressway Ride"
    ],
    image: "/images/vehicles/force-urbania-12-seater.jpg",
    order: 4,
  },
];

const apiFetch = async (endpoint: string, options: RequestInit & { timeoutMs?: number } = {}) => {
  const BACKEND_URL = import.meta.env.VITE_WEBSITE_BACKEND_URL || process.env.VITE_WEBSITE_BACKEND_URL || "https://shailrajtravels.onrender.com/api";
  const isWrite = options.method && ['POST', 'PUT', 'DELETE'].includes(options.method.toUpperCase());
  const defaultTimeout = isWrite ? 45000 : 12000;
  const timeoutMs = options.timeoutMs ?? defaultTimeout;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${BACKEND_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `API Error: ${res.status}`);
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError' || err.message?.includes('aborted')) {
      throw new Error(`Request timed out after ${timeoutMs / 1000}s communicating with server. Please try again.`);
    }
    throw err;
  }
};

export const getRecommendedVehiclesFn = createServerFn({ method: "GET" })
  .handler(async (): Promise<VehicleItem[]> => {
    try {
      const vehicles = await apiFetch('/recommended-vehicles');
      if (Array.isArray(vehicles) && vehicles.length > 0) {
        return vehicles;
      }
      return DEFAULT_RECOMMENDED_VEHICLES;
    } catch (err) {
      console.error("Failed to fetch recommended vehicles, using defaults:", err);
      return DEFAULT_RECOMMENDED_VEHICLES;
    }
  });

export const saveRecommendedVehiclesFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; vehicles: any[] }) => data)
  .handler(async ({ data }: { data: { adminToken: string; vehicles: any[] } }) => {
    if (!isValidAdminToken(data?.adminToken)) {
      throw new Error("Unauthorized");
    }
    
    return await apiFetch('/recommended-vehicles', {
      method: "POST",
      body: JSON.stringify(data.vehicles),
      timeoutMs: 45000,
    });
  });

