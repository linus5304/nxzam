import { UserTable } from "@/drizzle/schema"
import { db } from "@/drizzle/db"

export async function createUserDB(data: typeof UserTable.$inferInsert) {
    const user = await db.insert(UserTable).values(data)
    return user
}