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

export function QuizForm({ subjects, children, quiz }: {
    subjects: {
        id: string,
        name: string,
        code: string,
        examType: string,
    }[]
    children: React.ReactNode
    quiz?: z.infer<typeof quizSchema> & { id: string }
}) {
    const router = useRouter()
    const form = useForm<z.infer<typeof quizSchema>>({
        resolver: zodResolver(quizSchema),
        defaultValues: quiz ?? {
            title: "",
            description: "",
            difficulty: "medium",
            durationMinutes: 0,
            totalQuestions: 0,
            passingScore: 0,
            questions: [],
        },
    })

    async function onSubmit(values: z.infer<typeof quizSchema>) {
        console.log(values)
        const action = quiz == null ? create : update.bind(null, quiz.id)
        const data = await action(values)
        actionToast({ actionData: data })
    }

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
                            <SelectInput label="Difficulty" name="difficulty" options={[{
                                id: "easy",
                                label: "Easy",
                                value: "easy"
                            }, {
                                id: "medium",
                                label: "Medium",
                                value: "medium"
                            }, {
                                id: "hard",
                                label: "Hard",
                                value: "hard"
                            }]} />
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
                    <div>
                        <TextInput
                            label="Questions"
                            name="questions"
                            placeholder="Enter quiz questions"
                            hidden
                        />
                        <QuizQuestionSheet>
                            {children}
                        </QuizQuestionSheet>
                    </div>


                    <div className="flex justify-end">

                        <Button type="submit" disabled={form.formState.isSubmitting} onClick={form.handleSubmit(onSubmit)}>
                            {form.formState.isSubmitting ? "Creating..." : "Create Quiz"}
                        </Button>
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