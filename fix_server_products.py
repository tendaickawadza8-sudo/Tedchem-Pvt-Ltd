import re

with open('server.ts', 'r') as f:
    content = f.read()

replacement = """    },
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
  ];"""

content = re.sub(
    r'    \},\n    \{\n      id: "prod_11",\n      name: "Industrial Sweeping Broom",\n      description: "Heavy-duty industrial sweeping broom featuring thick, durable bristles and a strong handle, designed to sweep large spaces and tough debris efficiently\.",\n      imageUrl: fs\.existsSync\(path\.join\(UPLOADS_DIR, "broom\.jpg"\)\) \? "/uploads/broom\.jpg" : "https://picsum\.photos/seed/broom/600/400"\n    \}\n  \];',
    replacement,
    content
)

with open('server.ts', 'w') as f:
    f.write(content)
