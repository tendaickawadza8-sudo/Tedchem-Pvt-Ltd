import { db } from "./src/db/index.ts";
import { settings } from "./src/db/schema.ts";

(async () => {
  await db.update(settings).set({ logoUrl: "/uploads/tedchem_logo_v2.svg?v=2" });
  console.log("Reset logo to default.");
  process.exit(0);
})();
