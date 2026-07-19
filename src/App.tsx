import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FlaskConical,
  Phone,
  Mail,
  MapPin,
  Lock,
  Unlock,
  Plus,
  Trash2,
  X,
  Menu,
  CheckCircle,
  AlertCircle,
  Edit3,
  Loader2,
  Globe,
  ShieldCheck,
  Truck,
  ArrowRight,
  Inbox,
  Search,
  Settings as SettingsIcon,
  LogOut,
  Sparkles,
  ChevronRight,
  Send
} from "lucide-react";

// Interfaces
interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

interface Settings {
  logoUrl: string;
  companyName: string;
  aboutUsText: string;
  address: string;
  phones: string[];
  email: string;
  web3FormsKey?: string;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  submittedAt: string;
}

export default function App() {
  // Global State
  const [settings, setSettings] = useState<Settings>({
    logoUrl: "/uploads/tedchem_logo_v2.svg?v=2",
    companyName: "Tedchem Pvt Ltd",
    aboutUsText: "",
    address: "",
    phones: [],
    email: "",
    web3FormsKey: ""
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Nav & UI State
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminActiveTab, setAdminActiveTab] = useState<"settings" | "products" | "inquiries">("settings");

  // Admin Form States
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [editCompanyName, setEditCompanyName] = useState("");
  const [editAboutUs, setEditAboutUs] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editPhones, setEditPhones] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editWeb3Key, setEditWeb3Key] = useState("");

  const [newProdName, setNewProdName] = useState("");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdImageBase64, setNewProdImageBase64] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminMessage, setAdminMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactFeedback, setContactFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Refs for Scroll Detection
  const homeRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  // Fetch initial data
  const fetchData = async () => {
    try {
      const [settingsRes, productsRes] = await Promise.all([
        fetch(`/api/settings?t=${Date.now()}`),
        fetch(`/api/products?t=${Date.now()}`)
      ]);
      const settingsData = await settingsRes.json();
      const productsData = await productsRes.json();

      setSettings(settingsData);
      setProducts(productsData);

      // Pre-fill admin form settings
      setEditCompanyName(settingsData.companyName);
      setEditAboutUs(settingsData.aboutUsText);
      setEditAddress(settingsData.address);
      setEditPhones(settingsData.phones.join(", "));
      setEditEmail(settingsData.email);
      setEditWeb3Key(settingsData.web3FormsKey || "");
    } catch (error) {
      console.error("Error loading Tedchem data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch inquiries when logged in as admin
  const fetchInquiries = async () => {
    if (!isAdmin) return;
    try {
      const res = await fetch("/api/inquiries", {
        headers: { "x-admin-password": "Tedchem2026!" }
      });
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error("Error fetching inquiries:", err);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchInquiries();
    }
  }, [isAdmin]);



  const navigateTo = (section: string) => {
    setMobileMenuOpen(false);
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Admin Actions
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (adminPassword === "Tedchem2026!") {
      setIsAdmin(true);
      setShowLoginModal(false);
      setShowAdminPanel(true);
      setAdminPassword("");
    } else {
      setLoginError("Incorrect password. Please try again.");
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setShowAdminPanel(false);
    setAdminMessage(null);
  };

  // Convert files to Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string | null) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setter(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Save General settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setAdminMessage(null);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": "Tedchem2026!"
        },
        body: JSON.stringify({
          companyName: editCompanyName,
          aboutUsText: editAboutUs,
          address: editAddress,
          phones: editPhones.split(",").map(p => p.trim()).filter(Boolean),
          email: editEmail,
          web3FormsKey: editWeb3Key,
          logoData: logoBase64
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSettings(data.settings);
        setLogoBase64(null);
        setAdminMessage({ type: "success", text: "Settings and logo saved globally!" });
      } else {
        setAdminMessage({ type: "error", text: data.error || "Failed to save settings." });
      }
    } catch (err) {
      setAdminMessage({ type: "error", text: "Server connection failed." });
    } finally {
      setActionLoading(false);
    }
  };

  // Add Product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdDesc) {
      setAdminMessage({ type: "error", text: "Product Name and Description are required." });
      return;
    }

    setActionLoading(true);
    setAdminMessage(null);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": "Tedchem2026!"
        },
        body: JSON.stringify({
          name: newProdName,
          description: newProdDesc,
          imageData: newProdImageBase64
        })
      });

      const data = await res.json();
      if (res.ok) {
        setProducts(prev => [data.product, ...prev]);
        setNewProdName("");
        setNewProdDesc("");
        setNewProdImageBase64(null);
        // Reset file inputs manually
        const fileInput = document.getElementById("prod-img-input") as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        setAdminMessage({ type: "success", text: `Product "${data.product.name}" added successfully!` });
      } else {
        setAdminMessage({ type: "error", text: data.error || "Failed to add product." });
      }
    } catch (err) {
      setAdminMessage({ type: "error", text: "Server connection failed." });
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? This change is permanent and visible globally.")) return;
    setActionLoading(true);
    setAdminMessage(null);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-password": "Tedchem2026!"
        }
      });

      const data = await res.json();
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        setAdminMessage({ type: "success", text: "Product deleted globally!" });
      } else {
        setAdminMessage({ type: "error", text: data.error || "Failed to delete product." });
      }
    } catch (err) {
      setAdminMessage({ type: "error", text: "Server connection failed." });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Contact Submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactFeedback(null);

    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactFeedback({ type: "error", text: "Please fill in all required fields (Name, Email, Message)." });
      return;
    }

    setContactLoading(true);

    try {
      // 1. Save to our full-stack server-side inquiry log
      const localRes = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm)
      });

      // 2. If Web3Forms Access Key is set, forward the submission to Web3Forms for direct email delivery to Tedchem inbox!
      if (settings.web3FormsKey) {
        try {
          await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              access_key: settings.web3FormsKey,
              subject: `New Tedchem Inquiry from ${contactForm.name}`,
              from_name: "Tedchem Website",
              name: contactForm.name,
              email: contactForm.email,
              phone: contactForm.phone || "Not specified",
              message: contactForm.message
            })
          });
        } catch (err) {
          console.error("Web3Forms forward failed, saved locally instead:", err);
        }
      }

      if (localRes.ok) {
        setContactFeedback({
          type: "success",
          text: `Thank you! Your inquiry has been sent successfully to Tedchem Pvt Ltd. Our team will contact you shortly.`
        });
        setContactForm({ name: "", email: "", phone: "", message: "" });
        // Refresh inquiries in background if logged in
        if (isAdmin) fetchInquiries();
      } else {
        setContactFeedback({ type: "error", text: "Something went wrong on our servers. Please try again." });
      }
    } catch (error) {
      setContactFeedback({ type: "error", text: "Connection failed. Please check your network and try again." });
    } finally {
      setContactLoading(false);
    }
  };

  // Filter products based on search
  const filteredProducts = products.filter(
    p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-800">
        <Loader2 className="w-12 h-12 text-teal-600 animate-spin mb-4" />
        <h2 className="text-xl font-medium tracking-wide font-display">Loading Tedchem Corporate Portal...</h2>
        <p className="text-sm text-slate-500 mt-1">Establishing secure database connection</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between selection:bg-teal-600 selection:text-white">
      {/* Dynamic Announcement Bar */}
      <div className="bg-slate-900 text-slate-300 py-2 px-4 text-xs font-mono border-b border-slate-800 flex justify-between items-center z-50 relative">
        <div className="flex items-center space-x-4 max-w-7xl mx-auto w-full justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            Global Distributor Portal Connected
          </span>
          <div className="hidden md:flex space-x-6">
            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-teal-400" /> {settings.phones[0]}</span>
            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-teal-400" /> {settings.email}</span>
          </div>
        </div>
      </div>

      {/* Sticky Navigation Bar */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md shadow-sm z-40 border-b border-slate-200 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigateTo("home")}>
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={`${settings.companyName} Logo`}
                className="h-10 w-10 rounded object-contain border border-slate-100 bg-slate-50 p-1"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 bg-teal-700 rounded flex items-center justify-center text-white font-bold text-xl shadow-sm">
                {settings.companyName ? settings.companyName.charAt(0) : "T"}
              </div>
            )}
            <div>
              <span className="font-display font-extrabold text-lg tracking-tight uppercase block leading-tight">
                {(() => {
                  const name = settings.companyName || "Tedchem Pvt Ltd";
                  const pvtIndex = name.toLowerCase().indexOf("pvt ltd");
                  if (pvtIndex !== -1) {
                    return (
                      <>
                        <span className="text-[#0000FF]">{name.substring(0, pvtIndex)}</span>
                        <span className="font-light text-[#0000FF]">{name.substring(pvtIndex)}</span>
                      </>
                    );
                  }
                  return <span className="text-[#0000FF]">{name}</span>;
                })()}
              </span>
              <span className="text-[9px] uppercase tracking-widest font-sans font-bold text-[#0000FF] block -mt-0.5">
                Cleaning Detergents & Hygiene Solutions
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 h-full">
            <button
              onClick={() => navigateTo("home")}
              className={`text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer h-full border-b-2 flex items-center pt-0.5 ${
                activeSection === "home"
                  ? "text-teal-700 border-teal-700 font-bold"
                  : "text-slate-600 border-transparent hover:text-teal-700"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigateTo("products")}
              className={`text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer h-full border-b-2 flex items-center pt-0.5 ${
                activeSection === "products"
                  ? "text-teal-700 border-teal-700 font-bold"
                  : "text-slate-600 border-transparent hover:text-teal-700"
              }`}
            >
              Products
            </button>
            <button
              onClick={() => navigateTo("about")}
              className={`text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer h-full border-b-2 flex items-center pt-0.5 ${
                activeSection === "about"
                  ? "text-teal-700 border-teal-700 font-bold"
                  : "text-slate-600 border-transparent hover:text-teal-700"
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => navigateTo("contact")}
              className={`text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer h-full border-b-2 flex items-center pt-0.5 ${
                activeSection === "contact"
                  ? "text-teal-700 border-teal-700 font-bold"
                  : "text-slate-600 border-transparent hover:text-teal-700"
              }`}
            >
              Contact
            </button>

            {isAdmin && (
              <button
                onClick={() => setShowAdminPanel(true)}
                className="bg-teal-50 text-teal-700 hover:bg-teal-100 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 border border-teal-200 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Panel
              </button>
            )}
          </nav>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center space-x-2 md:hidden">
            {isAdmin && (
              <button
                onClick={() => setShowAdminPanel(true)}
                className="bg-teal-50 text-teal-700 p-1.5 rounded border border-teal-200"
              >
                <ShieldCheck className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-700 hover:text-slate-900 p-1.5 focus:outline-none"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-32 bg-white shadow-lg z-30 border-b border-slate-200 p-6 md:hidden flex flex-col space-y-4"
          >
            <button
              onClick={() => navigateTo("home")}
              className={`text-left py-2 text-base font-semibold border-b border-slate-100 ${
                activeSection === "home" ? "text-teal-600" : "text-slate-700"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigateTo("products")}
              className={`text-left py-2 text-base font-semibold border-b border-slate-100 ${
                activeSection === "products" ? "text-teal-600" : "text-slate-700"
              }`}
            >
              Products Catalog
            </button>
            <button
              onClick={() => navigateTo("about")}
              className={`text-left py-2 text-base font-semibold border-b border-slate-100 ${
                activeSection === "about" ? "text-teal-600" : "text-slate-700"
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => navigateTo("contact")}
              className={`text-left py-2 text-base font-semibold ${
                activeSection === "contact" ? "text-teal-600" : "text-slate-700"
              }`}
            >
              Contact Us
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow">
        {/* HOME SECTION */}
        {activeSection === "home" && (
        <div ref={homeRef}>
          {/* HERO SECTION */}
          <div className="relative bg-slate-900 text-white py-24 sm:py-32 overflow-hidden">
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
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl z-0"></div>
 
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="uppercase tracking-widest text-teal-400 text-xs font-bold block mb-2">
                Cleaning & Hygiene Solutions
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white mb-6">
                Premium Quality <br />
                <span className="text-teal-300">Cleaning Detergents.</span>
              </h1>
              <p className="text-teal-100 text-lg mb-8 leading-relaxed max-w-2xl">
                Manufacturing certified, high-efficiency cleaning detergents, disinfectants, and bulk hygiene solutions across Zimbabwe. Welcome to <strong className="text-white font-semibold">{settings.companyName}</strong>, your certified corporate partner for professional cleanliness and safety.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={() => navigateTo("products")}
                  className="bg-teal-500 hover:bg-teal-400 text-white px-6 py-3.5 rounded font-bold transition-all shadow-lg text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  Explore Products
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigateTo("contact")}
                  className="border border-teal-400 text-teal-400 px-6 py-3.5 rounded font-bold hover:bg-teal-800 hover:text-white transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  Download Catalog
                </button>
              </div>
            </div>
 
            {/* Quick stats and side graphic */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-teal-950/40 border border-teal-800/60 hover:border-teal-400 p-6 rounded-lg transition-all group">
                <div className="h-10 w-10 rounded bg-teal-500/10 flex items-center justify-center mb-4 text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-all">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-3xl font-bold text-white tracking-tight">100%</h3>
                <p className="text-xs text-teal-200 mt-1 uppercase font-semibold tracking-wider">Quality Assured</p>
              </div>
              <div className="bg-teal-950/40 border border-teal-800/60 hover:border-teal-400 p-6 rounded-lg transition-all group">
                <div className="h-10 w-10 rounded bg-teal-500/10 flex items-center justify-center mb-4 text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-all">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="text-3xl font-bold text-white tracking-tight">Global</h3>
                <p className="text-xs text-teal-200 mt-1 uppercase font-semibold tracking-wider">Secure Logistics</p>
              </div>
              <div className="bg-teal-950/40 border border-teal-800/60 hover:border-teal-400 p-6 rounded-lg transition-all group">
                <div className="h-10 w-10 rounded bg-teal-500/10 flex items-center justify-center mb-4 text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-all">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="text-3xl font-bold text-white tracking-tight">12+</h3>
                <p className="text-xs text-teal-200 mt-1 uppercase font-semibold tracking-wider">Industrial Sectors</p>
              </div>
              <div className="bg-teal-950/40 border border-teal-800/60 hover:border-teal-400 p-6 rounded-lg transition-all group">
                <div className="h-10 w-10 rounded bg-teal-500/10 flex items-center justify-center mb-4 text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-all">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-3xl font-bold text-white tracking-tight">Verified</h3>
                <p className="text-xs text-teal-200 mt-1 uppercase font-semibold tracking-wider">ISO Standards</p>
              </div>
            </div>
          </div>

          </div>

        </div>
        )}

        {/* PRODUCTS SECTION */}
        {activeSection === "products" && (
        <div ref={productsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-600">Product Portfolio</span>
              <h2 className="text-3xl font-bold text-slate-800 font-display tracking-tight mt-1">Our Core Products</h2>
            </div>
            <button
              onClick={() => {
                setContactForm(prev => ({
                  ...prev,
                  message: "Dear Sales Team,\n\nI would like to request the complete product catalog and price list for Tedchem Cleaning Detergents.\n\nThank you."
                }));
                navigateTo("contact");
              }}
              className="text-teal-700 text-xs font-bold hover:underline uppercase tracking-wider cursor-pointer"
            >
              Request Full Catalog
            </button>
          </div>

          <p className="text-slate-600 text-sm max-w-3xl mb-10 -mt-4">
            Explore our range of fully certified, high-grade cleaning detergents and disinfectants designed to ensure safety, pristine cleanliness, and superior hygiene across commercial, mining, and household sectors in Zimbabwe.
          </p>

          {/* Live Search & Filter Bar */}
          <div className="mb-10 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products by name or parameters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-teal-600 focus:border-teal-600 shadow-sm transition-all outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layoutId={`product-card-${product.id}`}
                  className="border border-slate-200 bg-slate-50 p-4 rounded-lg shadow-sm hover:border-teal-400 transition-all hover:bg-white flex flex-col justify-between group"
                >
                  <div>
                    {/* Product Image */}
                    <div className="relative w-full h-72 bg-white rounded mb-4 overflow-hidden flex items-center justify-center border border-slate-200/60 p-4 transition-all duration-300 group-hover:shadow-sm">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-all duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2.5 right-2.5 bg-teal-850/95 text-white text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded shadow-sm">
                        Corporate Grade
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-1 mb-4">
                      <h3 className="font-bold text-sm text-slate-900 mb-1 uppercase tracking-wider line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-500 leading-snug line-clamp-3">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="pt-2 border-t border-slate-100/60">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="w-full bg-teal-700 hover:bg-teal-600 text-white text-xs py-2 rounded font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>View Specifications</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white border border-slate-200 rounded-lg max-w-lg mx-auto">
              <FlaskConical className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="font-semibold text-sm text-slate-800 uppercase tracking-wider">No matching products found</h3>
              <p className="text-slate-500 text-xs mt-1 px-4 leading-relaxed">
                Please try modifying your search term or contact our sales office directly for custom procurement requests.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>


        )}

        {/* SPECIFICATIONS DETAIL MODAL */}
        <AnimatePresence>
          {selectedProduct && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200"
              >
                <div className="relative h-96 bg-white flex items-center justify-center p-6 border-b border-slate-100">
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    className="max-h-full max-w-full object-contain hover:scale-105 transition-all duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 p-1.5 rounded shadow-md text-slate-700 transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-4 left-4 bg-teal-850/95 text-white font-mono uppercase text-[10px] tracking-widest font-bold py-1 px-3 rounded shadow-sm">
                    Sourcing Code: {selectedProduct.id.toUpperCase()}
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-2xl text-slate-900 tracking-tight uppercase">
                      {selectedProduct.name}
                    </h3>
                    <p className="text-teal-700 font-bold text-xs uppercase tracking-wider">Certified Tedchem Hygiene & Cleaning Product</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">Product Profile</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Technical Specs parameters */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">Technical Specifications</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs font-mono bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500">Concentration:</span>
                        <span className="font-bold text-slate-900 text-right">High Active Formula</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500">Formula pH:</span>
                        <span className="font-bold text-teal-600 text-right">Balanced & Safe</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1.5 text-xs">
                        <span className="text-slate-500">Quality Standard:</span>
                        <span className="font-bold text-slate-900 text-right">ISO Compliant</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500">Sizing Options:</span>
                        <span className="font-bold text-slate-900 text-right">750ml / 1L / 5L / Bulk</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        setSelectedProduct(null);
                        setContactForm(prev => ({
                          ...prev,
                          message: `Dear Sales Team,\n\nI would like to request a quotation for your product: "${selectedProduct.name}". Please provide bulk pricing options, minimum order quantity, and delivery parameters.\n\nThank you.`
                        }));
                        navigateTo("contact");
                      }}
                      className="flex-1 bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold uppercase tracking-wider py-3 px-4 rounded text-center transition-all shadow cursor-pointer"
                    >
                      Request Quotation for this Product
                    </button>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider py-3 px-6 rounded transition-all cursor-pointer"
                    >
                      Close Details
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>


        {/* ABOUT US SECTION */}
        {activeSection === "about" && (
        <div ref={aboutRef} className="bg-slate-50 border-y border-slate-200 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Decorative graphic panel */}
              <div className="lg:col-span-5 relative">
                <div className="relative bg-teal-900 text-white p-8 sm:p-10 rounded-lg border border-teal-950 space-y-6 overflow-hidden shadow-md">
                  {/* Subtle blueprint pattern background */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <pattern id="grid-about" width="15" height="15" patternUnits="userSpaceOnUse">
                        <path d="M 15 0 L 0 0 0 15" fill="none" stroke="white" strokeWidth="0.5"/>
                      </pattern>
                      <rect width="100%" height="100%" fill="url(#grid-about)" />
                    </svg>
                  </div>
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-500/20 rounded-full blur-2xl"></div>
                  <h3 className="font-extrabold text-xl tracking-tight leading-snug uppercase">
                    Committed to Hygiene & Safety Excellence
                  </h3>
                  <p className="text-xs text-teal-100 leading-relaxed">
                    With highly specialized production and delivery networks, we supply retail, mining, corporate, and residential sectors on time, every time.
                  </p>
                  <div className="space-y-4 pt-4 border-t border-teal-850 z-10 relative">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold uppercase text-white tracking-wider">SABS & ISO Standard Compliant</h4>
                        <p className="text-[11px] text-teal-200/85 mt-0.5 leading-snug">All our detergents are manufactured following strict environmental, skin safety, and hygiene standards.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold uppercase text-white tracking-wider">Eco-Friendly Formulations</h4>
                        <p className="text-[11px] text-teal-200/85 mt-0.5 leading-snug">Active, biodegradable ingredients that deliver extreme cleanliness without harming the ecosystem.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text content */}
              <div className="lg:col-span-7 space-y-5">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-600">Company Overview</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight uppercase">
                  About {settings.companyName}
                </h2>
                <div className="text-slate-600 text-sm leading-relaxed space-y-4 whitespace-pre-line">
                  {settings.aboutUsText || "Tedchem Pvt Ltd is a premium manufacturer of cleaning detergents and hygiene solutions, supplying high-efficacy household, commercial, and industrial cleaning agents across Zimbabwe."}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="border border-slate-200 bg-white p-5 rounded-lg shadow-sm hover:border-teal-300 transition-all">
                    <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-1">Our Mission</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      To deliver premium, highly effective, and affordable hygiene solutions that improve health, cleanliness, and safety across homes, businesses, and industrial sectors.
                    </p>
                  </div>
                  <div className="border border-slate-200 bg-white p-5 rounded-lg shadow-sm hover:border-teal-300 transition-all">
                    <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-1">Our Values</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Absolute focus on product efficacy, eco-friendly manufacturing, unwavering customer support, and direct community hygiene alignment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        )}

        {/* CONTACT US SECTION */}
        {activeSection === "contact" && (
        <div ref={contactRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-600">Procurement and Sales Inquiry</span>
              <h2 className="text-3xl font-bold text-slate-800 font-display tracking-tight mt-1">Get in Touch</h2>
            </div>
          </div>

          <p className="text-slate-600 text-sm max-w-3xl mb-12 -mt-4">
            Submit your inquiry for bulk cleaning supplies, customized detergent manufacturing, or wholesale pricing options. Our hygiene team will evaluate your requirements and respond promptly.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Information Desk */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-teal-900 text-white p-8 rounded-lg space-y-6 shadow-md relative overflow-hidden">
                {/* Blueprint background decoration */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <pattern id="grid-contact" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid-contact)" />
                  </svg>
                </div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl"></div>
                <h3 className="font-bold text-lg text-teal-300 uppercase tracking-wider">Tedchem Corporate Office</h3>
                <p className="text-teal-100 text-xs leading-relaxed">
                  For bulk detergent supply orders, wholesale distribution partnerships, or tailored sanitation supply contracts, please reach out to our team.
                </p>

                <div className="space-y-4 pt-4 border-t border-teal-850 z-10 relative">
                  <div className="flex items-start space-x-3.5">
                    <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[10px] font-mono uppercase tracking-wider text-teal-300">Address Desk</h4>
                      <p className="text-xs font-bold text-white mt-0.5">{settings.address || "57 Herbert Chitepo Street"}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <Phone className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[10px] font-mono uppercase tracking-wider text-teal-300">Direct Sales Line</h4>
                      <div className="space-y-1 mt-0.5">
                        {settings.phones.map((phone, i) => (
                          <a
                            key={i}
                            href={`tel:${phone}`}
                            className="block text-xs font-bold text-white hover:text-teal-300 transition-colors"
                          >
                            {phone}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <Mail className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[10px] font-mono uppercase tracking-wider text-teal-300">Email Portal</h4>
                      <a
                        href={`mailto:${settings.email}`}
                        className="text-xs font-bold text-white hover:text-teal-300 transition-colors mt-0.5 block"
                      >
                        {settings.email || "tedchemzim8@gmail.com"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours card */}
              <div className="border border-slate-200 bg-slate-50 p-6 rounded-lg shadow-sm space-y-4">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Logistics Desk Hours</h4>
                <div className="space-y-2 text-xs text-slate-600 font-mono">
                  <div className="flex justify-between border-b border-slate-150 pb-1">
                    <span>Monday - Friday:</span>
                    <span className="font-bold text-slate-900">08:00 - 17:00 (GMT+2)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-150 pb-1">
                    <span>Saturday:</span>
                    <span className="font-bold text-slate-900">08:00 - 13:00 (GMT+2)</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Sundays & Hazmat:</span>
                    <span className="font-bold">Emergency Dispensation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Contact Form */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-6 pb-2 border-b border-slate-100">Submit Sourcing Form</h3>
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. John Doe"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Corporate Email Address *</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="e.g. buyer@miningcorp.com"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Telephone Number</label>
                  <input
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="e.g. +263 77 123 4567"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Inquiry details & specifications *</label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Describe your required detergent products, volume, packaging specifications, and delivery needs..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-none transition-all resize-y"
                  ></textarea>
                </div>

                {contactFeedback && (
                  <div
                    className={`p-3 rounded text-xs flex items-start gap-2.5 ${
                      contactFeedback.type === "success"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-rose-50 text-rose-800 border border-rose-200"
                    }`}
                  >
                    {contactFeedback.type === "success" ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                    )}
                    <span className="leading-relaxed">{contactFeedback.text}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={contactLoading}
                  className="w-full bg-teal-700 hover:bg-teal-600 disabled:bg-slate-300 text-white font-bold uppercase tracking-wider py-3 px-6 rounded flex items-center justify-center gap-2 transition-all shadow cursor-pointer text-xs"
                >
                  {contactLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Sourcing Dispatch...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Sourcing Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-800 font-mono text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-800 items-start">
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center space-x-3">
                {settings.logoUrl && (
                  <img src={settings.logoUrl} alt="Logo" className="h-8 w-8 object-contain bg-slate-50 p-1 rounded" />
                )}
                <span className="font-bold text-sm tracking-widest text-white uppercase block">
                  {settings.companyName}
                </span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed max-w-sm font-sans">
                Corporate manufacturers of certified cleaning detergents and premium hygiene solutions. Registered and compliant with national environmental, health, and skin safety codes.
              </p>
            </div>

            <div className="md:col-span-4 space-y-2 font-sans text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Head Office Desk</h4>
              <p className="text-slate-500">{settings.address || "57 Herbert Chitepo Street"}</p>
              <p className="text-slate-500">Tel: {settings.phones.join(" / ")}</p>
              <p className="text-slate-500">Email: {settings.email}</p>
            </div>

            <div className="md:col-span-3 space-y-4 md:text-right font-sans">
              <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Admin Access</h4>
              <div>
                {isAdmin ? (
                  <button
                    onClick={() => setShowAdminPanel(true)}
                    className="bg-teal-950 text-teal-400 border border-teal-900 hover:bg-teal-900 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Console Active</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="bg-slate-950 text-slate-500 hover:text-slate-300 hover:bg-slate-800 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-all cursor-pointer border border-slate-800"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Admin Login</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-600 gap-4">
            <span>© {new Date().getFullYear()} {settings.companyName}. All Rights Reserved.</span>
            <div className="flex space-x-4">
              <span className="text-slate-700 uppercase">ISO 9001:2015 Compliant</span>
              <span>•</span>
              <span className="text-slate-700 uppercase">256-bit SSL Secure</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ADMIN LOGIN MODAL */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 border border-slate-200 relative"
            >
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setLoginError("");
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-6 space-y-2">
                <div className="w-10 h-10 bg-teal-900 rounded flex items-center justify-center text-teal-300 mx-auto mb-2 shadow-inner">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Administrator Credentials</h3>
                <p className="text-xs text-slate-500">Provide the secure access password to unlock local business site edit options.</p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Access Password</label>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-none"
                    autoFocus
                  />
                </div>

                {loginError && (
                  <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded flex items-center gap-2 border border-rose-200">
                    <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-teal-700 hover:bg-teal-600 text-white font-bold uppercase tracking-wider py-3 px-4 rounded transition-all cursor-pointer text-xs"
                >
                  Verify Access Password
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADMIN DASHBOARD CONSOLE (FULL SIZE DRAWER/PANEL) */}
      <AnimatePresence>
        {showAdminPanel && (
          <div className="fixed inset-0 bg-slate-100 z-50 flex flex-col font-sans">
            {/* Admin Header */}
            <header className="bg-slate-900 border-b border-slate-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 bg-teal-900 rounded flex items-center justify-center text-teal-300 shadow">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-sm tracking-widest uppercase">{settings.companyName}</h2>
                  <span className="text-[9px] uppercase tracking-widest font-mono text-teal-400 block mt-0.5">
                    Secured Global Admin Panel (Active)
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowAdminPanel(false)}
                  className="bg-slate-800 hover:bg-slate-750 text-slate-200 text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  Return to Site
                </button>
                <button
                  onClick={handleAdminLogout}
                  className="bg-red-950/40 text-red-400 border border-red-900/50 hover:bg-red-900 hover:text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout Console
                </button>
              </div>
            </header>

            {/* Admin Layout Grid */}
            <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
              {/* Sidebar Tabs */}
              <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-4 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible">
                <button
                  onClick={() => { setAdminActiveTab("settings"); setAdminMessage(null); }}
                  className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2.5 px-4 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    adminActiveTab === "settings"
                      ? "bg-teal-800 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <SettingsIcon className="w-3.5 h-3.5" />
                  <span>General & Logo</span>
                </button>
                <button
                  onClick={() => { setAdminActiveTab("products"); setAdminMessage(null); }}
                  className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2.5 px-4 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    adminActiveTab === "products"
                      ? "bg-teal-800 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Products Catalog</span>
                </button>
                <button
                  onClick={() => { setAdminActiveTab("inquiries"); setAdminMessage(null); }}
                  className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2.5 px-4 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer relative ${
                    adminActiveTab === "inquiries"
                      ? "bg-teal-800 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <Inbox className="w-3.5 h-3.5" />
                  <span>Inquiry Inbox</span>
                  {inquiries.length > 0 && (
                    <span className="md:absolute md:right-4 bg-teal-500 text-white text-[9px] font-mono font-bold h-4 w-4 rounded-full flex items-center justify-center">
                      {inquiries.length}
                    </span>
                  )}
                </button>
              </aside>

              {/* Main Content Area */}
              <main className="flex-grow p-6 overflow-y-auto bg-slate-50">
                {/* Admin Alert System */}
                {adminMessage && (
                  <div
                    className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm ${
                      adminMessage.type === "success"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-rose-50 text-rose-800 border border-rose-200"
                    }`}
                  >
                    {adminMessage.type === "success" ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                    )}
                    <span>{adminMessage.text}</span>
                  </div>
                )}

                {/* TAB 1: SITE SETTINGS & LOGO */}
                {adminActiveTab === "settings" && (
                  <div className="max-w-3xl bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-8">
                    <div>
                      <h3 className="font-display font-bold text-lg text-slate-900">Manage Core Corporate Information</h3>
                      <p className="text-xs text-slate-500">Edit business name, contact info, logo upload, and about bio. All modifications apply globally instantly.</p>
                    </div>

                    <form onSubmit={handleSaveSettings} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Company Name</label>
                          <input
                            type="text"
                            required
                            value={editCompanyName}
                            onChange={(e) => setEditCompanyName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Email Portal</label>
                          <input
                            type="email"
                            required
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Corporate Address Desk</label>
                          <input
                            type="text"
                            required
                            value={editAddress}
                            onChange={(e) => setEditAddress(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Telephone Desk Lines (Comma Separated)</label>
                          <input
                            type="text"
                            required
                            value={editPhones}
                            onChange={(e) => setEditPhones(e.target.value)}
                            placeholder="+263773937863, +263774266354"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                          />
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-6 space-y-4">
                        <h4 className="text-xs uppercase font-mono font-bold text-slate-400 tracking-wider">Upload Company Logo</h4>
                        <div className="flex items-center space-x-6">
                          <div className="h-20 w-20 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center overflow-hidden p-2">
                            {logoBase64 ? (
                              <img src={logoBase64} alt="New Logo preview" className="h-full w-full object-contain" />
                            ) : settings.logoUrl ? (
                              <img src={settings.logoUrl} alt="Logo" className="h-full w-full object-contain" referrerPolicy="no-referrer" />
                            ) : (
                              <FlaskConical className="w-8 h-8 text-slate-300" />
                            )}
                          </div>
                          <div className="space-y-1.5">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, setLogoBase64)}
                              className="text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white file:cursor-pointer hover:file:bg-slate-800"
                            />
                            <p className="text-[10px] text-slate-400">Supported types: PNG, JPG, JPEG, SVG. Sized to square or landscape. Converts to server storage file on save.</p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-6 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs uppercase font-mono font-bold text-slate-400 tracking-wider">Configure Web3Forms Access Key</h4>
                          <a href="https://web3forms.com" target="_blank" rel="noopener noreferrer" className="text-[10px] text-teal-600 font-bold hover:underline">Get Key (Free 30s)</a>
                        </div>
                        <div className="space-y-1.5">
                          <input
                            type="text"
                            value={editWeb3Key}
                            onChange={(e) => setEditWeb3Key(e.target.value)}
                            placeholder="YOUR_WEB3FORMS_ACCESS_KEY"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono"
                          />
                          <p className="text-[10px] text-slate-400">By adding your Web3Forms access key, any message submitted through the public Contact form will automatically generate an email notification sent directly to <strong className="text-slate-600">{editEmail}</strong>.</p>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-6 space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Corporate Bio / About Us Overview</label>
                        <textarea
                          required
                          rows={6}
                          value={editAboutUs}
                          onChange={(e) => setEditAboutUs(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold py-3 px-6 rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit3 className="w-4 h-4" />}
                        Save Global Changes
                      </button>
                    </form>
                  </div>
                )}

                {/* TAB 2: MANAGE PRODUCTS */}
                {adminActiveTab === "products" && (
                  <div className="space-y-8">
                    {/* Add Product Card */}
                    <div className="max-w-3xl bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
                      <div>
                        <h3 className="font-display font-bold text-lg text-slate-900">Add New Cleaning or Detergent Product</h3>
                        <p className="text-xs text-slate-500">Add products with high-quality images, detailed formulations, and sizing details.</p>
                      </div>

                      <form onSubmit={handleAddProduct} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Product Name *</label>
                            <input
                              type="text"
                              required
                              value={newProdName}
                              onChange={(e) => setNewProdName(e.target.value)}
                              placeholder="e.g. Bacfix Multipurpose Disinfectant"
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Product Image *</label>
                            <input
                              type="file"
                              id="prod-img-input"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, setNewProdImageBase64)}
                              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description and specifications *</label>
                          <textarea
                            required
                            rows={3}
                            value={newProdDesc}
                            onChange={(e) => setNewProdDesc(e.target.value)}
                            placeholder="Typical specifications, Hazmat classification, molecular formula if applicable, minimum order quantities..."
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                          ></textarea>
                        </div>

                        {newProdImageBase64 && (
                          <div className="h-32 w-48 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden relative p-1">
                            <img src={newProdImageBase64} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                            <button
                              type="button"
                              onClick={() => setNewProdImageBase64(null)}
                              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-500 shadow"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold py-3 px-6 rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                          Add Product to Catalog
                        </button>
                      </form>
                    </div>

                    {/* Catalog list */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                      <div className="p-6 border-b border-slate-100">
                        <h3 className="font-display font-bold text-lg text-slate-900">Current Catalog Directory</h3>
                        <p className="text-xs text-slate-500">List of all active industrial offerings. Removing an item removes it from database.</p>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                          <thead>
                            <tr className="bg-slate-50 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200">
                              <th className="p-4">Visual asset</th>
                              <th className="p-4">Product details</th>
                              <th className="p-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {products.map((product) => (
                              <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4">
                                  <div className="h-12 w-16 bg-white rounded-lg overflow-hidden border border-slate-200 p-1 flex items-center justify-center">
                                    <img src={product.imageUrl} alt={product.name} className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                                  </div>
                                </td>
                                <td className="p-4 max-w-lg">
                                  <div className="font-semibold text-slate-900">{product.name}</div>
                                  <div className="text-slate-500 text-xs line-clamp-1 mt-0.5">{product.description}</div>
                                </td>
                                <td className="p-4 text-right">
                                  <button
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="bg-red-50 text-red-600 hover:bg-red-100 p-2.5 rounded-lg border border-red-150 transition-all cursor-pointer inline-flex items-center"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: CUSTOMER INQUIRIES LOG */}
                {adminActiveTab === "inquiries" && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                      <h3 className="font-display font-bold text-lg text-slate-900">Customer Sourcing Inbox</h3>
                      <p className="text-xs text-slate-500">All forms submitted by procurement staff via the website are logged securely below in real-time. This serves as your local CRM.</p>
                    </div>

                    {inquiries.length > 0 ? (
                      <div className="space-y-4">
                        {inquiries.map((inq) => (
                          <div key={inq.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-2 border-b border-slate-100 pb-3">
                              <div>
                                <h4 className="font-bold text-slate-900 font-display text-base">{inq.name}</h4>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 font-mono mt-1">
                                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> <a href={`mailto:${inq.email}`} className="hover:underline text-slate-700">{inq.email}</a></span>
                                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> <a href={`tel:${inq.phone}`} className="hover:underline text-slate-700">{inq.phone}</a></span>
                                </div>
                              </div>
                              <span className="bg-slate-100 text-slate-600 text-[10px] font-mono py-1 px-2.5 rounded-full uppercase">
                                {new Date(inq.submittedAt).toLocaleString()}
                              </span>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl text-slate-700 text-sm leading-relaxed whitespace-pre-wrap border border-slate-100">
                              {inq.message}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl max-w-md mx-auto">
                        <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h4 className="font-display font-semibold text-lg text-slate-800">Inquiry Inbox Empty</h4>
                        <p className="text-slate-500 text-sm mt-1">No customers have submitted sourcing inquiries yet. Active submissions will appear here automatically.</p>
                      </div>
                    )}
                  </div>
                )}
              </main>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
