'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { QuestionType } from '@/schemas/questions'
import { deleteQuestion, getQuestions } from '@/server/actions/questions'
import { SubjectType } from '@/schemas/subjects'
import { Difficulty, Status } from '@/lib/types'

type QuestionListProps = {
    initialQuestions: QuestionType[]
    subjects: SubjectType[]
}

export function QuestionList({ initialQuestions, subjects }: QuestionListProps) {
    const [questions, setQuestions] = useState<QuestionType[]>(initialQuestions)
    const [searchTerm, setSearchTerm] = useState('')
    const [subjectFilter, setSubjectFilter] = useState<string | undefined>(undefined)
    const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | undefined>(undefined)
    const [statusFilter, setStatusFilter] = useState<Status | undefined>(undefined)
    const router = useRouter()

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm) {
                const results = await getQuestions({ search: searchTerm })
                setQuestions(results)
            } else {
                const results = await getQuestions({ subjectId: subjectFilter, difficulty: difficultyFilter, status: statusFilter })
                setQuestions(results)
            }
        }, 300)

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm, subjectFilter, difficultyFilter, statusFilter])

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value)
    }

    const handleEdit = (id: string) => {
        router.push(`/questions/edit/${id}`)
    }

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            const success = await deleteQuestion(id)
            if (success) {
                setQuestions(questions.filter(q => q.id !== id))
            } else {
                alert('Failed to delete question. Please try again.')
            }
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex space-x-4">
                <Input
                    type="text"
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="max-w-sm"
                />
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {subjects.map((subject) => (
                            <SelectItem key={subject.id} value={subject.id}>
                                {subject.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={difficultyFilter} onValueChange={(value) => setDifficultyFilter(value as Difficulty)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Difficulties</SelectItem>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as Status)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Question</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {questions.map((question) => (
                        <TableRow key={question.id}>
                            <TableCell>{question.questionText}</TableCell>
                            <TableCell>{question.subject.name}</TableCell>
                            <TableCell>{question.difficulty}</TableCell>
                            <TableCell>{question.status}</TableCell>
                            <TableCell>
                                <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(question.id)}>
                                    Edit
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(question.id)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

