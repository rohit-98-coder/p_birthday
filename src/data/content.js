// ─────────────────────────────────────────────
//  Content data — easy to edit & extend
// ─────────────────────────────────────────────

export const PROFILE = {
  name: "Paru",
  nicknames: ["Billu", "O+", "Local Don", "Cutu"],
  birthDate: { year: 2004, month: 8, day: 11 }, // month is 0-indexed (Sept = 8)
  age: 22,
  from: "Mit",
};

export const REASONS = [
  { emoji: "🦋", text: "You walk into ordinary days and somehow they don't stay ordinary." },
  { emoji: "🔥", text: "The way you defend the people you love, no hesitation, no half-measures." },
  { emoji: "🐈", text: "Billu meow meow. I will not be elaborating further." },
  { emoji: "🕊️", text: "You make the hardest weeks feel survivable just by texting back 'okay, tell me everything.'" },
  { emoji: "🧵", text: "You hold on to little details about people like they're worth keeping. Most people don't bother." },
  { emoji: "🛡️", text: "You've been through things that could've hardened you, and somehow you stayed soft anyway." },
  { emoji: "🌾", text: "You make plain, unremarkable moments feel worth remembering later." },
  { emoji: "🔑", text: "You have this talent for unlocking exactly what someone needs to hear, and when." },
  { emoji: "🌌", text: "Our conversations at odd hours are the only meetings I never want to end." },
  { emoji: "🕯️", text: "You look like you tried when you clearly didn't, and I've never figured out how." },
  { emoji: "🪙", text: "Somehow the universe handed me you, and I still think it made an accounting error in my favor." },
  { emoji: "🫧", text: "You get quieter on your worst days, and I've learned that's my cue to get closer." },
  { emoji: "🪑", text: "A shared lab bench turned into the best decision I never planned to make." },
  { emoji: "🌊", text: "No reason required — I just love you. That's the whole sentence." },
  { emoji: "🎈", text: "Every year you're around is genuinely the highlight of my calendar, no competition." },
  { emoji: "🌻", text: "Watching you figure out who you're becoming has been the best show I never get tired of." },
  { emoji: "🐉", text: "Local Don, running this relationship like it's your territory — and I handed you the deed willingly." },
  { emoji: "🩸", text: "O+ and generous with everything else too — you'd give without keeping score." },
  { emoji: "📖", text: "You explain the same thing patiently for the third time and never make it feel like a burden." },
  { emoji: "🌙", text: "You clock when I go quiet before I even notice it myself." },
];

export const TIMELINE = [
  {
    icon: "🪑",
    year: "Day One",
    title: "The seat that started it",
    text: "Two stubborn people, one chair, in a DBMS lab that had no idea it was about to become historically significant. Neither of us backed down. Neither of us regrets it.",
  },
  {
    icon: "🌃",
    year: "Somewhere along the way",
    title: "Conversations with no bedtime",
    text: "Nights that went on far too long, about nothing important and everything that mattered. Still undefeated as my favorite part of any day.",
  },
  {
    icon: "🌷",
    year: "Where it all started",
    title: "Tulips, hands, and a decision",
    text: "Tulips only bloom for a few weeks a year — brief, deliberate, worth the wait. That felt like the right flower for something we chose on purpose.",
  },
  {
    icon: "🎉",
    year: "11.09.2004",
    title: "The arrival of the local don",
    text: "Somewhere, a hospital had no idea it was signing up the bossiest, warmest person I'd eventually meet years later in a computer lab.",
  },
  {
    icon: "🧾",
    year: "Somewhere in the middle",
    title: "Round two, same lab",
    text: "Different semester, same room, and I still picked the seat next to you over every empty one in the row. Some habits are worth keeping.",
  },
  {
    icon: "🎇",
    year: "Today, turning 22",
    title: "Another year, same choice",
    text: "Here's to the day the best person I know showed up in the world — and to every version of me that would still start that same fight over that same seat.",
  },
];

/**
 * PHOTOS — add your images here
 * Place image files in /public/photos/ (e.g. photo1.jpg, photo2.jpg)
 * Then update the `src` paths below.
 * You can add as many as you like.
 */
export const PHOTOS = [
  {
    src: "/photos/IMG-20260808-WA0092.jpg", // ← replace with your image path
    caption: "this is you, cutu",
    alt: "Us together",
  },
  {
    src: "/photos/IMG-20260823-WA0047.jpg", // ← replace with your image path
    caption: "mera baccha ka favorite jacket 🌼",
    alt: "Special moment",
  },
  {
    src: "/photos/Screenshot_2026-09-08-12-07-05-19_99c04817c0de5652397fc8b56c3b3817.jpg", // ← replace with your image path
    caption: "awwww Local Don, you look so cute here 😍",
    alt: "Special moment",
  },
  {
    src: "/photos/Screenshot_2026-09-08-12-07-30-02_99c04817c0de5652397fc8b56c3b3817.jpg", // ← replace with your image path
    caption: "chota sa baccha mera cutu 🎊",
    alt: "Special moment",
  },
  {
    src: "/photos/Screenshot_2026-09-08-12-11-44-02_99c04817c0de5652397fc8b56c3b3817.jpg", // ← replace with your image path
    caption: "this is us,together forever 🎀",
    alt: "Special moment",
  },
  {
    src: "/photos/Screenshot_2026-09-08-12-33-27-56_99c04817c0de5652397fc8b56c3b3817.jpg", // ← replace with your image path
    caption: "Awww mera cutu baccha pyara 😍",
    alt: "Special moment",
  },
  // ── Add more photos like this ──
  // {
  //   src: "/photos/your-photo.jpg",
  //   caption: "your caption here",
  //   alt: "description",
  // },
];

