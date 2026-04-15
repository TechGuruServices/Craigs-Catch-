import Jimp from 'jimp';
import path from 'path';

async function processLogo() {
  try {
    const inputPath = 'C:\\Users\\iceyh\\.gemini\\antigravity\\brain\\74154d65-1148-4c6b-b4dd-098e28e03b26\\media__1776143209625.png';
    console.log('Reading image:', inputPath);
    
    // Read the image
    const image = await Jimp.read(inputPath);
    
    console.log('Processing transparency...');
    // Replace near-white background with transparent
    // We'll iterate over all pixels
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    
    // Target color to make transparent (white)
    const targetColor = { r: 255, g: 255, b: 255 };
    const tolerance = 25; // 25 out of 255
    
    image.scan(0, 0, width, height, function(x, y, idx) {
      const point = {
        r: this.bitmap.data[idx + 0],
        g: this.bitmap.data[idx + 1],
        b: this.bitmap.data[idx + 2],
        a: this.bitmap.data[idx + 3]
      };

      // Check distance from white
      const isWhite = 
        Math.abs(point.r - targetColor.r) <= tolerance &&
        Math.abs(point.g - targetColor.g) <= tolerance &&
        Math.abs(point.b - targetColor.b) <= tolerance;
        
      if (isWhite) {
        // Set alpha to 0 for white-ish pixels
        this.bitmap.data[idx + 3] = 0; 
      }
    });

    // Make the circular crop if needed? The user uploaded a circular image on a white background. Removing white handles the corners nicely as long as we have a good tolerance.
    
    console.log('Autocropping...');
    image.autocrop();

    // Create 512x512 max size version for standard PWA usage
    const size = Math.min(image.bitmap.width, image.bitmap.height);
    const finalLogo = image.crop(
      (image.bitmap.width - size) / 2,
      (image.bitmap.height - size) / 2,
      size, size
    ).resize(512, 512);

    // Save final logo
    const out512 = path.resolve('client/public/logo-512.png');
    await finalLogo.writeAsync(out512);
    console.log('Saved 512x512 logo to', out512);

    // Save 192x192 logo
    const out192 = path.resolve('client/public/logo-192.png');
    await finalLogo.resize(192, 192).writeAsync(out192);
    console.log('Saved 192x192 logo to', out192);

    // Save generic favicon
    const outFavicon = path.resolve('client/public/favicon.png');
    await finalLogo.resize(64, 64).writeAsync(outFavicon);
    console.log('Saved favicon to', outFavicon);

    console.log('Done processing icons.');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

processLogo();
