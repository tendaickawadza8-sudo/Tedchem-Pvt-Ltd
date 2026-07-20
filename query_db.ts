import { db } from "./src/db/index.ts";
import { settings } from "./src/db/schema.ts";

async function run() {
  const s = await db.select().from(settings).limit(1);
  if (s.length > 0) {
    console.log("logoUrl length:", s[0].logoUrl ? s[0].logoUrl.length : "null");
    console.log("logoUrl start:", s[0].logoUrl ? s[0].logoUrl.substring(0, 100) : "null");
  } else {
    console.log("No settings found in DB");
  }
  process.exit(0);
}
run();
