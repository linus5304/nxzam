import { parseQuestion } from '@/lib/parsers'
import { Difficulty, Status } from '@/lib/types'
import { z } from 'zod'

export const questionFormSchema = z.object({
  subjectId: z.string().uuid("Invalid subject ID"),
  questionText: z.string().min(1, "Question text is required"),
  explanation: z.string().optional(),
  options: z.array(z.string()).min(2, "At least two options are required"),
  correctAnswer: z.number().int().min(0, "Correct answer must be a non-negative integer"),
  difficulty: z.enum(['easy', 'medium', 'hard'], {
    errorMap: () => ({ message: "Invalid difficulty level" })
  }),
  status: z.enum(['draft', 'published', 'archived'], {
    errorMap: () => ({ message: "Invalid status" })
  }),
  tags: z.array(z.string()),
  metadata: z.record(z.unknown()).optional()
})

export type QuestionFormData = z.infer<typeof questionFormSchema>

export type QuestionType = ReturnType<typeof parseQuestion>

export type QuestionsFilterParams = {
  questionText?: string,
  subjectId?: string,
  difficulty?: Difficulty,
  status?: Status
}