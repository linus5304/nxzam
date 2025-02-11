import { getSubjects } from "@/features/subjects/actions/subjects";
import { QuizForm } from "@/features/quiz/components/form";
import QuestionsPage from "../../questions/page";
import { getQuestions } from "@/features/questions/actions/questions";

export default async function NewQuestionPage() {
    const [subjects, questions] = await Promise.all([
        getSubjects(),
        getQuestions({})
    ])
    return (
        <QuizForm subjects={subjects} questions={questions ?? []} />
    )
}