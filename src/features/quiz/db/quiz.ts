import { db } from "@/drizzle/db"
import { QuestionTable, QuizAttemptTable, SubjectTable } from "@/drizzle/schema"
import { Difficulty, Status } from "@/lib/types"
import { QuestionsFilterParams } from "@/features/questions/schemas/questions"
import { and, eq } from "drizzle-orm"
import { QuizTable } from "@/drizzle/schema/quiz"
import { QuizQuestionTable } from "@/drizzle/schema/quiz-question"


export async function createQuizDB(data: typeof QuizTable.$inferInsert & { questionIds: string[] }) {
    try {
        const newQuiz = await db.transaction(async (tx) => {
            const [newQuiz] = await tx
                .insert(QuizTable)
                .values(data)
                .returning({ id: QuizTable.id, userId: QuizTable.createdBy })

            if (newQuiz == null) {
                tx.rollback()
                throw new Error("Failed to create quiz")
            }

            if (data.questionIds.length > 0) {
                await tx.insert(QuizQuestionTable).values(data.questionIds.map((questionId) => ({
                    quizId: newQuiz.id,
                    questionId: questionId
                })))
            }

            return newQuiz
        })

        return newQuiz
    } catch (error) {
        console.error(error)
        throw error
    }
}

export async function getQuizListDB() {
    return db.query.QuizTable.findMany({
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

export async function getQuizDB(id: string) {
    return await db.query.QuizTable.findFirst({
        columns: {
            id: true,
            title: true,
            description: true,
            difficulty: true,
            durationMinutes: true,
            passingScore: true,
            totalQuestions: true,
            subjectId: true,
            createdBy: true,
        },
        where: eq(QuizTable.id, id),
        with: {
            subject: {
                columns: {
                    id: true,
                    name: true
                }
            },
            quizQuestions: {
                columns: {
                    questionId: true,
                },
                with: {
                    question: {
                        columns: {
                            id: true,
                            questionText: true,
                            options: true,
                            explanation: true,
                            correctAnswer: true,
                        }
                    }
                }
            }
        }
    })
}

export async function getQuizAttemptListDB(quizId: string) {
    return await db.query.QuizAttemptTable.findMany({
        where: eq(QuizAttemptTable.quizId, quizId),
    })
}

export async function updateDB(id: string, data: Partial<typeof QuizTable.$inferInsert> & { questionIds: string[] }) {
    const { questionIds, ...rest } = data

    const updatedQuiz = await db.transaction(async (tx) => {
        const [updatedQuiz] = await tx.update(QuizTable).set(rest).where(and(eq(QuizTable.id, id))).returning();

        if (updatedQuiz == null) {
            tx.rollback()
            throw new Error("Failed to update quiz")
        }

        await tx.delete(QuizQuestionTable).where(eq(QuizQuestionTable.quizId, id));
        await tx.insert(QuizQuestionTable).values(questionIds.map((questionId) => ({
            quizId: updatedQuiz.id,
            questionId: questionId
        })));
        return updatedQuiz
    })
    return updatedQuiz
}

export async function deleteDB(id: string) {
    const quiz = await db.transaction(async (tx) => {
        await tx.delete(QuizQuestionTable).where(eq(QuizQuestionTable.quizId, id))
        const [quiz] = await tx.delete(QuizTable).where(eq(QuizTable.id, id)).returning({ id: QuizTable.id })
        return quiz
    })
    return quiz
}