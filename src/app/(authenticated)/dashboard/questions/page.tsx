import { getQuestions } from '@/server/actions/questions'
import { QuestionList } from '@/app/(authenticated)/dashboard/questions/_components/questions-list'
import { getSubjects } from '@/server/actions/subjects'

export default async function QuestionsPage() {
    const initialQuestions = await getQuestions({})
    const subjects = await getSubjects()

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Questions</h1>
            <QuestionList initialQuestions={initialQuestions} subjects={subjects} />
        </div>
    )
}