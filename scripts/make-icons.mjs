// Draws the app icons (a black square with white initials) into public/icons. Usage: bun scripts/make-icons.mjs [INITIALS]
import sharp from "sharp";

const initials = (process.argv[2] ?? "CN").toUpperCase().slice(0, 3);
const OUT = new URL("../public/icons/", import.meta.url).pathname;

// `pad` shrinks the artwork so a maskable icon keeps its letters inside the safe zone (the middle 80%).
const svg = (size, pad) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#000"/>
  <rect x="${size * (0.08 + pad)}" y="${size * (0.08 + pad)}" width="${size * (0.84 - 2 * pad)}" height="${size * (0.84 - 2 * pad)}" fill="none" stroke="#fff" stroke-width="${size * 0.012}"/>
  <text x="50%" y="50%" dy="${size * 0.1}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="${size * (0.34 - pad * 0.5)}" letter-spacing="${-size * 0.01}" fill="#fff">${initials}</text>
</svg>`;

const jobs = [
  ["icon-192.png", 192, 0],
  ["icon-512.png", 512, 0],
  ["icon-maskable-512.png", 512, 0.1],
  ["apple-touch-icon.png", 180, 0],
];
for (const [name, size, pad] of jobs) await sharp(Buffer.from(svg(size, pad))).png().toFile(OUT + name);
console.log("wrote", jobs.map((j) => j[0]).join(", "));
