import { getSubjects } from "@/features/subjects/actions/subjects";
import { QuizForm } from "@/features/quiz/components/form";
import QuestionsPage from "@/app/admin/quiz/[id]/questions/page";
import { getQuiz } from "@/features/quiz/actions/quiz";
import { notFound } from "next/navigation";

export default async function NewQuestionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const subjects = await getSubjects()
    const quiz = await getQuiz(id)
    if (!quiz || quiz === null) {
        return notFound()
    }
    return (
        <QuizForm subjects={subjects} quiz={{
            id: quiz.id,
            title: quiz.title,
            description: quiz.description ?? undefined,
            difficulty: quiz.difficulty as "easy" | "medium" | "hard",
            durationMinutes: quiz.durationMinutes,
            questionIds: quiz.questions.map((question) => question.questionId ?? ""),
            subjectId: quiz.subjectId,
            passingScore: quiz.passingScore,
            totalQuestions: quiz.totalQuestions,
        }}>
            <QuestionsPage />
        </QuizForm>
    )
}