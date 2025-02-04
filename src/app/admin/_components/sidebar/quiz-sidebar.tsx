"use client"

import { cn } from "@/lib/utils"
import { BookAIcon, BookOpenIcon, SettingsIcon } from "lucide-react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

export function QuizSidebar() {
    const pathname = usePathname()
    const { id } = useParams()
    if (!pathname.startsWith(`/admin/quiz/${id}`)) {
        return null
    }
    return (
        <div>
            <div className="flex flex-col gap-2">
                <Link href={`/admin/quiz/${id}`}>
                    <div className={cn("flex items-center gap-2 hover:bg-muted p-2 rounded-md animate-in fade-in-0 duration-300 transition-colors", {
                        "bg-muted": pathname === `/admin/quiz/${id}`
                    })}>
                        <BookAIcon size={16} />
                        <span>Overview</span>
                    </div>
                </Link>
                <Link href={`/admin/quiz/${id}/questions`}>
                    <div className={cn("flex items-center gap-2 hover:bg-muted p-2 rounded-md animate-in fade-in-0 duration-300 transition-colors", {
                        "bg-muted": pathname === `/admin/quiz/${id}/questions`
                    })}>
                        <BookOpenIcon size={16} />
                        <span>Questions</span>
                    </div>
                </Link>

                <Link href={`/admin/quiz/${id}/settings`}>
                    <div className={cn("flex items-center gap-2 hover:bg-muted p-2 rounded-md animate-in fade-in-0 duration-300 transition-colors", {
                        "bg-muted": pathname === `/admin/quiz/${id}/settings`
                    })}>
                        <SettingsIcon size={16} />
                        <span>Settings</span>
                    </div>
                </Link>
            </div>
        </div>
    )
}