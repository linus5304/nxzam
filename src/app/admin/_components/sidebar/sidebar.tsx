"use client"

import { cn } from "@/lib/utils"
import { BookAIcon, BookOpenIcon, SettingsIcon, UserIcon } from "lucide-react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

export function AppSidebar() {
    const pathname = usePathname()
    const { id } = useParams()
    if (pathname.startsWith(`/admin`) && id) {
        return null
    }

    return (
        <div>
            <div className="flex flex-col gap-2">
                <Link href="/admin">
                    <div className={cn("flex items-center gap-2 hover:bg-muted p-2 rounded-md animate-in fade-in-0 duration-300 transition-colors", {
                        "bg-muted": pathname === "/admin"
                    })}>
                        <BookAIcon size={16} />
                        <span>Overview</span>
                    </div>
                </Link>
                <Link href={`/admin/xzam`}>
                    <div className={cn("flex items-center gap-2 hover:bg-muted p-2 rounded-md animate-in fade-in-0 duration-300 transition-colors", {
                        "bg-muted": pathname === "/admin/xzam"
                    })}>
                        <BookOpenIcon size={16} />
                        <span>xzams</span>
                    </div>
                </Link>

                <Link href={`/admin/quiz`}>
                    <div className={cn("flex items-center gap-2 hover:bg-muted p-2 rounded-md animate-in fade-in-0 duration-300 transition-colors", {
                        "bg-muted": pathname === "/admin/quiz"
                    })}>
                        <BookOpenIcon size={16} />
                        <span>Quizzes</span>
                    </div>
                </Link>

                <Link href={`/admin/questions`}>
                    <div className={cn("flex items-center gap-2 hover:bg-muted p-2 rounded-md animate-in fade-in-0 duration-300 transition-colors", {
                        "bg-muted": pathname === "/admin/questions"
                    })}>
                        <BookOpenIcon size={16} />
                        <span>Questions</span>
                    </div>
                </Link>

                <Link href={`/admin/account`}>
                    <div className={cn("flex items-center gap-2 hover:bg-muted p-2 rounded-md animate-in fade-in-0 duration-300 transition-colors", {
                        "bg-muted": pathname === "/admin/account"
                    })}>
                        <UserIcon size={16} />
                        <span>Account</span>
                    </div>
                </Link>

                <Link href="/admin/quiz/create">
                    <div className={cn("flex items-center gap-2 hover:bg-muted p-2 rounded-md animate-in fade-in-0 duration-300 transition-colors", {
                        "bg-muted": pathname === "/admin/quiz/create"
                    })}>
                        <SettingsIcon size={16} />
                        <span>Settings</span>
                    </div>
                </Link>
            </div>
        </div>
    )
}