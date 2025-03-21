import { useEffect, useState } from "react";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { MathJax } from "better-react-mathjax";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import Bot from "@/assets/img/bot.svg";
import Calculator from "@/assets/img/calculator.svg";
import ChatBot from "@/components/chat-bot";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import ScientificCalculator from "@/components/ui/scientific-calculator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
} from "@/components/ui/sheet";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useGetQuestionQuery } from "@/store/services/question";

const AttemptQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useKindeAuth();
  const [token, setToken] = useState<string | null>(null);
  const [calculate, setCalculate] = useState<boolean>(false);
  const [chat, setChat] = useState<boolean>(false);
  const handleToken = async () => {
    let test: string | undefined = "";

    if (getToken) {
      test = await getToken();
    }

    setToken(test ?? "");
  };

  const { data, isLoading } = useGetQuestionQuery(
    {
      id: `${id}`,
      token: `${token}`,
    },
    {
      skip: !id || !token,
      refetchOnMountOrArgChange: true,
    }
  );

  const handleStartAttempt = (id: number | undefined) => {
    navigate(`/question-solution/${id}`);
  };

  useEffect(() => {
    handleToken();
  }, [getToken]);

  return isLoading ? (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="size-10 animate-spin text-primary" />
    </div>
  ) : (
    <>
      <Sheet
        open={chat}
        onOpenChange={() => {
          setChat(false);
        }}
      >
        <SheetContent className="flex h-full w-full flex-col items-start justify-start p-0">
          <ChatBot />
        </SheetContent>
      </Sheet>

      <Sheet
        open={calculate}
        onOpenChange={() => {
          setCalculate(false);
        }}
      >
        <SheetContent>
          <SheetHeader>
            <SheetDescription>
              <ScientificCalculator />
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <div className="flex h-screen w-full flex-col items-start justify-start">
        <nav className="flex h-16 w-full shrink-0 items-center justify-between border-b px-5 py-2.5">
          <div className="flex items-center justify-center gap-4">
            <SidebarTrigger className="block lg:hidden" />
            <div className="text-3xl font-bold lg:text-4xl">
              {data?.question_type === "Actual" ? "Actual" : "Practice"}
              &nbsp;Question
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <button type="button" onClick={() => setChat(true)}>
              <img src={Bot} alt="" />
            </button>
            <button type="button" onClick={() => setCalculate(true)}>
              <img src={Calculator} alt="" />
            </button>
          </div>
        </nav>
        <div className="flex h-[calc(100vh-64px)] w-full flex-col items-start justify-start gap-5 p-5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/questions"
                  className="font-semibold text-primary dark:text-blue-400"
                >
                  {data?.question_type === "Actual" ? "Questions" : "Practices"}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-gray-500 dark:text-gray-300">
                  Attempt Question
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex w-full flex-col items-center justify-center gap-1.5">
            <span className="w-full text-left font-semibold text-primary">
              {data?.course_title}
            </span>
            <div className="flex w-full items-start justify-between">
              <span className="line-clamp-1 w-full max-w-3xl flex-1 text-left text-4xl font-bold lg:text-[48px]">
                {data?.question_title}
              </span>
              {/* <span className="rounded-md bg-white px-4 py-1.5 text-primary">
                Attempt&nbsp;{data?.total_attempts! + 1}
              </span> */}
            </div>
            <span className="w-full text-left font-semibold capitalize text-gray-400">
              Standard:&nbsp;{data?.standard_title}&nbsp;|&nbsp;Difficulty
              Level:&nbsp;
              <span
                className={cn({
                  "text-green-500": data?.difficulty_level === "easy",
                  "text-yellow-500": data?.difficulty_level === "medium",
                  "text-red-500": data?.difficulty_level === "hard",
                })}
              >
                {data?.difficulty_level}
              </span>
            </span>
          </div>
          <div className="relative flex h-full w-full flex-col items-start justify-start overflow-hidden rounded-xl bg-white shadow-md">
            <div
              className="z-0 flex h-full w-full"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #E5E7EB 1px, transparent 1px),
                  linear-gradient(to bottom, #E5E7EB 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
                backgroundColor: "#ffffff",
              }}
            />
            <div className="absolute z-[1] grid h-full w-full grid-cols-2 items-start justify-start gap-5 rounded-xl p-5">
              <MathJax>{data?.question_title}</MathJax>
              {data?.image_url && data?.image_url.includes("https") && (
                <img src={data?.image_url} className="ml-auto size-72" />
              )}
            </div>
          </div>
          <div className="flex w-full items-center justify-end">
            <Button
              onClick={() => handleStartAttempt(data?.question_id)}
              type="button"
              variant="default"
            >
              Start Attempt
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AttemptQuestion;
