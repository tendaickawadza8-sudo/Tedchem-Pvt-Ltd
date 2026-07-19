import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

hero_original = """          <div className="relative text-white py-24 sm:py-32 overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center z-0" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1584820927498-cafe4c158f3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')" }}
          ></div>
          {/* Overlay */}
          <div className="absolute inset-0 bg-slate-900/75 z-0"></div>"""

hero_new = """          <div className="relative text-white py-24 sm:py-32 overflow-hidden bg-slate-900">
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

content = content.replace(hero_original, hero_new)

with open('src/App.tsx', 'w') as f:
    f.write(content)
