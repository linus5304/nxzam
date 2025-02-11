"use client"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Flag, MenuSquare } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { QuizResults } from "./quiz-results"
import { QuizQuestionDisplay } from "./quiz-question-display"


const questionViewSchema = z.object({
    questions: z.array(z.object({
        id: z.string(),
        type: z.literal('multipleChoice'),
        questionText: z.string(),
        options: z.array(z.object({
            id: z.string(),
            text: z.string(),
            isCorrect: z.boolean(),
        })),
        selectedOptionId: z.string().optional(),
    }))
})

export function QuizQuestionView({ questions }: {
    questions: {
        id: string
        questionText: string
        options: {
            id: string
            text: string
            isCorrect: boolean
        }[]
    }[]
}) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set())
    const [isCompleted, setIsCompleted] = useState(false)

    const form = useForm<z.infer<typeof questionViewSchema>>({
        resolver: zodResolver(questionViewSchema),
        defaultValues: {
            questions: questions.map((question) => ({
                ...question,
                selectedOptionId: undefined,
            })),
        },
    })

    const handleAnswer = (questionId: string, optionId: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionId
        }))
    }

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1)
        } else if (Object.keys(answers).length === questions.length) {
            setIsCompleted(true)
        }
    }

    const handleToggleFlag = (index: number) => {
        setFlaggedQuestions(prev => {
            const next = new Set(prev)
            if (next.has(index)) {
                next.delete(index)
            } else {
                next.add(index)
            }
            return next
        })
    }

    const answeredQuestions = new Set(Object.keys(answers))

    if (isCompleted) {
        return <QuizResults questions={questions} answers={answers} />
    }

    const currentQuestion = questions[currentQuestionIndex]

    return (
        <div className="w-full mx-auto max-w-2xl">
            <QuizNavigationDrawer
                totalQuestions={questions.length}
                currentQuestion={currentQuestionIndex}
                flaggedQuestions={flaggedQuestions}
                answeredQuestions={answeredQuestions}
                onQuestionSelect={setCurrentQuestionIndex}
                questions={questions}
            />

            <div className="flex justify-between items-start mb-6">
                <h2 className="font-medium">Question {currentQuestionIndex + 1}</h2>
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "gap-2",
                        flaggedQuestions.has(currentQuestionIndex) && "text-destructive"
                    )}
                    onClick={() => handleToggleFlag(currentQuestionIndex)}
                >
                    <Flag
                        className={cn(
                            "h-4 w-4",
                            flaggedQuestions.has(currentQuestionIndex) && "fill-destructive"
                        )}
                    />
                    {flaggedQuestions.has(currentQuestionIndex) ? 'Unflag' : 'Flag for later'}
                </Button>
            </div>

            <Form {...form}>
                <form className="flex flex-col gap-4">
                    <FormField
                        key={currentQuestion.id}
                        control={form.control}
                        name={`questions.${currentQuestionIndex}`}
                        render={({ field }) => (
                            <QuizQuestionDisplay
                                question={currentQuestion}
                                selectedOptionId={answers[currentQuestion.id]}
                                onOptionSelect={(value) => {
                                    field.onChange(value)
                                    handleAnswer(currentQuestion.id, value)
                                }}
                            />
                        )}
                    />

                    <div className="flex justify-between mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                            disabled={currentQuestionIndex === 0}
                        >
                            Previous
                        </Button>
                        <Button
                            type="button"
                            onClick={handleNext}
                            disabled={!answers[currentQuestion.id]}
                        >
                            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}


interface QuizNavigationDrawerProps {
    totalQuestions: number
    currentQuestion: number
    flaggedQuestions: Set<number>
    answeredQuestions: Set<string>
    onQuestionSelect: (index: number) => void
    questions: { id: string }[]
}

export function QuizNavigationDrawer({
    totalQuestions,
    currentQuestion,
    flaggedQuestions,
    answeredQuestions,
    onQuestionSelect,
    questions
}: QuizNavigationDrawerProps) {
    return (
        <Sheet key="bottom">
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="fixed bottom-4 left-4">
                    <MenuSquare className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
                <SheetHeader>
                    <SheetTitle className="text-md font-medium">Questions List</SheetTitle>
                </SheetHeader>
                <div className="grid grid-cols-6 gap-2 mt-8">
                    {Array.from({ length: totalQuestions }, (_, index) => (
                        <QuestionButton
                            key={index}
                            number={index + 1}
                            isActive={index === currentQuestion}
                            isFlagged={flaggedQuestions.has(index)}
                            isAnswered={answeredQuestions.has(questions[index].id)}
                            onClick={() => {
                                onQuestionSelect(index)
                            }}
                        />
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    )
}

interface QuestionButtonProps {
    number: number
    isActive: boolean
    isFlagged: boolean
    isAnswered: boolean
    onClick: () => void
}

function QuestionButton({
    number,
    isActive,
    isFlagged,
    isAnswered,
    onClick,
}: QuestionButtonProps) {
    return (
        <div className="relative group">
            <Button
                variant="outline"
                onClick={onClick}
                className={cn(
                    isActive && "bg-primary text-primary-foreground",
                    !isActive && isAnswered && "bg-foreground/10",
                    !isActive && !isAnswered && "bg-muted"
                )}
            >
                {number}
            </Button>
            {isFlagged && (
                <Flag
                    className={cn(
                        "h-4 w-4 absolute -top-1 -right-2",
                        isFlagged ? "fill-destructive stroke-destructive" : "stroke-muted-foreground"
                    )}
                />
            )}
        </div>
    )
}

export function QuizProgress({ current, total }: { current: number; total: number }) {
    return (
        <div className="mb-4">
            <div className="flex justify-between mb-2">
                <span>Question {current} of {total}</span>
                <span>{Math.round((current / total) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${(current / total) * 100}%` }}
                />
            </div>
        </div>
    )
}