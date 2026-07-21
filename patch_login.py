import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add admin password state
import re
content = re.sub(r'const \[showLoginModal, setShowLoginModal\] = useState\(false\);',
                 r'const [showLoginModal, setShowLoginModal] = useState(false);\n  const [adminPassword, setAdminPassword] = useState("");', content)

# Change handleAdminLogin
search_login = """  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const token = await result.user.getIdToken();
      setIdToken(token);
      setIsAdmin(true);
      setShowLoginModal(false);
      setShowAdminPanel(true);
    } catch (err: any) {
      setLoginError(err.message || "Authentication failed. Please try again.");
    }
  };"""

replace_login = """  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setIdToken(data.token);
        setIsAdmin(true);
        setShowLoginModal(false);
        setShowAdminPanel(true);
        setAdminPassword(""); // Clear password
      } else {
        setLoginError(data.error || "Authentication failed.");
      }
    } catch (err: any) {
      setLoginError("Network error. Please try again.");
    }
  };"""

content = content.replace(search_login, replace_login)

# Change form
search_form = """              <form onSubmit={handleAdminLogin} className="space-y-4">
                <button
                  type="submit"
                  className="w-full bg-teal-900 text-white font-bold py-3 rounded uppercase tracking-wider text-xs hover:bg-teal-800 transition-colors shadow-md"
                >
                  Sign in with Google
                </button>
              </form>"""

replace_form = """              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter Admin Password"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-teal-900 text-white font-bold py-3 rounded uppercase tracking-wider text-xs hover:bg-teal-800 transition-colors shadow-md"
                >
                  Sign In
                </button>
              </form>"""

content = content.replace(search_form, replace_form)

# Clean up firebase imports
content = re.sub(r"import \{ signInWithPopup \} from 'firebase/auth';\nimport \{ auth, googleAuthProvider \} from './lib/firebase\.ts';\n", "", content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
