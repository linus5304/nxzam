import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import { useFormContext } from "react-hook-form"

interface NumberInputProps {
    label: string
    name: string
    min?: number
    max?: number
    allowDecimals?: boolean
    placeholder?: string
    description?: string
    required?: boolean
    className?: string
    defaultValue?: number
}

export function NumberInput({
    label,
    name,
    min,
    max,
    allowDecimals = false,
    placeholder,
    description,
    required = false,
    className,
    defaultValue,
}: NumberInputProps) {
    const form = useFormContext()

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        // Allow: backspace, delete, tab, escape, enter, decimal point
        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight']
        if (allowDecimals) allowedKeys.push('.')

        if (
            // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (event.ctrlKey === true && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) ||
            // Allow: home, end, left, right
            allowedKeys.includes(event.key) ||
            // Allow: numbers
            /^\d$/.test(event.key)
        ) {
            // Valid key pressed
            if (event.key === '.' && !allowDecimals) {
                event.preventDefault()
            }
            return
        }

        // Prevent other keys
        event.preventDefault()
    }

    return (
        <FormField
            control={form.control}
            name={name}
            rules={{
                required: required ? "This field is required" : false,
                min: min !== undefined ? {
                    value: min,
                    message: `Minimum value is ${min}`
                } : undefined,
                max: max !== undefined ? {
                    value: max,
                    message: `Maximum value is ${max}`
                } : undefined,
                validate: (value) => {
                    if (value === '') return true
                    const num = allowDecimals ? parseFloat(value) : parseInt(value)
                    if (isNaN(num)) return "Please enter a valid number"
                    return true
                }
            }}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            type="number"
                            defaultValue={defaultValue}
                            min={min}
                            max={max}
                            placeholder={placeholder}
                            onKeyDown={handleKeyDown}
                            className={cn("font-mono", className)}
                            onChange={(event) => {
                                const value = event.target.value
                                if (value === '') {
                                    field.onChange(undefined)
                                    return
                                }

                                const numberValue = allowDecimals ?
                                    parseFloat(value) :
                                    parseInt(value)

                                if (isNaN(numberValue)) {
                                    return
                                }

                                if (min !== undefined && numberValue < min) {
                                    field.onChange(min)
                                    return
                                }

                                if (max !== undefined && numberValue > max) {
                                    field.onChange(max)
                                    return
                                }

                                field.onChange(numberValue)
                            }}
                        />
                    </FormControl>
                    {description && (
                        <FormDescription>{description}</FormDescription>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}