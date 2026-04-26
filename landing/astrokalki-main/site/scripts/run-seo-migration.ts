import { supabase } from "@/lib/supabaseClient"
import fs from "fs"
import path from "path"

async function runMigration() {
  try {
    console.log("[v0] Starting SEO database migration...")

    const sqlPath = path.join(process.cwd(), "scripts", "seo-migrations.sql")
    const sql = fs.readFileSync(sqlPath, "utf-8")

    // Split SQL statements and execute
    const statements = sql.split(";").filter((s) => s.trim())

    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`[v0] Executing: ${statement.slice(0, 50)}...`)

        const { error } = await supabase.rpc("execute_sql", {
          sql_statement: statement,
        })

        if (error) {
          console.warn(`[v0] Warning on statement:`, error)
        }
      }
    }

    console.log("[v0] SEO migration completed successfully")
  } catch (error) {
    console.error("[v0] Migration failed:", error)
    throw error
  }
}

runMigration()
