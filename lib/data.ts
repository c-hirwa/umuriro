// All business details are fictional. Swap them out when reusing this for a real client.
export const PLACE = {
  name: "Umuriro",
  tagline: "Grill house",
  address: "KN 27 St, Kiyovu, Kigali",
  phoneDisplay: "+250 780 000 000",
  whatsapp: "250780000000",
  tables: 12,
};

/** Photos are free-to-use images from Unsplash, served from their CDN. Replace with the client's own photos. */
export const photo = (id: string, w = 800, h?: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ""}&q=70`;

export const PHOTOS = {
  hero: "1742808838159-1848c1a36209", // skewers over hot coals
  grill: "1508615263227-c5d58c1e5821", // tongs and fire
  room: "1766832255363-c9f060ade8b0", // dining room
  crowd: "1581954548122-4dff8989c0f7", // friends at a long table
  chef: "1681270543584-8e541a1bb056",
  coals: "1621851709622-e19c9a4f0cc5",
};

export type Option = { label: string; choices: string[] };
export type Dish = {
  id: string;
  name: string;
  desc: string;
  price: number;
  img?: string;
  options?: Option[];
  tag?: string;
  veg?: boolean;
  /** dishes that only travel well when eaten here are hidden from delivery */
  dineInOnly?: boolean;
};
export type Section = { id: string; label: string; note?: string; dishes: Dish[] };

const SIDE: Option = { label: "Side", choices: ["Chips", "Fried plantain", "Ugali", "No side"] };
const HEAT: Option = { label: "Heat", choices: ["Mild", "Hot with pili-pili"] };

export const MENU: Section[] = [
  {
    id: "brunch", label: "Weekend brunch", note: "Saturday and Sunday, 10:00 to 14:00",
    dishes: [
      { id: "full-breakfast", name: "The Umuriro breakfast", desc: "Two eggs your way, grilled sausage, beans, fried plantain, tomato and toast.", price: 9000, options: [{ label: "Eggs", choices: ["Fried", "Scrambled", "Omelette"] }], tag: "Brunch favourite" },
      { id: "rolex", name: "Rolex", desc: "Chapati rolled around a tomato, onion and cabbage omelette. Street food, done right.", price: 5000, veg: true, options: [{ label: "Style", choices: ["Classic", "With avocado", "With grilled beef"] }] },
      { id: "shakshuka", name: "Pili-pili shakshuka", desc: "Eggs baked in spiced tomato and pepper, with charred bread for dipping.", price: 7500, veg: true },
      { id: "pancakes", name: "Banana pancakes", desc: "A stack of three with honey, passion fruit and toasted peanuts.", price: 6000, veg: true },
      { id: "avo-toast", name: "Avocado toast, chilli eggs", desc: "Thick toast, crushed avocado, two fried eggs and our chilli oil.", price: 7000, veg: true },
      { id: "brunch-grill", name: "Brunch on the grill", desc: "Goat brochette, sausage, eggs and roast potatoes off the morning fire.", price: 11000, options: [{ label: "Eggs", choices: ["Fried", "Scrambled"] }] },
      { id: "mandazi", name: "Mandazi basket", desc: "Warm, lightly spiced fried dough with cardamom and coconut. Five pieces.", price: 3000, veg: true },
      { id: "icyayi", name: "Icyayi", desc: "Rwandan spiced milk tea with ginger and lemongrass.", price: 1500, veg: true },
    ],
  },
  {
    id: "starters", label: "To start",
    dishes: [
      { id: "samosas", name: "Samosas", desc: "Three crisp triangles with lime and chilli dip.", price: 3000, options: [{ label: "Filling", choices: ["Beef", "Vegetable"] }] },
      { id: "wings", name: "Pili-pili wings", desc: "Six wings, charred over the coals, glazed with honey and chilli.", price: 5500, options: [HEAT] },
      { id: "maize", name: "Roasted maize", desc: "Corn on the cob straight off the fire, rubbed with lime, salt and chilli.", price: 1500, veg: true },
      { id: "avocado-salad", name: "Avocado and tomato salad", desc: "Big slices of local avocado, tomato, red onion and coriander.", price: 3500, veg: true },
    ],
  },
  {
    id: "grill", label: "From the grill",
    dishes: [
      { id: "goat", name: "Goat brochettes", desc: "Two skewers, marinated overnight, grilled over charcoal.", price: 4000, img: "1529563021893-cc83c992d75d", options: [SIDE, HEAT], tag: "Most ordered" },
      { id: "beef", name: "Beef brochettes", desc: "Two skewers of tender beef with onion and pepper.", price: 4000, img: "1636301175218-6994458a4b0a", options: [SIDE, HEAT] },
      { id: "chicken-skewers", name: "Chicken skewers", desc: "Lemon, garlic and thyme. Charred at the edges.", price: 4500, img: "1623253458786-eac05e77be2b", options: [SIDE, HEAT] },
      { id: "platter", name: "Mixed grill for two", desc: "Goat, beef, chicken and sausage with two sides.", price: 18000, img: "1555939594-58d7cb561ad1", options: [HEAT], tag: "To share" },
      { id: "sirloin", name: "Sirloin, 300 g", desc: "Grilled to order, with pepper sauce.", price: 12000, img: "1614119068601-483274e9dcb7", options: [{ label: "Cooked", choices: ["Medium rare", "Medium", "Well done"] }, SIDE] },
      { id: "rotisserie", name: "Half rotisserie chicken", desc: "Slow-turned over the coals, skin crackling.", price: 9000, img: "1606728035253-49e8a23146de", options: [SIDE] },
    ],
  },
  {
    id: "fish", label: "Lake fish",
    dishes: [
      { id: "tilapia", name: "Whole grilled tilapia", desc: "Fresh from Lake Kivu, with lemon and kachumbari.", price: 12000, img: "1665401015549-712c0dc5ef85", options: [SIDE, HEAT], tag: "Chef's pick" },
      { id: "fillet", name: "Spiced fish fillet", desc: "Rubbed with berbere and lime, grilled skin-side down.", price: 10000, img: "1765265432607-cdc1060294ba", options: [SIDE] },
      { id: "sambaza", name: "Sambaza", desc: "Crispy fried Kivu sardines. Eat them whole.", price: 5000 },
    ],
  },
  {
    id: "plates", label: "Rwandan plates",
    dishes: [
      { id: "isombe", name: "Isombe with ugali", desc: "Pounded cassava leaves with peanut, served with ugali.", price: 5000, img: "1604329760661-e71dc83f8f26", veg: true },
      { id: "ibihaza", name: "Ibihaza and beans", desc: "Pumpkin and red beans stewed with onion and palm oil.", price: 4500, veg: true },
      { id: "agatogo", name: "Agatogo", desc: "Green plantain and beef simmered in tomato.", price: 6500, img: "1608500218861-01091cdc501e" },
      { id: "pilau", name: "Spiced pilau with chicken", desc: "Cardamom, cumin and clove rice with grilled chicken.", price: 7000, img: "1781334266250-a7e72fdf539f" },
    ],
  },
  {
    id: "sides", label: "Sides",
    dishes: [
      { id: "chips", name: "Chips", desc: "Hand-cut, with our pili-pili mayo.", price: 2000, img: "1706711053549-f52f73a8960c" },
      { id: "plantain", name: "Fried plantain", desc: "Sweet and caramelised.", price: 2000, veg: true },
      { id: "ugali", name: "Ugali", desc: "Soft maize meal.", price: 1000, veg: true },
      { id: "kachumbari", name: "Kachumbari", desc: "Tomato, onion, chilli and coriander.", price: 1500, veg: true },
      { id: "rice", name: "Coconut rice", desc: "Fluffy and lightly sweet.", price: 1500, veg: true },
    ],
  },
  {
    id: "desserts", label: "Something sweet",
    dishes: [
      { id: "pineapple", name: "Grilled pineapple", desc: "Caramelised over the coals, with honey and a pinch of chilli.", price: 3500, veg: true },
      { id: "fritters", name: "Banana fritters", desc: "Sweet banana in a light batter, cinnamon sugar.", price: 3000, veg: true },
      { id: "cheesecake", name: "Passion fruit cheesecake", desc: "Baked here every morning. Tart, creamy, gone by 9pm.", price: 4500, veg: true },
    ],
  },
  {
    id: "drinks", label: "Drinks",
    dishes: [
      { id: "passion", name: "Fresh passion juice", desc: "Squeezed every morning.", price: 2500, img: "1546173159-315724a31696" },
      { id: "mango", name: "Mango juice", desc: "Thick, cold, no sugar added.", price: 2500, img: "1606673993554-a5f993a16e0d" },
      { id: "hibiscus", name: "Hibiscus and ginger cooler", desc: "Our house drink. Tart and spicy.", price: 3000, img: "1497534446932-c925b458314e" },
      { id: "coffee", name: "Rwandan coffee", desc: "Single origin, from the Northern Province.", price: 2000 },
      { id: "soda", name: "Soda", desc: "Ask for today's flavours.", price: 1000 },
      { id: "beer", name: "Local beer", desc: "Cold, 50 cl.", price: 2000, dineInOnly: true },
      { id: "mimosa", name: "Passion mimosa", desc: "Sparkling wine and fresh passion juice. Brunch only.", price: 5000, dineInOnly: true },
      { id: "water", name: "Still water", desc: "50 cl.", price: 800 },
    ],
  },
];

export const ALL_DISHES = MENU.flatMap((s) => s.dishes);

/** Brunch leads the menu on weekend mornings and drops to the end the rest of the time. */
export function menuForNow(now?: Date): Section[] {
  const brunchTime = now && (now.getDay() === 0 || now.getDay() === 6) && now.getHours() < 14;
  if (brunchTime) return MENU;
  return [...MENU.filter((s) => s.id !== "brunch"), ...MENU.filter((s) => s.id === "brunch")];
}
export const dishById = (id: string) => ALL_DISHES.find((d) => d.id === id);

export const HOURS = [
  { days: "Monday to Thursday", time: "11:00 – 23:00" },
  { days: "Friday", time: "11:00 – 01:00" },
  { days: "Saturday", time: "10:00 – 01:00" },
  { days: "Sunday", time: "10:00 – 22:00" },
];
export const BRUNCH_HOURS = "Saturday and Sunday, 10:00 – 14:00";

/** Online orders: pickup at the counter or delivery by our own riders. */
export const DELIVERY_ZONES = [
  { id: "kiyovu", name: "Kiyovu and town centre", fee: 1000, eta: "25–35 min" },
  { id: "nyarugenge", name: "Nyarugenge, Nyamirambo", fee: 1500, eta: "30–40 min" },
  { id: "kimihurura", name: "Kimihurura, Kacyiru", fee: 1500, eta: "30–45 min" },
  { id: "remera", name: "Remera, Gisozi", fee: 2500, eta: "40–55 min" },
  { id: "kicukiro", name: "Kicukiro, Gikondo, Niboye", fee: 2500, eta: "40–55 min" },
  { id: "kibagabaga", name: "Kibagabaga, Kagugu, Nyarutarama", fee: 3000, eta: "45–60 min" },
];
export const FREE_DELIVERY_FROM = 40000;
export const MIN_DELIVERY_ORDER = 5000;
export const PICKUP_ETA = "20 min";

export const SOCIAL = { instagram: "https://instagram.com/", facebook: "https://facebook.com/" };

export const rwf = (n: number) => `${n.toLocaleString("en-US")} RWF`;
