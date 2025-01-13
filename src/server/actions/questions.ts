'use server'

import { questionFormSchema } from '@/schemas/questions'
import { currentUser } from '@clerk/nextjs/server'
import { createQuestionDB, getQuestionDB, updateQuestionDB } from '@/server/db/questions'


export async function createQuestion(prevState: any, formData: FormData) {
  const validatedFields = questionFormSchema.safeParse({
    subjectId: formData.get('subjectId'),
    questionText: formData.get('questionText'),
    explanation: formData.get('explanation'),
    options: formData.getAll('options'),
    correctAnswer: parseInt(formData.get('correctAnswer') as string, 10),
    difficulty: formData.get('difficulty'),
    status: formData.get('status'),
    tags: formData.getAll('tags'),
    metadata: JSON.parse(formData.get('metadata') as string || '{}'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create question.',
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
      options: JSON.stringify(options),
      correctAnswer,
      difficulty,
      status,
      tags,
      metadata,
    })
    return { message: 'Question created successfully!' }
  } catch (error) {
    console.error(error)
    return { message: 'Database Error: Failed to create question.' }
  }
}

export async function getQuestion(id: string) {
  const question = await getQuestionDB(id)
  return question
}