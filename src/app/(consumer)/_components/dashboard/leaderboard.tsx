import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const leaderboardData = [
    { id: 1, name: "Alex Johnson", score: 1250, avatar: "/placeholder.svg?height=32&width=32" },
    { id: 2, name: "Sam Smith", score: 1100, avatar: "/placeholder.svg?height=32&width=32" },
    { id: 3, name: "Jamie Lee", score: 950, avatar: "/placeholder.svg?height=32&width=32" },
]

export function LeaderboardSection() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Leaderboard</CardTitle>
                <CardDescription>See how you rank among your peers</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {leaderboardData.map((user, index) => (
                        <div key={user.id} className="flex items-center space-x-4">
                            <div className="font-bold text-lg w-6">{index + 1}</div>
                            <Avatar>
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>
                                    {user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="font-semibold">{user.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{user.score} points</div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

