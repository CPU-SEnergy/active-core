"use client"

import type * as React from "react"
import { useState } from "react"
import { BarChart2, MessageSquare, Settings, Users } from "lucide-react"
import Image from "next/image"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Overview",
    icon: (props: React.ComponentProps<"svg">) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
          d="M10 3H3v7h7V3zM21 3h-7v7h7V3zM21 14h-7v7h7v-7zM10 14H3v7h7v-7z"
        />
      </svg>
    ),
  },
  {
    title: "Sales",
    icon: BarChart2,
  },
  {
    title: "Active Customer",
    icon: Users,
  },
  {
    title: "Inactive Customer",
    icon: (props: React.ComponentProps<"svg">) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
          d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9.2 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM18 8l4 4M22 8l-4 4"
        />
      </svg>
    ),
  },
  {
    title: "Messages",
    icon: MessageSquare,
  },
  {
    title: "Add Customer",
    icon: (props: React.ComponentProps<"svg">) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
          d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9.2 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 8v6M17 11h6"
        />
      </svg>
    ),
  },
  {
    title: "Add Product",
    icon: (props: React.ComponentProps<"svg">) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
          d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"
        />
      </svg>
    ),
  },
  {
    title: "View Products",
    icon: (props: React.ComponentProps<"svg">) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
          d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5h6M9 12h6M9 16h6"
        />
      </svg>
    ),
  },
  {
    title: "Add Cashier",
    icon: Users,
  },
]

export default function AdminSidebar() {
  const [activeItem, setActiveItem] = useState("Overview")

  return (
      <>
        <div className="flex">
          <Sidebar className="w-60 border-r bg-white">
            <SidebarHeader className="h-16 border-b px-4">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="h-full w-full px-0 hover:bg-transparent hover:text-black">
                    <a href="/" className="flex items-center gap-2">
                      <Image
                        src="/sports-fitness-logo.svg"
                        alt="Sports and Fitness Logo"
                        className="h-8 w-8"
                        width={32}
                        height={32}
                      />
                      <span className="font-semibold">Sports and Fitness</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="py-5">
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`h-11 gap-3 px-3 hover:bg-white hover:text-black [&>svg]:h-5 [&>svg]:w-5 ${
                        activeItem === item.title
                          ? "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-black"
                          : ""
                      }`}
                      onClick={() => setActiveItem(item.title)}>
                      <a href="#">
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <div className="mt-auto px-2 pb-4">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="h-10 gap-3 px-3 hover:bg-indigo-50 hover:text-indigo-600 [&>svg]:h-5 [&>svg]:w-5"
                  >
                    <a href="#">
                      <Settings />
                      <span>Settings</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          </Sidebar>
          <div className="flex-1">
            {/* Your content goes here */}
          </div>
        </div>
        <SidebarTrigger className="fixed bottom-4 right-4 md:hidden" />
      </>
  )
}

