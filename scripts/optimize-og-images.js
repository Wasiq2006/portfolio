import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const imagesDir = path.join(projectRoot, 'public', 'images');

async function optimizeImages() {
  console.log('Optimizing images for WhatsApp / Open Graph link preview specifications...');

  const imageFiles = ['Blog1.png', 'Blog2.png', 'Banner.png'];

  for (const filename of imageFiles) {
    const inputPath = path.join(imagesDir, filename);
    if (!fs.existsSync(inputPath)) {
      console.warn(`File ${filename} not found, skipping.`);
      continue;
    }

    const baseName = path.parse(filename).name;

    // 1. Generate 1200x630 compressed JPG (< 200KB for WhatsApp)
    const jpgOutputName = `${baseName}_og.jpg`;
    const jpgOutputPath = path.join(imagesDir, jpgOutputName);

    await sharp(inputPath)
      .resize(1200, 630, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 82, progressive: true })
      .toFile(jpgOutputPath);

    const jpgStats = fs.statSync(jpgOutputPath);
    console.log(` Created ${jpgOutputName}: ${(jpgStats.size / 1024).toFixed(1)} KB (Optimized for WhatsApp/OG)`);

    // 2. Also compress the PNG file in-place if needed (< 300KB)
    const pngCompressedBuffer = await sharp(inputPath)
      .resize(1200, 630, { fit: 'cover', position: 'center' })
      .png({ compressionLevel: 9, quality: 80 })
      .toBuffer();

    fs.writeFileSync(inputPath, pngCompressedBuffer);
    const pngStats = fs.statSync(inputPath);
    console.log(` Compressed ${filename}: ${(pngStats.size / 1024).toFixed(1)} KB`);
  }

  console.log('Image optimization completed!');
}

optimizeImages().catch((err) => {
  console.error('Error optimizing images:', err);
  process.exit(1);
});
