import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  dbUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
}

if (!process.env.DATABASE_URL)
  throw new Error("DATABASE_URL is not defined in environment variables");

if (!process.env.JWT_SECRET)
  throw new Error("JWT_SECRET is not defined in environment variables");

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  dbUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN || "7d") as string,
};

export default config;
