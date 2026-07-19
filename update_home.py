import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Update the wrapper for home
content = content.replace(
    '        {/* HERO SECTION */}\n        {activeSection === "home" && (\n        <div ref={homeRef} className="relative bg-teal-900 text-white py-24 sm:py-32 overflow-hidden">',
    '        {/* HOME SECTION */}\n        {activeSection === "home" && (\n        <div ref={homeRef}>\n          {/* HERO SECTION */}\n          <div className="relative bg-teal-900 text-white py-24 sm:py-32 overflow-hidden">'
)

# 2. Add the featured products right before closing the home section
new_featured_html = """          </div>

          {/* FEATURED PRODUCTS */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-slate-50 border-t border-slate-200">
            <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-600">Discover Quality</span>
                <h2 className="text-3xl font-bold text-slate-800 font-display tracking-tight mt-1">Featured Products</h2>
              </div>
              <button
                onClick={() => navigateTo("products")}
                className="text-teal-700 text-xs font-bold hover:underline uppercase tracking-wider cursor-pointer hidden sm:flex items-center gap-1 transition-all hover:text-teal-900"
              >
                View Full Catalog
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((product) => (
                <motion.div
                  key={`featured-${product.id}`}
                  className="border border-slate-200 bg-white p-4 rounded-lg shadow-sm hover:border-teal-400 transition-all hover:shadow-md flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative w-full h-48 bg-slate-50 rounded mb-4 overflow-hidden flex items-center justify-center border border-slate-100 p-4 transition-all duration-300 group-hover:bg-white">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-all duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2.5 right-2.5 bg-teal-850/95 text-white text-[8px] uppercase font-bold tracking-widest px-2 py-0.5 rounded shadow-sm">
                        Corporate Grade
                      </div>
                    </div>
                    <div className="space-y-1 mb-4">
                      <h3 className="font-bold text-sm text-slate-900 mb-1 uppercase tracking-wider line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-500 leading-snug line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                      }}
                      className="w-full bg-slate-100 hover:bg-teal-700 hover:text-white text-slate-700 text-xs py-2 rounded font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>View Specs</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 sm:hidden text-center">
               <button
                onClick={() => navigateTo("products")}
                className="bg-teal-50 text-teal-700 px-6 py-3 rounded text-xs font-bold hover:bg-teal-100 uppercase tracking-wider cursor-pointer inline-flex items-center gap-2 transition-all w-full justify-center"
              >
                View Full Catalog
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        )}

        {/* PRODUCTS SECTION */}"""

content = content.replace(
    '          </div>\n        </div>\n        )}\n\n        {/* PRODUCTS SECTION */}',
    new_featured_html
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
