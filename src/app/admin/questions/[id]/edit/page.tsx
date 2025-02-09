import { getQuestion } from "@/features/questions/actions/questions";
import { getSubjects } from "@/features/subjects/actions/subjects";
import { QuestionForm } from "@/features/questions/components/form";
import { notFound } from "next/navigation";

export default async function EditQuestionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    console.log("id", id)
    const subjects = await getSubjects();
    const question = await getQuestion(id);
    console.log("question", question)
    if (!question) {
        return notFound();
    }

    return <QuestionForm subjects={subjects} question={question} />
}