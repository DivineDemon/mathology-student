// import Upload from "@/assets/img/upload.svg";
import React, { useEffect, useState } from "react";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { MathJax } from "better-react-mathjax";
import { Check, Loader2, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import Video from "@/assets/img/video.svg";
import ChatBot from "@/components/chat-bot";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { usePostMathSolutionMutation } from "@/store/services/math";
import { useGetQuestionQuery } from "@/store/services/question";

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  content: { imageSrc: string; text: string };
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-end">
          <button
            className="rounded-full bg-black p-1 text-white"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <img
          src={Video}
          alt="Video Explanation"
          className="mx-auto mb-4 size-20 rounded-lg"
        />
        <p className="text-center text-xl font-semibold">
          Oops, But there are no video for this topic
        </p>
      </div>
    </div>
  );
};

const QuestionArtboard: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useKindeAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [explained, setExplained] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  // const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleToken = async () => {
    let test: string | undefined = "";

    if (getToken) {
      test = await getToken();
    }

    setToken(test ?? "");
  };

  const { data } = useGetQuestionQuery(
    {
      id: `${id}`,
      token: `${token}`,
    },
    {
      skip: !id || !token,
      refetchOnMountOrArgChange: true,
    }
  );

  const [getExplanation, { isLoading }] = usePostMathSolutionMutation();

  const handleNavigateBack = () => {
    navigate(-1);
  };

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0] || null;
  //   setUploadedFile(file);
  // };

  // const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
  //   event.preventDefault();
  //   const file = event.dataTransfer.files[0];
  //   setUploadedFile(file);
  // };

  // const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
  //   event.preventDefault();
  // };

  const explain = async () => {
    const response = await getExplanation({
      token: `${token}`,
      question_id: Number(id!),
      query:
        "Solve this question step-by-step with some values and explain each step.",
    });

    if (!response.error) {
      // @ts-ignore
      setExplained(response.solution_explain);
    }
  };

  useEffect(() => {
    handleToken();
  }, [getToken]);

  useEffect(() => {
    if (token) {
      explain();
    }

    const correct = localStorage.getItem("solution");

    if (correct === "Correct") {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  }, [token]);

  return (
    <div className="h-full w-full px-4">
      <div className="absolute bottom-14 right-6">
        <Sheet>
          <SheetTrigger>
            <div className="relative flex size-12 items-center justify-center rounded-full bg-white">
              <p className="text-2xl font-extrabold text-primary">M</p>
              <div className="absolute bottom-0 right-0 size-4 rounded-full border-2 border-primary bg-green-500" />
            </div>
          </SheetTrigger>
          <SheetContent className="flex h-full w-full flex-col items-start justify-start p-0">
            <ChatBot />
          </SheetContent>
        </Sheet>
      </div>
      <span className="font-semibold text-primary">Questions</span>&nbsp;
      <span>/</span>
      <span
        className="cursor-pointer font-semibold text-primary"
        onClick={handleNavigateBack}
      >
        {data?.question_title}
      </span>
      <span>/</span>
      <span>Solution</span>
      <h1 className="my-4 text-xl font-bold text-primary">
        {data?.lesson_title}
      </h1>
      <h1 className="mb-4 line-clamp-1 text-4xl font-bold">
        {data?.question_title}
      </h1>
      {/* Question Details */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <p className="text-gray-500">
            <strong>Standard:</strong>&nbsp;{data?.standard_title}
          </p>
          <span className="text-gray-500">|</span>
          <p className="flex gap-2">
            <strong className="text-gray-500">Difficulty Level:</strong>
            <span
              className={cn("capitalize", {
                "text-green-500": data?.difficulty_level === "easy",
                "text-yellow-500": data?.difficulty_level === "medium",
                "text-red-500": data?.difficulty_level === "hard",
              })}
            >
              {data?.difficulty_level}
            </span>
          </p>
        </div>
      </div>
      {/* File Upload */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div
            className="mt-6 flex h-[calc(100vh-260px)] w-full flex-col items-start rounded-2xl bg-popover px-4 shadow-md"
            style={{
              backgroundImage: `linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
              backgroundColor: "#ffffff",
            }}
          >
            <div className="flex w-full justify-between">
              <MathJax>{data?.question_title}</MathJax>
            </div>
            {/* <h1 className="text-2xl font-bold">Answer:</h1>
            <MathJax>{`\\[x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\\]`}</MathJax> */}
          </div>

          {/* File upload box */}
          {/* <div
            className="mt-6 flex flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-primary bg-popover p-5"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <img src={Upload} alt="" className="mb-2 size-6" />
            <label className="cursor-pointer rounded-md border border-primary bg-primary/15 px-4 py-1.5 text-primary">
              Choose file to upload
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            {!uploadedFile && (
              <p className="text-gray-500">Or drag and drop file here</p>
            )}
            {uploadedFile && (
              <p className="mt-2 text-sm text-green-500">
                Uploaded: {uploadedFile.name}
              </p>
            )}
          </div> */}
        </div>

        {/* Chat Component */}
        <div className="flex h-full flex-col items-start justify-start rounded-xl bg-white pb-4">
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
          <div className="flex h-full w-full flex-col items-start justify-start p-4">
            {/* <div className="w-full flex flex-col items-center justify-center">
              <h1 className="w-full text-center text-xl font-semibold">Correct Answer :</h1>
              <MathJax>{`\\[x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\\]`}</MathJax>
            </div> */}
            <div className="flex h-full max-h-full w-full items-start justify-start overflow-y-auto rounded-xl border border-gray-200">
              {isLoading ? (
                <div className="flex h-full w-full items-center justify-center">
                  <Loader2 className="size-10 animate-spin text-primary" />
                </div>
              ) : (
                <p className="w-full text-left text-sm">{explained}</p>
              )}
            </div>
          </div>
          {/* <div className="w-full items-center flex justify-center gap-2">
            <Button variant="outline">Next Question</Button>
            <Button>Continue Later</Button>
          </div> */}
        </div>
      </div>
      <div className="mt-2 flex w-full items-center justify-end gap-2">
        {/* <button className="rounded-md border border-popover bg-popover px-4 py-1 text-primary">
          Solution
        </button>
        <button className="rounded-md border border-primary bg-primary/15 px-4 py-1 text-primary">
          Explanation by AI
        </button> */}
        <Button onClick={() => setIsModalOpen(true)}>Video Explanation</Button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content={{
          imageSrc: Video,
          text: "This is the video explanation for the question.",
        }}
      />
    </div>
  );
};

export default QuestionArtboard;
