"use client";
import AdminSidebar from '@/components/AdminSidebar';
import {
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";


function CustomTrigger() {
  const { toggleSidebar } = useSidebar();
  return (
    <button onClick={toggleSidebar} className="custom-trigger-button m-2" >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          d="M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6Z"
        />
        <path stroke="currentColor" strokeWidth="2" d="M12 3V21" />
        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M7 8H9M7 12H9M7 16H9M7" />
      </svg>
    </button>
  );
}


export default function Layout({ children }: { children: React.ReactNode }) {
    
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className='w-full h-full'>
        <CustomTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
