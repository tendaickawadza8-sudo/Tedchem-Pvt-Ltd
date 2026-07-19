import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Body parsing with size limit for Base64 image uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Storage configuration paths
const DATA_DIR = path.join(process.cwd(), "data");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");

// Ensure data and uploads directory exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// 1. Copy generated default assets to data/uploads/ for static serving
const imagesSrcDir = path.join(process.cwd(), "src", "assets", "images");
if (fs.existsSync(imagesSrcDir)) {
  const files = fs.readdirSync(imagesSrcDir);
  const logoFile = files.find(f => f.startsWith("tedchem_logo"));
  const thickBleachFile = files.find(f => f.startsWith("thick_bleach"));
  const allPurposeFile = files.find(f => f.startsWith("all_purpose_cleaner"));
  const pineGelFile = files.find(f => f.startsWith("pine_gel"));
  const dishwashingFile = files.find(f => f.startsWith("dishwashing_liquid"));
  const deodorantBlocksFile = files.find(f => f.startsWith("bacfix_deodorant_blocks"));
  const toiletCleanerFile = files.find(f => f.startsWith("bacfix_toilet_cleaner"));
  const washingPowderFile = files.find(f => f.startsWith("bacfix_washing_powder"));
  const bacfixBleachFile = files.find(f => f.startsWith("bacfix_bleach_25l"));
  const whiteFloorPolishFile = files.find(f => f.startsWith("bacfix_white_floor_polish_wax"));
  const mopFile = files.find(f => f.startsWith("industrial_mop"));
  const broomFile = files.find(f => f.startsWith("industrial_broom"));

  if (logoFile) {
    fs.copyFileSync(path.join(imagesSrcDir, logoFile), path.join(UPLOADS_DIR, "tedchem_logo.svg"));
  }
  if (thickBleachFile) {
    fs.copyFileSync(path.join(imagesSrcDir, thickBleachFile), path.join(UPLOADS_DIR, "thick_bleach.jpg"));
  }
  if (allPurposeFile) {
    fs.copyFileSync(path.join(imagesSrcDir, allPurposeFile), path.join(UPLOADS_DIR, "all_purpose_cleaner.jpg"));
  }
  if (pineGelFile) {
    fs.copyFileSync(path.join(imagesSrcDir, pineGelFile), path.join(UPLOADS_DIR, "pine_gel.jpg"));
  }
  if (dishwashingFile) {
    fs.copyFileSync(path.join(imagesSrcDir, dishwashingFile), path.join(UPLOADS_DIR, "dishwashing_liquid.jpg"));
  }
  if (deodorantBlocksFile) {
    fs.copyFileSync(path.join(imagesSrcDir, deodorantBlocksFile), path.join(UPLOADS_DIR, "deodorant_blocks.jpg"));
  }
  if (toiletCleanerFile) {
    fs.copyFileSync(path.join(imagesSrcDir, toiletCleanerFile), path.join(UPLOADS_DIR, "toilet_cleaner.jpg"));
  }
  if (washingPowderFile) {
    fs.copyFileSync(path.join(imagesSrcDir, washingPowderFile), path.join(UPLOADS_DIR, "washing_powder.jpg"));
  }
  if (bacfixBleachFile) {
    fs.copyFileSync(path.join(imagesSrcDir, bacfixBleachFile), path.join(UPLOADS_DIR, "bacfix_bleach.jpg"));
  }
  if (whiteFloorPolishFile) {
    fs.copyFileSync(path.join(imagesSrcDir, whiteFloorPolishFile), path.join(UPLOADS_DIR, "white_floor_polish_wax.jpg"));
  }
  if (mopFile) {
    fs.copyFileSync(path.join(imagesSrcDir, mopFile), path.join(UPLOADS_DIR, "mop.jpg"));
  }
  if (broomFile) {
    fs.copyFileSync(path.join(imagesSrcDir, broomFile), path.join(UPLOADS_DIR, "broom.jpg"));
  }
}

