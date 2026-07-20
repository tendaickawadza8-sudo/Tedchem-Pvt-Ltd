const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const search = `    if (s.length > 0) {
      // parse phones back to array if it is stored as string
      res.json({
        ...s[0],
        phones: s[0].phones ? JSON.parse(s[0].phones) : []
      });
    } else {
      res.json({});
    }`;

const replace = `    if (s.length > 0) {
      // parse phones back to array if it is stored as string
      res.json({
        ...s[0],
        phones: s[0].phones ? JSON.parse(s[0].phones) : []
      });
    } else {
      res.json({
        logoUrl: "/uploads/tedchem_logo_v2.svg",
        companyName: "Tedchem Pvt Ltd",
        aboutUsText: "Tedchem Pvt Ltd is a premier manufacturer of high-quality cleaning detergents and hygiene solutions. Committed to safety, cleanliness, and superior quality assurance, we supply a range of certified bulk cleaning products, including Bacfix Thick Bleach, All Purpose Cleaner, Pine Gel, and Dishwashing Liquid. We serve corporate, retail, mining, and household sectors across the nation, ensuring reliable logistics and eco-friendly manufacturing standards.",
        address: "57 Herbert Chitepo Street, Mutare",
        phones: ["+263773937863", "+263774266354"],
        email: "tedchemzim8@gmail.com",
        web3FormsKey: ""
      });
    }`;

content = content.replace(search, replace);
fs.writeFileSync('server.ts', content);
