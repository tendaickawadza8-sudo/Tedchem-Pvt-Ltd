import sys

with open('server.ts', 'r') as f:
    content = f.read()

search = """app.get("/api/products", async (req, res) => {
  try {
    const p = await db.select().from(products).orderBy(asc(products.id));
    res.json(p);"""

replace = """app.get("/api/products", async (req, res) => {
  try {
    const p = await db.select().from(products).orderBy(asc(products.id));
    
    // Fix ephemeral local images
    const fixedP = p.map(prod => {
      let img = prod.imageUrl;
      if (img && img.startsWith("/uploads/img_")) {
        if (!fs.existsSync(path.join(process.cwd(), "data", img))) {
           img = "https://picsum.photos/seed/cleaner/600/400"; // Generic fallback
        }
      }
      return { ...prod, imageUrl: img };
    });
    
    res.json(fixedP);"""

content = content.replace(search, replace)

with open('server.ts', 'w') as f:
    f.write(content)
