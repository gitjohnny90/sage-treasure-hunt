// Stop data for the Ranger Sage Treasure Hunt prototype.
// Placeholder narration + clues. Real content gets dropped in later.
// Coordinates (mapX/mapY) are % positions on the stylized SVG map.

// Pin coordinates are % positions on camp-map_rotated.png (rotated 90 CCW from original).
// First-pass estimates — easy to nudge per pin.
const OUTDOOR_STOPS = [
  {
    id: 1,
    num: 1,
    name: "The Family Commons",
    pose: "pointing",
    mapX: 55.4, mapY: 79.2,
    hasSubStops: true,
    sageIntro: "Welcome to the heart of camp! The Family Commons is where everything begins.",
    transcript: "[Placeholder narration] The Family Commons was built as the central gathering place at Camp Gunnison. Inside you'll find the Ambassador Room, the Timothy Statue, the Library, and more. Take your time exploring each of the six interior spots.",
    clue: "Spot the silver dump truck sticker somewhere nearby!",
    clueSticker: "silver-dump-truck"
  },
  {
    id: 2, num: 2,
    name: "The Gunnison Triplex",
    pose: "arms-open",
    mapX: 37.2, mapY: 72.8,
    sageIntro: "Three cabins in one — this is where a lot of family adventures start.",
    transcript: "[Placeholder narration] The Gunnison Triplex provides comfortable lodging for visiting families. It's one of the camp's most popular cabins for summer events.",
    clue: "Look for a paw-print hidden on the porch railing.",
    clueSticker: "paw-print"
  },
  {
    id: 3, num: 3,
    name: "Waters of Life",
    pose: "looking",
    mapX: 40.8, mapY: 68.2,
    sageIntro: "Quiet, beautiful, and one of my favorite spots to stop and listen.",
    transcript: "[Placeholder narration] Waters of Life is a peaceful site for reflection, dedicated to scripture and stillness. Take a breath here.",
    clue: "Find a small dove icon carved or painted somewhere here.",
    clueSticker: "dove"
  },
  {
    id: 4, num: 4,
    name: "The Circle Cabin",
    pose: "pointing-reverse",
    mapX: 48.7, mapY: 64.5,
    sageIntro: "Round and cozy — this cabin's shape tells a story of its own.",
    transcript: "[Placeholder narration] The Circle Cabin's unique round footprint dates from the early years of the camp. It's been a quiet favorite ever since.",
    clue: "Can you count how many windows it has? Hint: not what you'd guess.",
    clueSticker: "compass"
  },
  {
    id: 5, num: 5,
    name: "Aspen Trees",
    pose: "arms-open",
    mapX: 47.8, mapY: 68.0,
    sageIntro: "The aspens here are some of the oldest at camp. Stop and listen — they actually whisper.",
    transcript: "[Placeholder narration] These aspen trees have been part of the camp landscape since before the ministry acquired the property. In autumn they turn brilliant gold.",
    clue: "Find a heart carved in a trunk somewhere.",
    clueSticker: "leaf"
  },
  {
    id: 6, num: 6,
    name: "Cabin 6",
    pose: "pointing",
    mapX: 42.8, mapY: 57.0,
    sageIntro: "Each cabin's got a story. Cabin 6 is no different.",
    transcript: "[Placeholder narration] Cabin 6 is one of the original 1950s structures on the property, remodeled in the 1980s by Way International staff.",
    clue: "Look for the year carved into the doorframe.",
    clueSticker: "compass"
  },
  {
    id: 7, num: 7,
    name: "The Inn",
    pose: "leaning",
    mapX: 56.3, mapY: 65.0,
    sageIntro: "The Inn's where a lot of campers stay. Friendly place, lots of memories.",
    transcript: "[Placeholder narration] The Inn provides comfortable lodging for guests staying multiple nights. It's the largest single building on camp besides the Family Commons.",
    clue: "Find Sage's paw print on the lobby floor.",
    clueSticker: "paw-print"
  },
  {
    id: 8, num: 8,
    name: "Cabin 8",
    pose: "pointing-reverse",
    mapX: 38.3, mapY: 63.0,
    sageIntro: "Another classic. These cabins each have their own character.",
    transcript: "[Placeholder narration] Cabin 8 has hosted countless families through the years. Each cabin at Camp Gunnison is named simply by number — a tradition since the 1970s.",
    clue: "Spot the small wooden sign with a Bible verse.",
    clueSticker: "compass"
  },
  {
    id: 9, num: 9,
    name: "Origins of Camp Gunnison",
    pose: "looking",
    mapX: 53.7, mapY: 62.5,
    sageIntro: "This is where it all began. The story of how Camp Gunnison came to be.",
    transcript: "[Placeholder narration] In 1976, Dr. Victor Paul Wierwille and his wife Dorothea found this property — then called Sleepy Hollow — and acquired it on a handshake. The camp was renamed and officially dedicated on July 17, 1977.",
    clue: "Find a plaque with the year 1976 on it.",
    clueSticker: "compass"
  },
  {
    id: 10, num: 10,
    name: "The Ranch Home",
    pose: "arms-open",
    mapX: 55.2, mapY: 57.0,
    sageIntro: "The Ranch Home — the original heart of the property.",
    transcript: "[Placeholder narration] The Ranch Home is one of the original buildings on the property, predating the ministry's acquisition.",
    clue: "Look for a horseshoe somewhere on the building.",
    clueSticker: "compass"
  },
  {
    id: 11, num: 11,
    name: "Ermal Owens Pavilion",
    pose: "pointing",
    mapX: 49.7, mapY: 58.3,
    sageIntro: "A gathering space for big camp events. Lots of joy under this roof.",
    transcript: "[Placeholder narration] The Ermal Owens Pavilion hosts outdoor events, large meals, and special gatherings throughout the camp season.",
    clue: "Count the support beams. There's a story in the number.",
    clueSticker: "leaf"
  },
  {
    id: 12, num: 12,
    name: "The Gunnison Bridge",
    pose: "pointing-reverse",
    mapX: 50.3, mapY: 49.7,
    sageIntro: "Crossing the river. Take a moment up here — best view at camp.",
    transcript: "[Placeholder narration] The Gunnison Bridge crosses the Gunnison River, connecting the main cabin area to the eastern pastures and recreation areas.",
    clue: "Look for fish in the water below.",
    clueSticker: "dove"
  },
  {
    id: 13, num: 13,
    name: "The North Pasture",
    pose: "arms-open",
    mapX: 61.1, mapY: 51.1,
    sageIntro: "Wide open and beautiful. The pasture stretches further than you'd think.",
    transcript: "[Placeholder narration] The North Pasture is part of the camp's working ranch land, home to grazing horses and sweeping mountain views.",
    clue: "Spot a wildflower in three different colors.",
    clueSticker: "leaf"
  },
  {
    id: 14, num: 14,
    name: "The Gazebo",
    pose: "leaning",
    mapX: 62.8, mapY: 29.5,
    sageIntro: "A perfect spot for quiet. The gazebo's a camper favorite.",
    transcript: "[Placeholder narration] The Gazebo offers a quiet retreat with views of the river and the surrounding peaks. It's a favorite spot for morning devotionals.",
    clue: "Find the date carved into the gazebo's beam.",
    clueSticker: "compass"
  },
  {
    id: 15, num: 15,
    name: "The Maintenance Building",
    pose: "pointing",
    mapX: 94.6, mapY: 25.7,
    sageIntro: "This is where the magic happens — keeping camp running takes a whole team.",
    transcript: "[Placeholder narration] The Maintenance Building is the operational hub of the camp, where the team that keeps everything working calls home base.",
    clue: "Spot the silver dump truck parked somewhere nearby!",
    clueSticker: "silver-dump-truck"
  },
  {
    id: 16, num: 16,
    name: "Tack Shop",
    pose: "pointing-reverse",
    mapX: 81.9, mapY: 35.1,
    sageIntro: "Saddles, bridles, all the gear. This is where the horseback adventures begin.",
    transcript: "[Placeholder narration] The Tack Shop houses the camp's horseback riding equipment. Saddle up — some of camp's best memories happen on horseback.",
    clue: "Find a horseshoe on the wall.",
    clueSticker: "compass"
  },
  {
    id: 17, num: 17,
    name: "The Water Tank and Dedication Prayer",
    pose: "looking",
    mapX: 91.7, mapY: 53.4,
    sageIntro: "A special place. The dedication prayer was offered here when Camp Gunnison was officially dedicated.",
    transcript: "[Placeholder narration] The Water Tank stands as a marker of the dedication of Camp Gunnison on July 17, 1977. The original dedication prayer is inscribed nearby.",
    clue: "Look for the inscribed plaque and read the prayer.",
    clueSticker: "dove"
  },
  {
    id: 18, num: 18,
    name: "The Grotto",
    pose: "leaning",
    mapX: 63.9, mapY: 62.5,
    sageIntro: "Tucked away and beautiful. The Grotto's a hidden gem.",
    transcript: "[Placeholder narration] The Grotto is a small natural rock formation that's become a contemplative spot for visitors.",
    clue: "Find Sage's paw print on a rock.",
    clueSticker: "paw-print"
  },
  {
    id: 19, num: 19,
    name: "The Green",
    pose: "arms-open",
    mapX: 65.6, mapY: 67.6,
    sageIntro: "Wide-open green space. Games, gatherings, and a lot of laughter happen here.",
    transcript: "[Placeholder narration] The Green is the camp's main open lawn — used for games, gatherings, outdoor worship, and just sprawling out in the sun.",
    clue: "Spot a frisbee or game equipment left out.",
    clueSticker: "leaf"
  },
  {
    id: 20, num: 20,
    name: "The South Lot",
    pose: "pointing",
    mapX: 62.3, mapY: 93.4,
    sageIntro: "Last stop on the outdoor tour! You made it all the way around.",
    transcript: "[Placeholder narration] The South Lot serves as additional parking and a quiet entry point to the southern trails. Congratulations on completing the outdoor tour!",
    clue: "Find Sage's paw print pointing the way home.",
    clueSticker: "paw-print"
  }
];

