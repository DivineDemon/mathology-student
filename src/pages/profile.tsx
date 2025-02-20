import { useEffect, useState } from "react";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { FileText, Loader2, NotebookTextIcon } from "lucide-react";
import { Link } from "react-router-dom";

import ProfileChart from "@/components/profile-chart";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetUserQuery } from "@/store/services/auth";
import { useGetQuestionsQuery } from "@/store/services/question";
import { useGetUserStatisticsQuery } from "@/store/services/statistics";

const profile = () => {
  const { getToken } = useKindeAuth();
  const [token, setToken] = useState<string | null>(null);
  const [period, setPeriod] = useState("weekly");

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

  console.log(period);

  return isLoading && isLoadingUser && isLoadingStats ? (
    <div className="flex h-full w-full items-center justify-center">
      {" "}
      <Loader2 className="size-16 animate-spin text-primary" />
    </div>
  ) : (
    <div className="mb-4 w-full space-y-2">
      <div className="flex flex-col items-center gap-4 lg:flex-row">
        <div className="flex w-full items-center justify-center gap-5 rounded-xl bg-popover p-4 lg:max-w-sm lg:flex-col">
          <div className="flex h-36 w-full items-center justify-start gap-5 rounded-xl bg-muted p-4">
            <img
              // src={user?.profile_picture_url}
              src="https://ui.shadcn.com/avatars/02.png"
              alt=""
              className="size-24 rounded-xl"
            />
            <div>
              <p className="text-xl font-bold">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.designation}</p>
            </div>
          </div>
          <div className="flex w-full justify-between gap-4">
            <div className="flex h-36 w-full items-center justify-start gap-5 rounded-xl bg-muted p-4">
              <NotebookTextIcon className="size-20 rounded-lg bg-primary p-2 text-popover" />
              <div>
                <p className="text-2xl font-bold">369</p>
                <p className="text-xs text-gray-400">Attempt Questions</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-popover p-2">
          <div className="flex w-full items-center justify-between">
            <p className="text-2xl font-bold">Practice Activity</p>
            <select
              className="select select-bordered select-sm w-[100px] max-w-xs rounded-md bg-gray-100 px-2 py-1"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <ProfileChart data={stats || []} />
        </div>
      </div>
      <p className="text-2xl font-bold">Practtices</p>
      <div className="!mb-6 grid grid-cols-2 gap-3">
        {data
          ?.filter((item) => item.question_type === "Practice")
          .slice(0, 4)
          .map((item) => (
            <div
              className="col-span-1 space-y-2 rounded-xl bg-popover p-4 shadow-md"
              key={item.question_id}
            >
              <p className="font-semibold">
                {item.question_id} : Exam {item.question_type}:{" "}
                {item.question_title}
              </p>

              <p className="flex items-start text-xs text-gray-500">
                <FileText className="mr-4 size-5 text-gray-400" />
                {item.question_description}
              </p>

              <div className="mt-4 flex gap-4">
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
  );
};

export default profile;
