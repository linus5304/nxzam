"use client"

import { cn } from "@/lib/utils"
import { BookAIcon, BookOpenIcon, SettingsIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function QuizSidebar() {
    const pathname = usePathname()
    return (
        <div>
            <div className="flex flex-col gap-2">
                <Link href="/admin/quiz">
                    <div className={cn("flex items-center gap-2 hover:bg-muted p-2 rounded-md animate-in fade-in-0 duration-300 transition-colors", {
                        "bg-muted": pathname === "/admin/quiz"
                    })}>
                        <BookAIcon size={16} />
                        <span>Overview</span>
                    </div>
                </Link>
                <Link href="/admin/quiz/create">
                    <div className="flex items-center gap-2 hover:bg-muted p-2 rounded-md animate-in fade-in-0 duration-300 transition-colors">
                        <BookOpenIcon size={16} />
                        <span>Questions</span>
                    </div>
                </Link>

                <Link href="/admin/quiz/create">
                    <div className="flex items-center gap-2 hover:bg-muted p-2 rounded-md animate-in fade-in-0 duration-300 transition-colors">
                        <SettingsIcon size={16} />
                        <span>Settings</span>
                    </div>
                </Link>
            </div>
        </div>
    )
}