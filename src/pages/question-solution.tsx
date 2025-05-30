import { ChangeEvent, useEffect, useRef, useState } from "react";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { MathJax } from "better-react-mathjax";
import { Loader2, Upload, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import Bot from "@/assets/img/bot.svg";
import Calculator from "@/assets/img/calculator.svg";
import Danger from "@/assets/img/danger.svg";
import Upload1 from "@/assets/img/upload.svg";
import Canvas from "@/components/canvas";
import ChatBot from "@/components/chat-bot";
import CustomToast from "@/components/custom-toast";
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
// import WarningModal from "@/components/warning-modal";
import { cn } from "@/lib/utils";
import { usePostMathSolveMathMutation } from "@/store/services/math";
import {
  useGetQuestionQuery,
  useGetQuestionsQuery,
  // useGetQuestionsQuery,
  usePostAttemptQuestionMutation,
} from "@/store/services/question";

const QuestionSolution = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useKindeAuth();
  const canvasRef = useRef<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  // const [warn, setWarn] = useState<boolean>(false);
  const [increaseAttempt, { isLoading: attempting }] =
    usePostAttemptQuestionMutation();
  const [token, setToken] = useState<string | null>(null);
  // const [movement, setMovement] = useState<string>("next");
  const [calculate, setCalculate] = useState<boolean>(false);
  const [chat, setChat] = useState<boolean>(false);

  const [canvasHeight, setCanvasHeight] = useState<number>(500);
  const [questionHeight, setQuestionHeight] = useState<number>(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [solution, { isLoading: isSolving }] = usePostMathSolveMathMutation();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isImgUploaded, setIsImgUploaded] = useState(false);
  const [isCanvas, setIsCanvas] = useState(false);
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

  const { data: questions } = useGetQuestionsQuery(`${token}`, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) {
      return;
    }

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
      setIsImgUploaded(true);
    };

    reader.readAsDataURL(file);
  };

  const handleExport = async () => {
    let image = "";
    let response = null;
    const stageInstance = canvasRef.current?.getStage();

    const hasCanvasDrawings =
      stageInstance &&
      stageInstance
        .getChildren()[0]
        ?.getChildren()
        .some((node: any) => node.getClassName() !== "Transformer");

    if (!uploadedImage && !hasCanvasDrawings) {
      // toast.custom(() => (
      //   <CustomToast
      //     type="error"
      //     title="Error"
      //     description="Please Upload or Draw/Write a Solution for Submission!"
      //   />
      // ));
      setIsErrorOpen(true);
      return;
    }

    if (uploadedImage) {
      response = await solution({
        token: `${token}`,
        body: {
          image_url: uploadedImage as string,
          question_id: data?.question_id as number,
        },
      });
    } else {
      image = await stageInstance.toDataURL();
      // image = (await parseImage(dataURL as File)) as string;

      response = await solution({
        token: `${token}`,
        body: {
          image_url: image,
          question_id: data?.question_id as number,
        },
      });
    }

    if (!response?.error) {
      if ((response?.data as string) === "Correct") {
        toast.custom(() => (
          <CustomToast
            type="success"
            title="Success"
            description="Correct Answer!"
          />
        ));
        setTimeout(() => {
          window.location.reload();
        }, 2000); // Delay refresh for 2 seconds to show toast
        const option = localStorage.getItem("option");

        if (option === "say") {
          const findIndex = questions!.findIndex(
            (question) => question.question_id === Number(id)
          );
          navigate(
            `/question-solution/${questions?.[Number(findIndex) + 1]?.question_id}`
          );
        } else {
          // @ts-ignore
          const qList = JSON.parse(localStorage.getItem("questions") || []);

          if (Array.isArray(qList) && qList.length < 2) {
            navigate("/practices");
          } else {
            const findIndex = qList!.findIndex(
              (question: {
                question_id: number;
                question_title: string;
                question_description: string;
                skill_tags: string[];
              }) => question.question_id === Number(id)
            );

            navigate(
              `/question-solution/${qList?.[Number(findIndex) + 1]?.question_id}`
            );
          }
        }
      } else {
        localStorage.setItem(
          "solution",
          JSON.stringify({
            status: response?.data as string,
            solution: uploadedImage
              ? (uploadedImage as string)
              : (image as string),
          })
        );

        const increment = await increaseAttempt({
          id: data?.question_id as number,
          token: `${token}`,
        });

        if (!increment.error) {
          navigate(`/question-artboard/${data?.question_id}`);
        }
      }
    } else {
      toast.custom(() => (
        <CustomToast
          type="error"
          title="Error"
          description="An Error Occurred While Processing Your Solution!"
        />
      ));
    }
  };

  // const handlePrevQuestion = () => {
  //   const findIndex = questions!.findIndex(
  //     (question) => question.question_id === Number(id)
  //   );
  //   navigate(
  //     `/question-solution/${questions?.[Number(findIndex) - 1]?.question_id}`
  //   );
  // };

  // const handleNextQuestion = () => {
  //   const findIndex = questions!.findIndex(
  //     (question) => question.question_id === Number(id)
  //   );
  //   navigate(
  //     `/question-solution/${questions?.[Number(findIndex) + 1]?.question_id}`
  //   );
  // };

  useEffect(() => {
    handleToken();
  }, [getToken]);

  useEffect(() => {
    const questionElement = document.getElementById("question-text");
    if (questionElement) {
      setQuestionHeight(questionElement.offsetHeight);
      const containerHeight =
        document.getElementById("canvas-container")?.offsetHeight || 0;
      setCanvasHeight(Math.max(300, containerHeight - questionHeight - 40));
    }
  }, [data, questionHeight]);

  return isLoading ? (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="size-16 animate-spin text-primary" />
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
      {/* <WarningModal
        open={warn}
        setOpen={setWarn}
        message={`move to the ${movement === "next" ? "next" : "previous"} question`}
        cta={() => {
          if (movement === "next") {
            handleNextQuestion();
          } else {
            handlePrevQuestion();
          }
        }}
      /> */}
      <div className="flex h-screen w-full flex-col items-start justify-start">
        <nav className="flex h-16 w-full shrink-0 items-center justify-between border-b px-5 py-2.5">
          <div className="flex items-center justify-center gap-4">
            <SidebarTrigger className="block lg:hidden" />
            <div className="text-3xl font-bold lg:text-4xl">
              {data?.question_type === "Practice" && "Practice"} Question
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <div
              className="size-10 cursor-pointer rounded-full bg-primary p-2 transition duration-150 ease-in-out hover:scale-105"
              onClick={() => setChat(true)}
            >
              <img src={Bot} alt="bot" className="brightness-30 size-full" />
            </div>
            <div
              className="size-10 cursor-pointer rounded-full bg-primary p-2 transition duration-150 ease-in-out hover:scale-105"
              onClick={() => setCalculate(true)}
            >
              <img
                src={Calculator}
                alt="calculator"
                className="brightness-30 size-full"
              />
            </div>
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
          <div className="flex w-full items-center justify-center">
            <div className="flex flex-1 flex-col items-start justify-center gap-1.5">
              <span className="w-full text-left font-semibold text-primary">
                {data?.course_title}
              </span>
              <span className="line-clamp-1 w-full max-w-3xl flex-1 text-left text-4xl font-bold lg:text-[48px]">
                {data?.question_title}
              </span>
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
            <div className="relative flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-primary bg-white p-3 lg:w-72 lg:flex-row lg:gap-5 lg:p-0">
              {uploadedImage && (
                <Button
                  type="button"
                  onClick={() => setUploadedImage("")}
                  className="absolute -left-2.5 -top-2.5 size-5 rounded-full bg-destructive p-1 text-white hover:bg-destructive/85"
                >
                  <X className="size-full" />
                </Button>
              )}
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                multiple={false}
                onChange={handleUpload}
                accept="image/png, image/jpg, image/jpeg"
              />
              <Upload className="size-8 shrink-0 text-primary lg:size-10" />
              <div className="flex flex-col items-center justify-center gap-1.5">
                <Button
                  type="button"
                  variant="default"
                  onClick={() => {
                    setIsCanvas(true);
                  }}
                  className=""
                >
                  Upload Solution
                </Button>
                <span className="w-full text-center text-xs text-gray-400">
                  .png, .jpeg, .jpg Allowed
                </span>
              </div>
            </div>
          </div>
          <div
            id="canvas-container"
            className="relative flex h-full w-full flex-col items-start justify-start overflow-hidden rounded-xl bg-white shadow-md"
          >
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
            <div className="absolute z-[1] grid h-full w-full grid-cols-2 flex-col items-start justify-start gap-5 rounded-xl p-5">
              <div>
                <div id="question-text">
                  <MathJax>{data?.question_title}</MathJax>
                </div>
                {!uploadedImage && (
                  <div
                    className="w-full max-w-4xl flex-grow"
                    style={{ height: `${canvasHeight}px` }}
                  >
                    {/* @ts-ignore */}

                    <Canvas ref={canvasRef} />
                  </div>
                )}
              </div>
              {data?.image_url && data?.image_url.includes("https") && (
                <img src={data?.image_url} className="ml-auto size-72" />
              )}
            </div>
          </div>
          <div className="flex w-full items-center justify-end gap-4">
            {/* <Button
              type="button"
              variant="outline"
              disabled={isSolving || attempting}
              onClick={() => {
                setMovement("prev");
                setWarn(true);
              }}
            >
              Previous Question
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isSolving || attempting}
              onClick={() => {
                setMovement("next");
                setWarn(true);
              }}
            >
              Next Question
            </Button> */}
            <Button
              type="button"
              variant="default"
              onClick={handleExport}
              disabled={isSolving || attempting}
            >
              {isSolving || attempting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Submit Answer"
              )}
            </Button>
          </div>
        </div>
      </div>
      {isErrorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative flex w-full max-w-lg flex-col items-center justify-center rounded-2xl bg-white p-10 shadow-lg">
            <div
              className="absolute right-3 top-3 cursor-pointer rounded-full bg-black p-1"
              onClick={() => setIsErrorOpen(false)}
            >
              <X className="text-white" />
            </div>
            <img src={Danger} alt="" className="size-20" />
            <p className="0 mt-3">Please Provide An Answer Before </p>
            <p>Submitting.</p>
            <button
              onClick={() => setIsErrorOpen(false)}
              className="mt-4 rounded-lg bg-primary px-6 py-2 text-white transition hover:bg-primary/70"
            >
              Continue
            </button>
          </div>
        </div>
      )}
      {isImgUploaded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative flex w-full max-w-lg flex-col items-center justify-center rounded-2xl bg-white p-10 shadow-lg">
            <div
              className="absolute right-3 top-3 cursor-pointer rounded-full bg-black p-1"
              onClick={() => setIsErrorOpen(false)}
            >
              <X className="text-white" />
            </div>
            <img src={Upload1} alt="" className="size-20" />
            <p className="mt-3 text-xl">Image submitted! </p>
            <p className="text-xs text-gray-400">
              Your image has been successfully submitted!
            </p>
            <button
              onClick={() => setIsImgUploaded(false)}
              className="mt-4 rounded-lg bg-primary px-6 py-2 text-white transition hover:bg-primary/70"
            >
              Continue
            </button>
          </div>
        </div>
      )}
      {isCanvas && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative flex w-full max-w-lg flex-col items-center justify-center rounded-2xl bg-white p-10 shadow-lg">
            <div
              className="absolute right-3 top-3 cursor-pointer rounded-full bg-black p-1"
              onClick={() => setIsCanvas(false)}
            >
              <X className="text-white" />
            </div>
            <img src={Danger} alt="" className="size-20" />
            <p className="mt-3 text-xl">Are You Sure </p>
            <p className="text-xs text-gray-400">
              You will lose your canvas drawing
            </p>
            <button
              onClick={() => {
                if (fileRef?.current) {
                  fileRef.current.click();
                }
                setIsCanvas(false);
              }}
              className="mt-4 rounded-lg bg-primary px-6 py-2 text-white transition hover:bg-primary/70"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default QuestionSolution;
