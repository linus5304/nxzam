import { getQuiz } from "@/features/quiz/actions/quiz"
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
            <h1>Quiz Attempt</h1>
            {questions.map((question) => (
                <div key={question?.id}>
                    <h2>{question?.questionText}</h2>
                    <div>{JSON.stringify(question?.options)}</div>
                </div>
            ))}
        </div>
    )
}