import { getQuestions } from '@/features/questions/actions/questions'
import { getSubjects } from '@/features/subjects/actions/subjects'
import { DataTable } from '@/features/quiz/components/table/data-table'
import { columns } from '@/features/quiz/components/table/columns'

export default async function QuestionsPage() {
    const initialQuestions = await getQuestions({})
    const subjects = await getSubjects()

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <h1 className="text-3xl font-bold mb-6">Quizzes</h1>
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
    )
}