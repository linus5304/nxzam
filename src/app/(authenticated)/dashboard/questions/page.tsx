import { getQuestions } from '@/server/actions/questions'
import { getSubjects } from '@/server/actions/subjects'
import { DataTable } from './_components/questions/data-table'
import { columns } from './_components/questions/columns'

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