import { Icons } from "@/lib/icons";
import { canAccessAdminPages } from "@/permissions/general";
import { getCurrentUser } from "@/services/clerk";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Sidebar } from "../_components/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-12 gap-4">
                <Sidebar />
                <div className="col-span-12 md:col-span-9 lg:col-span-10">
                    {children}
                </div>
            </div>
        </>
    )
}

async function Navbar() {
    return (
        <header className="container mx-auto flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
            <div className="flex justify-between w-full">
                <div className="flex items-center gap-2 px-4">
                    <Link href="/dashboard">
                        <Icons.LogoDark className="w-50 h-50" />
                    </Link>
                </div>
                <div className="flex gap-2 px-4 items-center">
                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: "w-10 h-10",
                            },
                        }}
                    />
                    <AdminLink />
                </div>
            </div>
        </header>
    )
}

async function AdminLink() {
    const user = await getCurrentUser()
    if (!canAccessAdminPages({ role: user.role })) {
        return null
    }
    return <Link href="/admin">Admin</Link>
}