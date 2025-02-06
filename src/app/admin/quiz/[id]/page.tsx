import { QuizActions } from "@/features/quiz/components/quiz-actions";

export default function QuizPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold mb-6">Quiz</h1>
                <QuizActions />
            </div>
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div>Display quiz statistics here</div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
    )
}