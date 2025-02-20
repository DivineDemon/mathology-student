import { useEffect, useState } from "react";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { MathJax } from "better-react-mathjax";
import { Calculator } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import ScientificCalculator from "@/components/scientific-calculator";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useGetQuestionQuery } from "@/store/services/question";

const QuestionAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useKindeAuth();
  const [token, setToken] = useState<string | null>(null);

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

  const handleNavigateBack = () => {
    navigate(-1);
  };

  const handleStartAttempt = (id: string) => {
    navigate(`/question-solution/${id}`);
  };

  useEffect(() => {
    handleToken();
  }, [getToken]);

  return (
    <div className="w-full px-4">
      <div className="absolute right-5 top-5">
        <Sheet>
          <SheetTrigger>
            <Calculator />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetDescription>
                <ScientificCalculator />
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <span
        className="cursor-pointer font-semibold text-primary"
        onClick={handleNavigateBack}
      >
        Questions
      </span>
      &nbsp;
      <span>/</span> <span>{data?.lesson_title}</span>
      <h1 className="my-4 text-xl font-bold text-primary">
        {data?.lesson_title}
      </h1>
      <div className="flex flex-col items-center justify-between md:flex-row">
        <h1 className="mb-4 text-4xl font-bold">
          {data?.question_type === "Actual" ? "Actual" : "Practice"} Question
        </h1>
        <div className="flex items-center gap-2 rounded-md bg-popover px-4 py-1.5 text-primary">
          <p>Attempt {data?.total_attempts! + 1}</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex gap-2">
          <p className="text-gray-500">
            <strong>Standard:</strong> {data?.standard_title}
          </p>
          <span className="font-light text-gray-500">|</span>
          <p className="flex gap-2">
            <strong className="text-gray-500">Difficulty Level:</strong>
            <div
              className={`${
                data?.difficulty_level === "easy"
                  ? "text-yellow-500"
                  : data?.difficulty_level === "medium"
                    ? "text-green-500"
                    : data?.difficulty_level === "hard"
                      ? "text-red-500"
                      : ""
              }`}
            >
              <p className="capitalize"> {data?.difficulty_level}</p>
            </div>
          </p>
        </div>
      </div>
      <div
        className="relative mt-6 flex h-[calc(100vh-20rem)] w-full flex-col items-start rounded-2xl bg-popover px-4 py-2 shadow-md"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          backgroundColor: "#ffffff",
        }}
      >
        <h1 className="text-xl font-bold">Question </h1>

        <MathJax>{data?.question_title}</MathJax>
        {/* Control Buttons */}
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={() => handleStartAttempt(`${data?.question_id}`)}>
          Start Attempt
        </Button>
      </div>
      {/* Eraser Width Slider */}
    </div>
  );
};

export default QuestionAttempt;
