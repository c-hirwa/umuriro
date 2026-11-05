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
};
export type Section = { id: string; label: string; dishes: Dish[] };

const SIDE: Option = { label: "Side", choices: ["Chips", "Fried plantain", "Ugali", "No side"] };
const HEAT: Option = { label: "Heat", choices: ["Mild", "Hot with pili-pili"] };

export const MENU: Section[] = [
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
      { id: "isombe", name: "Isombe with ugali", desc: "Pounded cassava leaves with peanut, served with ugali.", price: 5000, img: "1604329760661-e71dc83f8f26" },
      { id: "agatogo", name: "Agatogo", desc: "Green plantain and beef simmered in tomato.", price: 6500, img: "1608500218861-01091cdc501e" },
      { id: "pilau", name: "Spiced pilau with chicken", desc: "Cardamom, cumin and clove rice with grilled chicken.", price: 7000, img: "1781334266250-a7e72fdf539f" },
    ],
  },
  {
    id: "sides", label: "Sides",
    dishes: [
      { id: "chips", name: "Chips", desc: "Hand-cut, with our pili-pili mayo.", price: 2000, img: "1706711053549-f52f73a8960c" },
      { id: "plantain", name: "Fried plantain", desc: "Sweet and caramelised.", price: 2000 },
      { id: "ugali", name: "Ugali", desc: "Soft maize meal.", price: 1000 },
      { id: "kachumbari", name: "Kachumbari", desc: "Tomato, onion, chilli and coriander.", price: 1500 },
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
      { id: "beer", name: "Local beer", desc: "Cold, 50 cl.", price: 2000 },
    ],
  },
];

export const ALL_DISHES = MENU.flatMap((s) => s.dishes);
export const dishById = (id: string) => ALL_DISHES.find((d) => d.id === id);

export const HOURS = [
  { days: "Monday to Thursday", time: "11:00 – 23:00" },
  { days: "Friday and Saturday", time: "11:00 – 01:00" },
  { days: "Sunday", time: "12:00 – 22:00" },
];

export const rwf = (n: number) => `${n.toLocaleString("en-US")} RWF`;
