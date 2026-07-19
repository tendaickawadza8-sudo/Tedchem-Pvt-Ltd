const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/        \}\)\n        \{\/\* PRODUCTS SECTION \*\/\}/g, '        {/* PRODUCTS SECTION */}');
code = code.replace(/        \}\)\n\n        \{\/\* CONTACT US SECTION \*\/\}/g, '        {/* CONTACT US SECTION */}');
code = code.replace(/        \}\)\n        \{\/\* ABOUT US SECTION \*\/\}/g, '        {/* ABOUT US SECTION */}');

code = code.replace(/\{activeSection === "home" && \(\n        <div/g, '<div');
code = code.replace(/\{activeSection === "products" && \(\n        <div/g, '<div');
code = code.replace(/\{activeSection === "about" && \(\n        <div/g, '<div');
code = code.replace(/\{activeSection === "contact" && \(\n        <div/g, '<div');

code = code.replace(/        \}\)\n      <\/main>\n\n      \{\/\* FOOTER \*\/\}/g, '      </main>\n\n      {/* FOOTER */}');
code = code.replace(/        \}\)\n        \{\/\* SPECIFICATIONS DETAIL MODAL \*\/\}/g, '        {/* SPECIFICATIONS DETAIL MODAL */}');

fs.writeFileSync('src/App.tsx', code);
