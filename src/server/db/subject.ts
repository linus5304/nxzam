import { db } from "@/drizzle/db"

export async function getSubjectsDB() {
    const subjects = await db.query.SubjectTable.findMany()
    return subjects
}