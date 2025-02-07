"use server"

import { db } from "@/drizzle/db"
import { QuizAttemptTable } from "@/drizzle/schema/quiz-attempts"
import { getCurrentUser } from "@/services/clerk"
import { redirect } from "next/navigation"

export async function createQuizAttempt(quizId: string) {
    const user = await getCurrentUser()
    if (!user) {
        return { error: true, message: "User not found" }
    }
    await db.insert(QuizAttemptTable).values({
        quizId,
        userId: user.userId,
    })

    redirect(`/dashboard/quiz/${quizId}/attempt`)
}