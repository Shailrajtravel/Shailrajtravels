import { Author } from "../types/author";

export const authors: Record<string, Author> = {
  "mayur-patil": {
    id: "mayur-patil",
    name: "Mayur Patil",
    role: "Founder & Chief Pilgrimage Guide",
    yearsOfExperience: 5,
    location: "Gopal Patti, Manjri Budruk, Hadapsar, Pune - 412307",
    address: "Vaibhav Super Market, near Akshada Medical, Gopal Patti, Manjri Budruk, Hadapsar, Pune 412307",
    phone: "+919764413556",
    bio: "Mayur Patil is the Founder of Shailraj Travels, operating directly from Gopal Patti, Manjri Budruk, Hadapsar, Pune. Established in 2021, he brings deep devotion and firsthand on-ground operational expertise, pioneering premier spiritual tours and custom travel packages from Pune including the Ujjain Mahakaleshwar & Omkareshwar Tour, Ashtavinayak Darshan, and Maharashtra Jyotirlinga circuits with company-owned luxury AC Force Urbania coaches. He personally oversees route safety, temple darshan arrangements, and yatri comfort across Pune.",
    avatarUrl: "/images/authors/mayur-patil.jpg",
    expertiseAreas: [
      "Ujjain & Omkareshwar Pilgrimage Tours",
      "Ashtavinayak Yatra",
      "Pan-India Jyotirlinga Circuits",
      "Luxury Fleet & Force Urbania Travel",
      "Senior Citizen Pilgrimage Planning",
    ],
    regionsCovered: ["Maharashtra", "Madhya Pradesh", "Gujarat", "Andhra Pradesh", "Uttarakhand"],
    languages: ["Marathi", "Hindi", "English"],
    contactProfileUrl: "/about-shailraj-travels",
    socialLinks: {
      instagram: "https://www.instagram.com/wings_of_mayur_9999/",
    },
  },
  "shaila-mayur-patil": {
    id: "shaila-mayur-patil",
    name: "Shaila Mayur Patil",
    role: "Co-Founder & Yatri Hospitality Director",
    yearsOfExperience: 5,
    bio: "Shaila Mayur Patil is the Co-Founder of Shailraj Travels. Guiding the yatri care and hospitality vision since 2021, she ensures all pilgrimage packages feature hygienic 3-star AC accommodations, authentic pure vegetarian sattvic meals, and personalized care for elderly pilgrims and family groups.",
    avatarUrl: "/images/authors/shaila-mayur-patil.jpg",
    expertiseAreas: [
      "Pilgrim Care & Hospitality",
      "Pure Vegetarian Dining Coordination",
      "Family Pilgrimage Planning",
      "Senior Citizen Assistance",
    ],
    regionsCovered: ["Maharashtra", "Madhya Pradesh", "Gujarat"],
    languages: ["Marathi", "Hindi"],
    contactProfileUrl: "/about-shailraj-travels",
  },
};
