import { db } from "./src/db/index.ts";
import { settings } from "./src/db/schema.ts";
(async () => {
  const s = await db.select().from(settings).limit(1);
  console.log(s[0]);
  process.exit(0);
})();
