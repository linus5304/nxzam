import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, FileQuestion, GraduationCap, Trophy } from "lucide-react"

export function QuizCard({
    quiz,
}: {
    quiz: {
        id: string
        title: string
        description: string
        subjectId: string
        createdBy: string
        difficulty: string
        durationMinutes: number
        isPublished: boolean
        topics: string[]
        totalQuestions: number
        passingScore: number
    }
}) {
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>{quiz.title}</span>
                    <Badge variant={quiz.isPublished ? "default" : "secondary"}>{quiz.isPublished ? "Published" : "Draft"}</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{quiz.description}</p>
                <div className="flex flex-wrap gap-2">
                    {quiz.topics.map((topic, index) => (
                        <Badge key={index} variant="outline">
                            {topic}
                        </Badge>
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span>Difficulty: {quiz.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{quiz.durationMinutes} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FileQuestion className="h-4 w-4 text-muted-foreground" />
                        <span>{quiz.totalQuestions} questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                        <span>Pass: {quiz.passingScore}%</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">Created by: {quiz.createdBy}</CardFooter>
        </Card>
    )
}

