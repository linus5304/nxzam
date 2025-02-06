"use client"

import { NavMain } from "@/app/(consumer)/_components/sidebar/nav-main"
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import { Icons } from "@/lib/icons"
import { BookOpen, ChartBar, GraduationCap, Settings, Trophy } from "lucide-react"
import Link from "next/link"

const subjects = ["Math", "Science", "English", "History", "Geography", "Physics", "Chemistry", "Biology"]

const difficultyLevels = ["Easy", "Medium", "Hard", "Advanced"]


const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Quizzes",
            url: "/dashboard/quizzes",
            icon: BookOpen,
            isActive: true,
        },
        {
            title: "My Learning",
            url: "/dashboard/my-learning",
            icon: GraduationCap,
            isActive: true,
        },
        {
            title: "Progress",
            url: "/dashboard/progress",
            icon: ChartBar,
            isActive: true,
        },
        {
            title: "Leaderboard",
            url: "/dashboard/leaderboard",
            icon: Trophy,
            isActive: true,
        },
        {
            title: "Settings",
            url: "/dashboard/settings",
            icon: Settings,
            isActive: true,
        },
    ],
}

export function DashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem className="flex justify-center items-center py-2">
                        <Link href="/dashboard">
                            <Icons.LogoDark size={140} />
                        </Link>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
        </Sidebar>
    )
}

