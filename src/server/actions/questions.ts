'use server'

import { QuestionFormData, questionFormSchema, QuestionsFilterParams, QuestionType } from '@/schemas/questions'
import { currentUser } from '@clerk/nextjs/server'
import { createQuestionDB, deleteQuestionDB, getQuestionDB, getQuestionsDB, updateQuestionDB } from '@/server/db/questions'
import { parseQuestion } from '@/lib/parsers'

export async function createQuestion(prevState: any, formData: FormData) {
  const rawData: QuestionFormData = {
    subjectId: formData.get('subjectId') as string,
    questionText: formData.get('questionText') as string,
    explanation: formData.get('explanation') as string,
    options: formData.getAll('options') as string[],
    correctAnswer: parseInt(formData.get('correctAnswer') as string, 10),
    difficulty: formData.get('difficulty') as 'easy' | 'medium' | 'hard',
    status: formData.get('status') as 'draft' | 'published' | 'archived',
    tags: formData.getAll('tags') as string[],
    metadata: formData.get('metadata') ? JSON.parse(formData.get('metadata') as string) : {},
  }
  const validatedFields = questionFormSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create question.',
      success: false,
      inputs: rawData,
    }
  }

  const {
    subjectId, questionText, explanation, options, correctAnswer,
    difficulty, status, tags, metadata
  } = validatedFields.data

  const user = await currentUser()

  if (!user) {
    return { message: 'User not found.' }
  }

  try {
    const question = await createQuestionDB({
      subjectId,
      createdBy: user.id,
      questionText,
      explanation,
      options,
      correctAnswer,
      difficulty,
      status,
      tags,
      metadata,
    })
    return { message: 'Question created successfully!', success: true }
  } catch (error) {
    console.error(error)
    return { message: 'Database Error: Failed to create question.', success: false }
  }
}

export async function getQuestion(id: string) {
  const question = await getQuestionDB(id)
  return question
}

export async function getQuestions(filterParams: QuestionsFilterParams): Promise<QuestionType[]> {
  const questions = await getQuestionsDB(filterParams)
  return questions.map(parseQuestion)
}

export async function updateQuestion(id: string, data: QuestionFormData) {
  const user = await currentUser()
  if (!user) {
    return { message: 'User not found.' }
  }
  const updateData = {
    ...data,
    createdBy: user.id,
  }
  const question = await updateQuestionDB(id, updateData)
  return question
}

export async function deleteQuestion(id: string) {
  const question = await deleteQuestionDB(id)
  return question
}