const COMMONS_STOPS = [
  {
    id: "commons-1", num: "1A",
    name: "The Entrance",
    pose: "welcoming",
    sageIntro: "Welcome inside! This is where families first arrive at the Commons.",
    transcript: "[Placeholder narration] The Family Commons entrance welcomes guests with displays celebrating the camp's history and current programs.",
    clue: "Find a photo from the camp's earliest years.",
    clueSticker: "compass"
  },
  {
    id: "commons-2", num: "1B",
    name: "The Ambassador Room",
    pose: "pointing",
    sageIntro: "The Ambassador Room — named for the Way Ambassadors program.",
    transcript: "[Placeholder narration] This room honors the Way Ambassadors Outreach Program and the work of those who carry the ministry around the world.",
    clue: "Spot a map of the world with pins.",
    clueSticker: "compass"
  },
  {
    id: "commons-3", num: "1C",
    name: "The Timothy Statue",
    pose: "looking",
    sageIntro: "Stop and study this one. The Timothy Statue has a powerful meaning.",
    transcript: "[Placeholder narration] The Timothy Statue represents the principle of teaching the next generation, drawn from the apostle Paul's letters to Timothy.",
    clue: "Read the plaque at the base.",
    clueSticker: "dove"
  },
  {
    id: "commons-4", num: "1D",
    name: "The Second Floor",
    pose: "pointing-reverse",
    sageIntro: "Head upstairs! There's more to see on the second floor.",
    transcript: "[Placeholder narration] The second floor of the Family Commons holds meeting rooms, displays, and quiet study spaces.",
    clue: "Find the best view from the upstairs window.",
    clueSticker: "leaf"
  },
  {
    id: "commons-5", num: "1E",
    name: "The Library",
    pose: "leaning",
    sageIntro: "Books, study, and quiet. The Library is one of my favorite rooms.",
    transcript: "[Placeholder narration] The Library at Camp Gunnison houses ministry materials, scripture studies, and resources for personal and group study.",
    clue: "Find a book with a deer on the cover.",
    clueSticker: "leaf"
  },
  {
    id: "commons-6", num: "1F",
    name: "The Mezzanine",
    pose: "arms-open",
    sageIntro: "Last stop inside the Commons! A great view of the main hall.",
    transcript: "[Placeholder narration] The Mezzanine overlooks the main hall and provides a peaceful spot to take in the heart of the Family Commons.",
    clue: "Spot the dove logo somewhere visible from up here.",
    clueSticker: "dove"
  }
];

