import { useState } from "react";

import { Bell } from "lucide-react";

import Logo from "@/assets/img/logo.svg";

import { ModeToggle } from "./mode-toggle";
import { SidebarTrigger } from "./ui/sidebar";

const Navbar = () => {
  const [logo, setLogo] = useState(false);
  return (
    <nav className="sticky inset-x-0 top-0 z-[1] h-16 w-full border-b bg-gray-100 transition-all dark:bg-gray-900">
      <div className="flex h-16 w-full items-center justify-between px-5">
        <div onClick={() => setLogo(!logo)} className="flex items-center">
          {logo && <img src={Logo} alt="" className="size-32 dark:invert" />}
          <SidebarTrigger />
        </div>

        <div className="flex h-full items-center space-x-4">
          <div className="rounded-full border border-gray-400 p-2">
            <Bell className="h-6 w-6" fill="" />
          </div>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
