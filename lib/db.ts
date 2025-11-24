import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.DATABASE_URL)

// Hardcoded org ID for DMC Inc pilot
export const DMC_ORG_ID = process.env.DMC_ORG_ID ?? "dmc-inc"
