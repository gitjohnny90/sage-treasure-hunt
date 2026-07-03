// Stop data for the Ranger Sage Treasure Hunt.
// Transcripts are the real tour narration (recorded by camp leadership),
// transcribed from the audio in ./audio/ with light proper-noun cleanup.
// Coordinates (mapX/mapY) are % positions on camp-map_rotated.png.
//
// NOTE: stop ids are frozen — printed QR codes encode #stop/<id>.
// Renaming a stop is safe; renumbering is not.

const OUTDOOR_STOPS = [
  {
    id: 1,
    num: 1,
    name: "The Family Commons",
    pose: "pointing",
    mapX: 55.4, mapY: 79.2,
    hasSubStops: true,
    sageIntro: "The heart of camp. Six rooms, six stories — start inside.",
    transcript: "The Family Commons is the central gathering place at Camp Gunnison. Inside you'll find the Entrance, the Ambassador Room, the Timothy Statue, the Commons Second Floor, the Library, and the Mezzanine — six stops in all. Take your time exploring each one; when you've heard them all, the whole Commons checks off your list.",
    clue: "Six rooms to explore inside. Find every one and the whole Commons checks off!",
    clueSticker: "compass"
  },
  {
    id: 2, num: 2,
    name: "The Gunnison Triplex",
    pose: "arms-open",
    mapX: 37.2, mapY: 72.8,
    audio: "audio/stop-02-triplex.mp3",
    audioDuration: 32,
    sageIntro: "Four hundred twenty logs. I counted. Twice.",
    transcript: "This structure was dedicated in 1982, built by Grand Lake Log Homes, and it has about 420 logs. There are three staff apartments on the lower level, and dormitory-style housing above for larger events. Each side of the dormitory also has a loft, which can be used as office space or extra room for beds.",
    clue: "About 420 logs went into this building. How many can you count on one wall before you lose track?",
    clueSticker: "leaf"
  },
  {
    id: 3, num: 3,
    name: "Waters of Life",
    pose: "looking",
    mapX: 40.8, mapY: 68.2,
    audio: "audio/stop-03-waters-of-life.mp3",
    audioDuration: 42,
    sageIntro: "Water, work, and quiet — this one's been a little of everything.",
    transcript: "This Waters of Life structure was built in 1979. On the bottom floor is a shower facility and laundry used by staff, guests, and In-Residence Way Corps. The upstairs has had a multitude of uses over the years. It was originally the dining room, as well as the location for Corps Nights. It's also been a place for children's fellowship and a prayer room. Now it is used as In-Residence Way Corps housing.",
    clue: "Stand still a moment. Which is louder from here — the wind or the river?",
    clueSticker: "dove"
  },
  {
    id: 4, num: 4,
    name: "The Circle Cabin",
    pose: "pointing-reverse",
    mapX: 48.7, mapY: 64.5,
    audio: "audio/stop-04-circle-cabin.mp3",
    audioDuration: 27,
    sageIntro: "Round building, square history. One of the original twelve.",
    transcript: "Circle Cabin — one of the original twelve buildings. It originally housed the offices for Camp Gunnison, including finance and reception, until the Commons was built. It was recently renovated and is now used for In-Residence Way Corps housing.",
    clue: "Walk all the way around it. How many windows does a round cabin get? Count and see.",
    clueSticker: "compass"
  },
  {
    id: 5, num: 5,
    name: "Aspen Trees",
    pose: "arms-open",
    mapX: 47.8, mapY: 68.0,
    audio: "audio/stop-05-aspen-trees.mp3",
    audioDuration: 42,
    sageIntro: "These aspens? All one family. Literally.",
    transcript: "Aspen trees are all native to cold regions with cool summers. Although the Colorado state tree is the blue spruce, there are many aspens in the state. During the fall, the leaves turn a vibrant yellow color — it's quite a sight to see against the green of the spruces and the rocky backdrop of the mountains. Aspens in a group are considered a singular organism: they share the same root system and are genetic replicates of each other.",
    clue: "A whole aspen grove can be one single living thing. Find two trunks that look like twins.",
    clueSticker: "leaf"
  },
  {
    id: 6, num: 6,
    name: "Cabin 6",
    pose: "pointing",
    mapX: 42.8, mapY: 57.0,
    audio: "audio/stop-06-cabin-6.mp3",
    audioDuration: 42,
    sageIntro: "Eight bedrooms, one hot tub, zero bad views.",
    transcript: "Cabin 6 was completed in 1984 and remodeled in the summer of 2007. It is currently used for guest housing. It has eight bedrooms and four large bathrooms, plus a large kitchen and dining room along with a central living room — making it a great location for guests to spend time together. On the back deck is a hot tub available to staff and guests, and a nice porch swing where you can relax and enjoy the beautiful view of the river.",
    clue: "There's a porch swing out back with the best river view at camp. Can you spot it without leaving the path?",
    clueSticker: "compass"
  },
  {
    id: 7, num: 7,
    name: "The Inn",
    pose: "leaning",
    mapX: 56.3, mapY: 65.0,
    audio: "audio/stop-07-the-inn.mp3",
    audioDuration: 22,
    sageIntro: "Where the games live. I'm partial to the fireplace myself.",
    transcript: "The Inn was built in 1986 to replace one of the original twelve buildings. It is a fellowship and recreation area for our guests and staff. Upstairs is a fitness area for the staff and In-Residence Way Corps.",
    clue: "The Inn replaced one of the original twelve buildings. Can you tell what makes it look newer than its neighbors?",
    clueSticker: "paw-print"
  },
  {
    id: 8, num: 8,
    name: "Cabin 8",
    pose: "pointing-reverse",
    mapX: 38.3, mapY: 63.0,
    audio: "audio/stop-08-cabin-8.mp3",
    audioDuration: 31,
    sageIntro: "This cabin used to be full of potatoes. True story.",
    transcript: "Cabin 8 was built in the 1900s as a root cellar. It stored potatoes, cabbage, onions, carrots, and more. It's been remodeled and is now used as guest housing. It is a cozy cabin with a beautiful view of the river. Cabin 8 is sometimes referred to as a honeymoon cabin — but it is not only for honeymooners.",
    clue: "This building started life as a root cellar. Look at its shape — can you tell which part is oldest?",
    clueSticker: "compass"
  },
  {
    id: 9, num: 9,
    name: "Origins of Camp Gunnison",
    pose: "looking",
    mapX: 53.7, mapY: 62.5,
    // No recording for this stop yet — the story below is read-to-complete.
    sageIntro: "It all started with a handshake, right here.",
    transcript: "In 1976, Dr. Victor Paul Wierwille and his wife Dorothea found this property — then called Sleepy Hollow — and acquired it on a handshake with the Bowen family, who had ranched this land. The camp was renamed Camp Gunnison—The Way Family Ranch and officially dedicated on July 17, 1977. Everything you see on this tour grew from that beginning: a working ranch on the Gunnison River, set apart so families could be refreshed by God, His Word, and His handiwork.",
    clue: "Stand still and look all the way around. Everything you can see started with one handshake in 1976.",
    clueSticker: "compass"
  },
  {
    id: 10, num: 10,
    name: "The Ranch Home",
    pose: "arms-open",
    mapX: 55.2, mapY: 57.0,
    audio: "audio/stop-10-ranch-home.mp3",
    audioDuration: 27,
    sageIntro: "The Bowens' old place. The camp grew up around it.",
    transcript: "This was where the Bowens lived, and it was the only building that was consistently operated out of. We've expanded it to the current structure you see, with six bedrooms and four bathrooms — perfect for a large family vacation.",
    clue: "This is the oldest continuously used spot at camp. Tip your ranger hat as you walk by.",
    clueSticker: "paw-print"
  },
  {
    id: 11, num: 11,
    name: "Ermal Owens Pavilion",
    pose: "pointing",
    mapX: 49.7, mapY: 58.3,
    audio: "audio/stop-11-pavilion.mp3",
    audioDuration: 46,
    sageIntro: "Music, meals, art — this roof has heard it all.",
    transcript: "The Ermal Owens Pavilion was built in 1992 with funds donated by Dorothy Owens. It has been used for dining facilities to host guests, Sunday morning fellowships, dances, LEAD, and much more. The pavilion is heated and has audio-video capabilities. In the summer months it is used by guests for grilling and for some special camp activities. During family camps, this area is used for expressive art — the entire pavilion becomes filled with all the arts and crafts supplies you can imagine. There's truly something for everyone, even if you don't consider yourself artistic.",
    clue: "Count the picnic tables under this roof. How many families could eat here at once?",
    clueSticker: "leaf"
  },
  {
    id: 12, num: 12,
    name: "The Gunnison Bridge",
    pose: "pointing-reverse",
    mapX: 50.3, mapY: 49.7,
    audio: "audio/stop-12-bridge.mp3",
    audioDuration: 129,
    sageIntro: "Best view of the river — and both its bridges.",
    transcript: "Before you is the Gunnison River. It starts at the town of Almont, five miles north of here, formed at the confluence of the Taylor River and the East River. It flows into the beautiful Blue Mesa Reservoir — one of the largest bodies of water in Colorado — and then through the Black Canyon before joining the Colorado River. For all our anglers out there: you can find rainbow trout, brown trout, cutthroat trout, and kokanee salmon in these waters. With a fishing license you can fish the Gunnison River, but daily bag and possession limits vary by fish, so check the regulations if you plan on keeping any. The swinging bridge here was built in the 1950s. It can be raised by cables as needed to handle high water from snowmelt in the mountains. And as you can see, we have a new bridge going in — sturdy, built with metal and concrete, and over time it will age nicely and blend in with its surroundings. It is quite an undertaking to install a new bridge, especially on private property; many entities in the county and skilled staff are involved to ensure it's done correctly. Camp Gunnison's property extends across the river to the west — 36.2 acres, to be exact — with two staff homes we call the West Ranch homes. In the fall we lease the surrounding fields to a local rancher, so depending on the time of year, you may see some cattle walking around over there.",
    clue: "Two bridges, one river. Can you spot both the old swinging bridge and the new one?",
    clueSticker: "dove"
  },
  {
    id: 13, num: 13,
    name: "The North Pasture",
    pose: "arms-open",
    mapX: 61.1, mapY: 51.1,
    audio: "audio/stop-13-north-pasture.mp3",
    audioDuration: 70,
    sageIntro: "Horse country. The fence is newer than it looks.",
    transcript: "This large fenced-in area is the North Pasture. This is where we used to house our horses; now we bring in horses from a local company during family camps. In October 2021, the staff and In-Residence Way Corps rebuilt the beautiful fence you see around the North Pasture. The vision is that one day we will once again stable our own horses on the property — having horses here provides great training opportunity for the In-Residence Way Corps, and obviously great fun for guests. We used to sell hay from this pasture to a local neighbor. Now that we use this field for horses we don't, but in the field just west of the pasture — north of the pond — we do sell hay, along with hay from the south pasture and the fields on the west side. It's a good working relationship for both us and our neighboring rancher.",
    clue: "Staff rebuilt every rail of this fence in 2021. How many rails high is it?",
    clueSticker: "leaf"
  },
  {
    id: 14, num: 14,
    name: "The Gazebo",
    pose: "leaning",
    mapX: 62.8, mapY: 29.5,
    audio: "audio/stop-14-gazebo.mp3",
    audioDuration: 70,
    sageIntro: "A gazebo with a secret job. Listen close.",
    transcript: "The pond is our reservoir for the on-grounds irrigation system. We stock the pond with fish in the summer so families can enjoy fishing and teach their little ones how to fish. This gazebo is not only beautiful to look at and relax in — it is also the pump house. Great thought has gone into how Camp Gunnison was designed. This is a great spot to birdwatch as well; more than once a bald eagle has been spotted flying near this area. If you stand back on the road and look up and down it: this road used to be the railroad for the Denver & Rio Grande, or the D&RG. It ran from 1881 until 1954 through our property and on to Crested Butte. The road officially got paved in 1987.",
    clue: "This gazebo has a hidden job — listen to the story to find out what. And keep an eye up: bald eagles visit here.",
    clueSticker: "compass"
  },
  {
    id: 15, num: 15,
    name: "The Maintenance Building",
    pose: "pointing",
    mapX: 94.6, mapY: 25.7,
    audio: "audio/stop-15-maintenance.mp3",
    audioDuration: 63,
    sageIntro: "Where the real muscle is: the crew that keeps camp running.",
    transcript: "The maintenance building contains offices for our facility support staff. It is a large building with different areas and shops — maintenance, auto, carpentry, and paint — plus storage for grounds and recreation equipment, ladders, and just about any tool you can think of. The facility support department is in charge of all aspects of keeping the camp running mechanically sound: repairing logs, fixing the heating and air, plumbing, electrical, or any other repair that might come up. Facility support also handles pest control for the camp. We've found that cats work great for keeping the mice and other rodent populations down, so we use the maintenance building as a place to raise up kittens into ferocious barn cats — mousers.",
    clue: "Spot the silver dump truck somewhere nearby!",
    clueSticker: "silver-dump-truck",
    stickerHunt: {
      scriptureRef: "II Kings 3:16-17",
      scriptureText: "And he said, Thus saith the LORD, Make this valley full of ditches. For thus saith the LORD, Ye shall not see wind, neither shall ye see rain; yet that valley shall be filled with water, that ye may drink, both ye, and your cattle, and your beasts.",
      obviousHint: "Walk around to the back side of the Maintenance Building — the clear sticker box is next to the little irrigation ditch."
    }
  },
  {
    id: 16, num: 16,
    name: "Tack Shop",
    pose: "pointing-reverse",
    mapX: 81.9, mapY: 35.1,
    audio: "audio/stop-16-tack-shop.mp3",
    audioDuration: 122,
    sageIntro: "Morgan horses and rodeo dust. Cowboy stories ahead.",
    transcript: "Early on in the purchase and development of Camp Gunnison, Dr. Wierwille wanted to raise Morgan horses — a particular breed with a deep American history. The Morgan horse is known for speed and endurance, recognized for utilitarian capability: harness racing, pulling coaches, and general riding. Miners in the California Gold Rush used this breed, as did the Army during and after the American Civil War. The first thing built in this area were the stables. A believer who owned a Morgan stallion made an agreement to come work at Camp Gunnison, care for the horses, and her stallion would be used to breed more Morgans. At one point we had over ten horses on the property — used for game hunting, transporting materials for leadership training activities, and for enjoyment. It is the vision to one day have horses here permanently again. We also used to have a rodeo arena behind the stables. Every year during Way Corps graduation week, Dr. Wierwille would bring in a rodeo company to bless and entertain the graduating Corps. Everyone enjoyed the rodeo so much that he started thinking about doing it more often — and with rodeo professionals in the ministry at the time, the idea evolved into a voluntary rodeo school as part of the in-residence training, building the \"I can do\" mindset. Everything the ministry does is aimed to build the Word, biblical principles, biblical thinking, and an \"I can do\" attitude into people's lives. You may still be able to see some of the sand that was used in the arena behind the stables.",
    clue: "Horseshoes mean good luck. Find one — on a wall, on a door, or in the dirt.",
    clueSticker: "compass"
  },
  {
    id: 17, num: 17,
    name: "The Water Tank and Dedication Prayer",
    pose: "looking",
    mapX: 91.7, mapY: 53.4,
    audio: "audio/stop-17-water-tank.mp3",
    audioDuration: 272,
    sageIntro: "The high point — in every way. This is sacred ground.",
    transcript: "Built in 1979, the water tank holds 235,000 gallons of water. We have three operating wells on the main grounds, which provide an abundance of water for the camp, and two wells on the West Ranch. Take a moment and enjoy the views from the water tank hill — if you come up here more than once, you'll notice the view is always changing with the angle of the sun, the shadows of the clouds, and the time of year. God's creation is truly incredible, with infinite variety. Dr. Wierwille had great vision for what this place would do for God's kids. When he was looking around the property with the previous owners, they made it to this spot — the highest point on the property — and looked out west over the mountain ranges and south to the San Juan range. You can see Mount Uncompahgre, a little over 14,000 feet tall. Dr. Wierwille said it was just like his heart exploded within him, and God was telling him this was it. The story ends with the dedication prayer, recorded at the dedication of this property — Sage will play it for you. \"...we dedicate this property to You. Every inch of it, Father, we dedicate to You in the wonderful name of Your Son, our Lord and Savior, Jesus Christ... that this ground will be like hallowed ground, sanctified, set apart, to Your name's honor and glory... Thank You, Father, for the privilege of dedicating this land, all the buildings, and all the people who will ever step on this place.\" You are included in this prayer, along with the many people that will come after you.",
    clue: "You're standing at the highest point on the property. Find Uncompahgre Peak on the horizon — over 14,000 feet tall.",
    clueSticker: "dove"
  },
  {
    id: 18, num: 18,
    name: "The Memorial Garden",
    pose: "leaning",
    mapX: 63.9, mapY: 62.5,
    audio: "audio/stop-18-memorial.mp3",
    audioDuration: 78,
    sageIntro: "We keep our promises here. This garden is one of them.",
    transcript: "This is the Memorial Garden. It is maintained in full agreement with the promise made by Dr. Wierwille to the previous owners of this property, John and Mary Bowen. This garden stands in loving memory of their son George, an American Air Force pilot who lost his life in military service in Southeast Asia on July 1st, 1965. The plaque's rock is in the shape of Ohio, to signify our connection with The Way International headquarters. Mary Bowen came to the dedication of the Commons in 1988, and it meant a lot to her to see how the Memorial Garden was maintained. To this day we continue to keep our word: we maintain it year-round, and in the spring and summer you can see beautiful flowers here.",
    clue: "Look closely at the rock the plaque sits on. Its shape is a U.S. state — which one?",
    clueSticker: "dove"
  },
  {
    id: 19, num: 19,
    name: "The Green",
    pose: "arms-open",
    mapX: 65.6, mapY: 67.6,
    audio: "audio/stop-19-the-green.mp3",
    audioDuration: 109,
    sageIntro: "Campfires, stargazing, and the whole Milky Way.",
    transcript: "This campfire area has been used for many events at the camp — Rocky Mountain Recharge, family camp cookouts, and more. This spot is also the perfect place for stargazing: it's above the lights of Camp Gunnison and clear of trees, giving you a stunning view of the Milky Way. We schedule times during events for a God's Word in the Stars presentation here — a sweet time together learning about and admiring God's handiwork. If you look out over the property you can get a better idea of its size. The main part of grounds — what you can see on this side of the river — is 105.1 acres. An additional 36.2 acres on the west side of the Gunnison River, called the West Ranch, was purchased in 1983. Camp Gunnison totals 141.3 acres at an elevation of 7,885 feet. For comparison, headquarters in New Knoxville, Ohio sits at 902 feet — we are definitely in the high country. Behind you is the BLM — the Bureau of Land Management. While BLM land is open to the public for recreation, it is government-owned and maintained, so we're guaranteed no private building will ever go up behind us.",
    clue: "Find the campfire ring, then look up. If it were dark right now, you'd see the Milky Way.",
    clueSticker: "leaf"
  },
  {
    id: 20, num: 20,
    name: "The South Log Lot",
    pose: "pointing",
    mapX: 62.3, mapY: 93.4,
    audio: "audio/stop-20-south-lot.mp3",
    audioDuration: 49,
    sageIntro: "A wood lot so tidy it made a believer out of somebody.",
    transcript: "The South Log Lot. We use a lot of wood around here to heat our buildings, and the In-Residence Way Corps and staff come to this area to split wood. A while back, a gentleman from the National Forest came to look over the place while we were discussing using National Forest land for our LEAD program. He was surprised at how well and orderly we kept this wood lot — he said that if we kept our wood this neat, we would probably do the same in the National Forest. And guess what? He's been a faithful believer ever since. You never know what will reach someone.",
    clue: "Last outdoor stop! How high is the tallest woodpile? Give it your best ranger guess.",
    clueSticker: "paw-print"
  }
];

