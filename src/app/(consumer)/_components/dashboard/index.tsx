import { DashboardHeader } from "@/app/(consumer)/_components/dashboard/header"
import { DashboardSidebar } from "@/app/(consumer)/_components/dashboard/sidebar"
import { QuizSection } from "@/app/(consumer)/_components/dashboard/quiz"
import { ProgressSection } from "@/app/(consumer)/_components/dashboard/progress"
import { RecommendationsSection } from "@/app/(consumer)/_components/dashboard/recommendations"
import { CalendarSection } from "@/app/(consumer)/_components/dashboard/calendar"
import { LeaderboardSection } from "@/app/(consumer)/_components/dashboard/leaderboard"
import { AnalyticsSection } from "@/app/(consumer)/_components/dashboard/analytics"

export default function DashboardPage() {
    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
                <div className="container mx-auto px-6 py-8">
                    <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Welcome back, Alex!</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <QuizSection />
                        <div className="space-y-6">
                            <ProgressSection />
                            <CalendarSection />
                        </div>
                        <div className="space-y-6">
                            <RecommendationsSection />
                            <LeaderboardSection />
                        </div>
                    </div>
                    <div className="mt-6">
                        <AnalyticsSection />
                    </div>
                </div>
            </main>
        </div>
    )
}

