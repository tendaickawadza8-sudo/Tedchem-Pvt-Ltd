import sys

with open('server.ts', 'r') as f:
    content = f.read()

import re

# Add jwt import
content = re.sub(r'import express from "express";', r'import express from "express";\nimport jwt from "jsonwebtoken";', content)

login_route = """// ==================== API ENDPOINTS ====================

const JWT_SECRET = process.env.JWT_SECRET || "tedchem_secure_secret_2026";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "tedchem2026";

app.post("/api/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "24h" });
    return res.json({ token });
  }
  return res.status(401).json({ error: "Invalid password" });
});
"""

content = content.replace("// ==================== API ENDPOINTS ====================", login_route)

with open('server.ts', 'w') as f:
    f.write(content)
