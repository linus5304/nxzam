'use client'

import { QuestionFormData } from '@/schemas/questions'
import { createQuestion } from '@/server/actions/questions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useActionState, useState } from 'react'

interface QuestionFormProps {
    subjects: { id: string, name: string, examType: "gce_ol" | "gce_al" }[]
}

export function QuestionForm({ subjects }: QuestionFormProps) {
    const [state, formAction, pending] = useActionState(createQuestion, {
        errors: {} as Partial<Record<keyof QuestionFormData, string[]>>,
        message: '',
    })

    const [options, setOptions] = useState(['', ''])
    const [tags, setTags] = useState([''])

    const addOption = () => setOptions([...options, ''])
    const removeOption = (index: number) => setOptions(options.filter((_, i) => i !== index))
    const updateOption = (index: number, value: string) => {
        const newOptions = [...options]
        newOptions[index] = value
        setOptions(newOptions)
    }

    const addTag = () => setTags([...tags, ''])
    const removeTag = (index: number) => setTags(tags.filter((_, i) => i !== index))
    const updateTag = (index: number, value: string) => {
        const newTags = [...tags]
        newTags[index] = value
        setTags(newTags)
    }

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Create New Question</CardTitle>
            </CardHeader>
            <form action={formAction}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="subjectId">Subject</Label>
                        <Select name="subjectId" defaultValue="">
                            <SelectTrigger>
                                <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent>
                                {subjects.map((subject) => (
                                    <SelectItem key={subject.id} value={subject.id}>
                                        {subject.name} ({subject.examType})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {state.errors?.subjectId && (
                            <p className="text-sm text-red-500">{state.errors.subjectId}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="questionText">Question Text</Label>
                        <Textarea name="questionText" placeholder="Enter the question text" />
                        {state.errors?.questionText && (
                            <p className="text-sm text-red-500">{state.errors.questionText}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="explanation">Explanation (Optional)</Label>
                        <Textarea name="explanation" placeholder="Enter an explanation for the correct answer" />
                    </div>

                    <div className="space-y-2">
                        <Label>Options</Label>
                        {options.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <Input
                                    name="options"
                                    value={option}
                                    onChange={(e) => updateOption(index, e.target.value)}
                                    placeholder={`Option ${index + 1}`}
                                />
                                <Button type="button" variant="outline" onClick={() => removeOption(index)}>
                                    Remove
                                </Button>
                            </div>
                        ))}
                        <Button type="button" onClick={addOption}>Add Option</Button>
                        {state.errors?.options && (
                            <p className="text-sm text-red-500">{state.errors.options}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="correctAnswer">Correct Answer</Label>
                        <Select name="correctAnswer" defaultValue="">
                            <SelectTrigger>
                                <SelectValue placeholder="Select the correct answer" />
                            </SelectTrigger>
                            <SelectContent>
                                {options.map((_, index) => (
                                    <SelectItem key={index} value={index.toString()}>Option {index + 1}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {state.errors?.correctAnswer && (
                            <p className="text-sm text-red-500">{state.errors.correctAnswer}</p>
                        )}
                    </div>

                    <div className="space-y-2">
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
                        {state.errors?.difficulty && (
                            <p className="text-sm text-red-500">{state.errors.difficulty}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue="draft">
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                        </Select>
                        {state.errors?.status && (
                            <p className="text-sm text-red-500">{state.errors.status}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Tags</Label>
                        {tags.map((tag, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <Input
                                    name="tags"
                                    value={tag}
                                    onChange={(e) => updateTag(index, e.target.value)}
                                    placeholder={`Tag ${index + 1}`}
                                />
                                <Button type="button" variant="outline" onClick={() => removeTag(index)}>
                                    Remove
                                </Button>
                            </div>
                        ))}
                        <Button type="button" onClick={addTag}>Add Tag</Button>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="metadata">Metadata (JSON)</Label>
                        <Textarea name="metadata" placeholder="Enter metadata as JSON" />
                        {state.errors?.metadata && (
                            <p className="text-sm text-red-500">{state.errors.metadata}</p>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={pending}>
                        {pending ? 'Creating...' : 'Create Question'}
                    </Button>
                </CardFooter>
            </form>
            {state.message && (
                <p className={`mt-4 text-center ${state.errors ? 'text-red-500' : 'text-green-500'}`}>
                    {state.message}
                </p>
            )}
        </Card>
    )
}
