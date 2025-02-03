import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";
import { Search } from "./search";
import Link from "next/link";
import { columns } from "./columns";
import { getQuestions } from "@/features/questions/actions/questions";
import { getSubjects } from "@/features/subjects/actions/subjects";

export async function Table(props: {
    query: string
    page: number
    pageSize: number
}) {

    const initialQuestions = await getQuestions({
        query: props.query,
        page: props.page,
        pageSize: props.pageSize
    })
    const subjects = await getSubjects()

    return (
        <div>
            <div className="flex items-center py-4 gap-2">
                <Search placeholder="Search quizzes..." />
                <Button asChild className="ml-auto">
                    <Link href="/admin/quiz/new">
                        Create Quiz
                    </Link>
                </Button>
            </div>
            <DataTable columns={columns} data={initialQuestions} />
        </div>
    )
}