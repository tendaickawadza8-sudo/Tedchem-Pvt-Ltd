import { db } from './src/db/index.ts';
import { products } from './src/db/schema.ts';
import { desc } from 'drizzle-orm';

async function test() {
  const p = await db.select().from(products).orderBy(desc(products.id)).limit(1);
  console.log("Last product name:", p[0]?.name);
  console.log("Last product image starts with:", p[0]?.imageUrl?.substring(0, 50));
  process.exit();
}
test();
