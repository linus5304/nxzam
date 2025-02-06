'use server'

import { auth } from '@clerk/nextjs/server'
import { createQuizDB, getQuizDB, getQuizListDB, updateDB } from '../db/quiz'
import { quizSchema } from '../schemas/quiz'
import { z } from 'zod'

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

  return { error: false, message: "Quiz created successfully" }
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