import config from "../config/config.js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";

const connectionString = config.dbUrl;
const client = postgres(connectionString);
const db = drizzle(client, { schema });

export default db;
