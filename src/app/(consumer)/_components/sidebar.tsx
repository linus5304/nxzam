"use client"

import { usePathname, useSelectedLayoutSegments } from "next/navigation"
import { AppSidebar } from "./home-sidebar"
import { QuizSidebar } from "./quiz-sidebar"
import { QuestionsSidebar } from "@/app/admin/_components/sidebar/question-sidebar"

export function Sidebar() {
    const segments = useSelectedLayoutSegments()

    if (segments[0] === "quiz" && segments.length > 1) {
        return <QuizSidebar />
    }

    if (segments[0] === "questions") {
        return <QuestionsSidebar />
    }

    return <AppSidebar />
}