// 2. Initialize default settings if file doesn't exist
if (!fs.existsSync(SETTINGS_FILE)) {
  const defaultSettings = {
    logoUrl: fs.existsSync(path.join(UPLOADS_DIR, "tedchem_logo.svg")) ? "/uploads/tedchem_logo_v2.svg" : "https://picsum.photos/seed/tedchem/200/200",
    companyName: "Tedchem Pvt Ltd",
    aboutUsText: "Tedchem Pvt Ltd is a premier manufacturer of high-quality cleaning detergents and hygiene solutions. Committed to safety, cleanliness, and superior quality assurance, we supply a range of certified bulk cleaning products, including Bacfix Thick Bleach, All Purpose Cleaner, Pine Gel, and Dishwashing Liquid. We serve corporate, retail, mining, and household sectors across the nation, ensuring reliable logistics and eco-friendly manufacturing standards.",
    address: "57 Herbert Chitepo Street",
    phones: ["+263773937863", "+263774266354"],
    email: "tedchemzim8@gmail.com",
    web3FormsKey: "" // Can be added by the admin to enable Web3Forms direct email alerts!
  };
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2), "utf8");
}

// 3. Initialize default products if file doesn't exist
if (!fs.existsSync(PRODUCTS_FILE)) {
  const defaultProducts = [
    {
      id: "prod_1",
      name: "Bacfix Thick Bleach",
      description: "Lemon Fresh Multipurpose Thick Bleach. Delivers powerful deep cleaning action to remove tough stains, eliminate germs, and leave toilet bowls and hard surfaces sparkling clean with a fresh lemon aroma.",
      imageUrl: fs.existsSync(path.join(UPLOADS_DIR, "thick_bleach.jpg")) ? "/uploads/thick_bleach.jpg" : "https://picsum.photos/seed/bleach/600/400"
    },
    {
      id: "prod_2",
      name: "Bacfix All Purpose Cleaner",
      description: "Lemon scented premium all-purpose liquid cleaner. Highly effective multi-surface formula designed to lift grease, grime, and household dirt from floors, walls, kitchens, and bathrooms.",
      imageUrl: fs.existsSync(path.join(UPLOADS_DIR, "all_purpose_cleaner.jpg")) ? "/uploads/all_purpose_cleaner.jpg" : "https://picsum.photos/seed/cleaner/600/400"
    },
    {
      id: "prod_3",
      name: "Bacfix Pine Gel",
      description: "High-quality concentrated antiseptic pine gel cleaner. Formulated with natural pine oil to sanitize, clean, and deodorize surfaces in hospitals, schools, homes, and offices.",
      imageUrl: fs.existsSync(path.join(UPLOADS_DIR, "pine_gel.jpg")) ? "/uploads/pine_gel.jpg" : "https://picsum.photos/seed/gel/600/400"
    },
    {
      id: "prod_4",
      name: "Bacfix Dishwashing Liquid",
      description: "Premium grease-cutting Hand Wash and dishwashing liquid with a fresh lemon scent. Gently formulated yet ultra-concentrated to cut through tough oils, fat, and food residues, leaving your plates and cookware sparkling clean.",
      imageUrl: fs.existsSync(path.join(UPLOADS_DIR, "dishwashing_liquid.jpg")) ? "/uploads/dishwashing_liquid.jpg" : "https://picsum.photos/seed/dishwash/600/400"
    },
    {
      id: "prod_5",
      name: "Bacfix Deodorant Blocks",
      description: "Effective deodorizer blocks (72 tablets). Eliminates odours from urinals, gym lockers, closets, and storage sheds.",
      imageUrl: fs.existsSync(path.join(UPLOADS_DIR, "deodorant_blocks.jpg")) ? "/uploads/deodorant_blocks.jpg" : "https://picsum.photos/seed/blocks/600/400"
    },
    {
      id: "prod_6",
      name: "Bacfix Toilet Cleaner 25L",
      description: "Heavy-duty 25L industrial toilet cleaner. Powerful formula designed to remove stubborn stains, lime scale, and rust from toilet bowls and urinals while killing germs and leaving a fresh scent.",
      imageUrl: fs.existsSync(path.join(UPLOADS_DIR, "toilet_cleaner.jpg")) ? "/uploads/toilet_cleaner.jpg" : "https://picsum.photos/seed/toilet/600/400"
    },
    {
      id: "prod_7",
      name: "Bacfix Washing Powder 25kg",
      description: "Heavy-duty 25kg industrial washing powder. Powerful stain-removing formula that deep cleans clothes, removes tough stains, and leaves fabrics smelling fresh. Ideal for commercial laundries, hotels, and large households.",
      imageUrl: fs.existsSync(path.join(UPLOADS_DIR, "washing_powder.jpg")) ? "/uploads/washing_powder.jpg" : "https://picsum.photos/seed/powder/600/400"
    },
    {
      id: "prod_8",
      name: "Bacfix Bleach 25L",
      description: "Heavy-duty 25L industrial bleach. Powerful formula for bleaching, disinfecting, and sanitizing. Kills 99.9% of germs and bacteria, leaving surfaces bright and hygienic.",
      imageUrl: fs.existsSync(path.join(UPLOADS_DIR, "bacfix_bleach.jpg")) ? "/uploads/bacfix_bleach.jpg" : "https://picsum.photos/seed/bleach/600/400"
    },
    {
      id: "prod_9",
      name: "Bacfix White Floor Polish Wax 20L",
      description: "Premium 20L white floor polish wax paste. Provides a durable, high-gloss protective finish for all sealed hard floors. Scuff and slip-resistant formula that keeps floors looking brilliant.",
      imageUrl: fs.existsSync(path.join(UPLOADS_DIR, "white_floor_polish_wax.jpg")) ? "/uploads/white_floor_polish_wax.jpg" : "https://picsum.photos/seed/polish/600/400"
    },
    {
      id: "prod_10",
      name: "Industrial Cleaning Mop",
      description: "Heavy-duty industrial cleaning mop with highly absorbent cotton/microfiber head and a sturdy handle, ideal for commercial cleaning and large floor surfaces.",
      imageUrl: fs.existsSync(path.join(UPLOADS_DIR, "mop.jpg")) ? "/uploads/mop.jpg" : "https://picsum.photos/seed/mop/600/400"
    },
    {
      id: "prod_11",
      name: "Industrial Sweeping Broom",
      description: "Heavy-duty industrial sweeping broom featuring thick, durable bristles and a strong handle, designed to sweep large spaces and tough debris efficiently.",
      imageUrl: fs.existsSync(path.join(UPLOADS_DIR, "broom.jpg")) ? "/uploads/broom.jpg" : "https://picsum.photos/seed/broom/600/400"
    },
    {
      id: "prod_12",
      name: "Latex Gloves",
      description: "High-quality, durable latex gloves for medical, industrial, and general hygiene use. Provides excellent barrier protection and flexibility.",
      imageUrl: fs.existsSync(path.join(UPLOADS_DIR, "latex_gloves.jpg")) ? "/uploads/latex_gloves.jpg" : "https://picsum.photos/seed/gloves/600/400"
    },
    {
      id: "prod_13",
      name: "Disposable Face Masks",
      description: "3-ply disposable face masks offering reliable filtration and breathability. Suitable for personal and professional daily protection.",
      imageUrl: fs.existsSync(path.join(UPLOADS_DIR, "face_masks.jpg")) ? "/uploads/face_masks.jpg" : "https://picsum.photos/seed/masks/600/400"
    }
  ];
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(defaultProducts, null, 2), "utf8");
}

