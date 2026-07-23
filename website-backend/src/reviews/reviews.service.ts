import { Injectable, Logger } from '@nestjs/common';
import { reviewRepository } from '../repositories/ReviewRepository';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

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
