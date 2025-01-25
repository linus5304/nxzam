import * as React from "react"
import { Input } from "./input"
import { cn } from "@/lib/utils"

export interface NumberInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    onChange?: (value: number | undefined) => void
    min?: number
    max?: number
    allowDecimals?: boolean
    className?: string
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
    ({ className, onChange, min, max, allowDecimals = false, ...props }, ref) => {
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

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value

            if (value === '') {
                onChange?.(undefined)
                return
            }

            const numberValue = allowDecimals ? parseFloat(value) : parseInt(value)

            if (isNaN(numberValue)) {
                return
            }

            if (min !== undefined && numberValue < min) {
                onChange?.(min)
                return
            }

            if (max !== undefined && numberValue > max) {
                onChange?.(max)
                return
            }

            onChange?.(numberValue)
        }

        return (
            <Input
                {...props}
                ref={ref}
                type="number"
                min={min}
                max={max}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className={cn("font-mono", className)}
            />
        )
    }
)

NumberInput.displayName = "NumberInput"

export { NumberInput } 