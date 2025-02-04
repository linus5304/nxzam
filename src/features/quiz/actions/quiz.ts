'use server'

import { auth } from '@clerk/nextjs/server'
import { createQuizDB, getQuizListDB } from '../db/quiz'
import { quizSchema } from '../schemas/quiz'
import { z } from 'zod'

export async function create(_prevState: unknown, formData: FormData) {
  const defaultValues = z.record(z.string(), z.string()).parse(Object.fromEntries(formData));

  const durationMinutes = z.number().parse(Number(defaultValues.durationMinutes))
  const totalQuestions = z.number().parse(Number(defaultValues.totalQuestions))
  const passingScore = z.number().parse(Number(defaultValues.passingScore))

  console.log("defaultValues", defaultValues)

  try {
    const data = quizSchema.parse({
      ...defaultValues,
      durationMinutes,
      totalQuestions,
      passingScore
    });

    const { userId } = await auth();

    if (!userId) {
      return { success: false, message: "Unauthorized" }
    }

    const quiz = await createQuizDB({
      ...data,
      createdBy: userId,
    });

    return { defaultValues: {}, success: true, message: "Quiz created successfully", errors: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { defaultValues, success: false, message: "Invalid form data", errors: error.flatten().fieldErrors }
    }
    return { defaultValues, success: false, message: "Failed to create quiz", errors: null }
  }

}

export async function getQuizList() {
  const quizzes = await getQuizListDB()
  return quizzes
}