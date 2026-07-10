import fs from 'fs';
import path from 'path';
import https from 'https';

const DIRS = [
  'src/assets/images/hero',
  'src/assets/images/hotels',
  'src/assets/images/rooms',
  'src/assets/images/gallery',
  'src/assets/images/experience',
  'src/assets/images/testimonials'
];

const IMAGES = [
  // Hero
  {
    url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80',
    dest: 'src/assets/images/hero/hero-resort.jpg'
  },
  // Hotels
  {
    url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
    dest: 'src/assets/images/hotels/santorini-cliffside.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    dest: 'src/assets/images/hotels/kyoto-machiya.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    dest: 'src/assets/images/hotels/amalfi-retreat.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    dest: 'src/assets/images/hotels/bali-villas.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80',
    dest: 'src/assets/images/hotels/alpine-chalet.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=800&q=80',
    dest: 'src/assets/images/hotels/overwater-villas.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=800&q=80',
    dest: 'src/assets/images/hotels/tuscany-estate.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    dest: 'src/assets/images/hotels/paris-maison.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80',
    dest: 'src/assets/images/hotels/marrakech-riad.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
    dest: 'src/assets/images/hotels/cape-lodge.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1598977123418-45f04b614acb?auto=format&fit=crop&w=800&q=80',
    dest: 'src/assets/images/hotels/udaipur-palace.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    dest: 'src/assets/images/hotels/goa-villas.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    dest: 'src/assets/images/hotels/jaipur-haveli.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1486916856992-e4db22c8df33?auto=format&fit=crop&w=800&q=80',
    dest: 'src/assets/images/hotels/manali-retreat.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    dest: 'src/assets/images/hotels/kerala-villas.jpg'
  },
  // Rooms
  {
    url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    dest: 'src/assets/images/rooms/suite-deluxe.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    dest: 'src/assets/images/rooms/suite-signature.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
    dest: 'src/assets/images/rooms/suite-presidential.jpg'
  },
  // Gallery
  {
    url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    dest: 'src/assets/images/gallery/gallery-01.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    dest: 'src/assets/images/gallery/gallery-02.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
    dest: 'src/assets/images/gallery/gallery-03.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    dest: 'src/assets/images/gallery/gallery-04.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
    dest: 'src/assets/images/gallery/gallery-05.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    dest: 'src/assets/images/gallery/gallery-06.jpg'
  },
  // Experience
  {
    url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
    dest: 'src/assets/images/experience/experience-pool.jpg'
  }
];

// Ensure directories exist
DIRS.forEach(dir => {
  const fullPath = path.resolve(dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Download helper
const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${dest}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

const run = async () => {
  console.log('Starting image downloads...');
  for (const img of IMAGES) {
    try {
      await download(img.url, img.dest);
    } catch (err) {
      console.error(`Error downloading ${img.dest}:`, err.message);
    }
  }
  console.log('All downloads finished.');
};

run();
