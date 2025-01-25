import { getQuestion } from "@/server/actions/questions";

import { getSubjects } from "@/server/actions/subjects";
import { QuestionForm } from "../_components/questions/question-form";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

export default async function EditQuestionPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const subjects = await getSubjects();
    const question = await getQuestion(id);
    if (!question) {
        return notFound();
    }

    return <QuestionForm subjects={subjects} question={question} />
}


