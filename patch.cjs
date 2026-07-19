const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove handleScroll useEffect
code = code.replace(/  \/\/ Scroll tracking to update navigation highlights[\s\S]*?\}, \[\]\);/, '');

// 2. Replace scrollTo definition
code = code.replace(/  const scrollTo = \(ref: React\.RefObject<HTMLDivElement \| null>\) => \{\n    setMobileMenuOpen\(false\);\n    if \(ref\.current\) \{\n      ref\.current\.scrollIntoView\(\{ behavior: "smooth" \}\);\n    \}\n  \};/, `  const navigateTo = (section: string) => {
    setMobileMenuOpen(false);
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };`);

// 3. Replace scrollTo calls
code = code.replace(/scrollTo\(homeRef\)/g, 'navigateTo("home")');
code = code.replace(/scrollTo\(productsRef\)/g, 'navigateTo("products")');
code = code.replace(/scrollTo\(aboutRef\)/g, 'navigateTo("about")');
code = code.replace(/scrollTo\(contactRef\)/g, 'navigateTo("contact")');

// 4. Wrap sections
code = code.replace(/        \{\/\* HERO SECTION \*\/\}\n        <div ref=\{homeRef\}/, '        {/* HERO SECTION */}\n        {activeSection === "home" && (\n        <div ref={homeRef}');
code = code.replace(/        \{\/\* PRODUCTS SECTION \*\/\}\n        <div ref=\{productsRef\}/, '        {activeSection === "products" && (\n        {/* PRODUCTS SECTION */}\n        <div ref={productsRef}');
code = code.replace(/        \{\/\* SPECIFICATIONS DETAIL MODAL \*\/\}/, '        )}\n\n        {/* SPECIFICATIONS DETAIL MODAL */}');

// The about and contact sections
code = code.replace(/        \{\/\* ABOUT SECTION \*\/\}\n        <div ref=\{aboutRef\}/, '        {activeSection === "about" && (\n        {/* ABOUT SECTION */}\n        <div ref={aboutRef}');
code = code.replace(/        \{\/\* CONTACT SECTION \*\/\}\n        <div ref=\{contactRef\}/, '        )}\n\n        {activeSection === "contact" && (\n        {/* CONTACT SECTION */}\n        <div ref={contactRef}');

// Close contact section
// We need to find the end of the contact section, which is just before </main>
code = code.replace(/      <\/main>/, '        )}\n      </main>');

fs.writeFileSync('src/App.tsx', code);
