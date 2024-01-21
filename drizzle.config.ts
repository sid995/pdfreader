import type { Config } from 'drizzle-kit'
import * as dotenv from "dotenv"
dotenv.config({ path: ".env" })

export default {
  schema: "./src/lib/db/schema.ts",
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DB_URL!,
  }
} satisfies Config