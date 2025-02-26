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

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "@/features/questions/components/table/pagination"
import Link from "next/link"
import { useEffect, useState } from "react"
import { QuestionType } from "../../schemas/questions"
import { useFormContext } from "react-hook-form"

interface DataTableProps {
    columns: ColumnDef<QuestionType>[]
    data: QuestionType[]
    embedded?: boolean
}

export function DataTable({
    columns,
    data,
    embedded = false,
}: DataTableProps) {
    "use no memo"

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

    const form = useFormContext()

    const table = useReactTable<QuestionType>({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: (updateOrValue) => {
            const newRowSelection = typeof updateOrValue === 'function' ? updateOrValue(rowSelection) : updateOrValue
            setRowSelection(newRowSelection)
            const selectedQuestionsIds = Object.keys(newRowSelection)
                .filter(key => newRowSelection[key])
                .map(key => data[parseInt(key)].id)
            form.setValue("questionIds", selectedQuestionsIds, {
                shouldDirty: true,
                shouldTouch: true,
            })
        },
        enableRowSelection: true,
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
    })

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
                {!embedded && (
                    <Button asChild className="ml-auto">
                        <Link href="/admin/questions/new">
                            Create Question
                        </Link>
                    </Button>
                )}
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
