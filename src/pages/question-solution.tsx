import React, { useEffect, useRef, useState } from "react";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { MathJax } from "better-react-mathjax";
import { type Stage as KonvaStage } from "konva/lib/Stage";
import { Calculator, Eraser, Loader2, PenTool, Undo2 } from "lucide-react";
import { Layer, Line, Stage } from "react-konva";
import { useNavigate, useParams } from "react-router-dom";

import Upload from "@/assets/img/upload.svg";
import ChatBot from "@/components/chat-bot";
import ScientificCalculator from "@/components/scientific-calculator";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { parseImage } from "@/lib/utils";
import { usePostMathSolveMathMutation } from "@/store/services/math";
import {
  useGetQuestionQuery,
  useGetQuestionsQuery,
} from "@/store/services/question";

const QuestionSolution = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useKindeAuth();
  const stageRef = useRef<KonvaStage>(null);
  const [lines, setLines] = useState<any[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [eraserWidth, setEraserWidth] = useState(20);
  const [eraserMode, setEraserMode] = useState(false);
  const [history, setHistory] = useState<any[][]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [solution, { isLoading: isSolving }] = usePostMathSolveMathMutation();

  const handleClearCanvas = () => {
    setLines([]);
    saveCanvasState([]);
  };

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

  const saveCanvasState = (newLines: any[]) => {
    const newHistory = [...history.slice(0, historyIndex + 1), newLines];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleNavigateBack = () => {
    navigate(-1);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setUploadedFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setUploadedFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setLines(prevState);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const toggleEraserMode = () => {
    setEraserMode((prevEraserMode) => !prevEraserMode);
  };

  const handleMouseDown = (e: any) => {
    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    setLines([
      ...lines,
      {
        points: [pos.x, pos.y],
        color: eraserMode ? "white" : "black",
        strokeWidth: eraserMode ? eraserWidth : 4,
      },
    ]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    lines.splice(lines.length - 1, 1, lastLine);
    setLines([...lines]);
  };

  const handleExport = async () => {
    if (stageRef.current) {
      const dataURL = await stageRef.current.toBlob();
      const image = await parseImage(dataURL as File);

      const response = await solution({
        token: `${token}`,
        body: {
          image_url: image as string,
          question_id: data?.question_id as number,
        },
      });

      if (!response.error) {
        localStorage.setItem("solution", response?.data as string);
      }

      navigate(`/question-artboard/${data?.question_id}`);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    saveCanvasState(lines);
  };

  const handleNextQuestion = () => {
    const findIndex = questions!.findIndex(
      (question) => question.question_id === Number(id)
    );
    navigate(
      `/question-solution/${questions?.[Number(findIndex) + 1]?.question_id}`
    );
  };

  useEffect(() => {
    handleToken();
  }, [getToken]);

  return isLoading ? (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 className="size-16 animate-spin text-primary" />
    </div>
  ) : (
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
      <div className="absolute bottom-20 right-6 z-20">
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
      <span className="font-semibold text-primary">Questions</span>
      <span>/</span>
      <span
        className="cursor-pointer font-semibold text-primary"
        onClick={handleNavigateBack}
      >
        {data?.question_title}
      </span>
      <span>/</span>
      <span>Solution</span>
      <div className="flex flex-col justify-between gap-5 lg:flex-row">
        <div>
          <h1 className="my-4 text-xl font-bold text-primary">
            {data?.course_title}
          </h1>
          <h1 className="mb-4 text-4xl font-bold">
            {data?.question_type === "Actual" ? "Actual" : "Practice"} Question
          </h1>
          <div className="space-y-2">
            <div className="flex gap-2">
              <p className="text-gray-500">
                <strong>Standard:</strong> {data?.standard_title}
              </p>
              <span>|</span>
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
        </div>
        <div
          className="mt-6 flex items-center justify-center gap-4 rounded-lg border-2 border-dashed border-primary bg-popover px-10 py-2"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <img src={Upload} alt="" className="mb-2 size-6" />
          <div className="flex flex-col gap-2">
            <label className="cursor-pointer rounded-md border border-primary bg-primary/15 px-4 py-1 text-center text-xs text-primary">
              Choose file to upload
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            {!uploadedFile && (
              <p className="text-xs text-gray-500">
                Or drag and drop file here
              </p>
            )}
            {uploadedFile && (
              <p className="mt-2 w-36 overflow-hidden truncate text-xs text-green-500">
                Uploaded: {uploadedFile.name}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="col-span-1 lg:col-span-2">
          <div
            className="max-w-screen mt-6 flex h-[calc(100vh-20rem)] w-full flex-col items-start rounded-2xl bg-popover px-4 shadow-md"
            style={{
              backgroundImage: `linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
              backgroundColor: "#ffffff",
            }}
          >
            <div className="flex w-full">
              <MathJax>{data?.question_title}</MathJax>
            </div>
            <div className="absolute right-2 top-2 z-10 flex flex-col gap-2">
              <div className="flex justify-start gap-2">
                {eraserMode && (
                  <div className="flex items-center gap-2">
                    <label htmlFor="eraser-width">Eraser Width:</label>
                    <input
                      type="range"
                      id="eraser-width"
                      min="5"
                      max="50"
                      value={eraserWidth}
                      onChange={(e) => setEraserWidth(Number(e.target.value))}
                      className="w-32"
                    />
                    <span>{eraserWidth * 2}%</span>
                  </div>
                )}
                <Button variant="outline" onClick={handleClearCanvas}>
                  Clear
                </Button>
                <button onClick={undo} disabled={historyIndex <= 0}>
                  <Undo2 className="mr-2 h-4 w-4" />
                </button>
                {eraserMode ? (
                  <button onClick={toggleEraserMode} title="Toggle Pen Mode">
                    <PenTool
                      className={`h-6 w-6 ${
                        !eraserMode
                          ? "text-gray-700"
                          : "text-primary hover:text-primary"
                      }`}
                    />
                  </button>
                ) : (
                  <button onClick={toggleEraserMode} title="Toggle Eraser Mode">
                    <Eraser
                      className={`h-6 w-6 ${
                        !eraserMode
                          ? "text-red-500"
                          : "text-gray-700 hover:text-gray-900"
                      }`}
                    />
                  </button>
                )}
              </div>
            </div>
            <div
              id="canvas-container"
              className="z-10 my-2 mt-8 h-full w-full max-w-full overflow-y-auto rounded-lg border border-gray-300 bg-white"
              style={{
                cursor: eraserMode
                  ? 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><rect x="2" y="2" width="20" height="20" stroke="black" stroke-width="2"/></svg>\') 12 12, auto'
                  : 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><circle cx="12" cy="12" r="3" fill="black"/></svg>\') 12 12, auto',
              }}
            >
              <Stage
                ref={stageRef}
                width={window.innerWidth - 500}
                height={window.innerHeight - 10}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                <Layer>
                  {lines.map((line, i) => (
                    <Line
                      key={i}
                      points={line.points}
                      stroke={line.color}
                      strokeWidth={line.strokeWidth}
                      tension={0.5}
                      lineCap="round"
                      lineJoin="round"
                    />
                  ))}
                </Layer>
              </Stage>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Button
              type="button"
              onClick={handleNextQuestion}
              variant="outline"
            >
              Next Question
            </Button>
            <Button type="button" onClick={handleExport}>
              {isSolving ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Submit Answer"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionSolution;
