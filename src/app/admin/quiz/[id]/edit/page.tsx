import { getQuestion } from "@/features/questions/actions/questions";
import { getSubjects } from "@/features/subjects/actions/subjects";
import { QuestionForm } from "@/features/questions/components/form";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

export default async function EditQuestionPage({ params }: { params: Params }) {
    const { id } = await params;
    const subjects = await getSubjects();
    const question = await getQuestion(id);
    if (!question) {
        return notFound();
    }

    return <QuestionForm subjects={subjects} question={question} />
}


