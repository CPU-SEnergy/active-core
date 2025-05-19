"use client";

import type * as React from "react";
import { useState } from "react";
import { BarChart2, MessageSquare, Users, LogOut } from "lucide-react";
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
import { usePathname, useRouter } from "next/navigation";
import LogoutButton from "./LogoutButton";
import { useAuth } from "@/auth/AuthProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
    roles: ["admin", "cashier"],
  },
  {
    title: "Sales",
    icon: BarChart2,
    href: "/admin/sales",
    roles: ["admin"],
  },
  {
    title: "Active Customer",
    icon: Users,
    href: "/admin/active-customer",
    roles: ["admin", "cashier"],
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
    roles: ["admin", "cashier"],
  },
  {
    title: "Messages",
    icon: MessageSquare,
    href: "/admin/messages",
    roles: ["admin", "cashier"],
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
    roles: ["admin", "cashier"],
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
    roles: ["admin"],
  },
  {
    title: "Add Cashier",
    icon: Users,
    href: "/admin/cashier",
    roles: ["admin"],
  },
];

export default function AdminSidebar({ role }: { role: "admin" | "cashier" }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(role)
  );

  const LogoutButtonWrapper = () => {
    return (
      <div className="hidden">
        <LogoutButton user={user} />
      </div>
    );
  };

  const handleLogout = () => {
    const logoutBtn = document.querySelector('button[class*="bg-red-600"]');
    if (logoutBtn && user) {
      (logoutBtn as HTMLButtonElement).click();
    }
    setShowLogoutModal(false);
  };

  const handleLoginOrLogout = () => {
    if (user) {
      setShowLogoutModal(true);
    } else {
      router.push("/auth/login");
    }
  };

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
            {filteredMenuItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`relative h-11 gap-3 px-3 hover:bg-gray-100 hover:text-black [&>svg]:h-5 [&>svg]:w-5 ${
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
              {/* Keep the original LogoutButton for functionality but hidden */}
              <LogoutButtonWrapper />

              {/* Create a visually consistent logout button */}
              <SidebarMenuButton
                className="relative h-11 gap-3 px-3 hover:bg-gray-100 hover:text-black [&>svg]:h-5 [&>svg]:w-5"
                onClick={handleLoginOrLogout}
              >
                <LogOut />
                <span>{user ? "Logout" : "Login"}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </Sidebar>
      <div className="flex-1"></div>

      {/* Logout Confirmation Modal */}
      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out of your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setShowLogoutModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
