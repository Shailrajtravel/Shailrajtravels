import { BaseRepository } from './BaseRepository';
import { Document, ObjectId } from 'mongodb';
import { storageManager } from '../database/StorageManager';

export interface ScheduleItem {
  time: string;
  title: string;
  description: string;
}

export interface PromotionalOffer extends Document {
  _id?: ObjectId;
  slug: string;
  isActive: boolean;
  badge: string;
  title: string;
  subtitle: string;
  bannerImageUrl: string;
  offerPrice: string;
  originalPrice: string;
  priceUnit: string;
  urgencyText: string;
  vehicleName: string;
  highlights: string[];
  schedule: ScheduleItem[];
  route: string;
  pickupPoints: string[];
  inclusions: string[];
  exclusions: string[];
  ctaText: string;
  whatsappMessage: string;
  terms?: string;
  updatedAt: string;
}

export class PromotionalOfferRepository extends BaseRepository<PromotionalOffer> {
  protected entityType = 'offer';
  protected baseCollectionName = 'promotional_offers';
  protected isPartitioned = false;

  async findActive(): Promise<PromotionalOffer | null> {
    const col = await storageManager.getGlobalCollection<PromotionalOffer>(this.baseCollectionName);
    return col.findOne({ isActive: true });
  }

  async findAll(): Promise<PromotionalOffer[]> {
    const col = await storageManager.getGlobalCollection<PromotionalOffer>(this.baseCollectionName);
    return col.find().sort({ updatedAt: -1 }).toArray();
  }

  async findBySlug(slug: string): Promise<PromotionalOffer | null> {
    const col = await storageManager.getGlobalCollection<PromotionalOffer>(this.baseCollectionName);
    return col.findOne({ slug });
  }

  async saveOffer(offerData: Partial<PromotionalOffer>): Promise<PromotionalOffer> {
    const col = await storageManager.getGlobalCollection<PromotionalOffer>(this.baseCollectionName);
    const now = new Date().toISOString();
    const slug = offerData.slug || 'pune-to-lalbag-raja-darshan';

    const existing = await col.findOne({ slug });
    if (existing) {
      const updatedData = {
        ...offerData,
        slug,
        updatedAt: now,
      };
      delete (updatedData as any)._id;

      await col.updateOne(
        { _id: existing._id },
        { $set: updatedData }
      );
      return { ...existing, ...updatedData } as PromotionalOffer;
    } else {
      const newOffer = {
        ...offerData,
        slug,
        isActive: offerData.isActive ?? true,
        updatedAt: now,
      } as PromotionalOffer;

      const result = await col.insertOne(newOffer as any);
      return { ...newOffer, _id: result.insertedId };
    }
  }

  async toggleStatus(slug: string, isActive: boolean): Promise<boolean> {
    const col = await storageManager.getGlobalCollection<PromotionalOffer>(this.baseCollectionName);
    const res = await col.updateOne(
      { slug },
      { $set: { isActive, updatedAt: new Date().toISOString() } }
    );
    return res.modifiedCount > 0;
  }
}

export const promotionalOfferRepository = new PromotionalOfferRepository();
