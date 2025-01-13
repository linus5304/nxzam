import { db } from "@/drizzle/db"
import { QuestionTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"


export async function createQuestionDB(question: typeof QuestionTable.$inferInsert) {
    try {
        const data = await db.insert(QuestionTable).values(question)
        return data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export async function getQuestionDB(id: string) {
    const data = await db.query.QuestionTable.findFirst({
        where: (question, { eq }) => eq(question.id, id)
    })
    return data
}

export async function updateQuestionDB(id: string, question: typeof QuestionTable.$inferInsert) {
    const questionToUpdate = await getQuestionDB(id)
    if (!questionToUpdate) {
        return { error: "Question not found" }
    }
    const updatedQuestion = await db.update(QuestionTable).set(question).where(eq(QuestionTable.id, id))
    return updatedQuestion
}