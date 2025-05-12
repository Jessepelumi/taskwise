import config from "../config/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = config.dbUrl;
const client = postgres(connectionString);
const db = drizzle(client, { schema });

export default db;
