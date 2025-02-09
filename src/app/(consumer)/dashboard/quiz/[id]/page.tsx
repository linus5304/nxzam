import { ActionButton } from "@/components/action-button"
import { Button } from "@/components/ui/button"
import { createQuizAttempt } from "@/features/quiz-attempt/actions/quiz-attempt"
import { getQuiz, getQuizAttemptList } from "@/features/quiz/actions/quiz"
import { QuizHeader } from "@/features/quiz/components/header"
import { formatDate } from "@/lib/formatters"
import { notFound } from "next/navigation"

export default async function page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const [quiz, quizAttemptList] = await Promise.all([getQuiz(id), getQuizAttemptList(id)])
    if (!quiz) {
        return notFound()
    }

    return (
        <div className="flex flex-col gap-8">
            {/* <PageHeader title={quiz.title} description={quiz.description ?? ""} /> */}
            <div>
                <QuizHeader data={{
                    id: quiz.id,
                    title: quiz.title,
                    description: quiz.description ?? "",
                    passingScore: quiz.passingScore,
                    durationMinutes: quiz.durationMinutes,
                    difficulty: quiz.difficulty,
                    totalQuestions: quiz.totalQuestions,
                    createdBy: quiz.createdBy.fullName,
                }} />
            </div>
            <div>
                <h2 className="text-lg font-bold text-foreground mb-4">Your recent attempts</h2>
                <div className="flex flex-col gap-4">
                    {quizAttemptList.map((quizAttempt) => (
                        <QuizAttemptCard
                            key={quizAttempt.id} quizAttempt={{
                                id: quizAttempt.id,
                                startedAt: quizAttempt.startedAt,
                                completedAt: quizAttempt.completedAt ?? "",
                                score: quizAttempt.score ?? 0,
                                answers: quizAttempt.answers ?? [],
                            }} />
                    ))}
                </div>
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
        <div className="grid grid-cols-12 gap-1 border rounded-md p-4">
            <div className="flex flex-col gap-1 col-span-8">
                <div className="flex items-center gap-2">
                    Started at:
                    <div>{formatDate(new Date(quizAttempt.startedAt))}</div>
                </div>
                <div className="flex items-center gap-2">
                    Completed at:
                    <div>{quizAttempt.completedAt ? formatDate(new Date(quizAttempt.completedAt)) : "Not completed"}</div>
                </div>
            </div>
            <div className="flex gap-1 col-span-4 justify-between w-full">
                <div>
                    <div>Score: {quizAttempt.score}</div>
                    <div>Total questions: {quizAttempt.answers.length}</div>
                </div>

                <Button variant="outline">
                    View
                </Button>
            </div>
        </div>
    )
}