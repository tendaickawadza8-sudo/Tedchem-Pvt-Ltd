import sys
import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

icon_code = """const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);
"""

# Insert WhatsAppIcon at the top level
if 'WhatsAppIcon' not in content:
    content = re.sub(r'(export default function App\(\) \{)', icon_code + r'\n\1', content)

search1 = """<span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-teal-400" /> {settings.phones[0]}</span>"""
replace1 = """<span className="flex items-center gap-1">
              <a href={`https://wa.me/${settings.phones[0]?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-teal-300 transition-colors">
                <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                {settings.phones[0]}
              </a>
            </span>"""
content = content.replace(search1, replace1)

search2 = """                        {settings.phones.map((phone, i) => (
                          <a
                            key={i}
                            href={`tel:${phone}`}
                            className="block text-xs font-bold text-white hover:text-teal-300 transition-colors"
                          >
                            {phone}
                          </a>
                        ))}"""
replace2 = """                        {settings.phones.map((phone, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <a
                              href={`https://wa.me/${phone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center hover:opacity-80 transition-opacity"
                              title="Chat on WhatsApp"
                            >
                              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                            </a>
                            <a
                              href={`tel:${phone}`}
                              className="block text-xs font-bold text-white hover:text-teal-300 transition-colors"
                            >
                              {phone}
                            </a>
                          </div>
                        ))}"""
content = content.replace(search2, replace2)

search3 = """              <p className="text-slate-500">Tel: {settings.phones.join(" / ")}</p>"""
replace3 = """              <div className="text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>Tel:</span>
                {settings.phones.map((phone, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <a
                      href={`https://wa.me/${phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity flex-shrink-0"
                      title="Chat on WhatsApp"
                    >
                      <WhatsAppIcon className="w-3 h-3 text-[#25D366]" />
                    </a>
                    <a href={`tel:${phone}`} className="hover:text-teal-400 transition-colors">{phone}</a>
                    {i < settings.phones.length - 1 && <span className="ml-1">/</span>}
                  </span>
                ))}
              </div>"""
content = content.replace(search3, replace3)

with open('src/App.tsx', 'w') as f:
    f.write(content)
