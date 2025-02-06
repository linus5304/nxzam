'use server'

import { auth } from '@clerk/nextjs/server'
import { createQuizDB, getQuizListDB } from '../db/quiz'
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
    questionIds: data?.questions ?? []
  });

  return { error: false, message: "Quiz created successfully" }
}

export async function update(id: string, unsafeData: z.infer<typeof quizSchema>) {
  const { success, data } = quizSchema.safeParse(unsafeData)
  if (!success) {
    return { error: false, message: "Invalid form data" }
  }

  // await updateQuizDB(id, data)
  return { error: true, message: "Quiz updated successfully" }
}

export async function getQuizList() {
  const quizzes = await getQuizListDB()
  return quizzes
}