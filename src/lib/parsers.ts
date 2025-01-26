import { questionFormSchema } from "@/features/questions/schemas/questions";
import { getQuestionsDB } from "@/features/questions/db/questions";
import { z } from "zod";
import { Status } from "./types";

type DBQuestion = Awaited<ReturnType<typeof getQuestionsDB>>[number]
export const parseQuestion = (dbQuestion: DBQuestion):
    z.infer<typeof questionFormSchema> &
    {
        id: string,
        subject: { id: string, name: string },
        createdAt: string,
        isEditable: boolean,
        metadata: string
    } => ({
        id: dbQuestion.id,
        subjectId: dbQuestion.subject.id,
        subject: {
            id: dbQuestion.subject.id,
            name: dbQuestion.subject.name
        },
        questionText: dbQuestion.questionText,
        options: dbQuestion.options as string[],
        difficulty: dbQuestion.difficulty,
        status: dbQuestion.status as Status,
        correctAnswer: dbQuestion.correctAnswer,
        tags: dbQuestion.tags,
        explanation: dbQuestion.explanation ?? undefined,
        metadata: JSON.stringify(dbQuestion.metadata) as string,
        createdAt: new Date(dbQuestion.createdAt).toLocaleDateString(),
        isEditable: dbQuestion.status === 'draft',
    });
