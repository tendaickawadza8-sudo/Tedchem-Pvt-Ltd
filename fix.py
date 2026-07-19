import re

with open('src/App_backup.tsx', 'r') as f:
    content = f.read()

# Restore from backup first to eliminate my failed regexes.
with open('src/App.tsx', 'w') as f:
    f.write(content)

# We want to:
# 1. replace handleScroll in useEffect (remove it)
content = re.sub(r'  // Scroll tracking to update navigation highlights.*?\}, \[\]\);', '', content, flags=re.DOTALL)

# 2. replace scrollTo
scrollTo_str = r'''  const scrollTo = \(ref: React\.RefObject<HTMLDivElement \| null>\) => \{
    setMobileMenuOpen\(false\);
    if \(ref\.current\) \{
      ref\.current\.scrollIntoView\(\{ behavior: "smooth" \}\);
    \}
  \};'''
navigateTo_str = '''  const navigateTo = (section: string) => {
    setMobileMenuOpen(false);
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };'''
content = re.sub(scrollTo_str, navigateTo_str, content)

# 3. replace scrollTo calls
content = content.replace('scrollTo(homeRef)', 'navigateTo("home")')
content = content.replace('scrollTo(productsRef)', 'navigateTo("products")')
content = content.replace('scrollTo(aboutRef)', 'navigateTo("about")')
content = content.replace('scrollTo(contactRef)', 'navigateTo("contact")')

# 4. wrap sections
# hero
content = content.replace('        {/* HERO SECTION */}\n        <div ref={homeRef}', '        {/* HERO SECTION */}\n        {activeSection === "home" && (\n        <div ref={homeRef}')
# end hero, start products
content = content.replace('        {/* PRODUCTS SECTION */}\n        <div ref={productsRef}', '        )}\n\n        {/* PRODUCTS SECTION */}\n        {activeSection === "products" && (\n        <div ref={productsRef}')
# end products, start about
content = content.replace('        {/* ABOUT US SECTION */}\n        <div ref={aboutRef}', '        )}\n\n        {/* ABOUT US SECTION */}\n        {activeSection === "about" && (\n        <div ref={aboutRef}')
# end about, start contact
content = content.replace('        {/* CONTACT US SECTION */}\n        <div ref={contactRef}', '        )}\n\n        {/* CONTACT US SECTION */}\n        {activeSection === "contact" && (\n        <div ref={contactRef}')
# end contact
content = content.replace('      </main>', '        )}\n      </main>')

with open('src/App.tsx', 'w') as f:
    f.write(content)
