"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Terminal } from "lucide-react"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { deleteQuiz } from "@/features/quiz/actions/quiz"
import { Ellipsis } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export function QuizActions() {
    const { id } = useParams()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant="ghost" size="icon" asChild>
                    <Ellipsis className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={`/admin/quiz/${id}/edit`}>
                        Edit
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export function QuizDeleteAction() {
    const { id } = useParams()

    const handleDelete = async () => {
        await deleteQuiz(id as string)
    }

    return (
        <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Danger zone</AlertTitle>
            <AlertDescription>
                <div className="flex flex-col gap-2">
                    <p>
                        This action cannot be undone.
                    </p>
                    <form action={handleDelete}>
                        <Button variant="destructive" className="w-fit" type="submit">Delete Quiz</Button>
                    </form>
                </div>
            </AlertDescription>
        </Alert>
    )
}