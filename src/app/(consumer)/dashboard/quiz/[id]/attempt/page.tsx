import { getQuiz } from "@/features/quiz/actions/quiz"
import { QuizQuestionView } from "@/features/quiz/components/quiz-question-view"
import { notFound } from "next/navigation"


export default async function page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const quiz = await getQuiz(id)
    if (!quiz) {
        return notFound()
    }
    const questions = quiz.quizQuestions.map((quizQuestion) => quizQuestion.question)
    console.log(questions)
    return (
        <div>
            <QuizQuestionView questions={questions.map((question) => ({
                id: question.id,
                questionText: question.questionText,
                options: question.options,
            }))} />
        </div>
    )
}