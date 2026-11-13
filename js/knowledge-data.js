// Tu dong sinh boi build.js - Khong sua thu cong
const knowledgeData = [
  {
    "title": "The History of Tattooing in Vietnam: From Ancient Water Spirits to Modern Hanoi Ink",
    "slug": "knowledge/the-history-of-tattooing-in-vietnam-from-ancient-water-spirits-to-modern-hanoi-ink/",
    "thumb": "images/blog-images/vietco-tattoo.webp",
    "time": "October 26, 2026",
    "date": "2026-10-26",
    "desc": "Explore the history of tattooing in Vietnam, from Đông Sơn-era beliefs and Trần dynasty warriors to highland traditions and Hanoi’s modern custom tattoo scene."
  },
  {
    "title": "Fine Line Tattoo: The Complete Guide to Delicate Ink, Technique, and Aftercare",
    "slug": "knowledge/fine-line-tattoo-the-complete-guide-to-delicate-ink-technique-and-aftercare/",
    "thumb": "images/blog-images/fine-line-tattoo.webp",
    "time": "October 31, 2026",
    "date": "2026-10-31",
    "desc": "Discover everything about fine line tattoos: their origins, needle techniques, how they age, and expert aftercare tips. Book a custom fine line design at Mr Tattoo Hanoi Studio in Hanoi’s Old Quarter."
  },
  {
    "title": "Dotwork Tattoo: The Art of Stippling, Sacred Geometry, and Timeless Black Ink",
    "slug": "knowledge/dotwork-tattoo-the-art-of-stippling-sacred-geometry-and-timeless-black-ink/",
    "thumb": "images/blog-images/dotwork-tattoo.webp",
    "time": "November 3, 2026",
    "date": "2026-11-03",
    "desc": "Explore dotwork tattoos: their history, stippling techniques, needle choices, how they age, and aftercare essentials. Book a custom dotwork design at Mr Tattoo Hanoi Studio in Hanoi’s Old Quarter."
  },
  {
    "title": "Old School Tattoo: History, Bold Lines, and the Enduring Appeal of American Traditional Ink",
    "slug": "knowledge/old-school-tattoo-history-bold-lines-and-the-enduring-appeal-of-american-traditional-ink/",
    "thumb": "images/blog-images/old-school-tattoo.webp",
    "time": "November 5, 2026",
    "date": "2026-11-05",
    "desc": "Discover the story of old school tattoos: sailor roots, iconic flash, bold linework, classic colour palettes, and aftercare essentials. Book a custom old school design at Mr Tattoo Hanoi Studio in Hanoi’s Old Quarter."
  },
  {
    "title": "Best Custom Tattoo Studio Near Me in Hanoi Old Quarter | Mr. Tattoo Hanoi Studio",
    "slug": "knowledge/best-custom-tattoo-studio-near-me-in-hanoi-old-quarter-mr-tattoo-hanoi-studio/",
    "thumb": "images/blog-images/anhbaiviet-1.webp",
    "time": "November 5, 2026",
    "date": "2026-11-05",
    "desc": "​Are you exploring the historic streets of Hanoi and searching for a top-rated tattoo near me or a reliable tattoo near us to capture your travel memories? Finding a clean, reputable, and artistically skilled studio in a foreign city can feel overwhelming. Fortunately, right in the heart of Hanoi’s Old Quarter, Mr. Tattoo Hanoi offers a world-class tattooing experience tailored for international travelers and local enthusiasts alike."
  },
  {
    "title": "Māori Tattoo (Tā Moko): History, Meaning, and How to Approach It with Respect",
    "slug": "knowledge/maori-tattoo-ta-moko-history-meaning-and-how-to-approach-it-with-respect/",
    "thumb": "images/blog-images/maori-tattoo.webp",
    "time": "November 6, 2026",
    "date": "2026-11-06",
    "desc": "Learn the history of Māori tattoo (tā moko): its sacred meaning, traditional uhi chisel technique, modern methods, aftercare, and how to honour the culture respectfully. Custom design consultations at Mr Tattoo Hanoi Studio."
  },
  {
    "title": "Best Tattoo Shop in Hanoi Old Quarter: How to Choose the Right Studio?",
    "slug": "knowledge/best-tattoo-shop-in-hanoi-old-quarter-how-to-choose-the-right-studio/",
    "thumb": "images/blog-images/best-tattoo-studio.webp",
    "time": "November 8, 2026",
    "date": "2026-11-08",
    "desc": "Looking for the best tattoo shop in Hanoi Old Quarter? Learn how to judge hygiene, artistry, custom design process, and aftercare before you book your tattoo."
  },
  {
    "title": "How Much Does a Tattoo Cost in Hanoi?",
    "slug": "knowledge/how-much-does-a-tattoo-cost-in-hanoi/",
    "thumb": "images/blog-images/tattoo-cost.webp",
    "time": "November 8, 2026",
    "date": "2026-11-08",
    "desc": "How much does a tattoo cost in Hanoi? Explore price ranges by size, style, and artist experience, plus tips for budgeting a safe, high-quality custom tattoo."
  },
  {
    "title": "Cheap Tattoo in Hanoi: What Should Tourists Know Before Booking?",
    "slug": "knowledge/cheap-tattoo-in-hanoi-what-should-tourists-know-before-booking/",
    "thumb": "images/blog-images/cheap-tattoo-in-hanoi.webp",
    "time": "November 9, 2026",
    "date": "2026-11-09",
    "desc": "Thinking of getting a cheap tattoo in Hanoi? Learn what low prices really mean, which hygiene and quality checks matter, and how tourists can get affordable, safe custom ink."
  },
  {
    "title": "Where to Get a Fine Line Tattoo in Hanoi? How to Find the Right Artist",
    "slug": "knowledge/where-to-get-a-fine-line-tattoo-in-hanoi-how-to-find-the-right-artist/",
    "thumb": "images/blog-images/fine-line-tattoo-2.webp",
    "time": "November 9, 2026",
    "date": "2026-11-09",
    "desc": "Wondering where to get a fine line tattoo in Hanoi? Learn what separates true fine-line artistry from risky shortcuts, how to vet portfolios, and how to plan a design that ages beautifully."
  },
  {
    "title": "Is It Safe to Get a Tattoo in Vietnam? A Traveler’s Guide to Hygiene and Standards",
    "slug": "knowledge/is-it-safe-to-get-a-tattoo-in-vietnam-a-travelers-guide-to-hygiene-and-standards/",
    "thumb": "images/blog-images/safe-tattoo-vietnam.webp",
    "time": "November 12, 2026",
    "date": "2026-11-12",
    "desc": "Is it safe to get a tattoo in Vietnam? Learn the hygiene standards to demand, red flags to avoid, and aftercare tips for hot, humid climates before you book."
  },
  {
    "title": "CHEAP TATTOO IN HANOI – STARTING FROM JUST $10, $20 & $30!",
    "slug": "knowledge/cheap-tattoo-in-hanoi-starting-from-just-10-20-30/",
    "thumb": "images/blog-images/cheap-tattoo-in-hanoi-2.webp",
    "time": "November 13, 2026",
    "date": "2026-11-13",
    "desc": "Looking for a cheap tattoo in Hanoi? At Mr.Tattoo, you can get a beautiful tattoo at an affordable price in the heart of Hanoi Old Quarter."
  },
  {
    "title": "GETTING A TATTOO IN HANOI? VISIT MR.TATTOO IN THE OLD QUARTER",
    "slug": "knowledge/getting-a-tattoo-in-hanoi-visit-mrtattoo-in-the-old-quarter/",
    "thumb": "images/blog-images/hanoi-old-quarter-tattoo.webp",
    "time": "November 13, 2026",
    "date": "2026-11-13",
    "desc": "Visiting Hanoi and thinking about getting a tattoo during your trip to Vietnam?"
  },
  {
    "title": "Where to Get a Fine Line Tattoo in Hanoi Old Quarter?",
    "slug": "knowledge/where-to-get-a-fine-line-tattoo-in-hanoi-old-quarter/",
    "thumb": "images/blog-images/get-a-fine-line-tattoo.webp",
    "time": "November 13, 2026",
    "date": "2026-11-13",
    "desc": "Looking for a professional fine line tattoo studio in Hanoi? Fine line tattoos may look simple, but creating clean, delicate and consistent lines requires years of experience, a steady hand and great attention to detail."
  },
  {
    "title": "MR.TATTOO – BEST CHINESE CHARACTER & ASIAN STYLE TATTOO IN HANOI",
    "slug": "knowledge/mrtattoo-best-chinese-character-asian-style-tattoo-in-hanoi/",
    "thumb": "images/blog-images/chinese-characters-tattoo.webp",
    "time": "November 13, 2026",
    "date": "2026-11-13",
    "desc": "Looking for a beautiful Chinese character tattoo in Hanoi?"
  }
];