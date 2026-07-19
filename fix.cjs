const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Fix the comments inside the conditional rendering
code = code.replace(/\{activeSection === "home" && \(\n        <div/g, '{activeSection === "home" && (\n        <div');

// The replacement was:
// code = code.replace(/        \{\/\* PRODUCTS SECTION \*\/\}\n        <div ref=\{productsRef\}/, '        {activeSection === "products" && (\n        {/* PRODUCTS SECTION */}\n        <div ref={productsRef}');
code = code.replace(/\{activeSection === "products" && \(\n        \{\/\* PRODUCTS SECTION \*\/\}\n        <div ref=\{productsRef\}/g, '{/* PRODUCTS SECTION */}\n        {activeSection === "products" && (\n        <div ref={productsRef}');

code = code.replace(/\{activeSection === "about" && \(\n        \{\/\* ABOUT SECTION \*\/\}\n        <div ref=\{aboutRef\}/g, '{/* ABOUT SECTION */}\n        {activeSection === "about" && (\n        <div ref={aboutRef}');

// Wait, the HERO SECTION was:
// code = code.replace(/        \{\/\* HERO SECTION \*\/\}\n        <div ref=\{homeRef\}/, '        {/* HERO SECTION */}\n        {activeSection === "home" && (\n        <div ref={homeRef}');
// This is already correct: {/* HERO SECTION */} then {activeSection === "home" && ( <div...

fs.writeFileSync('src/App.tsx', code);
