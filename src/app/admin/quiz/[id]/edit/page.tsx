import { getSubjects } from "@/features/subjects/actions/subjects";
import { QuizForm } from "@/features/quiz/components/form";
import QuestionsPage from "@/app/admin/quiz/[id]/questions/page";
import { getQuiz } from "@/features/quiz/actions/quiz";
import { notFound } from "next/navigation";
import { getQuestions } from "@/features/questions/actions/questions";

export default async function EditQuizPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const [subjects, quiz, questions] = await Promise.all([
        getSubjects(),
        getQuiz(id),
        getQuestions({})
    ]);
    if (!quiz || quiz === null) {
        return notFound()
    }
    return (
        <QuizForm
            subjects={subjects}
            questions={questions ?? []}
            quiz={{
                id: quiz.id,
                title: quiz.title,
                description: quiz.description ?? undefined,
                difficulty: quiz.difficulty as "easy" | "medium" | "hard",
                durationMinutes: quiz.durationMinutes,
                questionIds: quiz.quizQuestions.map((question) => question.questionId ?? ""),
                subjectId: quiz.subjectId,
                passingScore: quiz.passingScore,
                totalQuestions: quiz.totalQuestions,
            }} />
    )
}