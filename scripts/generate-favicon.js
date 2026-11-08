// Builds the fallback icons:
//   public/favicon.ico (16/32/48)      <- public/favicon.svg
//   public/apple-touch-icon.png (180)  <- public/apple-touch-icon.svg if present, else favicon.svg
// (A separate large source lets the 180px icon carry detail, like the faint LED grid,
//  that would turn to mush at 16-32px tab sizes.)
// Edit those SVGs, then run: npm run icons
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = (f) => path.join(root, 'public', f);
const svg = fs.readFileSync(pub('favicon.svg'));

const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => sharp(svg, { density: 300 }).resize(s, s).png().toBuffer()));

// ICO container holding PNGs: 6-byte header + 16-byte directory entry per image.
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(pngs.length, 4);
let offset = 6 + 16 * pngs.length;
const entries = pngs.map((png, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(sizes[i], 0);
  e.writeUInt8(sizes[i], 1);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(png.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += png.length;
  return e;
});
fs.writeFileSync(pub('favicon.ico'), Buffer.concat([header, ...entries, ...pngs]));

// iOS needs an opaque square (it applies its own rounded mask): flatten onto the tile colour.
const appleSvg = fs.existsSync(pub('apple-touch-icon.svg')) ? fs.readFileSync(pub('apple-touch-icon.svg')) : svg;
await sharp(appleSvg, { density: 300 }).resize(180, 180).flatten({ background: '#0a0a0a' }).png().toFile(pub('apple-touch-icon.png'));

console.log('Generated favicon.ico (16/32/48) and apple-touch-icon.png');
