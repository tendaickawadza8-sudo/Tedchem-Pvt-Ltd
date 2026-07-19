const fs = require('fs');
let code = fs.readFileSync('src/App_backup.tsx', 'utf8');

// I will rebuild from backup.
// 1. replace handleScroll in useEffect (remove it)
code = code.replace(/  \/\/ Scroll tracking to update navigation highlights[\s\S]*?\}, \[\]\);/, '');

// 2. replace scrollTo
code = code.replace(/  const scrollTo = \(ref: React\.RefObject<HTMLDivElement \| null>\) => \{\n    setMobileMenuOpen\(false\);\n    if \(ref\.current\) \{\n      ref\.current\.scrollIntoView\(\{ behavior: "smooth" \}\);\n    \}\n  \};/, `  const navigateTo = (section: string) => {
    setMobileMenuOpen(false);
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };`);

// 3. replace scrollTo calls
code = code.replace(/scrollTo\(homeRef\)/g, 'navigateTo("home")');
code = code.replace(/scrollTo\(productsRef\)/g, 'navigateTo("products")');
code = code.replace(/scrollTo\(aboutRef\)/g, 'navigateTo("about")');
code = code.replace(/scrollTo\(contactRef\)/g, 'navigateTo("contact")');

// 4. wrap sections
// Hero
code = code.replace('        {/* HERO SECTION */}\n        <div ref={homeRef}', '        {/* HERO SECTION */}\n        {activeSection === "home" && (\n        <div ref={homeRef}');

// Hero end / Products start
code = code.replace('        {/* PRODUCTS SECTION */}\n        <div ref={productsRef}', '        )}\n\n        {/* PRODUCTS SECTION */}\n        {activeSection === "products" && (\n        <div ref={productsRef}');

// Products end / Specs Modal start
code = code.replace('        {/* SPECIFICATIONS DETAIL MODAL */}', '        )}\n\n        {/* SPECIFICATIONS DETAIL MODAL */}');

// About start
code = code.replace('        {/* ABOUT US SECTION */}\n        <div ref={aboutRef}', '        {/* ABOUT US SECTION */}\n        {activeSection === "about" && (\n        <div ref={aboutRef}');

// About end / Contact start
code = code.replace('        {/* CONTACT US SECTION */}\n        <div ref={contactRef}', '        )}\n\n        {/* CONTACT US SECTION */}\n        {activeSection === "contact" && (\n        <div ref={contactRef}');

// Contact end
code = code.replace('      </main>\n\n      {/* FOOTER */}', '        )}\n      </main>\n\n      {/* FOOTER */}');

fs.writeFileSync('src/App.tsx', code);
