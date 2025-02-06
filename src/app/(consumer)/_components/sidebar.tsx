"use client"

import { cn } from "@/lib/utils"
import { BookAIcon, BookOpenIcon, TrophyIcon, UserIcon } from "lucide-react"
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
                <Link href="/dashboard">
                    <div className={cn("flex items-center gap-2 hover:bg-muted p-2 rounded-md animate-in fade-in-0 duration-300 transition-colors", {
                        "bg-muted": pathname === "/dashboard"
                    })}>
                        <BookAIcon size={16} />
                        <span>Overview</span>
                    </div>
                </Link>
                <Link href={`/admin/xzam`}>
                    <div className={cn("flex items-center gap-2 hover:bg-muted p-2 rounded-md animate-in fade-in-0 duration-300 transition-colors", {
                        "bg-muted": pathname === "/dashboard/xzam"
                    })}>
                        <BookOpenIcon size={16} />
                        <span>xzams</span>
                    </div>
                </Link>

                <Link href={`/dashboard/quiz`}>
                    <div className={cn("flex items-center gap-2 hover:bg-muted p-2 rounded-md animate-in fade-in-0 duration-300 transition-colors", {
                        "bg-muted": pathname === "/dashboard/quiz"
                    })}>
                        <BookOpenIcon size={16} />
                        <span>Quizzes</span>
                    </div>
                </Link>

                <Link href={`/dashboard/leaderboard`}>
                    <div className={cn("flex items-center gap-2 hover:bg-muted p-2 rounded-md animate-in fade-in-0 duration-300 transition-colors", {
                        "bg-muted": pathname === "/dashboard/leaderboard"
                    })}>
                        <TrophyIcon size={16} />
                        <span>Leaderboard</span>
                    </div>
                </Link>

                <Link href={`/dashboard/account`}>
                    <div className={cn("flex items-center gap-2 hover:bg-muted p-2 rounded-md animate-in fade-in-0 duration-300 transition-colors", {
                        "bg-muted": pathname === "/dashboard/account"
                    })}>
                        <UserIcon size={16} />
                        <span>Account</span>
                    </div>
                </Link>
            </div>
        </div>
    )
}