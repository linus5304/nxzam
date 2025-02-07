import { ActionButton } from "@/components/action-button"
import { PageHeader } from "@/components/page-header"
import { createQuizAttempt } from "@/features/quiz-attempt/actions/quiz-attempt"
import { getQuiz, getQuizAttemptList } from "@/features/quiz/actions/quiz"
import { formatDate } from "@/lib/formatters"
import { PlayIcon } from "lucide-react"
import { notFound } from "next/navigation"

export default async function page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const [quiz, quizAttemptList] = await Promise.all([getQuiz(id), getQuizAttemptList(id)])
    if (!quiz) {
        return notFound()
    }

    return (
        <div>
            <PageHeader title={quiz.title} description={quiz.description ?? ""} />
            <div>
                <div>{quiz.passingScore}</div>
                <div>{quiz.durationMinutes}</div>
                <div>{quiz.difficulty}</div>
                <div>{quiz.totalQuestions}</div>
                <div>{quiz.createdBy}</div>
            </div>
            <ActionButton action={createQuizAttempt.bind(null, id)} className="flex items-center gap-2">
                Start Quiz
            </ActionButton>
            <div>
                {quizAttemptList.map((quizAttempt) => (
                    <QuizAttemptCard key={quizAttempt.id} quizAttempt={{
                        id: quizAttempt.id,
                        startedAt: quizAttempt.startedAt,
                        completedAt: quizAttempt.completedAt ?? "",
                        score: quizAttempt.score ?? 0,
                        answers: quizAttempt.answers ?? [],
                    }} />
                ))}
            </div>
        </div>
    )
}

function QuizAttemptCard({ quizAttempt }: {
    quizAttempt: {
        id: string
        startedAt: string
        completedAt: string
        score: number
        answers: {
            questionId: string
            answer: string
        }[]
    }
}) {
    return (
        <div>
            <div>{quizAttempt.id}</div>
            <div>{formatDate(new Date(quizAttempt.startedAt))}</div>
            <div>{quizAttempt.completedAt ? formatDate(new Date(quizAttempt.completedAt)) : "Not completed"}</div>
            <div>{quizAttempt.score}</div>
            <div>{quizAttempt.answers.length}</div>
        </div>
    )
}