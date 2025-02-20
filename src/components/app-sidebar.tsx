import { useEffect, useState } from "react";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { CirclePower } from "lucide-react";
// Add Bell import
import { useLocation, useNavigate } from "react-router-dom";

import Error from "@/assets/img/error.svg";
import Logo from "@/assets/img/logo.svg";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { items } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useGetUserQuery } from "@/store/services/auth";

const AppSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logout, getToken } = useKindeAuth();
  const [token, setToken] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const { data } = useGetUserQuery(`${token}`, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  const handleToken = async () => {
    let test: string | undefined = "";

    if (getToken) {
      test = await getToken();
    }

    setToken(test ?? "");
  };

  const handleNavigateToProfile = () => {
    navigate("/profile");
  };

  const handleLogoutConfirm = () => {
    logout(); // Perform logout
    setIsLogoutModalOpen(false); // Close modal after logout
    navigate("/"); // Redirect to home
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false); // Close modal without logout
  };

  useEffect(() => {
    handleToken();
  }, [getToken]);

  return (
    <Sidebar>
      {/* Sidebar Header */}
      <SidebarHeader className="bg-background dark:bg-gray-900">
        <div className="flex h-12 w-full items-center justify-center">
          <img src={Logo} alt="Logo" className="dark:invert" />
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="flex flex-col items-center justify-start bg-background">
        <div className="flex w-full flex-col space-y-2 px-2.5">
          {items.map((item) => (
            <div
              key={item.title}
              className={cn(
                "group flex w-full items-center justify-center gap-5 rounded-xl px-5 py-2.5 hover:bg-primary/80 hover:text-white",
                {
                  "bg-primary text-white": pathname.includes(item.url),
                }
              )}
            >
              <div className="flex w-full items-center">
                <a href={item.url} className="flex w-full gap-5 px-0">
                  <img
                    src={item.icon as string}
                    alt="icon"
                    className={cn("size-5 group-hover:invert", {
                      invert: pathname.includes(item.url),
                    })}
                  />
                  <span className="text-md font-semibold">{item.title}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="bg-sidebar-background">
        <div className="flex w-full items-center justify-center gap-2.5">
          {/* User Image */}
          <img
            src={
              data?.profile_picture_url
                ? data.profile_picture_url
                : "https://ui.shadcn.com/avatars/02.png"
            }
            alt="User Profile"
            className="size-10 cursor-pointer rounded-xl"
            onClick={handleNavigateToProfile}
          />
          {/* User Info */}
          <div className="flex w-full flex-col items-start justify-center gap-1">
            <span className="w-full overflow-hidden truncate text-left text-sm font-semibold">
              {data?.name}
            </span>
            {/* <span className="flex overflow-hidden truncate text-left text-xs font-light">
              {truncateString(`${user?.email}`, 26)}
            </span> */}
            <span className="text-sm capitalize">{data?.designation}</span>
          </div>
          {/* Logout Icon */}
          <CirclePower
            className="size-10 cursor-pointer text-red-500"
            onClick={() => setIsLogoutModalOpen(true)}
          />
          {/* Bell Icon - Trigger for Sheet */}
        </div>
      </SidebarFooter>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex w-96 flex-col items-center justify-center rounded-lg bg-white p-6 shadow-lg">
            <img src={Error} alt="" className="mb-4 size-14" />
            <h2 className="text-xl font-bold">Confirm Logout</h2>
            <p className="text-gray-600">Are you sure you want to log out?</p>
            <div className="mt-6 flex w-full justify-center gap-8">
              <button
                onClick={handleLogoutCancel}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="rounded-md bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </Sidebar>
  );
};

export default AppSidebar;