export const BUCKET_LIST = [
  "An actual trip, booked and real, not just talked about 🧭",
  "A movie marathon with a snack list longer than the movie list 🍿",
  "Cook something ambitious together and accept the smoke alarm risk 🔥",
  "Take a stack of photos too ridiculous to ever post 📷",
  "One entirely unplanned, unproductive Sunday, just us 🛌",
  "Do your 22nd properly — cake, chaos, all of it 🎊",
  "Go back to that DBMS lab someday, purely for the drama of it 🪑",
  "Pick up one new hobby together and be equally terrible at it 🎨",
];

export const COUPONS = [
  { emoji: "🎟️", title: "One movie night", sub: "my treat, your pick" },
  { emoji: "🍳", title: "Breakfast made for you", sub: "redeemable any morning" },
  { emoji: "💆‍♀️", title: "A full massage", sub: "zero complaints guaranteed" },
  { emoji: "🫡", title: "Your call, all day", sub: "whatever you decide, goes" },
  { emoji: "🤍", title: "One free apology hug", sub: "never expires" },
  { emoji: "📼", title: "Unlimited rewatches", sub: "your comfort show, no vetoes" },
  { emoji: "🪑", title: "The good seat, permanently", sub: "I learned my lesson in that lab" },
];

export const COMFORTS = [
  { emoji: "🌸", text: "Today is yours to enjoy fully — no holding back, no keeping it small." },
  { emoji: "🍀", text: "Out of everyone in the world, I still can't believe I get to call you mine." },
  { emoji: "🍰", text: "Something sweet, something indulgent — today it's non-negotiable." },
  { emoji: "🧸", text: "A hug is on its way to you, even from a distance." },
  { emoji: "🫖", text: "A warm drink, your favorite corner, and nothing pulling at your time — that's today." },
  { emoji: "🎀", text: "Let yourself be spoiled today. You don't need to earn it, you already have." },
  { emoji: "🕊️", text: "Another year with you in the world is something I'll never stop being grateful for." },
];

export const QUIZ = [
  {
    q: "Where did our story begin?",
    opts: ["The library", "The DBMS lab", "The canteen", "The bus stop"],
    correct: 1,
  },
  {
    q: "Which of these is NOT actually your nickname?",
    opts: ["Billu", "O+", "Local Don", "Rocky"],
    correct: 3,
  },
  {
    q: "What flower means 'undying love' in our story?",
    opts: ["Rose", "Tulip", "Lily", "Sunflower"],
    correct: 1,
  },
  {
    q: "What year were you born, Cutu?",
    opts: ["2002", "2003", "2004", "2005"],
    correct: 2,
  },
  {
    q: "What's my favorite sound in the whole world?",
    opts: ["Rain", "Your laugh", "Music", "Silence"],
    correct: 1,
  },
  {
    q: "What did we actually fight over on day one?",
    opts: ["A textbook", "A seat in the lab", "The last samosa", "A group project"],
    correct: 1,
  },
];

export const SURPRISE_NOTES = [
  { emoji: "🌼", text: "Random thought: that seat argument remains the best decision I never planned." },
  { emoji: "🎐", text: "Fact of the day: you're still the best accident of my entire timeline." },
  { emoji: "🍮", text: "Permission slip: today can be as slow and lazy as you need it to be." },
  { emoji: "🎪", text: "PS — never dial down the Local Don energy. It's load-bearing." },
  { emoji: "🕊️", text: "On 11.09.2004, the best thing that ever happened to me quietly showed up." },
  { emoji: "🧷", text: "Whatever today throws at you, I'm still on your side by the end of it." },
  { emoji: "🪑", text: "Give me that same lab, that same seat, tomorrow — I'd start the fight all over again." },
];

export const VALID_NICKNAMES = ["billu", "o+", "local don", "paru", "cutu"];

export const LETTER = {
  paragraphs: [
    `I still think about the day we met — two overly stubborn people arguing over <strong>one seat in the DBMS lab</strong> like the stakes were enormous. Neither of us knew that petty little standoff over a chair was the first page of something I'm still living in.`,
    `Every year your birthday arrives the way you do — a little suddenly, entirely welcome — and I still can't quite believe I get to celebrate <strong>you</strong>. Not only for being born, but for becoming exactly who you've grown into: sharp, warm, unapologetically in charge (hello, Local Don), and somehow still the best part of my most ordinary days.`,
    `That lab will always hold a strange kind of importance for me — not for anything it taught me, but because part of me is still standing in it, next to you, refusing to move seats, with absolutely no idea what I was walking into.`,
    `Thank you for choosing <strong>us</strong>, again and again, on the days that were easy and the ones that weren't. For turning one small argument over a chair into the best story I never meant to start. Happy 22nd, Billu. Here's to more birthdays, more late nights, and more ordinary days that somehow turn into everything.`,
  ],
  sign: "— yours, always, Mit 🌷",
};