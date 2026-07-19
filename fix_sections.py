import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Wrap home
content = content.replace('        {/* HERO SECTION */}\n        <div ref={homeRef}', '        {/* HERO SECTION */}\n        {activeSection === "home" && (\n        <div ref={homeRef}')
content = content.replace('        {/* PRODUCTS SECTION */}\n        <div ref={productsRef}', '        )}\n\n        {/* PRODUCTS SECTION */}\n        {activeSection === "products" && (\n        <div ref={productsRef}')
content = content.replace('        {/* ABOUT US SECTION */}\n        <div ref={aboutRef}', '        )}\n\n        {/* ABOUT US SECTION */}\n        {activeSection === "about" && (\n        <div ref={aboutRef}')
content = content.replace('        {/* CONTACT US SECTION */}\n        <div ref={contactRef}', '        )}\n\n        {/* CONTACT US SECTION */}\n        {activeSection === "contact" && (\n        <div ref={contactRef}')

# The end of contact section needs a closing `)}`
# The contact section ends right before `      </main>`
content = content.replace('      </main>', '        )}\n      </main>', 1)

with open('src/App.tsx', 'w') as f:
    f.write(content)
