import { getQuestions } from '@/features/questions/actions/questions'
import { getSubjects } from '@/features/subjects/actions/subjects'
import { DataTable } from '@/features/quiz/components/table/data-table'
import { columns } from '@/features/quiz/components/table/columns'

export default async function QuestionsPage() {
    const initialQuestions = await getQuestions({})
    const subjects = await getSubjects()

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-3xl font-bold mb-6">Quizzes</h1>
            <DataTable columns={columns} data={initialQuestions} />
        </div>
    )
}