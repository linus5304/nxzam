import { db } from "@/drizzle/db"
import { QuestionTable, SubjectTable } from "@/drizzle/schema"
import { Difficulty, Status } from "@/lib/types"
import { QuestionsFilterParams } from "@/features/questions/schemas/questions"
import { and, eq } from "drizzle-orm"


export async function createQuestionDB(data: typeof QuestionTable.$inferInsert) {
    const [question] = await db
        .insert(QuestionTable)
        .values(data)
        .returning({ id: QuestionTable.id, userId: QuestionTable.createdBy })
    return question
}

export async function getQuestionDB(id: string) {
    return await db.query.QuestionTable.findFirst({
        where: eq(QuestionTable.id, id),
        with: {
            subject: {
                columns: {
                    id: true,
                    name: true
                }
            }
        }
    })
}

export async function getQuestionsDB(filterParams: QuestionsFilterParams) {
    const page = filterParams.page ?? 0
    const pageSize = filterParams.pageSize ?? 10

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
        },
        limit: pageSize,
        offset: page * pageSize
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