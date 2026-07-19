import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

hero_original = """          <div className="relative text-white py-24 sm:py-32 overflow-hidden bg-slate-900">
          {/* Background Image Grid of Products */}
          <div className="absolute inset-0 z-0 opacity-20 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 transform -skew-y-6 scale-125 origin-center">
            {products.map((p, i) => (
              <div key={i} className="w-full h-64 bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${p.imageUrl})` }}></div>
            ))}
            {/* Duplicate to fill space if few products */}
            {products.map((p, i) => (
              <div key={`dup-${i}`} className="w-full h-64 bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${p.imageUrl})` }}></div>
            ))}
            {products.map((p, i) => (
              <div key={`dup2-${i}`} className="w-full h-64 bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${p.imageUrl})` }}></div>
            ))}
          </div>
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-slate-900/80 z-0"></div>"""

hero_new = """          <div className="relative bg-slate-900 text-white py-24 sm:py-32 overflow-hidden">
          {/* Subtle industrial blueprint decorative lines */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="grid-hero" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid-hero)" />
            </svg>
          </div>
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl z-0"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl z-0"></div>"""

content = content.replace(hero_original, hero_new)

with open('src/App.tsx', 'w') as f:
    f.write(content)
