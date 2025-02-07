"use client"

import { cn } from "@/lib/utils"
import { BookAIcon, BookOpenIcon, SettingsIcon } from "lucide-react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

export function QuizSidebar() {
    const pathname = usePathname()
    const { id } = useParams()
    if (!pathname.startsWith(`/dashboard/quiz/${id}`)) {
        return null
    }
    return (
        <div>
            <div className="flex flex-col gap-2">
                <Link href={`/dashboard/quiz/${id}`}>
                    <div className={cn("flex items-center gap-2 hover:bg-muted p-2 rounded-md animate-in fade-in-0 duration-300 transition-colors", {
                        "bg-muted": pathname === `/dashboard/quiz/${id}`
                    })}>
                        <BookAIcon size={16} />
                        <span>Overview</span>
                    </div>
                </Link>

                <Link href={`/dashboard/quiz/${id}/settings`}>
                    <div className={cn("flex items-center gap-2 hover:bg-muted p-2 rounded-md animate-in fade-in-0 duration-300 transition-colors", {
                        "bg-muted": pathname === `/dashboard/quiz/${id}/settings`
                    })}>
                        <SettingsIcon size={16} />
                        <span>Settings</span>
                    </div>
                </Link>
            </div>
        </div>
    )
}