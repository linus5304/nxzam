import { Button } from '@/components/ui/button'
import { getQuizList } from '@/features/quiz/actions/quiz'
import { QuizCard } from '@/features/quiz/components/quiz-card'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'

export default async function QuizPage() {
    const quizzes = await getQuizList()

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold mb-6">Quizzes</h1>
                <div className="flex items-center gap-2">
                    <Link href="/admin/quiz/new">
                        <Button>
                            <PlusIcon className="w-4 h-4" />
                            Create Quiz
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                {quizzes.map((quiz) => (
                    <Link href={`/admin/quiz/${quiz.id}`} key={quiz.id}>
                        <QuizCard quiz={{
                            id: quiz.id,
                            title: quiz.title,
                            description: quiz.description ?? '',
                            subjectId: quiz.subjectId,
                            createdBy: quiz.createdBy,
                            difficulty: quiz.difficulty,
                            durationMinutes: quiz.durationMinutes,
                            isPublished: quiz.isPublished,
                            topics: quiz.topics,
                            totalQuestions: quiz.totalQuestions,
                            passingScore: quiz.passingScore,
                        }} />
                    </Link>
                ))}
            </div>
        </div >
    )
}