import { z } from 'zod'

export const quizSchema = z.object({
  subjectId: z.string().uuid("Invalid subject ID"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  durationMinutes: z.number().int().positive("Duration must be a positive number"),
  passingScore: z.number().int().min(0, "Passing score must be 0 or greater"),
  totalQuestions: z.number().int().positive("Total questions must be a positive number"),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  questionIds: z.array(z.string()),
  topics: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.string().optional()
})