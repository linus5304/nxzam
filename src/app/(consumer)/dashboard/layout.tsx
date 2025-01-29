import { SidebarInset } from "@/components/ui/sidebar";

import { DashboardHeader } from "@/app/(consumer)/_components/dashboard/header";
import { DashboardSidebar } from "@/app/(consumer)/_components/dashboard/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

    return (

        <SidebarProvider>
            <DashboardSidebar />
            <SidebarInset>
                <DashboardHeader />
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}