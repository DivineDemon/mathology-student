import { useEffect, useState } from "react";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { MathJax } from "better-react-mathjax";
import { Check, Loader2, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  useGetQuestionAttemptsQuery,
  useGetQuestionQuery,
} from "@/store/services/question";

const QuestionArtboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useKindeAuth();
  const [reveal, setReveal] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [submittedSolution, setSubmittedSolution] = useState<string>("");

  const { data: attempts } = useGetQuestionAttemptsQuery(
    {
      id: Number(id),
      token: `${token}`,
    },
    {
      skip: !id || !token,
      refetchOnMountOrArgChange: true,
    }
  );

  const handleToken = async () => {
    let test: string | undefined = "";

    if (getToken) {
      test = await getToken();
    }

    setToken(test ?? "");
  };

  const { data: question } = useGetQuestionQuery(
    {
      id: `${id}`,
      token: `${token}`,
    },
    {
      skip: !id || !token,
      refetchOnMountOrArgChange: true,
    }
  );

  const { data, isLoading: fetching } = useGetQuestionQuery(
    {
      id: `${id}`,
      token: `${token}`,
    },
    {
      skip: !id || !token,
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    handleToken();

    const userSolution: {
      status: string;
      solution: string;
    } = JSON.parse(localStorage.getItem("solution")!);

    if (userSolution.status === "Correct") {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }

    setSubmittedSolution(userSolution.solution);
  }, [getToken]);

  return fetching ? (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="size-16 animate-spin text-primary" />
    </div>
  ) : (
    <div className="flex h-screen max-h-screen w-full flex-col items-start justify-start overflow-y-auto">
      <nav className="flex h-16 w-full shrink-0 items-center justify-between border-b px-5 py-2.5">
        <div className="flex items-center justify-center gap-4">
          <SidebarTrigger className="block lg:hidden" />
          <div className="text-3xl font-bold lg:text-4xl">
            {data?.question_type === "Practice" && "Practice"} Question
          </div>
        </div>
      </nav>
      <div className="flex min-h-[calc(100vh-64px)] w-full flex-col items-start justify-start gap-5 p-5">
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
                Answer Discussion
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="grid h-full w-full grid-cols-2 items-center justify-center gap-5 xl:grid-cols-3">
          <div className="relative col-span-1 flex h-full w-full flex-col items-start justify-start overflow-hidden rounded-xl bg-white shadow-md xl:col-span-2">
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
            <div className="absolute z-[1] flex h-full w-full flex-col items-start justify-start gap-5 rounded-xl p-5">
              <MathJax>{data?.question_title}</MathJax>
            </div>
          </div>
          <div className="col-span-1 flex h-[568px] w-full flex-col items-start justify-start overflow-x-auto rounded-xl bg-white shadow-md xl:h-full">
            <div
              className={cn("flex w-full items-center gap-2 rounded-t-xl p-4", {
                "bg-destructive": !isCorrect,
                "bg-green-500": isCorrect,
              })}
            >
              {isCorrect ? (
                <Check className="h-6 w-6 rounded-full bg-popover text-green-500" />
              ) : (
                <X className="h-6 w-6 rounded-full bg-popover text-destructive" />
              )}
              <h1 className="text-2xl font-bold text-white">
                {isCorrect ? "Correct" : "Incorrect"}
              </h1>
            </div>
            <div className="flex h-full max-h-full w-full flex-col items-start justify-start overflow-y-auto p-5">
              <img src={submittedSolution} alt="solution" className="w-full" />
              {reveal && (
                <p className="h-full w-full text-left">
                  {question?.solution_file}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-end gap-4 pb-5">
          {attempts && attempts < 2 ? (
            <Button
              onClick={() => navigate(-1)}
              type="button"
              variant="outline"
            >
              Retry
            </Button>
          ) : (
            <>
              <Button
                onClick={() => setReveal(!reveal)}
                type="button"
                variant="outline"
              >
                {reveal ? "Hide Solution" : "Reveal Solution"}
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionArtboard;
