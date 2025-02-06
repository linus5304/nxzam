import { getSubjects } from "@/features/subjects/actions/subjects";
import { QuizForm } from "@/features/quiz/components/form";
import QuestionsPage from "../../questions/page";

export default async function NewQuestionPage() {
    const subjects = await getSubjects()
    return (
        <QuizForm subjects={subjects}>
            <QuestionsPage />
        </QuizForm>
    )
}