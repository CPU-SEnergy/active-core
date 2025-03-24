"use client";

import type * as React from "react";
import { BarChart2, MessageSquare, Settings, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

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
    href: "/admin",
  },
  {
    title: "Sales",
    icon: BarChart2,
    href: "/admin/sales",
  },
  {
    title: "Active Customer",
    icon: Users,
    href: "/admin/active-customer",
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
    href: "/admin/inactive-customer",
  },
  {
    title: "Messages",
    icon: MessageSquare,
    href: "/admin/messages",
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
    href: "/admin/add-customer",
  },
  {
    title: "Add Products and Services",
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
    href: "/admin/add-products-and-services",
  },
  {
    title: "Add Cashier",
    icon: Users,
    href: "/admin/cashier",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex">
      <Sidebar className="w-60 border-r bg-white">
        <SidebarHeader className="h-16 border-b px-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="h-full w-full px-0 hover:bg-transparent hover:text-black"
              >
                <Link href="/admin" className="flex items-center gap-2">
                  <Image
                    src="/sports-fitness-logo.svg"
                    alt="Sports and Fitness Logo"
                    className="h-8 w-8"
                    width={32}
                    height={32}
                  />
                  <span className="font-semibold">Sports and Fitness</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="py-5">
          <SidebarMenu>
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`h-11 gap-3 px-3 hover:bg-gray-100 hover:text-black [&>svg]:h-5 [&>svg]:w-5 ${
                      isActive
                        ? "bg-gray-200 text-black before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-black"
                        : ""
                    }`}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <div className="mt-auto px-2 pb-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={`h-10 gap-3 px-3 hover:bg-gray-100 hover:text-black [&>svg]:h-5 [&>svg]:w-5 ${
                  pathname === "/admin/settings" ? "bg-gray-200 text-black" : ""
                }`}
              >
                <Link href="/admin/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </Sidebar>
      <div className="flex-1"></div>
    </div>
  );
}
