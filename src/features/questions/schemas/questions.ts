import { parseQuestion } from '@/lib/parsers'
import { Difficulty, Status } from '@/lib/types'
import { z } from 'zod'

export const questionFormSchema = z.object({
  subjectId: z.string().uuid("Invalid subject ID"),
  questionText: z.string().min(1, "Question text is required"),
  explanation: z.string().optional(),
  options: z.array(z.object({
    id: z.string(),
    text: z.string().min(1, "Option text is required"),
    isCorrect: z.boolean(),
  }))
    .min(2, "At least 2 options are required")
    .max(6, "Maximum 6 options allowed")
    .refine(
      (options) => options.filter(opt => opt.isCorrect).length === 1,
      "Exactly one option must be marked as correct"
    ),
  correctAnswer: z.number().int().min(0, "Correct answer must be a non-negative integer"),
  difficulty: z.enum(['easy', 'medium', 'hard'], {
    errorMap: () => ({ message: "Invalid difficulty level" })
  }),
  status: z.enum(['draft', 'published', 'archived'], {
    errorMap: () => ({ message: "Invalid status" })
  }),
  tags: z.array(z.string()),
  metadata: z.string().optional()
})

export type QuestionFormData = z.infer<typeof questionFormSchema>

export type QuestionType = ReturnType<typeof parseQuestion>

export type QuestionsFilterParams = {
  query?: string,
  subjectId?: string,
  difficulty?: Difficulty,
  status?: Status,
  page?: number,
  pageSize?: number
}