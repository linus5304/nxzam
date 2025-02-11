import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    FormControl,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

interface QuizQuestionDisplayProps {
    question: {
        id: string
        questionText: string
        explanation?: string
        options: {
            id: string
            text: string
            isCorrect: boolean
        }[]
    }
    selectedOptionId?: string
    isReadOnly?: boolean
    showCorrectAnswer?: boolean
    onOptionSelect?: (optionId: string) => void
}

export function QuizQuestionDisplay({
    question,
    selectedOptionId,
    isReadOnly = false,
    showCorrectAnswer = false,
    onOptionSelect
}: QuizQuestionDisplayProps) {
    const isCorrect = question.options.find(opt => opt.id === selectedOptionId)?.isCorrect
    const correctOption = question.options.find(opt => opt.isCorrect)

    return (
        <div className="w-full">
            <FormItem className="flex flex-col space-y-4">
                <FormLabel className="leading-6">
                    <span className="font-medium">{question.questionText}</span>
                </FormLabel>
                <FormControl>
                    <RadioGroup
                        value={selectedOptionId}
                        onValueChange={isReadOnly ? undefined : onOptionSelect}
                        className="flex flex-col space-y-2"
                        disabled={isReadOnly}
                    >
                        {question.options.map((option) => {
                            const isSelected = option.id === selectedOptionId
                            const isCorrectOption = option.isCorrect && showCorrectAnswer

                            return (
                                <FormItem
                                    key={option.id}
                                    className="flex items-center space-x-3 space-y-0"
                                >
                                    <FormControl>
                                        <RadioGroupItem
                                            value={option.id}
                                            className="peer sr-only"
                                        />
                                    </FormControl>
                                    <FormLabel
                                        className={cn(
                                            "flex flex-col items-center justify-between",
                                            "rounded-md border-2 p-4 w-full",
                                            "transition-colors duration-200",
                                            !isReadOnly && "cursor-pointer hover:bg-accent hover:text-accent-foreground",
                                            isReadOnly && "cursor-default",
                                            isSelected && !showCorrectAnswer && "border-primary",
                                            showCorrectAnswer && isSelected && isCorrect && "border-green-500 bg-green-50",
                                            showCorrectAnswer && isSelected && !isCorrect && "border-red-500 bg-red-50",
                                            showCorrectAnswer && isCorrectOption && "border-green-500 bg-green-50",
                                            "peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                        )}
                                    >
                                        {option.text}
                                    </FormLabel>
                                </FormItem>
                            )
                        })}
                    </RadioGroup>
                </FormControl>

                {showCorrectAnswer && question.explanation && (
                    <Alert className="mt-4">
                        <AlertDescription>
                            {question.explanation}
                        </AlertDescription>
                    </Alert>
                )}

                {showCorrectAnswer && selectedOptionId && !isCorrect && (
                    <Alert variant="destructive" className="mt-2">
                        <AlertDescription>
                            The correct answer was: {correctOption?.text}
                        </AlertDescription>
                    </Alert>
                )}
            </FormItem>
        </div>
    )
}