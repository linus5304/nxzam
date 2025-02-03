import { Table } from '@/features/quiz/components/table'

export default async function Page(props: {
    searchParams?: Promise<{
        q?: string
        page?: string
        pageSize?: string
    }>
}) {

    const { q, page, pageSize } = await props.searchParams ?? {};
    const query = q ?? ""
    const pageNumber = page ? parseInt(page) : 0
    const pageSizeNumber = pageSize ? parseInt(pageSize) : 10
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Quizzes</h1>
            <Table query={query} page={pageNumber} pageSize={pageSizeNumber} />
        </div>
    )
}