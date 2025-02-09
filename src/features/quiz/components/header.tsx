'use client'

import { ActionButton } from "@/components/action-button"
import { Button } from "@/components/ui/button"
import { createQuizAttempt } from "@/features/quiz-attempt/actions/quiz-attempt"
import { ArrowRightIcon } from "lucide-react"

export function QuizHeader({ data }: {
    data: {
        id: string
        title: string
        description: string
        passingScore: number
        durationMinutes: number
        difficulty: string
        totalQuestions: number, createdBy: string
    }
}) {

    return (
        <div className="dark:bg-grid-white/[0.2] bg-grid-black/[0.02] border w-full rounded-md text-left p-4 md:p-6 grid sm:grid-cols-12 gap-4">
            <div className="flex flex-col gap-4 items-start sm:col-span-8">
                <div>
                    <h3 className="text-lg font-bold mb-1 text-foreground">
                        {data.title}
                    </h3>
                    <p className="text-wrap text-sm text-foreground/60">
                        {data.description}
                    </p>
                </div>
                <ActionButton action={createQuizAttempt.bind(null, data.id)} className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        Start Quiz
                        <ArrowRightIcon className="w-4 h-4" />
                    </div>
                </ActionButton>
            </div>
            <div className="flex flex-col gap-2 items-start border rounded-md border-foreground/5 p-2 sm:col-span-4">
                <div className="flex justify-between w-full">
                    <h3 className="text-sm text-foreground/60">
                        Passing Score:
                    </h3>
                    <p className="text-wrap text-sm text-foreground">
                        {data.passingScore}
                    </p>
                </div>
                <div className="flex justify-between w-full">
                    <h3 className="text-sm text-foreground/60">
                        Duration:
                    </h3>
                    <p className="text-wrap text-sm text-foreground">
                        {data.durationMinutes}
                    </p>
                </div>
                <div className="flex justify-between w-full">
                    <h3 className="text-sm text-foreground/60">
                        Difficulty:
                    </h3>
                    <p className="text-wrap text-sm text-foreground">
                        {data.difficulty}
                    </p>
                </div>
                <div className="flex justify-between w-full">
                    <h3 className="text-sm text-foreground/60">
                        Total Questions:
                    </h3>
                    <p className="text-wrap text-sm text-foreground">
                        {data.totalQuestions}
                    </p>
                </div>
                <div className="flex justify-between w-full">
                    <h3 className="text-sm text-foreground/60">
                        Created By:
                    </h3>
                    <p className="text-wrap text-sm text-foreground">
                        {data.createdBy}
                    </p>
                </div>
            </div>
        </div>
    )
}