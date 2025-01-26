'use server'

import { parseQuestion } from '@/lib/parsers'
import { QuestionFormData, questionFormSchema, QuestionsFilterParams, QuestionType } from '@/features/questions/schemas/questions'
import { createQuestionDB, deleteQuestionDB, getQuestionDB, getQuestionsDB, updateQuestionDB } from '@/features/questions/db/questions'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'

export async function createQuestion(unsafeData: z.infer<typeof questionFormSchema>) {
  const { userId } = await auth()
  const { success, data } = questionFormSchema.safeParse(unsafeData)
  if (!success || userId == null) {
    return {
      errors: true,
      message: 'There was an error creating the question.',
    }
  }
  const question = await createQuestionDB({ ...data, createdBy: userId })
  return {
    error: question == null,
    message: question == null ? 'There was an error creating the question.' : 'Question created successfully!'
  }
}

export async function getQuestion(id: string) {
  const question = await getQuestionDB(id)
  return question ? parseQuestion(question) : null
}

export async function getQuestions(filterParams: QuestionsFilterParams): Promise<QuestionType[]> {
  const questions = await getQuestionsDB(filterParams)
  return questions.map(parseQuestion)
}

export async function updateQuestion(id: string, unsafeData: QuestionFormData): Promise<{ error: boolean, message: string }> {
  const errorMessage = "There was an error updating the question."
  const { userId } = await auth()
  const { success, data } = questionFormSchema.safeParse(unsafeData)
  if (!success || userId == null) {
    return { error: true, message: errorMessage }
  }
  const updateData = {
    ...data,
    createdBy: userId,
  }
  const isSuccess = await updateQuestionDB(updateData, { id, userId })
  return {
    error: !isSuccess,
    message: isSuccess ? "Question updated successfully!" : errorMessage
  }
}

export async function deleteQuestion(id: string) {
  const question = await deleteQuestionDB(id)
  return question
}