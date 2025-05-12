import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const sql = postgres(process.env.DATABASE_URL!);

console.log(process.env.DATABASE_URL);

sql`SELECT NOW()`
  .then((res) => {
    console.log("✅ Connection successful:", res);
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Connection failed:", err);
    process.exit(1);
  });
