import { db } from './src/db/index.ts';
import { settings, products, inquiries } from './src/db/schema.ts';
import fs from 'fs';
import path from 'path';

async function seed() {
  try {
    const DATA_DIR = path.join(process.cwd(), "data");
    const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
    const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
    const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");

    if (fs.existsSync(SETTINGS_FILE)) {
      const s = JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf8"));
      await db.insert(settings).values({
        logoUrl: s.logoUrl,
        companyName: s.companyName,
        aboutUsText: s.aboutUsText,
        address: s.address,
        phones: JSON.stringify(s.phones),
        email: s.email,
        web3FormsKey: s.web3FormsKey,
      });
      console.log('Seeded settings');
    }

    if (fs.existsSync(PRODUCTS_FILE)) {
      const p = JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf8"));
      for (const prod of p) {
        await db.insert(products).values({
          name: prod.name,
          description: prod.description,
          imageUrl: prod.imageUrl,
        });
      }
      console.log('Seeded products');
    }

    if (fs.existsSync(INQUIRIES_FILE)) {
      const inq = JSON.parse(fs.readFileSync(INQUIRIES_FILE, "utf8"));
      for (const i of inq) {
        await db.insert(inquiries).values({
          name: i.name,
          email: i.email,
          message: i.message,
          status: 'new',
        });
      }
      console.log('Seeded inquiries');
    }
  } catch (err) {
    console.error('Seed error:', err);
  }
}
seed();