const ALL_STOPS = [...OUTDOOR_STOPS, ...COMMONS_STOPS];
const TOTAL_STOPS = ALL_STOPS.length; // 26

// Map pose keys → image filenames (served from ./assets/)
const POSE_IMAGES = {
  "welcoming":       "assets/sage_welcoming.png",
  "arms-open":       "assets/sage_arms-open.png",
  "pointing":        "assets/sage_pointing.png",
  "pointing-reverse":"assets/sage_pointing-reverse.png",
  "pointing-sign":   "assets/sage_pointing-with-sign.png",
  "looking":         "assets/sage_circle-look-around.png",
  "leaning":         "assets/sage_leaning.png",
  "question":        "assets/sage_question-mark.png"
};

// Clue sticker imagery (only silver dump truck is a real sticker right now)
const CLUE_STICKERS = {
  "silver-dump-truck": "assets/stickers/sticker_silver-dump-truck.png",
  "paw-print":         null, // placeholder
  "dove":              null,
  "compass":           null,
  "leaf":              null
};

// Generate a stable per-session faux prize code
function generatePrizeCode() {
  const stored = localStorage.getItem("sage-prize-code");
  if (stored) return stored;
  const num = Math.floor(1000 + Math.random() * 9000);
  const code = `GUN-${num}-SAGE`;
  localStorage.setItem("sage-prize-code", code);
  return code;
}
