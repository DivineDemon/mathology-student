import { Outlet } from "react-router-dom";

import AppSidebar from "./app-sidebar";

import { SidebarProvider } from "./ui/sidebar";

const GlobalLayout = () => {


  return (
    <SidebarProvider>
      
      <div className="flex h-full w-full items-center justify-center">
        <AppSidebar />
        <div className="flex h-full flex-1 flex-col bg-gray-100 transition-[width] dark:bg-sidebar">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default GlobalLayout;
