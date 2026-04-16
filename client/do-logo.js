import Jimp from 'jimp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function processLogo() {
  try {
    const inputPath = path.resolve(__dirname, '../ai-logo.jpg');
    console.log('Reading image:', inputPath);
    
    // Read the image
    const image = await Jimp.read(inputPath);
    
    console.log('Processing transparency...');
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    
    const targetColor = { r: 255, g: 255, b: 255 };
    const tolerance = 25; 
    
    image.scan(0, 0, width, height, function(x, y, idx) {
      const point = {
        r: this.bitmap.data[idx + 0],
        g: this.bitmap.data[idx + 1],
        b: this.bitmap.data[idx + 2],
        a: this.bitmap.data[idx + 3]
      };

      const isWhite = 
        Math.abs(point.r - targetColor.r) <= tolerance &&
        Math.abs(point.g - targetColor.g) <= tolerance &&
        Math.abs(point.b - targetColor.b) <= tolerance;
        
      if (isWhite) {
        this.bitmap.data[idx + 3] = 0; 
      }
    });

    console.log('Autocropping...');
    image.autocrop();

    const size = Math.min(image.bitmap.width, image.bitmap.height);
    const finalLogo = image.crop(
      (image.bitmap.width - size) / 2,
      (image.bitmap.height - size) / 2,
      size, size
    ).resize(512, 512);

    const out512 = path.resolve(__dirname, 'public/icon-512.png');
    await finalLogo.writeAsync(out512);
    console.log('Saved 512x512 logo to', out512);

    const out192 = path.resolve(__dirname, 'public/icon-192.png');
    await finalLogo.resize(192, 192).writeAsync(out192);
    console.log('Saved 192x192 logo to', out192);

    const outFavicon = path.resolve(__dirname, 'public/favicon.png');
    await finalLogo.resize(64, 64).writeAsync(outFavicon);
    console.log('Saved favicon to', outFavicon);

    console.log('Done processing icons.');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

processLogo();
