"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
    { subject: "Math", score: 80 },
    { subject: "Science", score: 75 },
    { subject: "English", score: 90 },
    { subject: "History", score: 85 },
    { subject: "Geography", score: 70 },
]

export function AnalyticsSection() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Your score distribution across subjects</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <XAxis dataKey="subject" />
                        <YAxis />
                        <Bar dataKey="score" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

