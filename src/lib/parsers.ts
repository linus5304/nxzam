import { getQuestionsDB } from "@/server/db/questions";

export const parseQuestion = (dbQuestion: Awaited<ReturnType<typeof getQuestionsDB>>[number]) => ({
    id: dbQuestion.id,
    subjectId: dbQuestion.subject.id,
    subject: {
        id: dbQuestion.subject.id,
        name: dbQuestion.subject.name
    },
    questionText: dbQuestion.questionText,
    options: dbQuestion.options as string[],
    difficulty: dbQuestion.difficulty,
    status: dbQuestion.status,
    createdAt: new Date(dbQuestion.createdAt).toLocaleDateString(),
    isEditable: dbQuestion.status === 'draft',
    metadata: dbQuestion.metadata ?
        JSON.parse(JSON.stringify(dbQuestion.metadata)) : null,
});