import {
  Trophy,
  Music,
  Palette,
  Laptop,
  Utensils,
  BookOpen,
  Coffee,
  Sparkles,
  Heart,
  Calendar,
} from "@/lib/icons";
import { formatDisplayName } from "@/lib/display-name";

/**
 * 8-10 Curated Parent Category Taxonomy for MeelTe Community Events.
 * Groups diverse community and host categories into clear, scannable parent groups.
 */
export const EVENT_TAXONOMY_GROUPS = [
  {
    id: "sports-fitness",
    label: "Sports & Fitness",
    Icon: Trophy,
    keywords: [
      "sports",
      "fitness",
      "cricket",
      "football",
      "badminton",
      "yoga",
      "running",
      "marathon",
      "cycling",
      "trekking",
      "gym",
      "workout",
    ],
  },
  {
    id: "music-nightlife",
    label: "Music & Shows",
    Icon: Music,
    keywords: [
      "music",
      "concert",
      "band",
      "live music",
      "jam",
      "dj",
      "gig",
      "acoustic",
      "karaoke",
      "nightlife",
    ],
  },
  {
    id: "arts-culture",
    label: "Arts & Comedy",
    Icon: Palette,
    keywords: [
      "art",
      "comedy",
      "standup",
      "theatre",
      "drama",
      "dance",
      "painting",
      "pottery",
      "craft",
      "exhibition",
      "film",
      "movie",
      "culture",
    ],
  },
  {
    id: "tech-networking",
    label: "Tech & Business",
    Icon: Laptop,
    keywords: [
      "tech",
      "technology",
      "startup",
      "business",
      "networking",
      "ai",
      "coding",
      "hackathon",
      "founder",
      "developer",
      "career",
    ],
  },
  {
    id: "food-drinks",
    label: "Food & Drinks",
    Icon: Utensils,
    keywords: [
      "food",
      "drinks",
      "dining",
      "tasting",
      "cooking",
      "baking",
      "cafe",
      "brunch",
      "beverage",
    ],
  },
  {
    id: "workshops-learning",
    label: "Workshops & Classes",
    Icon: BookOpen,
    keywords: [
      "workshop",
      "class",
      "learning",
      "masterclass",
      "seminar",
      "coaching",
      "education",
      "training",
    ],
  },
  {
    id: "social-hangouts",
    label: "Social & Meetups",
    Icon: Coffee,
    keywords: [
      "social",
      "meetup",
      "hangout",
      "board games",
      "book club",
      "discussion",
      "community",
      "friends",
      "casual",
    ],
  },
  {
    id: "parties-celebrations",
    label: "Parties & Festivals",
    Icon: Sparkles,
    keywords: [
      "party",
      "celebration",
      "festival",
      "holiday",
      "gathering",
      "clubbing",
    ],
  },
  {
    id: "community-causes",
    label: "Causes & Volunteering",
    Icon: Heart,
    keywords: [
      "cause",
      "charity",
      "volunteering",
      "ngo",
      "clean up",
      "awareness",
      "fundraiser",
    ],
  },
  {
    id: "others",
    label: "Other Events",
    Icon: Calendar,
    keywords: ["others", "other", "general"],
  },
];

/**
 * Clean and format event category label.
 */
export function cleanEventCategoryLabel(raw) {
  if (!raw || typeof raw !== "string") return "";
  return formatDisplayName(raw.trim());
}

/**
 * Map an event category string to its best-matching parent group.
 */
export function getTaxonomyGroupForEventCategory(catName) {
  if (!catName || typeof catName !== "string") {
    return EVENT_TAXONOMY_GROUPS[EVENT_TAXONOMY_GROUPS.length - 1]; // Other Events
  }
  const normalized = catName.toLowerCase().trim();

  for (const group of EVENT_TAXONOMY_GROUPS) {
    if (group.keywords.some((k) => normalized === k || normalized.includes(k) || k.includes(normalized))) {
      return group;
    }
  }

  return EVENT_TAXONOMY_GROUPS[EVENT_TAXONOMY_GROUPS.length - 1];
}

/**
 * Organize event categories and loaded items into structured parent groups with counts and subcategories.
 */
export function buildEventTaxonomyModel(rawCategories = [], items = []) {
  const countMap = new Map();

  // Populate from category endpoint
  if (Array.isArray(rawCategories)) {
    rawCategories.forEach((c) => {
      const name = typeof c === "string" ? c : c?.category;
      if (!name) return;
      const count = typeof c === "object" && typeof c?.liveCount === "number" ? c.liveCount : 0;
      countMap.set(name.toLowerCase(), count);
    });
  }

  // Count occurrences from loaded events
  const loadedCountMap = new Map();
  items.forEach((event) => {
    if (event?.category) {
      const key = event.category.toLowerCase().trim();
      loadedCountMap.set(key, (loadedCountMap.get(key) || 0) + 1);
    }
  });

  const allRawNames = new Set();
  countMap.forEach((_, key) => allRawNames.add(key));
  loadedCountMap.forEach((_, key) => allRawNames.add(key));

  const groups = EVENT_TAXONOMY_GROUPS.map((group) => {
    const subcategories = [];
    let groupTotalCount = 0;

    allRawNames.forEach((rawLower) => {
      const parent = getTaxonomyGroupForEventCategory(rawLower);
      if (parent.id === group.id) {
        const apiCount = countMap.get(rawLower) || 0;
        const loadedCount = loadedCountMap.get(rawLower) || 0;
        const count = Math.max(apiCount, loadedCount);

        groupTotalCount += count;
        subcategories.push({
          raw: rawLower,
          label: cleanEventCategoryLabel(rawLower),
          count,
        });
      }
    });

    subcategories.sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.label.localeCompare(b.label);
    });

    return {
      id: group.id,
      label: group.label,
      Icon: group.Icon || Calendar,
      count: groupTotalCount,
      subcategories,
    };
  });

  return groups;
}

