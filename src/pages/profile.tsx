import { useEffect, useState } from "react";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { ChevronDown, FileCheck, FileText, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

import Chart from "@/components/profile/chart";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useGetUserQuery } from "@/store/services/auth";
import { useGetQuestionsQuery } from "@/store/services/question";
import { useGetUserStatisticsQuery } from "@/store/services/statistics";

const Profile = () => {
  const { getToken } = useKindeAuth();
  const [period, setPeriod] = useState("weekly");
  const [token, setToken] = useState<string | null>(null);

  const handleToken = async () => {
    let test: string | undefined = "";

    if (getToken) {
      test = await getToken();
    }

    setToken(test ?? "");
  };

  const { data, isLoading } = useGetQuestionsQuery(`${token}`, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  const { data: user, isLoading: isLoadingUser } = useGetUserQuery(`${token}`, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  const { data: stats, isLoading: isLoadingStats } = useGetUserStatisticsQuery(
    {
      period,
      token: `${token}`,
    },
    {
      skip: !token || !period,
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    handleToken();
  }, [getToken]);

  return isLoading && isLoadingUser && isLoadingStats ? (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 className="size-16 animate-spin text-primary" />
    </div>
  ) : (
    <div className="flex h-screen w-full flex-col items-start justify-start">
      <nav className="flex h-16 w-full shrink-0 items-center justify-between border-b px-5 py-2.5">
        <div className="flex items-center justify-center gap-4">
          <SidebarTrigger className="block lg:hidden" />
          <div className="text-3xl font-bold lg:text-4xl">Profile</div>
        </div>
      </nav>
      <div className="flex h-[calc(100vh-64px)] w-full flex-col items-start justify-start p-5">
        <div className="flex h-1/2 w-full items-center justify-center gap-5">
          <div className="flex h-full w-1/3 flex-col items-start justify-start gap-5 rounded-xl bg-white p-5">
            <div className="flex h-full w-full items-center justify-center gap-5 rounded-xl bg-gray-100 p-5">
              <img
                src="https://ui.shadcn.com/avatars/04.png"
                className="size-32 rounded-xl border-2 border-white"
              />
              <div className="flex flex-1 flex-col items-center justify-center">
                <span className="w-full text-left text-2xl font-bold">
                  {user?.email}
                </span>
                <span className="w-full text-left text-sm text-gray-400">
                  {user?.designation}
                </span>
              </div>
            </div>
            <div className="flex h-full w-full items-center justify-center gap-5 rounded-xl bg-gray-100 p-5">
              <div className="flex size-32 items-center justify-center rounded-xl border-2 border-white bg-primary p-8 text-white">
                <FileCheck className="size-full" />
              </div>
              <div className="flex flex-1 flex-col items-center justify-center">
                <span className="w-full text-left text-2xl font-bold">
                  {user?.total_attempts}369
                </span>
                <span className="w-full text-left text-sm text-gray-400">
                  Attempted Questions
                </span>
              </div>
            </div>
          </div>
          <div className="flex h-full w-2/3 flex-col items-start justify-start gap-5 rounded-xl bg-white p-5">
            <div className="flex w-full items-center justify-center">
              <span className="flex-1 text-left text-2xl font-bold">
                Practice Activity
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="capitalize">
                    {period} <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-fit" align="end">
                  <DropdownMenuRadioGroup
                    value={period}
                    onValueChange={setPeriod}
                  >
                    <DropdownMenuRadioItem value="weekly">
                      Weekly
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="monthly">
                      Monthly
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="yearly">
                      Yearly
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {isLoadingStats ? (
              <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="size-10 animate-spin text-primary" />
              </div>
            ) : (
              <Chart data={stats || []} />
            )}
          </div>
        </div>
        <div className="flex h-1/2 w-full flex-col items-start justify-start gap-5 pt-5">
          <span className="w-full text-left text-2xl font-bold">Practices</span>
          <div className="grid w-full grid-cols-2 items-center justify-center gap-5">
            {data
              ?.filter((item) => item.question_type === "Practice")
              .slice(0, 4)
              .map((item) => (
                <div
                  className="col-span-1 flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-popover p-4 shadow-md"
                  key={item.question_id}
                >
                  <p className="w-full text-left font-semibold">
                    {item.question_id}: Exam {item.question_type}:&nbsp;
                    {item.question_title}
                  </p>
                  <div className="flex w-full items-center justify-start text-xs text-gray-500">
                    <FileText className="mr-4 size-5 text-gray-400" />
                    <span className="line-clamp-1 flex-1 text-left">
                      {item.question_description}
                    </span>
                  </div>
                  <div className="flex w-full items-center justify-start gap-4">
                    <Button variant="outline"> {item.standard_title}</Button>
                    <Link
                      to={`/question-attempt/${item.question_id}`}
                      className={cn(
                        buttonVariants({
                          variant: "default",
                        })
                      )}
                    >
                      Start Practice
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
