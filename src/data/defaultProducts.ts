export interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Bacfix Thick Bleach",
    description: "High-grade industrial and domestic disinfectant bleach with thick clinging formula for deep cleaning, stain removal, and bacteria elimination.",
    imageUrl: "/uploads/thick_bleach.jpg"
  },
  {
    id: 2,
    name: "Bacfix All Purpose Cleaner",
    description: "Versatile, multi-surface cleaning solution formulated to dissolve tough dirt, grime, and grease from floors, walls, tiles, and countertops.",
    imageUrl: "/uploads/all_purpose_cleaner.jpg"
  },
  {
    id: 3,
    name: "Bacfix Pine Gel",
    description: "Concentrated pine disinfectant gel featuring natural pine oil extract. Powerful degreasing and sanitizing agent with long-lasting freshness.",
    imageUrl: "/uploads/prod_3.png"
  },
  {
    id: 4,
    name: "Bacfix Dishwashing Liquid",
    description: "High-foaming commercial dishwashing detergent designed to cut through stubborn grease and dried food soils while remaining gentle on hands.",
    imageUrl: "/uploads/prod_4.png"
  },
  {
    id: 5,
    name: "Bacfix Deodorant Blocks",
    description: "Long-lasting fragrance urinal and washroom blocks providing continuous odor control, freshening, and hygiene in commercial facilities.",
    imageUrl: "/uploads/deodorant_blocks.jpg"
  },
  {
    id: 6,
    name: "Bacfix Toilet Cleaner 25L",
    description: "Heavy-duty bulk institutional toilet cleaner that penetrates lime scale, rust stains, and uric acid deposits in high-traffic bathrooms.",
    imageUrl: "/uploads/toilet_cleaner.jpg"
  },
  {
    id: 7,
    name: "Bacfix Washing Powder 25kg",
    description: "Commercial bulk laundry detergent powder with active bio-enzymes for superior stain removal and bright washing in hotel and hospital laundries.",
    imageUrl: "/uploads/washing_powder.jpg"
  },
  {
    id: 8,
    name: "Bacfix Bleach 25L",
    description: "Bulk sodium hypochlorite disinfectant solution ideal for water treatment, commercial sanitization, and heavy industrial laundering.",
    imageUrl: "/uploads/bacfix_bleach.jpg"
  },
  {
    id: 9,
    name: "Bacfix White Floor Polish Wax 20L",
    description: "High-gloss protective liquid wax for vinyl, linoleum, sealed wood, and polished concrete floors. Provides durable slip resistance.",
    imageUrl: "/uploads/white_floor_polish_wax.jpg"
  },
  {
    id: 10,
    name: "Industrial Cleaning Mop",
    description: "Heavy-duty 400g/500g cotton yarn mop with durable zinc-plated clip and sturdy industrial aluminum/timber handle for large commercial spaces.",
    imageUrl: "/uploads/mop.jpg"
  },
  {
    id: 11,
    name: "Industrial Sweeping Broom",
    description: "Wide commercial floor sweeper broom with dense hardwearing PVC bristles, ideal for warehouses, factories, schools, and outdoor pavements.",
    imageUrl: "/uploads/broom.jpg"
  },
  {
    id: 12,
    name: "Latex Gloves",
    description: "Premium examination and industrial protective latex gloves. Textured grip, powder-free, chemical resistant, and compliant with hygiene protocols.",
    imageUrl: "/uploads/latex_gloves_v2.jpg"
  },
  {
    id: 13,
    name: "Disposable Face Masks",
    description: "3-ply certified protective filtration masks with elastic earloops and adjustable nose clip for workplace respiratory protection.",
    imageUrl: "/uploads/face_masks_v2.jpg"
  },
  {
    id: 14,
    name: "Bacfix Tile Cleaner 2L",
    description: "Tile Cleaner for cleaning Tile. Highly effective formula to remove dirt, grease, and soap scum, restoring shine to ceramic and floor tiles.",
    imageUrl: "/uploads/prod_14.png"
  },
  {
    id: 15,
    name: "Bacfix Tile Cleaner 5L",
    description: "Perfumed Tile Cleaner for cleaning Tiles. Bulk commercial formula with a fresh lasting fragrance, perfect for homes, offices, and institutions.",
    imageUrl: "/uploads/prod_15.png"
  }
];
