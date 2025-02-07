import { PageHeader } from "@/components/page-header"
import { getQuizList } from "@/features/quiz/actions/quiz"
import { QuizCard } from "@/features/quiz/components/quiz-card"
import Link from "next/link"

export default async function page() {
    const quizzes = await getQuizList()
    return (
        <div>
            <PageHeader title="Quizzes" />
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                {quizzes.map((quiz) => (
                    <Link href={`/dashboard/quiz/${quiz.id}`} key={quiz.id}>
                        <QuizCard key={quiz.id} quiz={{
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
        </div>
    )
}