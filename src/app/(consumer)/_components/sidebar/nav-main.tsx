"use client"

import { type LucideIcon } from "lucide-react"

import {
  Collapsible
} from "@/components/ui/collapsible"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import Link from "next/link"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
          <SidebarMenuItem className="p-4">
            <SidebarMenuButton asChild tooltip={item.title} size="lg">
              <Link href={item.url}>
                <item.icon size={24} />
                <span className="text-lg">{item.title.toUpperCase()}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </Collapsible>
      ))}
    </SidebarMenu>
  )
}
