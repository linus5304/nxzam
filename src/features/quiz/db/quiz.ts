import { db } from "@/drizzle/db"
import { QuestionTable, SubjectTable } from "@/drizzle/schema"
import { Difficulty, Status } from "@/lib/types"
import { QuestionsFilterParams } from "@/features/questions/schemas/questions"
import { and, eq } from "drizzle-orm"
import { QuizTable } from "@/drizzle/schema/quiz"


export async function createQuizDB(data: typeof QuizTable.$inferInsert) {
    try {
        const [quiz] = await db
            .insert(QuizTable)
            .values(data)
            .returning({ id: QuizTable.id, userId: QuizTable.createdBy })
        return quiz
    } catch (error) {
        console.error(error)
        throw error
    }
}

export async function getQuizListDB() {
    return await db.query.QuizTable.findMany()
}

export async function getQuizDB(id: string) {
    return await db.query.QuizTable.findFirst({
        where: eq(QuizTable.id, id),
    })
}

export async function getQuestionsDB(filterParams: QuestionsFilterParams) {
    const questions = await db.query.QuestionTable.findMany({
        where: (question, { eq, ilike }) => {
            if (filterParams.query) {
                return ilike(question.questionText, `%${filterParams.query}%`)
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

export async function updateQuestionDB(question: typeof QuestionTable.$inferInsert, { id, userId }: { id: string, userId: string }) {
    const updatedQuestion = await db
        .update(QuestionTable)
        .set(question)
        .where(and(eq(QuestionTable.id, id), eq(QuestionTable.createdBy, userId))).returning();
    return updatedQuestion
}

export async function deleteQuestionDB(id: string) {
    const question = await db.delete(QuestionTable).where(eq(QuestionTable.id, id))
    return question
}