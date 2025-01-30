"use client";
import AdminSidebar from '@/components/AdminSidebar';
import {
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";


function CustomTrigger() {
    const { toggleSidebar } = useSidebar()
    return <button onClick={toggleSidebar}>Toggle Sidebar</button>
  }
export function Layout({ children }: { children: React.ReactNode }) {
    
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main>
        <CustomTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default Layout;


