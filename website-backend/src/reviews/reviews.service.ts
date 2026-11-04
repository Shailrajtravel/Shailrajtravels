import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { reviewRepository } from '../repositories/ReviewRepository';
import { storageManager } from '../database/StorageManager';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class ReviewsService implements OnModuleInit {
  private readonly logger = new Logger(ReviewsService.name);
  private readonly placeId = process.env.GOOGLE_PLACE_ID || "ChIJXRgrL53DwjsRs0FidQRovF0";

  onModuleInit() {
    // Initial sync check 5 seconds after startup
    setTimeout(() => {
      this.getGoogleReviews(false).catch((e) =>
        this.logger.warn("Initial Google Places reviews sync skipped:", e?.message || e),
      );
    }, 5000);

    // Daily background refresh (24 hours = 86,400,000 ms)
    // ~30 requests/month (well within India free tier of 7,000 Enterprise + Atmosphere requests)
    setInterval(() => {
      this.syncGoogleReviews().catch((e) =>
        this.logger.error("Daily Google Places reviews sync failed:", e?.message || e),
      );
    }, 24 * 60 * 60 * 1000);
  }

  private getDefaultGoogleStats() {
    return {
      rating: "5.0",
      reviewCount: "23",
      placeId: this.placeId,
      source: "business_default",
      lastSynced: new Date().toISOString(),
      writeReviewUrl: `https://search.google.com/local/writereview?placeid=${this.placeId}`,
      googleMapsUrl: `https://www.google.com/maps/place/Shailraj+Travels/@18.5116495,73.9655755,17z/data=!4m8!3m7!1s0x3bc2c39d2f2b185d:0x5dbc6804756241b3!8m2!3d18.5116495!4d73.9655755!9m1!1b1!16s%2Fg%2F11zd36ljtd?entry=ttu`,
      reviews: [],
    };
  }

  async syncGoogleReviews() {
    const apiKey =
      process.env.GOOGLE_MAPS_API_KEY ||
      process.env.GOOGLE_PLACES_API_KEY ||
      process.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      this.logger.warn(
        "GOOGLE_MAPS_API_KEY is not set in backend environment. Automatic Google Places sync cannot contact Google.",
      );
      return null;
    }

    try {
      this.logger.log(`Calling Google Places API (New) for Place ID: ${this.placeId}...`);
      const url = `https://places.googleapis.com/v1/places/${this.placeId}`;
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "id,displayName,rating,userRatingCount,reviews",
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        this.logger.error(`Google Places API returned ${res.status}: ${errorText}`);
        return null;
      }

      const json = await res.json();
      const rawReviews = Array.isArray(json.reviews) ? json.reviews : [];

      const reviews = rawReviews.map((r: any, idx: number) => ({
        id: r.name || `g-rev-${idx}`,
        name: r.authorAttribution?.displayName || "Google Reviewer",
        rating: r.rating || 5,
        text: r.text?.text || r.originalText?.text || "",
        relativeTime: r.relativePublishTimeDescription || "Recently",
        authorPhotoUrl: r.authorAttribution?.photoUri,
        publishTime: r.publishTime,
        timestamp: r.publishTime ? Date.parse(r.publishTime) : Date.now() - idx * 86400000,
      }));

      // Sort newest / latest reviews first
      reviews.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

      const stats = {
        rating: String(json.rating || "5.0"),
        reviewCount: String(json.userRatingCount || "23"),
        placeId: this.placeId,
        source: "google_places_api_v1",
        lastSynced: new Date().toISOString(),
        writeReviewUrl: `https://search.google.com/local/writereview?placeid=${this.placeId}`,
        googleMapsUrl: `https://www.google.com/maps/place/Shailraj+Travels/@18.5116495,73.9655755,17z/data=!4m8!3m7!1s0x3bc2c39d2f2b185d:0x5dbc6804756241b3!8m2!3d18.5116495!4d73.9655755!9m1!1b1!16s%2Fg%2F11zd36ljtd?entry=ttu`,
        reviews,
      };

      // Persist to MongoDB collection
      const col = await storageManager.getGlobalCollection("google_reviews_cache");
      await col.updateOne(
        { key: "shailraj_google_reviews" },
        { $set: { key: "shailraj_google_reviews", data: stats, lastSynced: new Date() } },
        { upsert: true },
      );

      this.logger.log(
        `Google Places sync complete: ${reviews.length} reviews fetched. Rating: ${stats.rating} (${stats.reviewCount} total).`,
      );
      return stats;
    } catch (err: any) {
      this.logger.error("Failed to sync Google reviews:", err?.message || err);
      return null;
    }
  }

  async getGoogleReviews(forceRefresh = false) {
    try {
      const col = await storageManager.getGlobalCollection("google_reviews_cache");
      const cached = await col.findOne({ key: "shailraj_google_reviews" });

      const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
      const isFresh =
        cached &&
        cached.lastSynced &&
        Date.now() - new Date(cached.lastSynced).getTime() < CACHE_TTL_MS;

      if (isFresh && !forceRefresh && cached?.data) {
        return cached.data;
      }

      // If stale or forceRefresh, try to sync
      const synced = await this.syncGoogleReviews();
      if (synced) return synced;

      if (cached && cached.data) {
        return cached.data;
      }

      return this.getDefaultGoogleStats();
    } catch (e: any) {
      this.logger.error("Error retrieving Google reviews:", e?.message || e);
      return this.getDefaultGoogleStats();
    }
  }

  async getReviews() {
    try {
      const reviews = await reviewRepository.findAllSorted();
      return reviews.map((r: any) => ({
        _id: r._id.toString(),
        name: r.name,
        rating: r.rating,
        textEn: r.textEn,
        textMr: r.textMr,
        blogTitle: r.blogTitle || "A Journey of Devotion",
        blogContent: r.blogContent || r.textEn || r.text,
        blogTitleMr: r.blogTitleMr || r.blogTitle || "भक्तीचा प्रवास",
        blogContentMr: r.blogContentMr || r.textMr || r.text,
        date: r.date,
      }));
    } catch (error) {
      this.logger.error("Failed to fetch reviews", error);
      return [];
    }
  }

  async addReview(data: any) {
    const { name, rating, text } = data;
    let textEn = text;
    let textMr = text;

    const apiKey = process.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        let model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `You are a translator for Shailraj Travels.
You will receive a customer review of their trip.
Translate the raw review into BOTH English and Marathi.

OUTPUT FORMAT:
You must return a raw JSON object (no markdown, no \`\`\` tags).
{
  "textEn": "String (English translation of the review)",
  "textMr": "String (Marathi translation of the review)"
}

Review text:
"${text}"`;

        let resultText = "";
        try {
          const result = await model.generateContent(prompt);
          resultText = result.response.text();
        } catch (e: any) {
          if (e.message?.includes("404") || e.status === 404) {
            model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const result = await model.generateContent(prompt);
            resultText = result.response.text();
          } else {
            throw e;
          }
        }

        const jsonStr = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(jsonStr);
        if (parsed.textEn) textEn = parsed.textEn;
        if (parsed.textMr) textMr = parsed.textMr;
      } catch (e) {
        this.logger.error("Translation failed, saving original text:", e);
      }
    }

    const newReview = {
      name,
      rating,
      textEn,
      textMr,
      date: new Date().toISOString(),
    };

    const insertedId = await reviewRepository.insertOne(newReview);
    return { success: true, review: { ...newReview, _id: insertedId } };
  }

  async deleteReview(id: string) {
    await reviewRepository.deleteOne(id);
    return { success: true };
  }
}
