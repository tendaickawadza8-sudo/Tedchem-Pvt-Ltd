const fs = require('fs');
let code = fs.readFileSync('src/App_backup.tsx', 'utf8');

// The code currently has:
// 1. {activeSection === "home" && (
// <div ref={homeRef} ...
// 2. <div ref={productsRef} ...
// 3. <div ref={aboutRef} ...
// 4. <div ref={contactRef} ...
// But it also has unmatched brackets because of the failed script.

// Let's reset the structure around these refs and re-wrap.
// First, find the exact strings to replace.

// Fix home section end
code = code.replace(/        \{\/\* PRODUCTS SECTION \*\/\}\n        \{activeSection === "products" && \(\n        <div ref=\{productsRef\}/g,
        ')}\n        {/* PRODUCTS SECTION */}\n        {activeSection === "products" && (\n        <div ref={productsRef}');

// Wait, the products section also contains the SPECIFICATIONS DETAIL MODAL? 
// Yes, the modal is AnimatePresence which should probably be inside the products section or outside.
// The products section ends right before {/* ABOUT US SECTION */}
code = code.replace(/        \{\/\* ABOUT US SECTION \*\/\}\n        <div ref=\{aboutRef\}/g,
        ')}\n\n        {/* ABOUT US SECTION */}\n        {activeSection === "about" && (\n        <div ref={aboutRef}');

// The about section ends before {/* CONTACT SECTION */}
// Wait, is it {/* CONTACT SECTION */} or something else? Let's check.
