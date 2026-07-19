import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Update Hero Section background and styling
hero_original = """          <div className="relative bg-teal-900 text-white py-24 sm:py-32 overflow-hidden">
          {/* Subtle industrial blueprint decorative lines */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="grid-hero" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid-hero)" />
            </svg>
          </div>
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl"></div>"""

hero_new = """          <div className="relative text-white py-24 sm:py-32 overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center z-0" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1584820927498-cafe4c158f3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')" }}
          ></div>
          {/* Overlay */}
          <div className="absolute inset-0 bg-slate-900/75 z-0"></div>"""

content = content.replace(hero_original, hero_new)

# 2. Remove Featured Products
# Find where it starts
start_idx = content.find("          {/* FEATURED PRODUCTS */}")
# Find where products section starts
end_idx = content.find("        {/* PRODUCTS SECTION */}")

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + "        </div>\n        )}\n\n" + content[end_idx:]

with open('src/App.tsx', 'w') as f:
    f.write(content)
