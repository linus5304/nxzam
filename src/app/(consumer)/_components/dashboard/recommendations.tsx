import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const recommendations = [
    { id: 1, title: "Improve your Algebra skills", description: "Based on your recent quiz results" },
    { id: 2, title: "Try a History challenge", description: "You haven't taken a History quiz recently" },
    { id: 3, title: "Science quiz streak", description: "Keep your daily streak going!" },
]

export function RecommendationsSection() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
                <CardDescription>Personalized suggestions to boost your learning</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recommendations.map((rec) => (
                        <div key={rec.id} className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold">{rec.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                            <Button variant="link" className="mt-2 p-0">
                                Learn more
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

