import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/lib/icons";
import { QuizSidebar } from "@/app/admin/_components/sidebar/quiz-sidebar";
import { QuestionsSidebar } from "@/app/admin/_components/sidebar/question-sidebar";
import { AppSidebar } from "./_components/sidebar/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

    return (
        <>
            <header className="container mx-auto flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
                <div className="flex items-center gap-2 px-4">
                    <Icons.LogoDark size={140} />
                </div>
                <div className="flex items-center gap-2 px-4">
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <DynamicBreadcrumb />
                </div>
            </header>
            <div className="container mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-3 lg:col-span-2">
                    <AppSidebar />
                    <QuizSidebar />
                    <QuestionsSidebar />
                </div>
                <div className="col-span-12 md:col-span-9 lg:col-span-10">
                    {children}
                </div>
            </div>
        </>
    )
}