const COMMONS_STOPS = [
  {
    id: "commons-1", num: "1A",
    name: "The Entrance",
    pose: "welcoming",
    audio: "audio/commons-1-entrance.mp3",
    audioDuration: 103,
    sageIntro: "Welcome in! The general manager himself will tell you this one.",
    transcript: "God bless you, and welcome to this walking tour of Camp Gunnison. My name is Chandler Greene, and I serve as the general manager here at the camp. As the far-west end of grounds of The Way International, everything we do here at Camp Gunnison supports our worldwide biblical research, teaching, and fellowship ministry in moving God's Word over the world. Our ministry's biblical research is presented through teachings at our various camps and events, and the peacefulness here provides an ideal setting for our guests to receive spiritual truths and enjoy sweet fellowship with God and one another. The major function of Camp Gunnison is to support believers from every corner of the world in their spiritual development. It's a place where followers of The Way gather for ministry classes and special events; a place where students in the Way Corps training spend time developing leadership skills for a lifetime of Christian service; and a place where Way believers and their families and friends can come from around the world to be refreshed by God, His Word, and His handiwork. Since we started making camps and getaways available, the camp has hosted participants from 46 states and 16 countries on six continents.",
    clue: "Visitors have come from 46 states and 16 countries. How far did YOU travel to get here?",
    clueSticker: "compass"
  },
  {
    id: "commons-2", num: "1B",
    name: "The Ambassador Room",
    pose: "pointing",
    audio: "audio/commons-2-ambassador.mp3",
    audioDuration: 42,
    sageIntro: "150 seats, countless meals, and a wedding or two.",
    transcript: "The Ambassador Room was designed for smaller classes, serving meals, and even weddings — we can fit up to 150 people in this room. You'll see the latex chinking between the logs in this room and in many of the other log structures on grounds. It's designed to expand and contract with the logs depending on the weather. It can be replaced if it wears out or gets damaged, though typically we don't have any issues with the chinking.",
    clue: "Find the chinking — the stretchy stripes between the logs that keep the weather out.",
    clueSticker: "compass"
  },
  {
    id: "commons-3", num: "1C",
    name: "The Timothy Statue",
    pose: "looking",
    audio: "audio/commons-3-timothy.mp3",
    audioDuration: 80,
    sageIntro: "Five years of carving. One faithful young man.",
    transcript: "This statue is made from marble harvested from Marble, Colorado, in the northern part of Gunnison County. Marble for the Lincoln Memorial, the Tomb of the Unknown Soldier, and the Colorado State Capitol all came from this same quarry. Starting in 1980, a Way Corps believer was commissioned by Dr. Wierwille to design the sculpture, originally for the Word Over the World Auditorium. It took him five years to complete. It was then moved to The Way College of Biblical Research in Indiana — a property our ministry once owned — when it was replaced by The Teacher, a bronze statue of Dr. Wierwille. Then in 1998 it was moved to Camp Gunnison. The statue is so heavy that structural beams had to be installed underneath the floor just to support it. Timothy's life remains an inspiration to us: when the believers in the first century were facing persecution, Timothy remained a faithful, strong support to the Apostle Paul.",
    clue: "The floor under this statue had to be reinforced just to hold it. Take a guess: how heavy is solid marble?",
    clueSticker: "dove"
  },
  {
    id: "commons-4", num: "1D",
    name: "The Second Floor",
    pose: "pointing-reverse",
    audio: "audio/commons-4-second-floor.mp3",
    audioDuration: 69,
    sageIntro: "Look up. The walls up here have eyes. Friendly ones.",
    transcript: "You can see we have many animal trophies mounted on the walls of the Commons. We have an Alaskan caribou located above the stairs, and a grizzly bear above the stairs as well. There's a cowhide on the railing above the blue steps. You'll also see longhorn steer horns by the shared work area, moose antlers above the mailroom, and two bull elk — one mounted by the duck lounge and one by the guest rooms. We have a bighorn sheep mounted by the library, and a mule deer — known for their big ears — also mounted by the library.",
    clue: "Count the animal mounts you can spot from the stairs. Can you find the mule deer's big ears?",
    clueSticker: "leaf"
  },
  {
    id: "commons-5", num: "1E",
    name: "The Library",
    pose: "leaning",
    audio: "audio/commons-5-library.mp3",
    audioDuration: 72,
    sageIntro: "Books, quiet, and the way up to the best view inside.",
    transcript: "The library is currently where the In-Residence Way Corps take classes and have in-depth time in the Word during study hall. It is also available for staff to check out books, and a variety of library books are provided for guests on a bookshelf downstairs in the living room area. If you are looking at the library and turn to your left, you will see our doors for guest housing in the Commons — four rooms and one apartment available to stay in during camps or vacations. If you follow the hallway, you will find a set of stairs that take you up to the mezzanine level. The mezzanine provides a quiet place for reflection and prayer, and it is well known for its spectacular views. The mezzanine level is a little higher in elevation with a number of steps to climb — if you'd like to see the 360-degree view or enjoy the quietness, please take your time going up the stairs.",
    clue: "Find a book you'd want to read on a porch swing. Bonus: spot the stairs up to the Mezzanine.",
    clueSticker: "leaf"
  },
  {
    id: "commons-6", num: "1F",
    name: "The Mezzanine",
    pose: "arms-open",
    audio: "audio/commons-6-mezzanine.mp3",
    audioDuration: 135,
    sageIntro: "Top of the Commons. Name those peaks.",
    transcript: "The Mezzanine. As you start by the rock wall and work clockwise, you will see all the different mountain ranges. There's Signal Peak, which is 9,000 feet — you can see this past the BLM. Then there is Uncompahgre Peak, which is Ute for \"hot water springs\" — the light-gray-looking mountains in the distance, over 50 miles away. Then you'll see the San Juan Mountains over the portico; these are 60 miles southwest, and many of them are over 14,000 feet. Then you'll see the West Elk mountain range — the large range seen in the distance behind Cabin 12. Then there is a ridge called the Anthracites; anthracite means coal-bearing. It can be seen behind the Gunnison Triplex — the jagged mountain range, located approximately 25 miles away. Then you'll see Carbon Peak, right above Ranch Home number 2, over 12,000 feet. And to your right you'll see Flat Top, seen behind Cabin 6 and a little to the right. There are 58 Colorado fourteeners, and people travel from all over to bag a fourteener here.",
    clue: "Work clockwise from the rock wall. How many mountain ranges can you name from up here?",
    clueSticker: "dove"
  }
];

const ALL_STOPS = [...OUTDOOR_STOPS, ...COMMONS_STOPS];
const TOTAL_STOPS = ALL_STOPS.length;

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

// Clue sticker imagery. The silver dump truck is a real printed sticker;
// the rest render as built-in badge icons until physical stickers are finalized.
const CLUE_STICKERS = {
  "silver-dump-truck": "assets/stickers/sticker_silver-dump-truck.png",
  "paw-print":         null,
  "dove":              null,
  "compass":           null,
  "leaf":              null
};

// Generate a stable per-device prize code shown on the finish screen.
function generatePrizeCode() {
  const stored = localStorage.getItem("sage-prize-code");
  if (stored) return stored;
  const num = Math.floor(1000 + Math.random() * 9000);
  const code = `GUN-${num}-SAGE`;
  localStorage.setItem("sage-prize-code", code);
  return code;
}
