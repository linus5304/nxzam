import { getQuestions } from '@/features/questions/actions/questions'
import QuestionsList from '@/features/questions/components/questions-list'
import { getSubjects } from '@/features/subjects/actions/subjects'

export default async function QuestionsPage() {
    const initialQuestions = await getQuestions({})
    const subjects = await getSubjects()

    return (
        <QuestionsList />
    )
}