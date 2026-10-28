/**
 * EcoTrace Rewards Marketplace Visuals
 * High-resolution imagery for partner rewards and brand vouchers.
 */

export const REWARD_IMAGES = {
  nykaa: {
    src: "/images/rewards/nykaa_makeup.jpg",
    alt: "Nykaa luxury cosmetics, lipsticks, makeup brushes, and eco skincare",
    brand: "Nykaa Beauty",
    accentColor: "#E91E63",
    badgeBg: "bg-pink-600",
    badgeText: "text-white",
    borderGlow: "border-pink-300",
    logoLetter: "N",
    logoBadge: "NYKAA",
    tagline: "Beauty & Personal Care",
  },
  mcdonalds: {
    src: "/images/rewards/mcdonalds_burger_fries.jpg",
    alt: "McDonald's gourmet cheeseburger with sesame seed bun and hot crispy golden french fries",
    brand: "McDonald's",
    accentColor: "#DA291C",
    badgeBg: "bg-red-600",
    badgeText: "text-yellow-300",
    borderGlow: "border-amber-300",
    logoLetter: "M",
    logoBadge: "McD",
    tagline: "Meals & Fast Food",
  },
  amazon: {
    src: "/images/rewards/amazon_voucher.jpg",
    alt: "Amazon Climate Pledge eco-friendly delivery package and digital gift voucher card",
    brand: "Amazon Pay",
    accentColor: "#FF9900",
    badgeBg: "bg-zinc-900",
    badgeText: "text-amber-400",
    borderGlow: "border-zinc-700",
    logoLetter: "a",
    logoBadge: "amazon",
    tagline: "Climate Pledge Friendly",
  },
  ecoWarrior: {
    src: "/images/rewards/eco_warrior_cert.jpg",
    alt: "Eco Warrior digital sustainability credential certificate and gold holographic seal",
    brand: "EcoTrace Foundation",
    accentColor: "#10B981",
    badgeBg: "bg-emerald-700",
    badgeText: "text-white",
    borderGlow: "border-emerald-400",
    logoLetter: "W",
    logoBadge: "CERTIFIED",
    tagline: "Official Credential",
  },
  greenChampion: {
    src: "/images/rewards/green_champion_trophy.jpg",
    alt: "Gleaming golden championship trophy with emerald green gemstones and sculpted laurel leaves",
    brand: "Global Sustainability Club",
    accentColor: "#F59E0B",
    badgeBg: "bg-amber-600",
    badgeText: "text-white",
    borderGlow: "border-amber-300",
    logoLetter: "★",
    logoBadge: "CHAMPION",
    tagline: "Hall of Fame Award",
  },
  mysteryBonus: {
    src: "/images/rewards/mystery_bonus.jpg",
    alt: "Glowing magical emerald and gold treasure chest overflowing with coins and eco tokens",
    brand: "EcoTrace Gamification",
    accentColor: "#8B5CF6",
    badgeBg: "bg-purple-700",
    badgeText: "text-amber-300",
    borderGlow: "border-purple-400",
    logoLetter: "?",
    logoBadge: "MYSTERY",
    tagline: "Gamified Bonus Pack",
  },
};

/**
 * Maps a reward item to its corresponding visual asset configuration
 */
export function getRewardVisual(reward) {
  if (!reward) return REWARD_IMAGES.mysteryBonus;
  const merchant = (reward.merchant || "").toLowerCase();
  const title = (reward.title || "").toLowerCase();
  const category = (reward.category || "").toLowerCase();

  if (merchant.includes("nykaa") || title.includes("nykaa") || title.includes("beauty") || title.includes("cosmetic")) {
    return REWARD_IMAGES.nykaa;
  }
  if (merchant.includes("mcdonald") || merchant.includes("mcd") || title.includes("mcdonald") || title.includes("burger") || title.includes("meal")) {
    return REWARD_IMAGES.mcdonalds;
  }
  if (merchant.includes("amazon") || title.includes("amazon") || title.includes("gift card") || title.includes("pay balance")) {
    return REWARD_IMAGES.amazon;
  }
  if (merchant.includes("foundation") || title.includes("warrior") || title.includes("certificate") || title.includes("credential")) {
    return REWARD_IMAGES.ecoWarrior;
  }
  if (merchant.includes("champion") || title.includes("champion") || title.includes("trophy") || title.includes("hall of fame")) {
    return REWARD_IMAGES.greenChampion;
  }
  if (merchant.includes("bonus") || title.includes("bonus") || title.includes("mystery") || category.includes("bonus")) {
    return REWARD_IMAGES.mysteryBonus;
  }

  // Fallbacks by category
  if (category.includes("food")) {
    return REWARD_IMAGES.mcdonalds;
  }
  if (category.includes("shopping")) {
    return REWARD_IMAGES.nykaa;
  }
  if (category.includes("voucher")) {
    return REWARD_IMAGES.amazon;
  }

  return REWARD_IMAGES.mysteryBonus;
}
