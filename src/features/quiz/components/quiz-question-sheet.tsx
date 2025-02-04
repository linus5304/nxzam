"use client"

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { PlusIcon } from "lucide-react"

export function QuizQuestionSheet({ children }: { children: React.ReactNode }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">
                    <PlusIcon className="w-4 h-4" />
                    Add Question
                </Button>
            </SheetTrigger>
            <SheetContent className="min-w-[800px]">
                <SheetHeader>
                    <SheetTitle>Are you absolutely sure?</SheetTitle>
                    <SheetDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </SheetDescription>
                </SheetHeader>
                {children}
            </SheetContent>
        </Sheet>
    )
}