import { getSubjects } from "@/features/subjects/actions/subjects";
import { QuestionForm } from "@/features/questions/components/form";

export default async function NewQuestionPage() {
    const subjects = await getSubjects()
    return <QuestionForm subjects={subjects} />
}