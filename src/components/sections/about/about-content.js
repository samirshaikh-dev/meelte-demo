

/** Keeps the visual breadcrumb and its BreadcrumbList schema in sync. */
export const ABOUT_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
];


export const ABOUT_DESCRIPTION =
  "meelTe is a hyperlocal community app for India: nearby shop offers, local events you can join, and the people you follow. Live on Google Play and the App Store.";

/**
 * In-page anchors. The `id` values must stay in step with the sections rendered by
 * AboutStory, AboutMission, AboutVision, AboutCapabilities and AboutCta.
 */
export const ABOUT_ON_THIS_PAGE = [
  { id: "story", label: "Our story" },
  { id: "mission", label: "Mission" },
  { id: "vision", label: "Vision" },
  { id: "what-we-do", label: "What we do" },
  { id: "why-meelTe", label: "Why meelTe" },
];

export const ABOUT_HERO = {
  badge: "Our Purpose & Origin",
  titleLead: "About",
  titleAccent: "meelTe",
  lead: "Why we built a platform to help people find what matters, before it slips away.",
  goalLabel: "Our core goal",
  goal: "Help people connect with the right opportunities and the right people at the right time.",
  playLabel: "Get it on Google Play",
  appStoreLabel: "Download for iPhone",
};

export const ABOUT_HOW_IT_WORKS_LABEL = "See how it works";

export const ABOUT_STORY = {
  title: "Our Story",
  intro: "meelTe was born from a simple everyday experience.",
  acts: [
    {
      marker: "01",
      icon: "Zap",
      title: "The Fleeting Opportunity",
      paragraphs: [
        "While browsing a social platform, I came across an attractive product offer that caught my attention. Before I could learn more, I received a phone call. By the time the call ended, the advertisement had disappeared and I was unable to find it again.",
        "I regretted answering the call and realised how easily valuable opportunities can be lost in the fast-moving digital world.",
      ],
    },
    {
      marker: "02",
      icon: "MapPin",
      title: "The Disconnection in a New City",
      paragraphs: [
        "At another point, while travelling to a new city, I found it difficult to connect with people who shared my language, culture, and interests. Despite being surrounded by thousands of people, meaningful connections were hard to find.",
      ],
    },
    {
      marker: "03",
      icon: "Sparkles",
      title: "The Inspiration Behind meelTe",
      paragraphs: [
        "These experiences inspired the creation of meelTe — a platform designed to help people discover opportunities, local products, meaningful events, and communities without missing what matters most to them.",
      ],
      conclusion:
        "Our goal is simple: help people connect with the right opportunities and the right people at the right time.",
      emphasis: true,
    },
  ],
};

export const ABOUT_MISSION = {
  title: "Our Mission",
  intro:
    "At meelTe, our mission is to help people discover value in their local communities.",
  items: [
    {
      icon: "Store",
      title: "Faster, Smarter Local Commerce",
      body: "We aim to enable users to find products available nearby at competitive prices, allowing them to purchase what they need without waiting for deliveries or lengthy searches. By connecting buyers with local opportunities, we help users make faster and smarter decisions.",
      note: "Zero delivery delays · immediate neighborhood access",
    },
    {
      icon: "HeartHandshake",
      title: "Meaningful Human Connections",
      body: "At the same time, we believe meaningful human connections are more important than ever. Through community-driven events and social experiences, meelTe provides a platform where people with shared interests, hobbies, cultures, and goals can come together, build relationships, and create lasting memories.",
      note: "Shared cultures & hobbies · real-world memories",
    },
  ],
};

export const ABOUT_VISION = {
  title: "Our Vision",
  intro:
    "We envision a world where discovering opportunities and building connections is effortless.",
  subIntro:
    "Our vision is to become a trusted platform that bridges the gap between local commerce and community engagement by helping people:",
  points: [
    {
      marker: "01",
      icon: "Store",
      title: "Discover nearby products & services",
      body: "Find what is available in your neighborhood quickly without endless scrolling or lengthy delivery waits.",
    },
    {
      marker: "02",
      icon: "Users",
      title: "Connect with like-minded individuals",
      body: "Build meaningful bonds with people around you who share your language, culture, interests, and passions.",
    },
    {
      marker: "03",
      icon: "CalendarDays",
      title: "Participate in meaningful events",
      body: "Join or organize local gatherings, hobby circles, sports meetups, and real-world social experiences.",
    },
    {
      marker: "04",
      icon: "HeartHandshake",
      title: "Build stronger local communities",
      body: "Support local shopkeepers, neighbors, and organizers to create resilient, vibrant neighborhoods.",
    },
  ],
  quote:
    "We aspire to create an ecosystem where every interaction adds value and every connection has purpose.",
};

export const ABOUT_CAPABILITIES = {
  badge: "Platform Experience",
  title: "What We Do",
  intro:
    "meelTe is a platform that brings together people, communities, events, and local opportunities in one place.",
  items: [
    {
      icon: "Compass",
      title: "Discover Nearby Products",
      body: "Find products available near your location at competitive prices, without waiting for deliveries.",
      chip: "Fast & Local",
    },
    {
      icon: "Sparkles",
      title: "Explore Local Offers",
      body: "Never miss a fleeting local deal or neighborhood opportunity before it slips away.",
      chip: "Fleeting Deals",
    },
    {
      icon: "CalendarDays",
      title: "Create & Join Community Events",
      body: "Organize weekend runs, pottery jams, workshops, and community festivals with zero barrier to entry.",
      chip: "Real World",
    },
    {
      icon: "Users",
      title: "Connect with People",
      body: "Easily meet neighbors who share your hobbies, native language, cultural background, and ambitions.",
      chip: "Authentic Ties",
    },
    {
      icon: "ShieldCheck",
      title: "Real-World Relationships",
      body: "Move past superficial online follows into genuine, lasting friendships and community support networks.",
      chip: "Meaningful",
    },
  ],
};

export const ABOUT_WHY = {
  badge: "The meelTe Difference",
  title: "Why Choose meelTe",
  /**
   * The opening sentence carries three emphasised words. They are stored separately
   * because each one is rendered as its own inline element — the emphasis has to
   * survive as markup, not as a string the component cannot reach into.
   */
  difference: {
    before:
      "Unlike traditional platforms that often overwhelm users with irrelevant content, meelTe focuses on ",
    emphasis: ["relevance", "community", "meaningful discovery"],
    after: ".",
  },
  body: "We believe users should spend less time searching and more time finding exactly what they need.",
  contactLabel: "Contact Our Team",
};
