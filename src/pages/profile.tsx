import { useEffect, useState } from "react";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import {
  BadgePercent,
  ChevronDown,
  FileChartColumn,
  FileText,
  Loader2,
  Pen,
  PencilLine,
} from "lucide-react";
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
import { useGetUserQuery, useUpdateUserMutation } from "@/store/services/auth";
import { useGetQuestionsQuery } from "@/store/services/question";
import { useGetTotalAttemptsQuery, useGetUserStatisticsQuery, useGetUserStatisticsSkillsQuery } from "@/store/services/statistics";
import { toast } from "sonner";
import CustomToast from "@/components/custom-toast";

const Profile = () => {
  const { getToken } = useKindeAuth();
  const [period, setPeriod] = useState("weekly");
  const [token, setToken] = useState<string | null>(null);
  const [name, setName] = useState("")
  const handleToken = async () => {
    let test: string | undefined = "";

    if (getToken) {
      test = await getToken();
    }

    setToken(test ?? "");
  };

  const [updateUser, { isLoading }
  ] = useUpdateUserMutation();

  const handleUpdate = async () => {
    const response = await updateUser({
      token: token as string,
      body: {
        name,
      }
    })

    if(response){
      toast.custom(()=>(
        <CustomToast
          title="Success"
          description="Profile updated successfully"
          type="success"
        />
      ))

    }
    else{
      toast.custom(()=>(
        <CustomToast
          title="error"
          description="Profile update Failed"
          type="error"
        />
      ))
    }
  }

  const { data: attempt } = useGetTotalAttemptsQuery(`${token}`, {
    skip: !token,
    refetchOnMountOrArgChange: true
  })

  const { data: skill, isLoading: skillLoading } = useGetUserStatisticsSkillsQuery(`${token}`, {
    skip: !token,
    refetchOnMountOrArgChange: true
  })



  const { data } = useGetQuestionsQuery(`${token}`, {
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
    if (user) {
      setName(user.name)
    }
  }, [getToken, user]);

  return isLoading && isLoadingUser && isLoadingStats ? (
    <div className="h-screen w-full">
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="size-16 animate-spin text-primary" />
      </div>
    </div>
  ) : (
    <div className="flex h-full min-h-screen w-full flex-col items-start justify-start">
      <nav className="flex h-16 w-full shrink-0 items-center justify-between border-b px-5 py-2.5">
        <div className="flex items-center justify-center gap-4">
          <SidebarTrigger className="block lg:hidden" />
          <div className="text-3xl font-bold lg:text-4xl">Profile</div>
        </div>
      </nav>
      <div className="flex min-h-[calc(100vh-64px)] w-full flex-col items-start justify-start p-5">
        <div className="flex w-full flex-col items-start justify-center gap-5 lg:flex-row">
          <div className="flex w-full flex-row items-start justify-start gap-3 rounded-xl bg-white p-5  lg:w-1/2 lg:flex-col ">
            <div className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gray-100 p-5 lg:gap-5">
              <img
                src="https://ui.shadcn.com/avatars/04.png"
                className="size-16 shrink-0 rounded-xl border-2 border-white lg:size-16"
              />
              <div className="flex flex-1 flex-col items-start justify-start">
                <div className="flex justify-between w-full">
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="text-sm rounded-md px-2 py-0.5" />
                  <button disabled={isLoading} onClick={handleUpdate}>  {isLoading ? <Loader2 className=" animate-spin text-primary" /> : <PencilLine />}</button>
                </div>
                <span className="lg:text-medium w-full text-left text-gray-400 md:text-sm">
                  {user?.designation || "Creator"}
                </span>
              </div>
            </div>
            <div className="flex gap-5 w-full">
              <div className="flex flex-col w-full items-start justify-center gap-2.5 rounded-xl bg-gray-100 p-5 lg:gap-5">
                <div className="flex  size-16 shrink-0 items-start   justify-start rounded-xl border-2 border-white bg-primary p-3 text-white lg:size-20">
                  <FileChartColumn className="size-full" />
                </div>
                <div className="flex flex-1 flex-col items-center justify-center">
                  <span className="w-full text-left text-xl font-bold lg:text-3xl">
                    {attempt?.total_attempts || 0}
                  </span>
                  <span className="lg:text-medium w-full text-left text-sm text-gray-400">
                    Attempt Questions
                  </span>
                </div>
              </div>
              <div className="flex flex-col w-full items-start justify-center gap-2.5 rounded-xl bg-gray-100 p-5 lg:gap-5">
                <div className="flex  size-20 shrink-0 items-center   justify-center rounded-xl border-2 border-white bg-primary p-3 text-white lg:size-20">
                  <BadgePercent className="size-10" />
                </div>
                <div className="flex w-full flex-col items-start justify-center">
                  <span className="w-full text-start text-3xl font-bold">
                    {skillLoading ? <Loader2 className="size-16 animate-spin text-primary" /> : <>{skill?.skill_level} <span>%</span></>}
                  </span>
                  <span className="w-full text-start text-gray-500">
                    Student Skill Metric
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex h-[356px] w-full flex-col items-start justify-start gap-5 rounded-xl bg-white p-5 lg:w-2/3">
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
