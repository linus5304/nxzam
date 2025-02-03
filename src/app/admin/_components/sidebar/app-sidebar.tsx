"use client"

import {
  SquareTerminal
} from "lucide-react"
import * as React from "react"

import { NavMain } from "@/app/admin/_components/sidebar/nav-main"
import { NavUser } from "@/app/admin/_components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import { Icons } from "@/lib/icons"
import Link from "next/link"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Questions",
      url: "/admin/questions",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Under Review",
          url: "/admin/questions/under-review",
        },
        {
          title: "Verified",
          url: "/admin/questions/verified",
        },
      ],
    },
    {
      title: "Quizzes",
      url: "/admin/quiz",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Under Review",
          url: "/admin/quizzes/under-review",
        },
        {
          title: "Verified",
          url: "/admin/quizzes/verified",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-center items-center py-2">
            <Link href="/admin">
              <Icons.LogoDark size={140} />
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
