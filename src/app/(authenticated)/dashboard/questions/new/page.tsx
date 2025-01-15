import { getSubjects } from "@/server/actions/subjects";
import { QuestionForm } from "../_components/question-form";

export default async function NewQuestionPage() {
    const subjects = await getSubjects()
    return <QuestionForm subjects={subjects} />
}