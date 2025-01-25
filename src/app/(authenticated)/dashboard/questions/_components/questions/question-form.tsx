'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { NumberInput } from "@/components/ui/number-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { QuestionFormData, questionFormSchema } from '@/schemas/questions'
import { createQuestion, updateQuestion } from '@/server/actions/questions'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface QuestionFormProps {
    subjects: { id: string, name: string, examType: "gce_ol" | "gce_al" }[]
    id?: string
    question?: QuestionFormData & { id: string }
}

const initialState: QuestionFormData = {
    subjectId: '',
    questionText: '',
    explanation: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    difficulty: 'medium',
    status: 'draft',
    tags: [''],
    metadata: '',
}


export function QuestionForm({ subjects, question }: QuestionFormProps) {
    const form = useForm<z.infer<typeof questionFormSchema>>({
        resolver: zodResolver(questionFormSchema),
        defaultValues: question ?? initialState,
    })

    async function onSubmit(values: z.infer<typeof questionFormSchema>) {
        const action = question == null ? createQuestion : updateQuestion.bind(null, question.id)
        const data = await action(values)
        console.log(data)
        if (data.error) {
            toast.error(data.message)
        } else {
            toast.success(data.message)
            form.reset(initialState)
        }
    }

    const tags = form.watch('tags')

    const addTag = () => {
        const newTags = [...tags, '']
        form.setValue('tags', newTags)
    }
    const removeTag = (index: number) => {
        const newTags = tags.filter((_, i) => i !== index)
        form.setValue('tags', newTags)
    }
    const updateTag = (index: number, value: string) => {
        const newTags = [...tags]
        newTags[index] = value
        form.setValue('tags', newTags)
    }

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Create New Question</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="subjectId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="subjectId">Subject</FormLabel>
                                    <Select name="subjectId" onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a subject" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {subjects.map((subject) => (
                                                <SelectItem key={subject.id} value={subject.id}>
                                                    {subject.name} ({subject.examType})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="questionText"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Question Text</FormLabel>
                                    <Textarea placeholder="Enter the question text" {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="explanation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Explanation (Optional)</FormLabel>
                                    <Textarea placeholder="Enter an explanation for the correct answer" {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="options"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Options</FormLabel>
                                    {field.value.map((option, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <Input
                                                value={option}
                                                onChange={(e) => {
                                                    const newOptions = [...field.value]
                                                    newOptions[index] = e.target.value
                                                    form.setValue('options', newOptions)
                                                }}
                                                placeholder={`Option ${index + 1}`}
                                            />
                                        </div>
                                    ))}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="correctAnswer"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Correct Answer</FormLabel>
                                    <FormControl>
                                        <NumberInput
                                            min={0}
                                            max={form.getValues('options').length - 1}
                                            value={field.value}
                                            onChange={(value) => field.onChange(value ?? 0)}
                                            placeholder="Enter option number (0-based)"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Enter a number between 0 and {form.getValues('options').length - 1} to select the correct option
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="difficulty"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Difficulty</FormLabel>
                                    <Select name="difficulty" onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select difficulty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="easy">Easy</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="hard">Hard</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select name="status" onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    {tags.map((tag, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <Input
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
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="metadata"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Metadata (JSON)</FormLabel>
                                    <Textarea placeholder="Enter metadata as JSON" {...field} />
                                    <FormDescription>Metadata is used to store additional information about the question. It is stored as a JSON string.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Creating...' : 'Create Question'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
