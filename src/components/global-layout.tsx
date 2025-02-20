import { Outlet } from "react-router-dom";

import AppSidebar from "./app-sidebar";
import { ThemeProvider } from "./theme-provider";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";

const GlobalLayout = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SidebarProvider>
        <div className="flex h-screen w-full items-center justify-center">
          <AppSidebar />
          <div className="flex h-full flex-1 flex-col items-start justify-start transition-[width]">
            <div className="flex h-10 w-full items-start justify-start lg:hidden">
              <SidebarTrigger className="h-full" />
            </div>
            <div className="flex h-[calc(100vh-100px)] w-full items-start justify-start bg-background p-5 dark:bg-black md:mt-0 lg:h-[calc(100vh)]">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default GlobalLayout;