// 4. Initialize empty inquiries file if it doesn't exist
if (!fs.existsSync(INQUIRIES_FILE)) {
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2), "utf8");
}

// Helper to save a Base64 image to local uploads folder
function saveBase64Image(base64Data: string): string {
  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 image data");
  }
  const ext = matches[1].split("/")[1] || "png";
  const data = Buffer.from(matches[2], "base64");
  const filename = `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;
  const filepath = path.join(UPLOADS_DIR, filename);
  fs.writeFileSync(filepath, data);
  return `/uploads/${filename}`;
}

// Admin authorization middleware
function authorizeAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const password = req.headers["x-admin-password"] || req.body.adminPassword;
  if (password === "Tedchem2026!") {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized. Invalid admin password." });
  }
}

// Serve uploaded media statically
app.use("/uploads", express.static(UPLOADS_DIR));

// ==================== API ENDPOINTS ====================

// Admin login verification
app.post("/api/login", (req, res) => {
  const { password } = req.body;
  if (password === "Tedchem2026!") {
    res.json({ success: true, message: "Authentication successful" });
  } else {
    res.status(401).json({ success: false, error: "Incorrect password" });
  }
});

// GET site settings
app.get("/api/settings", (req, res) => {
  try {
    const data = fs.readFileSync(SETTINGS_FILE, "utf8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: "Failed to read settings data" });
  }
});

// UPDATE site settings (requires admin password)
app.post("/api/settings", authorizeAdmin, (req, res) => {
  try {
    const currentSettings = JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf8"));
    const { companyName, aboutUsText, address, phones, email, web3FormsKey, logoData } = req.body;

    let logoUrl = currentSettings.logoUrl;
    if (logoData && logoData.startsWith("data:")) {
      logoUrl = saveBase64Image(logoData);
    }

    const updatedSettings = {
      ...currentSettings,
      companyName: companyName !== undefined ? companyName : currentSettings.companyName,
      aboutUsText: aboutUsText !== undefined ? aboutUsText : currentSettings.aboutUsText,
      address: address !== undefined ? address : currentSettings.address,
      phones: phones !== undefined ? phones : currentSettings.phones,
      email: email !== undefined ? email : currentSettings.email,
      web3FormsKey: web3FormsKey !== undefined ? web3FormsKey : currentSettings.web3FormsKey,
      logoUrl
    };

    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updatedSettings, null, 2), "utf8");
    res.json({ success: true, settings: updatedSettings });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to save settings data" });
  }
});

// GET products catalog
app.get("/api/products", (req, res) => {
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, "utf8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: "Failed to read products data" });
  }
});

// ADD product (requires admin password)
app.post("/api/products", authorizeAdmin, (req, res) => {
  try {
    const { name, description, imageData } = req.body;
    if (!name || !description) {
      return res.status(400).json({ error: "Product name and description are required" });
    }

    let imageUrl = "https://picsum.photos/seed/product/600/400";
    if (imageData && imageData.startsWith("data:")) {
      imageUrl = saveBase64Image(imageData);
    }

    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf8"));
    const newProduct = {
      id: `prod_${Date.now()}`,
      name,
      description,
      imageUrl
    };

    products.unshift(newProduct); // Add to the top of the list
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf8");
    res.json({ success: true, product: newProduct });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to add product" });
  }
});

// DELETE product (requires admin password)
app.delete("/api/products/:id", authorizeAdmin, (req, res) => {
  try {
    const { id } = req.params;
    let products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf8"));
    const initialLength = products.length;
    products = products.filter((p: any) => p.id !== id);

    if (products.length === initialLength) {
      return res.status(404).json({ error: "Product not found" });
    }

    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf8");
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// GET customer inquiries (requires admin password)
app.get("/api/inquiries", authorizeAdmin, (req, res) => {
  try {
    const data = fs.readFileSync(INQUIRIES_FILE, "utf8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: "Failed to read inquiries" });
  }
});

// SUBMIT customer inquiry (public endpoint)
app.post("/api/inquiries", (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required" });
    }

    const inquiries = JSON.parse(fs.readFileSync(INQUIRIES_FILE, "utf8"));
    const newInquiry = {
      id: `inq_${Date.now()}`,
      name,
      email,
      phone: phone || "Not provided",
      message,
      submittedAt: new Date().toISOString()
    };

    inquiries.unshift(newInquiry);
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), "utf8");
    res.json({ success: true, inquiry: newInquiry });
  } catch (error) {
    res.status(500).json({ error: "Failed to submit inquiry" });
  }
});

// ==================== VITE & STATIC SERVING ====================

async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== "production") {
    // Vite middleware mode for local development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets from dist/
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Tedchem Pvt Ltd full-stack server running on http://localhost:${PORT}`);
  });
}

setupViteOrStatic();
