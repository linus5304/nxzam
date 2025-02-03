'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NumberInput } from '@/components/ui/number-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useActionState, useState } from 'react'
import { toast } from 'sonner'
import { create } from '../actions/quiz'

export function QuizForm({ subjects }: {
    subjects: {
        id: string,
        name: string,
        code: string,
        examType: string,
    }[]
}) {
    const [state, formAction, pending] = useActionState(create, {
        success: false,
        message: "",
        errors: {},
        defaultValues: {}
    })

    const [topics, setTopics] = useState<string[]>([])
    const addTopic = () => {
        setTopics((prev) => [...prev, ""])
    }

    const removeTopic = (index: number) => {
        setTopics((prev) => prev.filter((_, i) => i !== index))
    }

    const updateTopics = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTopics((prev) => [...prev, e.target.value])
    }

    return (
        <>
            <h1 className="text-2xl font-bold">Create New Quiz</h1>
            <form action={formAction} className="space-y-4">
                <div className="grid grid-cols-12 gap-4">
                    <div className='col-span-4'>
                        <Label htmlFor="subjectId">Subject</Label>
                        <Select name="subjectId">
                            <SelectTrigger>
                                <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent>
                                {subjects.map((subject) => (
                                    <SelectItem key={subject.id} value={subject.id}>
                                        {subject.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {(state.errors?.subjectId) && (
                            <p className="text-red-500 text-sm">{state.errors?.subjectId?.[0]}</p>
                        )}
                    </div>

                    <div className='col-span-8'>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="Enter quiz title"
                            defaultValue={state.defaultValues?.title}
                        />
                        {(state.errors?.title) && (
                            <p className="text-red-500 text-sm">{state.errors?.title?.[0]}</p>
                        )}
                    </div>
                </div>

                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        placeholder="Enter quiz description"
                        defaultValue={state.defaultValues?.description}
                    />
                    {(state.errors?.description) && (
                        <p className="text-red-500 text-sm">{state.errors?.description?.[0]}</p>
                    )}
                </div>

                <div className="grid sm:grid-cols-12 grid-cols-6 gap-4">
                    <div className="col-span-3">
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <Select name="difficulty" defaultValue="medium">
                            <SelectTrigger>
                                <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                        </Select>
                        {(state.errors?.difficulty) && (
                            <p className="text-red-500 text-sm">{state.errors?.difficulty?.[0]}</p>
                        )}
                    </div>

                    <div className="col-span-3">
                        <Label htmlFor="durationMinutes">Duration (minutes)</Label>
                        <NumberInput
                            id="durationMinutes"
                            name="durationMinutes"
                            defaultValue={state.defaultValues?.durationMinutes}
                        />
                        {(state.errors?.durationMinutes) && (
                            <p className="text-red-500 text-sm">
                                {state.errors?.durationMinutes?.[0]}
                            </p>
                        )}
                    </div>


                    <div className="col-span-3">
                        <Label htmlFor="totalQuestions">Total Questions</Label>
                        <NumberInput
                            id="totalQuestions"
                            name="totalQuestions"
                            defaultValue={state.defaultValues?.totalQuestions}
                        />
                        {(state.errors?.totalQuestions) && (
                            <p className="text-red-500 text-sm">
                                {state.errors?.totalQuestions?.[0]}
                            </p>
                        )}
                    </div>

                    <div className="col-span-3">
                        <Label htmlFor="passingScore">Passing Score</Label>
                        <NumberInput
                            id="passingScore"
                            name="passingScore"
                            defaultValue={state.defaultValues?.passingScore}
                        />
                        {(state.errors?.passingScore) && (
                            <p className="text-red-500 text-sm">
                                {state.errors?.passingScore?.[0]}
                            </p>
                        )}
                    </div>
                </div>

                {/* <div className="space-y-2">
                    <Label>Topics</Label>
                    {topics.map((topic, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <Input
                                name="topics"
                                defaultValue={topic}
                                placeholder={`Topic ${index + 1}`}
                            />
                            <Button type="button" variant="outline" onClick={() => removeTopic(index)}>
                                Remove
                            </Button>
                        </div>
                    ))}
                    <Button type="button" onClick={addTopic}>
                        Add Topic
                    </Button>
                    {(state.errors?.topics) && (
                        <p className="text-red-500 text-sm">{state.errors?.topics?.[0]}</p>
                    )}
                </div> */}

                <div className="flex items-center space-x-2">
                    <input type="checkbox" id="isPublished" name="isPublished" />
                    <Label htmlFor="isPublished">Publish Quiz</Label>
                </div>

                <div className="flex justify-end">

                    <Button type="submit" disabled={pending}>
                        {pending ? "Creating..." : "Create Quiz"}
                    </Button>
                </div>
            </form>
        </>
    )
}
