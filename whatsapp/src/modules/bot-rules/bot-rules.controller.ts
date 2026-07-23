import { Controller, Get, Put, Body, InternalServerErrorException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { RequireRole } from '../auth/decorators/auth.decorators';
import { ApiKeyRole } from '../auth/entities/api-key.entity';

export interface ChatbotRule {
  keywords: string[];
  reply: string;
}

export interface ChatbotRulesDto {
  rules: ChatbotRule[];
}

const DEFAULT_RULES: ChatbotRule[] = [
  {
    keywords: ["hi", "hello", "namaste", "start", "menu", "help", "options", "shailraj"],
    reply: "Namaste! 🙏 Welcome to *Shailraj Travels* - Your Trusted Travel Partner in Pune! 🚗✨\n\nHere is how we can assist you:\n1️⃣ *Book a Cab/Bus* - Reply 'book' or visit https://shailrajtravels.com\n2️⃣ *Tour Packages* - Reply 'packages' or 'tours'\n3️⃣ *Office Address* - Reply 'address'\n4️⃣ *Contact Us* - Reply 'contact'\n\nHow can we help you today?"
  },
  {
    keywords: ["book", "booking", "cab", "car", "bus", "rental", "hire"],
    reply: "🚗 *Book Your Ride with Shailraj Travels!*\n\nWe offer Sedan, SUV, Urbania, & Tempo Traveller rentals for outstation & local tours.\n\n👉 Book online directly: https://shailrajtravels.com/bookings\n📞 Or call us directly at +91 9359570497 for instant confirmation!"
  },
  {
    keywords: ["tours", "packages", "tour", "ashtavinayak", "mahableshwar", "goa", "shirdi", "konkan"],
    reply: "🏞️ *Popular Tour Packages by Shailraj Travels:*\n\n• Ashtavinayak Darshan (2 Days / 3 Days)\n• Shirdi - Shanishingnapur Tour\n• Mahabaleshwar & Panchgani Weekend Getaway\n• Konkan Coastal & Beach Tour\n• Goa Special Package\n\n👉 Explore full itinerary & rates: https://shailrajtravels.com/tours"
  },
  {
    keywords: ["address", "location", "office", "where"],
    reply: "📍 *Shailraj Travels Office Address:*\n\nVaibhav super market near akshada medical Gopal Patti Manjri budruk, Hadapsar, Pune, Maharashtra 412307, India\n\n🗺️ Google Maps: https://maps.google.com/?q=Manjri+Budruk+Hadapsar+Pune"
  },
  {
    keywords: ["contact", "phone", "number", "call", "owner", "support"],
    reply: "📞 *Contact Shailraj Travels:*\n\n• Phone / WhatsApp: +91 9359570497\n• Email: shailrajtravels@gmail.com\n• Website: https://shailrajtravels.com\n\nFeel free to call us anytime for urgent bookings!"
  }
];

@ApiTags('bot-rules')
@Controller('bot-rules')
export class BotRulesController {
  private getRulesPath(): string {
    const dataDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch (e) {}
    }
    const dataRulesPath = path.resolve(dataDir, 'chatbot-rules.json');
    if (fs.existsSync(dataRulesPath)) {
      return dataRulesPath;
    }

    let rulesPath = path.resolve(process.cwd(), 'chatbot-rules.json');
    if (fs.existsSync(rulesPath)) {
      return rulesPath;
    }

    const rootRulesPath = path.resolve(process.cwd(), '../chatbot-rules.json');
    if (fs.existsSync(rootRulesPath)) {
      return rootRulesPath;
    }

    return dataRulesPath;
  }

  @Get()
  @ApiOperation({ summary: 'Get chatbot rules' })
  @ApiResponse({ status: 200, description: 'Current chatbot rules' })
  getRules(): ChatbotRulesDto {
    try {
      const rulesPath = this.getRulesPath();
      if (fs.existsSync(rulesPath)) {
        const content = fs.readFileSync(rulesPath, 'utf8');
        const data = JSON.parse(content);
        if (Array.isArray(data.rules) && data.rules.length > 0) {
          return data as ChatbotRulesDto;
        }
      }
      try {
        fs.writeFileSync(rulesPath, JSON.stringify({ rules: DEFAULT_RULES }, null, 2), 'utf8');
      } catch (e) {}
      return { rules: DEFAULT_RULES };
    } catch (err) {
      return { rules: DEFAULT_RULES };
    }
  }

  @Put()
  @RequireRole(ApiKeyRole.ADMIN)
  @ApiOperation({ summary: 'Update chatbot rules' })
  @ApiResponse({ status: 200, description: 'Rules updated successfully' })
  updateRules(@Body() dto: ChatbotRulesDto): { success: boolean } {
    try {
      const rulesPath = this.getRulesPath();
      fs.writeFileSync(rulesPath, JSON.stringify(dto, null, 2), 'utf8');
      return { success: true };
    } catch (err) {
      throw new InternalServerErrorException('Failed to write chatbot rules');
    }
  }
}
