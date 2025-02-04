import { Input } from "@/components/ui/input"
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useFormContext } from "react-hook-form"

interface TextInputProps {
    label: string
    name: string
    placeholder?: string
    description?: string
    required?: boolean
    className?: string
}

export function TextInput({
    label,
    name,
    placeholder,
    description,
    required = false,
    className = ""
}: TextInputProps) {
    const form = useFormContext()

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input
                            placeholder={placeholder}
                            {...field}
                            className={className}
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