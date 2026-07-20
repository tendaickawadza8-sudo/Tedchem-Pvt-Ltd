import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

search_string = """  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between selection:bg-teal-600 selection:text-white">"""

replacement = """
  const pageTitles: Record<string, string> = {
    home: "Home",
    products: "Products",
    about: "About Us",
    contact: "Contact Us",
    admin: "Admin Dashboard"
  };
  const activeTitle = pageTitles[activeSection] || "Home";
  const docTitle = `${settings.companyName} - ${activeTitle}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between selection:bg-teal-600 selection:text-white">
      <Helmet>
        <title>{docTitle}</title>
        <meta name="description" content={settings.aboutUsText || "Premium manufacturer of cleaning detergents and hygiene solutions."} />
      </Helmet>"""

content = content.replace(search_string, replacement)

with open('src/App.tsx', 'w') as f:
    f.write(content)
