import { getQuestions } from '@/features/questions/actions/questions'
import { columns } from '@/features/questions/components/table/columns'
import { DataTable } from '@/features/questions/components/table/data-table'
import { getSubjects } from '@/features/subjects/actions/subjects'

export default async function QuestionsPage() {
    const initialQuestions = await getQuestions({})
    const subjects = await getSubjects()

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-3xl font-bold mb-6">Questions</h1>
            <DataTable columns={columns} data={initialQuestions} />
        </div>
    )
}