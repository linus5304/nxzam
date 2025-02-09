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
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"


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

    if (isCompleted) {
        return <QuizResults questions={questions} answers={answers} />
    }

    const currentQuestion = questions[currentQuestionIndex]

    return (
        <div className="w-full mx-auto max-w-2xl">
            <QuizProgress
                current={currentQuestionIndex + 1}
                total={questions.length}
            />

            <Form {...form}>
                <form className="flex flex-col gap-4">
                    <FormField
                        key={currentQuestion.id}
                        control={form.control}
                        name={`questions.${currentQuestionIndex}`}
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>{currentQuestion.questionText}</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={(value) => {
                                            field.onChange(value)
                                            handleAnswer(currentQuestion.id, value)
                                        }}
                                        value={answers[currentQuestion.id]}
                                        className="flex flex-col space-y-1"
                                    >
                                        {currentQuestion.options.map((option) => (
                                            <FormItem key={option.id} className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value={option.id} className="peer sr-only" />
                                                </FormControl>
                                                <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer min-w-80">
                                                    {option.text}
                                                </FormLabel>
                                            </FormItem>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
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

export function QuizResults({
    questions,
    answers
}: {
    questions: Array<{
        id: string
        questionText: string
        options: Array<{
            id: string
            text: string
            isCorrect: boolean
        }>
    }>
    answers: Record<string, string>
}) {
    const calculateScore = () => {
        let correct = 0
        questions.forEach(question => {
            const selectedOption = question.options.find(opt => opt.id === answers[question.id])
            if (selectedOption?.isCorrect) correct++
        })
        return {
            correct,
            total: questions.length,
            percentage: Math.round((correct / questions.length) * 100)
        }
    }

    const score = calculateScore()

    return (
        <div className="w-full mx-auto max-w-2xl space-y-8">
            <div className="text-center p-6 bg-muted rounded-lg">
                <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
                <p className="text-xl">
                    You scored {score.correct} out of {score.total} ({score.percentage}%)
                </p>
            </div>

            <div className="space-y-6">
                {questions.map(question => {
                    const selectedOption = question.options.find(opt => opt.id === answers[question.id])
                    const correctOption = question.options.find(opt => opt.isCorrect)
                    const isCorrect = selectedOption?.isCorrect

                    return (
                        <div
                            key={question.id}
                            className={`p-4 rounded-lg border ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                                }`}
                        >
                            <h3 className="font-medium mb-2">{question.questionText}</h3>
                            <p>Your answer: {selectedOption?.text}</p>
                            {!isCorrect && (
                                <p className="text-green-700 mt-2">
                                    Correct answer: {correctOption?.text}
                                </p>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}