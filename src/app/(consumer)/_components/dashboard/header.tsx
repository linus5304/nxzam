"use client"

import { Bell, Search, Moon, Sun } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useClerk } from "@clerk/nextjs"

export function DashboardHeader() {
    const { setTheme, theme } = useTheme()
    const { user } = useClerk()

    return (
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-50">
            <div className="flex items-center gap-2 px-4 w-full">
                <div className="flex flex-1 justify-between">
                    <div className="flex items-center">
                        <Input type="search" placeholder="Search quizzes..." className="w-64 mr-4" />
                        <Button variant="outline">
                            <Search className="h-4 w-4 mr-2" />
                            Search
                        </Button>
                    </div>
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="mr-2"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        >
                            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="mr-2">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar>
                                        <AvatarImage src={user?.imageUrl} />
                                        <AvatarFallback>{user?.firstName?.charAt(0).toUpperCase()}{user?.lastName?.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuItem>Log out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    )
}

