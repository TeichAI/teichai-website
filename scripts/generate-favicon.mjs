import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

async function generateFavicons() {
    const inputPath = join(projectRoot, 'public', 'logo.png');
    const appDir = join(projectRoot, 'src', 'app');

    // Generate 32x32 PNG for favicon
    await sharp(inputPath)
        .resize(32, 32)
        .png()
        .toFile(join(appDir, 'favicon.png'));

    // Generate 180x180 for Apple touch icon
    await sharp(inputPath)
        .resize(180, 180)
        .png()
        .toFile(join(appDir, 'apple-icon.png'));

    // Generate 192x192 for Android/PWA
    await sharp(inputPath)
        .resize(192, 192)
        .png()
        .toFile(join(projectRoot, 'public', 'icon-192.png'));

    // Generate 512x512 for PWA
    await sharp(inputPath)
        .resize(512, 512)
        .png()
        .toFile(join(projectRoot, 'public', 'icon-512.png'));

    // Generate Open Graph image (1200x630)
    await sharp(inputPath)
        .resize(630, 630, { fit: 'contain', background: { r: 9, g: 9, b: 11, alpha: 1 } })
        .extend({
            top: 0,
            bottom: 0,
            left: 285,
            right: 285,
            background: { r: 9, g: 9, b: 11, alpha: 1 }
        })
        .png()
        .toFile(join(appDir, 'opengraph-image.png'));

    console.log('✓ Generated all favicon and OG images');
}

generateFavicons().catch(console.error);
