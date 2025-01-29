"use client"

import {
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  SquareTerminal
} from "lucide-react"
import * as React from "react"

import { NavMain } from "@/app/admin/_components/sidebar/nav-main"
import { NavSecondary } from "@/app/admin/_components/sidebar/nav-secondary"
import { NavUser } from "@/app/admin/_components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Icons } from "@/lib/icons"
import { NavOthers } from "./nav-others"
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
      url: "/dashboard/questions",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Under Review",
          url: "/dashboard/questions/under-review",
        },
        {
          title: "Verified",
          url: "/dashboard/questions/verified",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  others: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
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
        <NavOthers items={data.others} className="mt-auto" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
