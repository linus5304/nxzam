import { getSubjectsDB } from "../db/subject"

export async function getSubjects() {
    const subjects = await getSubjectsDB()
    return subjects
}