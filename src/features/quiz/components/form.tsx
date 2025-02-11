'use client'

import { NumberInput } from '@/components/form/number-input'
import { SelectInput } from '@/components/form/select-input'
import { TextInput } from '@/components/form/text-input'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon } from "lucide-react"
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { quizSchema } from '../schemas/quiz'
import { create, update } from '../actions/quiz'
import { actionToast } from '@/hooks/use-toast'
import { useCallback, useEffect } from 'react'
import { difficultyLevels } from '@/data/data'
import { DataTable } from '@/features/questions/components/table/data-table'
import { columns } from '@/features/questions/components/table/columns'
import { QuestionType } from '@/features/questions/schemas/questions'

export function QuizForm({ subjects, quiz, questions }: {
    subjects: {
        id: string,
        name: string,
        code: string,
        examType: string,
    }[],
    questions: QuestionType[],
    quiz?: z.infer<typeof quizSchema> & { id: string }
}) {
    "use no memo"

    const form = useForm<z.infer<typeof quizSchema>>({
        resolver: zodResolver(quizSchema),
        defaultValues: quiz ?? {
            title: "",
            description: "",
            difficulty: "medium",
            durationMinutes: 0,
            totalQuestions: 0,
            passingScore: 0,
            questionIds: [],
        },
    })

    async function onSubmit(values: z.infer<typeof quizSchema>) {
        console.log(values)
        const action = quiz == null ? create : update.bind(null, quiz.id)
        const data = await action(values)
        actionToast({ actionData: data })
    }

    // Filter questions based on selected subject
    const selectedSubjectId = form.watch("subjectId")
    const filteredQuestions = questions?.filter(q =>
        !selectedSubjectId || q.subjectId === selectedSubjectId
    ) ?? []

    return (
        <>
            <h1 className="text-2xl font-bold">Create New Quiz</h1>
            <Form {...form}>
                <form className="space-y-4">
                    <div className="grid grid-cols-12 gap-4">
                        <div className='col-span-4'>
                            <SelectInput
                                label="Subject"
                                name="subjectId"
                                options={subjects.map(subject => ({
                                    id: subject.id,
                                    label: `${subject.name} (${subject.examType})`,
                                    value: subject.id
                                }))} />
                        </div>

                        <div className='col-span-8'>
                            <TextInput
                                label="Title"
                                name="title"
                                placeholder="Enter quiz title"
                            />
                        </div>
                    </div>

                    <div>
                        <TextInput
                            label="Description"
                            name="description"
                            placeholder="Enter quiz description"
                        />
                    </div>

                    <div className="grid sm:grid-cols-12 grid-cols-6 gap-4">
                        <div className="col-span-3">
                            <SelectInput label="Difficulty" name="difficulty" options={difficultyLevels.map(difficulty => ({
                                id: difficulty.id,
                                label: difficulty.label,
                                value: difficulty.value
                            }))} />
                        </div>

                        <div className="col-span-3">
                            <NumberInput
                                label="Duration (minutes)"
                                name="durationMinutes"
                                min={1}
                                max={1000}
                                allowDecimals={false}
                                defaultValue={quiz?.durationMinutes}
                            />
                        </div>


                        <div className="col-span-3">
                            <NumberInput
                                label="Total Questions"
                                name="totalQuestions"
                                min={1}
                                max={1000}
                                allowDecimals={false}
                                defaultValue={quiz?.totalQuestions}
                            />
                        </div>

                        <div className="col-span-3">
                            <NumberInput
                                label="Passing Score"
                                name="passingScore"
                                min={1}
                                max={100}
                                allowDecimals={false}
                                defaultValue={quiz?.passingScore}
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input type="checkbox" id="isPublished" name="isPublished" />
                        <Label htmlFor="isPublished">Publish Quiz</Label>
                    </div>

                    <Separator />
                    <TextInput
                        label="Questions"
                        name="questionIds"
                        placeholder="Enter quiz questions"
                        hidden
                    />

                    <div className="p-4 border rounded-lg bg-card">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Select Questions</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                    Selected: {form.watch("questionIds")?.length || 0}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    Required: {form.watch("totalQuestions")}
                                </span>
                            </div>
                        </div>

                        {form.watch("subjectId") ? (
                            <DataTable
                                columns={columns}
                                data={filteredQuestions}
                                embedded
                            />
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                Please select a subject first to view available questions
                            </div>
                        )}
                    </div>

                    {/* Validation Messages */}
                    {form.watch("questionIds")?.length > form.watch("totalQuestions") && (
                        <p className="text-destructive text-sm">
                            You have selected more questions than the total required
                        </p>
                    )}
                    {form.watch("questionIds")?.length < form.watch("totalQuestions") && (
                        <p className="text-destructive text-sm">
                            You need to select more questions to match the total required
                        </p>
                    )}
                    <div className="flex justify-end">
                        {quiz == null ? (
                            <Button type="submit" disabled={form.formState.isSubmitting} onClick={form.handleSubmit(onSubmit)}>
                                {form.formState.isSubmitting ? "Creating..." : "Create Quiz"}
                            </Button>
                        ) : (
                            <Button type="submit" disabled={form.formState.isSubmitting} onClick={form.handleSubmit(onSubmit)}>
                                {form.formState.isSubmitting ? "Updating..." : "Update Quiz"}
                            </Button>
                        )}
                    </div>
                </form>
                <DevTool control={form.control} />
            </Form>
        </>
    )
}


function QuizQuestionSheet({ children }: { children: React.ReactNode }) {
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
                    <SheetTitle>Select Questions</SheetTitle>
                    <SheetDescription>
                        Select the questions you want to add to the quiz.
                    </SheetDescription>
                </SheetHeader>
                {children}
            </SheetContent>
        </Sheet>
    )
}