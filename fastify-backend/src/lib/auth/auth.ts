import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

export const auth = betterAuth({
  baseURL: "http://localhost:3000",
  database: new Database("./sqlite.db"),
  emailAndPassword: {
    enabled: true,
  },
});
