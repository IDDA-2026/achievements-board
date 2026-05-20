// =============================================================
//  IDDA LEADERBOARD — DATA FILE
//  Edit this file to update players and achievements.
//  Follow the existing structure exactly.
// =============================================================

const LEADERBOARD_DATA = {
  meta: {
    cohort: "IDDA Cohort 2026",
    subtitle: "",
    updatedAt: "2025-05-18",
  },

  // ----------------------------------------------------------
  // ACHIEVEMENTS — master list of every possible achievement.
  // rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
  // ----------------------------------------------------------
  achievements: [
    {
      id: "on_time",
      name: "On Time",
      description:
        "Session starts and you are already connected with your camera on during the week.",
      icon: "⏰",
      points: 100,
      rarity: "uncommon",
      category: "dedication",
    },
    {
      id: "bonus_lab_1",
      name: "Bonus Lab 1: HTML Dashboard",
      description: "HTML Dashboard bonus lab delivered on time.",
      icon: "🖥️",
      points: 500,
      rarity: "epic",
      category: "coding",
    },
    {
      id: "bonus_lab_2",
      name: "Bonus Lab 2: LLM cards",
      description: "LLM cards bonus lab delivered on time.",
      icon: "🖥️",
      points: 500,
      rarity: "epic",
      category: "coding",
    },
    {
      id: "kahoot_fixjava_1st",
      name: "Kahoot: Fix My Java Brain: 1st Place",
      description: "Winner of the Fix My Java Brain Kahoot challenge.",
      icon: "🏆",
      points: 500,
      rarity: "epic",
      category: "challenge",
    },
    {
      id: "kahoot_fixjava_2nd",
      name: "Kahoot: Fix My Java Brain: 2nd Place",
      description: "Second place in the Fix My Java Brain Kahoot challenge.",
      icon: "🥈",
      points: 250,
      rarity: "rare",
      category: "challenge",
    },
    {
      id: "labs_week_may18",
      name: "Week of May 18 — Labs Delivered",
      description: "All labs for the week of May 18 delivered by end of week.",
      icon: "📚",
      points: 200,
      rarity: "rare",
      category: "coding",
      locked: true,
    },
  ],

  // ----------------------------------------------------------
  // PLAYERS — add one object per student.
  // avatar: path relative to index.html (e.g. "avatars/name.jpg")
  // title: custom title shown on card; leave "" for auto-title
  // earnedAchievements: list of { id, earnedAt } objects
  //   earnedAt format: "YYYY-MM-DD"
  // ----------------------------------------------------------
  players: [
    {
      id: "yusif",
      name: "Yusif",
      avatar: "avatars/yusif.png",
      title: "",
      earnedAchievements: [{ id: "bonus_lab_1", earnedAt: "2026-05-18" }, { id: "bonus_lab_2", earnedAt: "2026-05-19" }],
    },
    {
      id: "yaqut",
      name: "Yaqut",
      avatar: "avatars/yaqut.png",
      title: "",
      earnedAchievements: [],
    },
    {
      id: "umut",
      name: "Umut",
      avatar: "avatars/umut.png",
      title: "",
      earnedAchievements: [{ id: "bonus_lab_1", earnedAt: "2026-05-19" }, { id: "bonus_lab_2", earnedAt: "2026-05-20" }],
    },
    {
      id: "ulvi",
      name: "Ulvi",
      avatar: "avatars/ulvi.png",
      title: "",
      earnedAchievements: [{ id: "kahoot_fixjava_2nd", earnedAt: "2026-05-20" }],
    },
    {
      id: "sevinc",
      name: "Sevinc",
      avatar: "avatars/sevinc.png",
      title: "",
      earnedAchievements: [{ id: "bonus_lab_1", earnedAt: "2026-05-19" }],
    },
    {
      id: "omar",
      name: "Omar",
      avatar: "avatars/omar.png",
      title: "",
      earnedAchievements: [{ id: "bonus_lab_1", earnedAt: "2026-05-18" }, { id: "bonus_lab_2", earnedAt: "2026-05-19" }, { id: "kahoot_fixjava_1st", earnedAt: "2026-05-20" }],
    },
    {
      id: "shaig",
      name: "Shaig",
      avatar: "avatars/shaig.png",
      title: "",
      earnedAchievements: [{ id: "bonus_lab_1", earnedAt: "2026-05-18" }, { id: "bonus_lab_2", earnedAt: "2026-05-19" }],
    },
    {
      id: "lala",
      name: "Lala",
      avatar: "avatars/lala.png",
      title: "",
      earnedAchievements: [],
    },
    {
      id: "elcin",
      name: "Elcin",
      avatar: "avatars/elcin.png",
      title: "",
      earnedAchievements: [{ id: "bonus_lab_1", earnedAt: "2026-05-19" }],
    },
    {
      id: "kenan",
      name: "Kenan",
      avatar: "avatars/kenan.png",
      title: "",
      earnedAchievements: [{ id: "bonus_lab_1", earnedAt: "2026-05-18" }, { id: "bonus_lab_2", earnedAt: "2026-05-19" }, { id: "kahoot_fixjava_1st", earnedAt: "2026-05-20" }],
    },
    {
      id: "abdulvahhab",
      name: "Abdulvahhab",
      avatar: "avatars/abdulvahhab.png",
      title: "",
      earnedAchievements: [{ id: "bonus_lab_1", earnedAt: "2026-05-18" }, { id: "bonus_lab_2", earnedAt: "2026-05-19" }],
    },
    {
      id: "aslan",
      name: "Aslan",
      avatar: "avatars/aslan.png",
      title: "",
      earnedAchievements: [{ id: "bonus_lab_1", earnedAt: "2026-05-19" }, { id: "bonus_lab_2", earnedAt: "2026-05-19" }],
    },
    {
      id: "revan",
      name: "Rəvan",
      avatar: "avatars/revan.png",
      title: "",
      earnedAchievements: [{ id: "bonus_lab_1", earnedAt: "2026-05-18" }, { id: "bonus_lab_2", earnedAt: "2026-05-19" }],
    },
    {
      id: "mikayil",
      name: "Mikayil",
      avatar: "avatars/mikayil.png",
      title: "",
      earnedAchievements: [{ id: "bonus_lab_1", earnedAt: "2026-05-18" }, { id: "bonus_lab_2", earnedAt: "2026-05-19" }],
    },
    {
      id: "asiman",
      name: "Asiman",
      avatar: "avatars/asiman.png",
      title: "",
      earnedAchievements: [{ id: "bonus_lab_1", earnedAt: "2026-05-19" }],
    },
    {
      id: "shebnem",
      name: "Shebnem",
      avatar: "avatars/shebnem.png",
      title: "",
      earnedAchievements: [{ id: "bonus_lab_1", earnedAt: "2026-05-19" }],
    },
    {
      id: "nuray",
      name: "Nuray",
      avatar: "avatars/nuray.png",
      title: "",
      earnedAchievements: [{ id: "bonus_lab_1", earnedAt: "2026-05-18" }, { id: "bonus_lab_2", earnedAt: "2026-05-19" }],
    },
    {
      id: "nihad",
      name: "Nihad",
      avatar: "avatars/nihad.png",
      title: "",
      earnedAchievements: [],
    },
    {
      id: "ruzi",
      name: "Ruzi",
      avatar: "avatars/ruzi.png",
      title: "",
      earnedAchievements: [{ id: "bonus_lab_1", earnedAt: "2026-05-18" }, { id: "bonus_lab_2", earnedAt: "2026-05-19" }],
    },
    {
      id: "ali",
      name: "Ali",
      avatar: "avatars/default.png",
      title: "",
      earnedAchievements: [],
    },
    {
      id: "ayhan",
      name: "Ayhan",
      avatar: "avatars/default.png",
      title: "",
      earnedAchievements: [],
    },
    {
      id: "islam",
      name: "Islam",
      avatar: "avatars/default.png",
      title: "",
      earnedAchievements: [],
    },
    {
      id: "ilkin",
      name: "İlkin",
      avatar: "avatars/default.png",
      title: "",
      earnedAchievements: [],
    },
    {
      id: "mansura",
      name: "Mansura",
      avatar: "avatars/default.png",
      title: "",
      earnedAchievements: [{ id: "bonus_lab_1", earnedAt: "2026-05-20" }],
    },
    {
      id: "mohsin",
      name: "Mohsin",
      avatar: "avatars/default.png",
      title: "",
      earnedAchievements: [],
    },
    {
      id: "qurbanali",
      name: "Qurbanali",
      avatar: "avatars/default.png",
      title: "",
      earnedAchievements: [{ id: "bonus_lab_1", earnedAt: "2026-05-19" }, { id: "bonus_lab_2", earnedAt: "2026-05-19" }],
    },
    {
      id: "yunis",
      name: "Yunis",
      avatar: "avatars/default.png",
      title: "",
      earnedAchievements: [],
    },
  ],
};
