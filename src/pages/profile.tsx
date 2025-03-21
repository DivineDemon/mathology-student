import { ChangeEvent, useEffect, useRef, useState } from "react";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { ChevronDown, FileText, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import Camera from "@/assets/img/camera.svg";
import Edit from "@/assets/img/edit.svg";
import Note from "@/assets/img/note.svg";
import Save from "@/assets/img/save.svg";
import Skillimg from "@/assets/img/skillimg.svg";
import CustomToast from "@/components/custom-toast";
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
import { cn, parseImage } from "@/lib/utils";
import { useGetUserQuery, useUpdateUserMutation } from "@/store/services/auth";
import { useGetQuestionsQuery } from "@/store/services/question";
import {
  useGetTotalAttemptsQuery,
  useGetUserStatisticsQuery,
  useGetUserStatisticsSkillsQuery,
} from "@/store/services/statistics";

const Profile = () => {
  const { getToken } = useKindeAuth();
  const [name, setName] = useState("");
  const [period, setPeriod] = useState("weekly");
  const imageRef = useRef<HTMLInputElement>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [image, setImage] = useState("https://ui.shadcn.com/avatars/04.png");

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    let temp: string = "";
    const file = e.target.files?.[0];

    if (file) {
      temp = (await parseImage(file)) as string;
      setImage(temp);
    }
  };

  const handleToken = async () => {
    let test: string | undefined = "";

    if (getToken) {
      test = await getToken();
    }

    setToken(test ?? "");
  };

  const handleUpdate = async () => {
    const response = await updateUser({
      token: token as string,
      body: {
        name,
        image_url: image,
      },
    });

    if (response) {
      toast.custom(() => (
        <CustomToast
          title="Success"
          description="Profile updated successfully"
          type="success"
        />
      ));
    } else {
      toast.custom(() => (
        <CustomToast
          title="error"
          description="Profile update Failed"
          type="error"
        />
      ));
    }
  };

  const { data: attempt } = useGetTotalAttemptsQuery(`${token}`, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  const { data: skill, isLoading: skillLoading } =
    useGetUserStatisticsSkillsQuery(`${token}`, {
      skip: !token,
      refetchOnMountOrArgChange: true,
    });

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
      setName(user.name);
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
          <div className="flex w-full flex-row items-start justify-start gap-3 rounded-xl bg-white p-5 lg:w-1/2 lg:flex-col">
            <div className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gray-100 p-5 lg:gap-5">
              <div className="relative size-16 shrink-0 rounded-xl border-2 border-white lg:size-16">
                <input
                  ref={imageRef}
                  type="file"
                  className="hidden"
                  multiple={false}
                  onChange={handleImageUpload}
                  accept="image/png, image/jpg, image/jpeg"
                />
                <img
                  src={image}
                  className="z-0 aspect-square size-full rounded-xl object-cover"
                />
                {edit && (
                  <div
                    onClick={() => {
                      if (imageRef.current) {
                        imageRef.current.click();
                      }
                    }}
                    className="absolute inset-0 z-[1] flex h-full w-full cursor-pointer items-end justify-end rounded-xl bg-primary/65 p-1"
                  >
                    <img src={Camera} alt="camera" className="size-5" />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col items-start justify-start">
                <div className="relative flex w-full justify-between">
                  <input
                    type="text"
                    value={name}
                    disabled={!edit}
                    onChange={(e) => setName(e.target.value)}
                    className="mb-1 bg-transparent text-3xl font-bold"
                  />
                  <button
                    className="absolute -right-3 -top-4 size-5"
                    disabled={isLoading}
                    onClick={() => {
                      if (edit) {
                        handleUpdate();
                      }
                      setEdit(!edit);
                    }}
                  >
                    {isLoading ? (
                      <Loader2 className="size-full animate-spin text-primary" />
                    ) : edit ? (
                      <img src={Save} className="size-6" />
                    ) : (
                      <img src={Edit} className="size-6" />
                    )}
                  </button>
                </div>
                <span className="lg:text-medium w-full text-left text-gray-400 md:text-sm">
                  {user?.email}
                </span>
              </div>
            </div>
            <div className="flex w-full gap-5">
              <div className="flex w-full flex-col items-start justify-center gap-2.5 rounded-xl bg-gray-100 p-5 lg:gap-5">
                <div className="flex size-16 shrink-0 items-start justify-start rounded-xl border-2 border-white bg-primary p-3 text-white lg:size-20">
                  <img src={Note} alt="" />
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
              <div className="flex w-full flex-col items-start justify-center gap-2.5 rounded-xl bg-gray-100 p-5 lg:gap-5">
                <div className="flex size-20 shrink-0 items-center justify-center rounded-xl border-2 border-white bg-primary p-3 text-white lg:size-20">
                  <img src={Skillimg} alt="" />
                </div>
                <div className="flex w-full flex-col items-start justify-center">
                  <span className="w-full text-start text-3xl font-bold">
                    {skillLoading ? (
                      <Loader2 className="size-16 animate-spin text-primary" />
                    ) : (
                      <>
                        {skill?.skill_level} <span>%</span>
                      </>
                    )}
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
                    {item.question_title}
                  </p>
                  <div className="flex w-full items-center justify-start text-xs text-gray-500">
                    <FileText className="mr-4 size-5 fill-gray-400 text-white" />
                    <span className="line-clamp-1 flex-1 text-left">
                      {item.question_description}
                    </span>
                  </div>
                  <div className="flex w-full items-center justify-start gap-4">
                    {/* <Button variant="outline"> {item.standard_title}</Button> */}
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
