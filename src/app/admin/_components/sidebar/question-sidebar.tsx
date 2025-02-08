"use client"

import { cn } from "@/lib/utils"
import { BookAIcon, BookOpenIcon, SettingsIcon } from "lucide-react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

export function QuestionsSidebar() {
    const pathname = usePathname()
    const { id } = useParams()
    if (!pathname.startsWith(`/admin/questions/${id}`)) {
        return null
    }
    return (
        <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <div className="flex flex-col gap-2">
                <Link href="/admin/quiz">
                    <div className={cn("flex items-center gap-2 hover:bg-muted p-2 rounded-md animate-in fade-in-0 duration-300 transition-colors", {
                        "bg-muted": pathname === "/admin/questions"
                    })}>
                        <BookAIcon size={16} />
                        <span>Overview</span>
                    </div>
                </Link>
                <Link href={`/admin/questions/${id}/questions`}>
                    <div className="flex items-center gap-2 hover:bg-muted p-2 rounded-md animate-in fade-in-0 duration-300 transition-colors">
                        <BookOpenIcon size={16} />
                        <span>Student questions</span>
                    </div>
                </Link>

                <Link href="/admin/questions/create">
                    <div className="flex items-center gap-2 hover:bg-muted p-2 rounded-md animate-in fade-in-0 duration-300 transition-colors">
                        <SettingsIcon size={16} />
                        <span>Questions settings</span>
                    </div>
                </Link>
            </div>
        </div>
    )
}