'use server'

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createQuizDB, deleteDB, getQuizAttemptListDB, getQuizDB, getQuizListDB, updateDB } from '../db/quiz'
import { quizSchema } from '../schemas/quiz'

export async function create(unsafeData: z.infer<typeof quizSchema>) {
  const { success, data } = quizSchema.safeParse(unsafeData)
  if (!success) {
    return { error: false, message: "Invalid form data" }
  }
  const { userId } = await auth();

  if (!userId) {
    return { error: true, message: "Unauthorized" }
  }

  await createQuizDB({
    ...data,
    createdBy: userId,
    questionIds: data?.questionIds ?? []
  });
  redirect(`/admin/quiz`)
}

export async function update(id: string, unsafeData: z.infer<typeof quizSchema>) {
  const { success, data } = quizSchema.safeParse(unsafeData)
  if (!success) {
    return { error: false, message: "Invalid form data" }
  }
  const { userId } = await auth();

  if (!userId) {
    return { error: true, message: "Unauthorized" }
  }

  await updateDB(id, {
    ...data,
    questionIds: data?.questionIds ?? []
  })
  return { error: false, message: "Quiz updated successfully" }
}

export async function getQuiz(id: string) {
  const quiz = await getQuizDB(id)
  return quiz
}

export async function getQuizList() {
  const quizzes = await getQuizListDB()
  return quizzes
}

export async function getQuizAttemptList(quizId: string) {
  const quizAttemptList = await getQuizAttemptListDB(quizId)
  return quizAttemptList
}

export async function deleteQuiz(id: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: true, message: "Unauthorized" }
  }
  const quiz = await deleteDB(id)
  if (quiz == null) {
    return { error: true, message: "Error deleting quiz" }
  }
  redirect(`/admin/quiz`)
}