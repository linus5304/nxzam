import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"

interface TagInputProps {
    label: string
    name: string
    placeholder?: string
    description?: string
    required?: boolean
    className?: string
}

export function TagInput({
    label,
    name,
    placeholder,
    description,
    required = false,
    className = "",
}: TagInputProps) {
    const form = useFormContext()
    const [inputValue, setInputValue] = useState("")

    const tags = form.watch(name) || []

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            const newTag = inputValue.trim()

            if (newTag && !tags.includes(newTag)) {
                form.setValue(name, [...tags, newTag])
                setInputValue("")
            }
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            // Remove the last tag when backspace is pressed on empty input
            form.setValue(name, tags.slice(0, -1))
        }
    }

    const removeTag = (tagToRemove: string) => {
        form.setValue(
            name,
            tags.filter((tag: string) => tag !== tagToRemove)
        )
    }

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                            {tags.map((tag: string, index: number) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="flex items-center gap-1 font-normal"
                                >
                                    {tag}
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() => removeTag(tag)}
                                    />
                                </Badge>
                            ))}
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={placeholder}
                                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 flex-1 min-w-[120px] bg-transparent shadow-none"
                            />
                        </div>
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