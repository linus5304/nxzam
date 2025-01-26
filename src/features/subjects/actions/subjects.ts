import { getSubjectsDB } from "../db/subjects"

export async function getSubjects() {
    const subjects = await getSubjectsDB()
    return subjects
}