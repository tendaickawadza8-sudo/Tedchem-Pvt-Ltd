const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');
const searchString = `  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between selection:bg-teal-600 selection:text-white">`;

const replacement = `
  const pageTitles: Record<string, string> = {
    home: "Home",
    products: "Products",
    about: "About Us",
    contact: "Contact Us",
    admin: "Admin Dashboard"
  };
  const activeTitle = pageTitles[activeSection] || "Home";
  const docTitle = \`\${settings.companyName} - \${activeTitle}\`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between selection:bg-teal-600 selection:text-white">
      <Helmet>
        <title>{docTitle}</title>
        <meta name="description" content={settings.aboutUsText || "Premium manufacturer of cleaning detergents and hygiene solutions."} />
      </Helmet>
`;

content = content.replace(searchString, replacement);
fs.writeFileSync('src/App.tsx', content);
