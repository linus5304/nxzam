"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { DataTablePagination } from "@/features/questions/components/table/pagination"
import Link from "next/link"
import { useFormContext } from "react-hook-form"
import { QuestionType } from "../../schemas/questions"

interface DataTableProps {
    columns: ColumnDef<QuestionType>[]
    data: QuestionType[]
}

export function DataTable({
    columns,
    data,
}: DataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable<QuestionType>({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
    })

    const form = useFormContext()
    useEffect(() => {
        const questionIds = form.getValues("questionIds") as string[]
        console.log("questionIds", questionIds)
        if (questionIds.length > 0) {
            const newRowSelection = data.reduce((acc, row, index) => {
                if (questionIds.includes(row.id)) {
                    acc[index] = true
                }
                return acc
            }, {} as Record<number, boolean>)
            setRowSelection(newRowSelection)
        }
    }, [data])

    useEffect(() => {
        if (form) {
            const selectedQuestions = table.getSelectedRowModel().flatRows.map(row => row.original.id)
            form.setValue("questionIds", selectedQuestions, {
                shouldDirty: true,
                shouldValidate: true,
            })
        }
    }, [rowSelection])

    return (
        <>
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter questions..."
                    value={(table.getColumn("questionText")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("questionText")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <Button asChild className="ml-auto">
                    <Link href="/admin/questions/new">
                        Create Question
                    </Link>
                </Button>
            </div>
            <div className="rounded-md border mb-4">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </>

    )
}
