'use client'

import { SelectInput } from '@/components/form/select-input'
import { TagInput } from '@/components/form/tag-input'
import { TextareaInput } from '@/components/form/text-input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { difficultyLevels, statuses } from '@/data/data'
import { createQuestion, updateQuestion } from '@/features/questions/actions/questions'
import { questionFormSchema } from '@/features/questions/schemas/questions'
import { zodResolver } from "@hookform/resolvers/zod"
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useFieldArray, useForm, useFormContext } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const initialState: z.infer<typeof questionFormSchema> = {
    subjectId: '',
    questionText: '',
    explanation: '',
    options: [
        { id: crypto.randomUUID(), text: '', isCorrect: false },
        { id: crypto.randomUUID(), text: '', isCorrect: false },
        { id: crypto.randomUUID(), text: '', isCorrect: false },
        { id: crypto.randomUUID(), text: '', isCorrect: false },
    ],
    correctAnswer: 0,
    difficulty: 'medium',
    status: 'draft',
    tags: [],
    metadata: '',
}


export function QuestionForm({ subjects, question }: {
    subjects: { id: string, name: string, examType: "gce_ol" | "gce_al" }[]
    question?: z.infer<typeof questionFormSchema> & { id: string }
}) {
    const router = useRouter()
    const form = useForm<z.infer<typeof questionFormSchema>>({
        resolver: zodResolver(questionFormSchema),
        defaultValues: question ?? initialState,
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'options' as never
    })

    async function onSubmit(values: z.infer<typeof questionFormSchema>) {
        const action = question == null ? createQuestion : updateQuestion.bind(null, question.id)
        const data = await action(values)
        if (data.error) {
            toast.error(data.message)
        } else {
            toast.success(data.message)
            !question ? form.reset(initialState) : router.push(`/admin/questions`)
        }
    }

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Create New Question</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <SelectInput
                            label="Subject"
                            name="subjectId"
                            options={subjects.map(subject => ({
                                id: subject.id,
                                label: `${subject.name} (${subject.examType})`,
                                value: subject.id
                            }))} />
                        <TextareaInput
                            label="Question Text"
                            name="questionText"
                            placeholder="Enter question text"
                        />
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Options</Label>
                                {fields.length < 6 && ( // Limit to max 6 options
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => append({
                                            id: crypto.randomUUID(),
                                            text: '',
                                            isCorrect: false
                                        })}
                                    >
                                        Add Option
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-3">
                                {fields.map((field, index) => (
                                    <QuestionOptionField
                                        key={field.id}
                                        index={index}
                                        remove={() => remove(index)}
                                        optionsLength={fields.length}
                                    />
                                ))}
                            </div>

                            {form.formState.errors.options && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.options.message}
                                </p>
                            )}
                        </div>
                        <TextareaInput
                            label="Explanation"
                            name="explanation"
                            placeholder="Enter explanation"
                        />
                        <SelectInput
                            label="Difficulty"
                            name="difficulty"
                            options={difficultyLevels.map(difficulty => ({
                                id: difficulty.id,
                                label: difficulty.label,
                                value: difficulty.value
                            }))} />

                        <SelectInput
                            label="Status"
                            name="status"
                            options={statuses.map(status => ({
                                id: status.id,
                                label: status.label,
                                value: status.value
                            }))} />

                        <TagInput
                            label="Tags"
                            name="tags"
                            placeholder="Type a tag and press Enter"
                            description="Press Enter or comma to add a tag"
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
                            {question ? 'Update Question' : 'Create Question'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}



const QuestionOptionField = ({
    index,
    remove,
    optionsLength
}: {
    index: number,
    remove: () => void,
    optionsLength: number
}) => {
    const form = useFormContext();

    return (
        <div className="flex items-center gap-3">
            <div className="flex-1">
                <Input
                    {...form.register(`options.${index}.text`)}
                    placeholder={`Option ${index + 1}`}
                />
            </div>

            <div className="flex items-center gap-2">
                <FormField
                    control={form.control}
                    name={`options.${index}.isCorrect`}
                    render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={(checked) => {
                                        // If this option is being marked as correct,
                                        // unmark other options
                                        if (checked) {
                                            const options = form.getValues('options');
                                            options.forEach((_: any, i: number) => {
                                                if (i !== index) {
                                                    form.setValue(
                                                        `options.${i}.isCorrect`,
                                                        false
                                                    );
                                                }
                                            });
                                        }
                                        field.onChange(checked);
                                    }}
                                />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                                Correct Answer
                            </FormLabel>
                        </FormItem>
                    )}
                />

                {optionsLength > 2 && ( // Prevent removing if only 2 options left
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={remove}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
};