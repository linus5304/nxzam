import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react"

export function QuizResults({
    questions,
    answers
}: {
    questions: Array<{
        id: string
        questionText: string
        explanation?: string
        options: Array<{
            id: string
            text: string
            isCorrect: boolean
        }>
    }>
    answers: Record<string, string>
}) {
    const calculateScore = () => {
        let correct = 0
        questions.forEach(question => {
            const selectedOption = question.options.find(opt => opt.id === answers[question.id])
            if (selectedOption?.isCorrect) correct++
        })
        return {
            correct,
            total: questions.length,
            percentage: Math.round((correct / questions.length) * 100)
        }
    }

    const score = calculateScore()

    return (
        <div className="w-full mx-auto max-w-2xl space-y-8">
            <div className="p-6 bg-card rounded-lg border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Quiz Results</h2>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-primary">
                            {score.percentage}%
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {score.correct} out of {score.total} correct
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                    <Stat
                        label="Correct"
                        value={score.correct}
                        icon={<CheckCircle2 className="w-4 h-4 text-green-500" />}
                    />
                    <Stat
                        label="Incorrect"
                        value={score.total - score.correct}
                        icon={<XCircle className="w-4 h-4 text-red-500" />}
                    />
                    <Stat
                        label="Score"
                        value={`${score.percentage}%`}
                        icon={<AlertCircle className="w-4 h-4 text-primary" />}
                    />
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-lg font-semibold">Detailed Review</h3>

                {questions.map((question, index) => {
                    const selectedOption = question.options.find(
                        opt => opt.id === answers[question.id]
                    )
                    const correctOption = question.options.find(opt => opt.isCorrect)
                    const isCorrect = selectedOption?.isCorrect

                    return (
                        <div
                            key={question.id}
                            className={cn(
                                "p-6 rounded-lg border",
                                "transition-colors duration-200",
                            )}
                        >
                            <p className="text-sm text-muted-foreground mb-1">
                                Question {index + 1}
                            </p>

                            <QuizQuestionResultDisplay
                                question={question}
                                selectedOptionId={answers[question.id]}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function Stat({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
    return (
        <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-1">
                {icon}
                <span className="font-semibold">{value}</span>
            </div>
            <p className="text-xs text-muted-foreground">{label}</p>
        </div>
    )
}


interface QuizQuestionResultDisplayProps {
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
}

export function QuizQuestionResultDisplay({
    question,
    selectedOptionId,
}: QuizQuestionResultDisplayProps) {
    const selectedOption = question.options.find(opt => opt.id === selectedOptionId)
    const correctOption = question.options.find(opt => opt.isCorrect)
    const isCorrect = selectedOption?.isCorrect

    return (
        <div className="w-full space-y-4">
            <div className="flex items-start gap-3">
                <div className="mt-1">
                    {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                    )}
                </div>
                <h4 className="font-medium">{question.questionText}</h4>
            </div>

            <div className="ml-8 space-y-2">
                {question.options.map((option) => {
                    const isSelected = option.id === selectedOptionId
                    const isCorrectOption = option.isCorrect

                    return (
                        <div
                            key={option.id}
                            className={cn(
                                "rounded-md border p-3",
                                "transition-colors duration-200",
                                isSelected && isCorrect && "border-green-500 bg-green-50",
                                isSelected && !isCorrect && "border-red-500 bg-red-50",
                                !isSelected && isCorrectOption && "border-green-500 bg-green-50",
                                !isSelected && !isCorrectOption && "border-foreground/20"
                            )}
                        >
                            {option.text}
                        </div>
                    )
                }
                )}


                {/* Explanation */}
                {question.explanation && (
                    <Alert>
                        <AlertDescription>
                            {question.explanation}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Show correct answer if wrong */}
                {selectedOptionId && !isCorrect && (
                    <Alert variant="destructive">
                        <AlertTitle>Explanation</AlertTitle>
                        <AlertDescription>
                            The correct answer was: {correctOption?.text}
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    )
}