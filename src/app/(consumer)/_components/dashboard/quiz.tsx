import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const officialExams = [
    { id: 1, title: "Midterm Math Exam", subject: "Math", date: "2023-05-15", questions: 50 },
    { id: 2, title: "Final History Exam", subject: "History", date: "2023-06-10", questions: 75 },
]

const practiceQuizzes = [
    { id: 1, title: "Algebra Basics", subject: "Math", difficulty: "Easy", questions: 10 },
    { id: 2, title: "World War II", subject: "History", difficulty: "Medium", questions: 15 },
    { id: 3, title: "Chemical Reactions", subject: "Chemistry", difficulty: "Hard", questions: 20 },
]

export function QuizSection() {
    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Exams and Quizzes</CardTitle>
                <CardDescription>Prepare for official exams or practice with quizzes</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="official" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="official">Official Exams</TabsTrigger>
                        <TabsTrigger value="practice">Practice Quizzes</TabsTrigger>
                    </TabsList>
                    <TabsContent value="official">
                        <div className="space-y-4">
                            {officialExams.map((exam) => (
                                <div
                                    key={exam.id}
                                    className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
                                >
                                    <div>
                                        <h3 className="font-semibold">{exam.title}</h3>
                                        <div className="flex space-x-2 mt-1">
                                            <Badge>{exam.subject}</Badge>
                                            <Badge variant="outline">{exam.date}</Badge>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{exam.questions} questions</p>
                                    </div>
                                    <Button>Start Exam</Button>
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="practice">
                        <div className="space-y-4">
                            {practiceQuizzes.map((quiz) => (
                                <div
                                    key={quiz.id}
                                    className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
                                >
                                    <div>
                                        <h3 className="font-semibold">{quiz.title}</h3>
                                        <div className="flex space-x-2 mt-1">
                                            <Badge>{quiz.subject}</Badge>
                                            <Badge variant="outline">{quiz.difficulty}</Badge>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{quiz.questions} questions</p>
                                    </div>
                                    <Button>Start Quiz</Button>
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

