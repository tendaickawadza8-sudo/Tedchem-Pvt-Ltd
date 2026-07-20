import sys

with open('server.ts', 'r') as f:
    content = f.read()

search = """    if (s.length > 0) {
      // parse phones back to array if it is stored as string
      res.json({
        ...s[0],
        phones: s[0].phones ? JSON.parse(s[0].phones) : []
      });"""

replace = """    if (s.length > 0) {
      let logoToReturn = s[0].logoUrl;
      if (logoToReturn && logoToReturn.startsWith("/uploads/img_")) {
        // Ephemeral file might be lost on Cloud Run restart
        if (!fs.existsSync(path.join(process.cwd(), "data", logoToReturn))) {
           logoToReturn = "/uploads/tedchem_logo_v2.svg";
        }
      }

      // parse phones back to array if it is stored as string
      res.json({
        ...s[0],
        logoUrl: logoToReturn || "/uploads/tedchem_logo_v2.svg",
        phones: s[0].phones ? JSON.parse(s[0].phones) : []
      });"""

content = content.replace(search, replace)

with open('server.ts', 'w') as f:
    f.write(content)
