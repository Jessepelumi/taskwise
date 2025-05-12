import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  dbUrl: string;
}

if (!process.env.DATABASE_URL)
  throw new Error("DATABASE_URL is not defined in environment variables");

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  dbUrl: process.env.DATABASE_URL,
};

export default config;
