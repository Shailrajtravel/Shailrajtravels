import { Injectable, Logger } from '@nestjs/common';
import { recommendedVehicleRepository } from '../repositories/RecommendedVehicleRepository';

const DEFAULT_RECOMMENDED_VEHICLES = [
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

@Injectable()
export class RecommendedVehiclesService {
  private readonly logger = new Logger(RecommendedVehiclesService.name);

  async getRecommendedVehicles() {
    try {
      const vehicles = await recommendedVehicleRepository.findAllSorted();
      if (!vehicles || vehicles.length === 0) {
        return DEFAULT_RECOMMENDED_VEHICLES;
      }
      return vehicles.map(v => ({
        id: v.id,
        name: v.name,
        capacityStr: v.capacityStr,
        minCap: v.minCap,
        maxCap: v.maxCap,
        description: v.description,
        amenities: v.amenities,
        image: v.image,
        badge: v.badge,
        order: v.order
      }));
    } catch (error) {
      this.logger.error("Failed to fetch recommended vehicles", error);
      return [];
    }
  }

  async saveRecommendedVehicles(vehicles: any[]) {
    await recommendedVehicleRepository.replaceAll(vehicles);
    return { success: true };
  }
}
