import json

with open('data/products.json', 'r') as f:
    products = json.load(f)

products.append({
    "id": "prod_12",
    "name": "Latex Gloves",
    "description": "High-quality, durable latex gloves for medical, industrial, and general hygiene use. Provides excellent barrier protection and flexibility.",
    "imageUrl": "https://picsum.photos/seed/gloves/600/400"
})

products.append({
    "id": "prod_13",
    "name": "Disposable Face Masks",
    "description": "3-ply disposable face masks offering reliable filtration and breathability. Suitable for personal and professional daily protection.",
    "imageUrl": "https://picsum.photos/seed/masks/600/400"
})

with open('data/products.json', 'w') as f:
    json.dump(products, f, indent=2)

