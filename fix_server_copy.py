import re

with open('server.ts', 'r') as f:
    content = f.read()

find_str = """  const broomFile = files.find(f => f.startsWith("industrial_broom"));"""

replace_str = """  const broomFile = files.find(f => f.startsWith("industrial_broom"));
  const latexGlovesFile = files.find(f => f.startsWith("box_of_latex_gloves"));
  const faceMasksFile = files.find(f => f.startsWith("box_of_face_masks"));"""

content = content.replace(find_str, replace_str)

find_str2 = """  if (broomFile) {
    fs.copyFileSync(path.join(imagesSrcDir, broomFile), path.join(UPLOADS_DIR, "broom.jpg"));
  }"""

replace_str2 = """  if (broomFile) {
    fs.copyFileSync(path.join(imagesSrcDir, broomFile), path.join(UPLOADS_DIR, "broom.jpg"));
  }
  if (latexGlovesFile) {
    fs.copyFileSync(path.join(imagesSrcDir, latexGlovesFile), path.join(UPLOADS_DIR, "latex_gloves_v2.jpg"));
  }
  if (faceMasksFile) {
    fs.copyFileSync(path.join(imagesSrcDir, faceMasksFile), path.join(UPLOADS_DIR, "face_masks_v2.jpg"));
  }"""

content = content.replace(find_str2, replace_str2)

with open('server.ts', 'w') as f:
    f.write(content)
