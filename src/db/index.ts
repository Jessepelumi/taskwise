import config from "../config/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index";
import { lookup as dnsLookup } from "dns";

const connectionString = config.dbUrl;

const client = postgres(connectionString, { prepare: false });

const db = drizzle(client, { schema });

export default db;
