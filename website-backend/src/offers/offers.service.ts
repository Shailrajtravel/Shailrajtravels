import { Injectable, Logger } from '@nestjs/common';
import { promotionalOfferRepository, PromotionalOffer } from '../repositories/PromotionalOfferRepository';

export const DEFAULT_OFFER: Partial<PromotionalOffer> = {
  slug: "pune-to-lalbag-raja-darshan",
  isActive: true,
  badge: "ONE DAY TRIP",
  title: "Pune to Lalbag Raja Darshan",
  subtitle: "Faith | Travel | Blessings - Special One Day Trip",
  bannerImageUrl: "/images/offers/lalbag-raja-pune-offer.jpg",
  offerPrice: "999",
  originalPrice: "1,499",
  priceUnit: "per person",
  urgencyText: "Limited Seats in Luxury Force Urbania! 14th Sep Late Night Departure",
  vehicleName: "Luxury AC Force Urbania",
  highlights: [
    "Comfortable AC Travel",
    "Group Travel Friendly",
    "Safe & Reliable Chauffeurs",
    "Hassle-Free Darshan",
    "Spacious Seating",
    "Fully Air Conditioned",
    "Ample Luggage Space",
    "Ideal for Families, Friends & Devotees",
  ],
  schedule: [
    {
      time: "14th Sep (Late Night)",
      title: "Departure from Pune",
      description: "Night journey from Pune pickup points via Mumbai-Pune Expressway in luxury AC Force Urbania.",
    },
    {
      time: "15th Sep (Early Morning)",
      title: "Reach Mumbai",
      description: "Arrive in Mumbai fresh and energized near Lalbaug before dawn.",
    },
    {
      time: "15th Sep (Morning)",
      title: "Lalbaug Raja Darshan",
      description: "Holy darshan and blessings of Navsacha Lalbaugcha Raja with your loved ones.",
    },
    {
      time: "15th Sep (Afternoon)",
      title: "Return to Pune",
      description: "Board vehicle with sacred memories and reach Pune comfortably by evening.",
    },
  ],
  route: "Pune ➔ Mumbai-Pune Expressway ➔ Mumbai (Lalbag Raja) ➔ Pune",
  pickupPoints: [
    "Swargate",
    "Pune Station",
    "Shivajinagar",
    "Aundh",
    "Chandani Chowk",
    "Hinjawadi Flyover",
    "Wakad",
    "Nigdi Bhakti-Shakti",
  ],
  inclusions: [
    "Round-trip travel in Luxury AC Force Urbania",
    "Experienced and courteous highway driver",
    "All highway tolls, Mumbai entry taxes & parking fees included",
    "Complimentary packaged drinking water bottle",
    "Clean sanitised pure-veg highway halts for refresh",
  ],
  exclusions: [
    "VIP Darshan pass / coconut / floral offerings",
    "Meals, breakfast & personal expenses",
  ],
  ctaText: "Book Your Seat Now",
  whatsappMessage: "Hello Shailraj Travels, I want to book seats for Pune to Lalbag Raja Darshan One Day Trip at ₹999 per person in Force Urbania. Please confirm availability.",
  terms: "Advance booking of 50% required to confirm seat reservation. Remaining payment on boarding.",
  updatedAt: new Date().toISOString(),
};

@Injectable()
export class OffersService {
  private readonly logger = new Logger(OffersService.name);

  async getActiveOffer(): Promise<Partial<PromotionalOffer> | null> {
    try {
      const active = await promotionalOfferRepository.findActive();
      if (active) return active;
      // If nothing active in DB, return null or fallback default if active
      return DEFAULT_OFFER.isActive ? DEFAULT_OFFER : null;
    } catch (error) {
      this.logger.error("Failed to fetch active offer", error);
      return DEFAULT_OFFER;
    }
  }

  async getAllOffers(): Promise<Partial<PromotionalOffer>[]> {
    try {
      const offers = await promotionalOfferRepository.findAll();
      if (!offers || offers.length === 0) {
        return [DEFAULT_OFFER];
      }
      return offers;
    } catch (error) {
      this.logger.error("Failed to fetch all offers", error);
      return [DEFAULT_OFFER];
    }
  }

  async getOfferBySlug(slug: string): Promise<Partial<PromotionalOffer> | null> {
    try {
      const offer = await promotionalOfferRepository.findBySlug(slug);
      if (offer) return offer;
      if (slug === DEFAULT_OFFER.slug) return DEFAULT_OFFER;
      return null;
    } catch (error) {
      this.logger.error(`Failed to fetch offer by slug ${slug}`, error);
      return slug === DEFAULT_OFFER.slug ? DEFAULT_OFFER : null;
    }
  }

  async saveOffer(data: Partial<PromotionalOffer>): Promise<Partial<PromotionalOffer>> {
    try {
      return await promotionalOfferRepository.saveOffer(data);
    } catch (error) {
      this.logger.error("Failed to save offer", error);
      throw error;
    }
  }

  async toggleOfferStatus(slug: string, isActive: boolean): Promise<boolean> {
    try {
      return await promotionalOfferRepository.toggleStatus(slug, isActive);
    } catch (error) {
      this.logger.error(`Failed to toggle status for ${slug}`, error);
      throw error;
    }
  }

  async deleteOffer(slug: string): Promise<boolean> {
    try {
      return await promotionalOfferRepository.deleteOffer(slug);
    } catch (error) {
      this.logger.error(`Failed to delete offer ${slug}`, error);
      throw error;
    }
  }
}
