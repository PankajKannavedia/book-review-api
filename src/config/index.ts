import { config } from "dotenv";
import ip from "ip";
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === "true";
export const IP = ip.address(`public`, `ipv4`);

export const {
  NODE_ENV,
  BASE_URL,
  PORT,
  PORT_HTTP,
  DB_USER,
  DB_PASS,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  EMAIL,
  PASS,
  SECRET_KEY,
  ORIGIN,
} = process.env;
