import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const subjects = [
    { name: "Math", progress: 75 },
    { name: "Science", progress: 60 },
    { name: "English", progress: 90 },
    { name: "History", progress: 45 },
]

export function ProgressSection() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Progress</CardTitle>
                <CardDescription>Track your improvement across subjects</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {subjects.map((subject) => (
                        <div key={subject.name} className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span>{subject.name}</span>
                                <span className="text-gray-500">{subject.progress}%</span>
                            </div>
                            <Progress value={subject.progress} className="h-2" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

