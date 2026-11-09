import {
  Utensils,
  Shirt,
  HeartPulse,
  Laptop,
  Home,
  Car,
  Baby,
  BookOpen,
  Trophy,
  Sparkles,
  Tag,
} from "@/lib/icons";
import { formatDisplayName } from "./ad-formatters";

/**
 * 8-10 Curated Parent Category Taxonomy for MeelTe Ads.
 * Merges the 24+ flat and overlapping database categories into clear, scannable parent groups.
 */
export const TAXONOMY_GROUPS = [
  {
    id: "food-grocery",
    label: "Food & Grocery",
    Icon: Utensils,
    keywords: [
      "food & beverage",
      "restaurant/cooked food",
      "groceries",
      "vegetables",
      "food",
      "beverage",
      "grocery",
    ],
  },
  {
    id: "fashion",
    label: "Fashion",
    Icon: Shirt,
    keywords: [
      "mens fashion",
      "womens fashion",
      "boutique/tailors",
      "boutique",
      "tailor",
      "clothing",
      "fashion",
    ],
  },
  {
    id: "health-beauty",
    label: "Health & Beauty",
    Icon: HeartPulse,
    keywords: [
      "cosmetics/makeup",
      "pharmacy",
      "pharmacy & medical",
      "salons/spa",
      "salon",
      "spa",
      "cosmetics",
      "makeup",
      "medical",
    ],
  },
  {
    id: "electronics",
    label: "Electronics",
    Icon: Laptop,
    keywords: [
      "mobile computers",
      "tv, appliances, electronics",
      "electronics",
      "appliances",
      "computer",
      "mobile",
    ],
  },
  {
    id: "home-kitchen",
    label: "Home & Kitchen",
    Icon: Home,
    keywords: ["home & kitchen", "home", "kitchen", "furniture"],
  },
  {
    id: "automotive",
    label: "Automotive",
    Icon: Car,
    keywords: [
      "automotive / vehicle parts / accessories",
      "car, bikes",
      "automotive",
      "car",
      "bike",
      "vehicle",
    ],
  },
  {
    id: "kids-baby",
    label: "Kids & Baby",
    Icon: Baby,
    keywords: ["baby products, baby fashion", "kids", "baby", "children"],
  },
  {
    id: "books-stationery",
    label: "Books & Stationery",
    Icon: BookOpen,
    keywords: [
      "books & stationery and school supplies",
      "stationary",
      "stationery",
      "books",
      "school supplies",
    ],
  },
  {
    id: "entertainment-sports",
    label: "Sports & Fun",
    Icon: Trophy,
    keywords: [
      "movies, music & video games",
      "sports, fitness",
      "sports",
      "fitness",
      "games",
      "music",
      "movies",
    ],
  },
  {
    id: "others",
    label: "Others",
    Icon: Sparkles,
    keywords: ["others", "other", "services"],
  },
];

/**
 * Format category display name and fix known typos (e.g. "Stationary" -> "Stationery").
 */
export function cleanCategoryLabel(raw) {
  if (!raw || typeof raw !== "string") return "";
  const trimmed = raw.trim();
  if (trimmed.toLowerCase() === "stationary") {
    return "Stationery";
  }
  return formatDisplayName(trimmed);
}

/**
 * Map any raw category name to its best-matching parent taxonomy group.
 */
export function getTaxonomyGroupForCategory(catName) {
  if (!catName || typeof catName !== "string") {
    return TAXONOMY_GROUPS[TAXONOMY_GROUPS.length - 1]; // Other Services
  }
  const normalized = catName.toLowerCase().trim();

  // 1. Exact or keyword substring match
  for (const group of TAXONOMY_GROUPS) {
    if (group.keywords.some((k) => normalized === k || normalized.includes(k) || k.includes(normalized))) {
      return group;
    }
  }

  // 2. Default fallback
  return TAXONOMY_GROUPS[TAXONOMY_GROUPS.length - 1];
}

/**
 * Organize raw category lists and items into structured groups with live counts and subcategories.
 *
 * @param {Array} rawCategories - Category list from API ({ category, liveCount, ... } or string)
 * @param {Array} items - Currently loaded ads items
 * @returns {Array} List of parent groups with aggregated counts and their subcategories
 */
export function buildTaxonomyModel(rawCategories = [], items = []) {
  // Map of raw category -> liveCount
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

  // Count occurrences from loaded items (ensuring minimum count is at least loaded items)
  const loadedCountMap = new Map();
  items.forEach((ad) => {
    if (ad?.category) {
      const key = ad.category.toLowerCase();
      loadedCountMap.set(key, (loadedCountMap.get(key) || 0) + 1);
    }
  });

  // Consolidate raw category list
  const allRawNames = new Set();
  countMap.forEach((_, key) => allRawNames.add(key));
  loadedCountMap.forEach((_, key) => allRawNames.add(key));

  // Build each parent group
  const groups = TAXONOMY_GROUPS.map((group) => {
    const subcategories = [];
    let groupTotalCount = 0;

    allRawNames.forEach((rawLower) => {
      const parent = getTaxonomyGroupForCategory(rawLower);
      if (parent.id === group.id) {
        // Best estimate of count: max of API liveCount and loaded items count
        const apiCount = countMap.get(rawLower) || 0;
        const loadedCount = loadedCountMap.get(rawLower) || 0;
        const count = Math.max(apiCount, loadedCount);

        groupTotalCount += count;
        subcategories.push({
          raw: rawLower,
          label: cleanCategoryLabel(rawLower),
          count,
        });
      }
    });

    // Sort subcategories: populated first, then alphabetical
    subcategories.sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.label.localeCompare(b.label);
    });

    return {
      id: group.id,
      label: group.label,
      Icon: group.Icon || Tag,
      count: groupTotalCount,
      subcategories,
    };
  });

  return groups;
}

