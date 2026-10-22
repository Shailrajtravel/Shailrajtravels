export interface Comparison {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  toursCompared: string[];
  keyDifferences: { aspect: string; optionA: string; optionB: string }[];
  verdict: string;
}

export const comparisons: Comparison[] = [
  {
    slug: "ujjain-vs-kashi-vishwanath",
    title: "Ujjain Mahakaleshwar vs Kashi Vishwanath Tour",
    metaTitle: "Ujjain vs Kashi Vishwanath Jyotirlinga Tour Comparison | Shailraj Travels",
    metaDescription:
      "Comparing the Ujjain Mahakaleshwar Jyotirlinga experience with Kashi Vishwanath. Which spiritual journey from Pune should you choose first?",
    toursCompared: ["ujjain-omkareshwar-Ghrishneshwar-maheshwar-tour", "pune-mumbai-to-3-jyotirlinga-darshan"],
    keyDifferences: [
      {
        aspect: "Primary Deity",
        optionA: "Lord Shiva (Mahakal)",
        optionB: "Lord Shiva (Maharashtra Tri-Jyotirlinga)",
      },
      { aspect: "Tour Duration", optionA: "3 Days / 2 Nights", optionB: "3 Days / 2 Nights" },
      {
        aspect: "Key Rituals",
        optionA: "Bhasma Aarti (Ujjain)",
        optionB: "Abhishek at Trimbakeshwar & Bhimashankar",
      },
      {
        aspect: "Travel Fatigue",
        optionA: "Low-Moderate (AC Force Urbania via Nashik/Sendhwa)",
        optionB: "Low (Western Maharashtra scenic routes)",
      },
    ],
    verdict:
      "If your priority is experiencing the divine Bhasma Aarti at Mahakaleshwar along with Omkareshwar and Grishneshwar, choose the Ujjain tour. If you wish to complete the sacred Maharashtra Jyotirlingas closer to home without crossing state borders, choose the 3 Jyotirlinga Darshan.",
  },
  {
    slug: "ashtavinayak-vs-saptashrungi",
    title: "Ashtavinayak Yatra vs Saptashrungi Tour",
    metaTitle: "Ashtavinayak vs Saptashrungi Weekend Tour Comparison | Shailraj Travels",
    metaDescription:
      "Comparing the 2-day Ashtavinayak Yatra with the Saptashrungi Devi weekend tour from Pune. Which is better for family?",
    toursCompared: ["pune-to-ashtavinayak-darshan", "pune-to-shakti-peeth-yatra"],
    keyDifferences: [
      {
        aspect: "Focus",
        optionA: "8 Ganesha Temples",
        optionB: "Shakti Peetha Devi Temples",
      },
      {
        aspect: "Pacing",
        optionA: "Fast (Covering 8 temples in 2 days)",
        optionB: "Relaxed spiritual pace",
      },
      { aspect: "Travel Medium", optionA: "AC Force Urbania / Bus", optionB: "Private AC Car / Urbania" },
      {
        aspect: "Physical Strain",
        optionA: "Moderate (Lenyadri 283 steps)",
        optionB: "Low (Ropeway / elevator facilities available)",
      },
    ],
    verdict:
      "For a spiritually exhaustive traditional pilgrimage with family, the Ashtavinayak Yatra is unparalleled. For a highly relaxed, low-strain weekend getaway with senior citizens, the Shakti Peeth / Saptashrungi tour is the better choice.",
  },
  {
    slug: "dwarka-somnath-vs-jagannath-puri",
    title: "Dwarka Somnath vs Jagannath Puri Tour",
    metaTitle: "Dwarka Somnath vs Jagannath Puri Tour Comparison | Shailraj Travels",
    metaDescription:
      "Compare the western Dham (Dwarka) with the eastern Dham (Jagannath Puri). Travel logistics from Pune, Darshan experiences, and costs.",
    toursCompared: ["pune-to-girnar-spiritual-tour", "pune-to-tirupati-balaji-darshan-tour"],
    keyDifferences: [
      {
        aspect: "Location",
        optionA: "West Coast (Arabian Sea, Gujarat)",
        optionB: "East Coast (Bay of Bengal, Odisha)",
      },
      { aspect: "Primary Dham", optionA: "Dwarkadhish", optionB: "Lord Jagannath" },
      {
        aspect: "Local Sightseeing",
        optionA: "Girnar Ropeway, Nageshwar, Porbandar",
        optionB: "Konark Sun Temple, Chilika Lake",
      },
      {
        aspect: "Travel from Pune",
        optionA: "Flight/Train to Ahmedabad or Rajkot",
        optionB: "Direct Flight to Bhubaneswar",
      },
    ],
    verdict:
      "Both are supreme Dhams of Lord Vishnu/Krishna. Jagannath Puri is generally faster to reach from Pune via a direct flight and offers a more relaxed beach-town vibe. Dwarka Somnath is a more extensive, multi-city road trip offering a higher density of temples.",
  },
];
