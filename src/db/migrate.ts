import { migrate } from "drizzle-orm/postgres-js/migrator";
import db from ".";

export const migrateDb = async () => {
  try {
    console.log("Migrating DataBase");

    await migrate(db, { migrationsFolder: "src/db/drizzle" });

    console.log("DataBase Migration Completed");
  } catch (error) {
    console.error(error);
  }
};

migrateDb();
