import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"

export function CalendarSection() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Study Calendar</CardTitle>
                <CardDescription>Schedule your study sessions and exams</CardDescription>
            </CardHeader>
            <CardContent>
                <Calendar />
            </CardContent>
        </Card>
    )
}

