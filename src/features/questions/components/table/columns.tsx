"use client"

import { QuestionType } from '@/features/questions/schemas/questions'
import { ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from '@/features/questions/components/table/column-header'
import { Button } from "@/components/ui/button"
import { Checkbox } from '@/components/ui/checkbox'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import Link from 'next/link'

export const columns: ColumnDef<QuestionType>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'questionText',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Question" />
        )
    },
    {
        accessorKey: 'subjectId',
        cell: ({ row }) => <div>{row.original.subject.name}</div>,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Subject" />
        )
    },
    {
        accessorKey: 'difficulty',
        cell: ({ row }) => <div>{row.original.difficulty}</div>,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Difficulty" />
        )
    },
    {
        accessorKey: 'status',
        cell: ({ row }) => <div>{row.original.status}</div>,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        )
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const question = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <Link href={`/admin/questions/${question.id}/edit`}>
                            <DropdownMenuItem>
                                Edit
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]