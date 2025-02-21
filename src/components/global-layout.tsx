import { ChevronLeft } from "lucide-react";
import { Outlet } from "react-router-dom";

import AppSidebar from "./app-sidebar";
import ChatBot from "./chat-bot";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { SidebarProvider } from "./ui/sidebar";

const GlobalLayout = () => {
  return (
    <SidebarProvider>
      <Sheet>
        <SheetTrigger asChild>
          <div className="absolute bottom-24 right-0 z-50 flex w-fit cursor-pointer items-center justify-center gap-2.5 rounded-l-lg bg-gradient-to-r from-primary to-primary/65 p-2.5 text-white">
            <ChevronLeft className="size-5" /> Chat
          </div>
        </SheetTrigger>
        <SheetContent className="flex h-full w-full flex-col items-start justify-start p-0">
          <ChatBot />
        </SheetContent>
      </Sheet>
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
