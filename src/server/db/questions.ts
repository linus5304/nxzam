import { db } from "@/drizzle/db"
import { QuestionTable, SubjectTable } from "@/drizzle/schema"
import { Difficulty, Status } from "@/lib/types"
import { QuestionsFilterParams } from "@/schemas/questions"
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

export async function getQuestionsDB(filterParams: QuestionsFilterParams) {
    const questions = await db.query.QuestionTable.findMany({
        where: (question, { eq, ilike }) => {
            if (filterParams.questionText) {
                return ilike(question.questionText, `%${filterParams.questionText}%`)
            }
            if (filterParams.subjectId) {
                return eq(question.subjectId, filterParams.subjectId)
            }
            if (filterParams.difficulty) {
                return eq(question.difficulty, filterParams.difficulty as Difficulty)
            }
            if (filterParams.status) {
                return eq(question.status, filterParams.status as Status)
            }
        },
        with: {
            subject: {
                columns: {
                    id: true,
                    name: true
                }
            }
        }
    })
    return questions as (typeof QuestionTable.$inferSelect & {
        subject: Pick<typeof SubjectTable.$inferSelect, 'id' | 'name'>
    })[]
}

export async function updateQuestionDB(id: string, question: typeof QuestionTable.$inferInsert) {
    const questionToUpdate = await getQuestionDB(id)
    if (!questionToUpdate) {
        return { error: "Question not found" }
    }
    const updatedQuestion = await db.update(QuestionTable).set(question).where(eq(QuestionTable.id, id))
    return updatedQuestion
}

export async function deleteQuestionDB(id: string) {
    const question = await db.delete(QuestionTable).where(eq(QuestionTable.id, id))
    return question
}