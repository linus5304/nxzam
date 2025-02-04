import { getSubjects } from "@/features/subjects/actions/subjects";
import { QuizForm } from "@/features/quiz/components/form";
import QuestionsList from "@/features/questions/components/questions-list";

export default async function NewQuestionPage() {
    const subjects = await getSubjects()
    return <QuizForm subjects={subjects}>
        <QuestionsList />
    </QuizForm>
}