"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function Combobox({
    options,
    value: controlledValue,
    placeholder,
    onChange
}: {
    options: { value: string, label: string }[],
    value: string,
    placeholder: string,
    onChange: (value: string) => void
}) {
    const [open, setOpen] = React.useState(false)
    const [initialValue, setInitialValue] = React.useState("")

    const isControlled = controlledValue !== undefined
    const currentValue = isControlled ? controlledValue : initialValue

    function handleChange(value: string) {
        const newValue = value === currentValue ? "" : value
        if (isControlled) {
            onChange(newValue)
        } else {
            setInitialValue(newValue)
            onChange(newValue)
        }
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {currentValue
                        ? options.find((option) => option.value === currentValue)?.label
                        : `Select ${placeholder}...`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder={`Search ${placeholder}...`} />
                    <CommandList>
                        <CommandEmpty>No {placeholder} found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={() => {
                                        handleChange(option.value)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            currentValue === option.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
