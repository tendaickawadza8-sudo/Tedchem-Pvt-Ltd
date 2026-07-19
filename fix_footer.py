import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

footer_original = """            <div className="md:col-span-5 space-y-4">
              <span className="font-bold text-sm tracking-widest text-white uppercase block">
                {settings.companyName}
              </span>"""

footer_new = """            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center space-x-3">
                {settings.logoUrl && (
                  <img src={settings.logoUrl} alt="Logo" className="h-8 w-8 object-contain bg-slate-50 p-1 rounded" />
                )}
                <span className="font-bold text-sm tracking-widest text-white uppercase block">
                  {settings.companyName}
                </span>
              </div>"""

content = content.replace(footer_original, footer_new)

with open('src/App.tsx', 'w') as f:
    f.write(content)
