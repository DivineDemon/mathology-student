import { useEffect, useState } from "react";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { CircleAlert, Loader2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useGetCoursesQuery } from "@/store/services/course";
import {
  useGetPracticeQuestionsMutation,
  useGetQuestionsQuery,
} from "@/store/services/question";

import CustomToast from "./custom-toast";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title }) => {
  const navigate = useNavigate();
  const { getToken } = useKindeAuth();
  const [getPracticeQuestions, { isLoading }] =
    useGetPracticeQuestionsMutation();
  const [option, setOption] = useState<string>("fixed");
  const [difficulty, setDifficulty] = useState<string>("");
  const [token, setToken] = useState<string | undefined>(undefined);
  const [numberQuestions, setNumberQuestions] = useState<string>("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const { data: courses } = useGetCoursesQuery(`${token}`, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  const { data: questions } = useGetQuestionsQuery(`${token}`, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  const handleToken = async () => {
    let temp: string | undefined = "";

    if (getToken) {
      temp = await getToken();
    }

    setToken(temp);
  };

  const handleSelectChange = (e: string) => {
    if (selectedCourses.includes(e)) {
      toast.custom(() => (
        <CustomToast
          type="error"
          title="Error"
          description="Item Already Selected!"
        />
      ));

      return;
    }

    setSelectedCourses([...selectedCourses, e]);
  };

  const getQuestions = async () => {
    localStorage.setItem("option", option);

    if (option === "fixed") {
      try {
        const response = await getPracticeQuestions({
          token: token as string,
          body: {
            course_id: courses?.filter(
              (course) => course.course_title === selectedCourses[0]
            )[0].course_id as number,
            difficulty_level: difficulty.toLowerCase(),
            // @ts-ignore
            limit: Number(numberQuestions),
          },
        });

        if (response.data) {
          localStorage.setItem("questions", JSON.stringify(response.data));
          navigate(`/question-attempt/${response.data[0].question_id}`);
        } else {
          toast.custom(() => (
            <CustomToast
              type="error"
              title="Warning"
              description="This Course Has No Questions!"
            />
          ));
        }
      } catch (error: Error | unknown) {
        toast.custom(() => (
          <CustomToast
            type="error"
            title="Error"
            description={(error as Error).message}
          />
        ));
      }
    } else {
      const firstPractice = questions?.filter(
        (q) => q.question_type === "Practice"
      )[0];

      navigate(`/question-attempt/${firstPractice?.question_id}`);
    }
  };

  useEffect(() => {
    handleToken();
  }, [getToken]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-10">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-black p-1 text-white"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="mb-4 text-xl font-bold">{title}</h2>
        <div className="flex items-center">
          <p className="text-gray-500">Skills:</p>
          <p className="ml-10 font-bold">(As Selected)</p>
          <CircleAlert fill="black" className="ml-4 size-6 text-white" />
        </div>
        <div className="mt-4 flex flex-col space-y-4">
          <div>
            <input
              type="radio"
              id="option1"
              name="options"
              value="fixed"
              checked={option === "fixed"}
              onChange={(e) => setOption(e.target.value)}
            />
            <label htmlFor="option1" className="ml-2 font-bold">
              Fixed number of questions
            </label>
            <p className="ml-5 text-sm text-gray-400">
              Choose the course, number of questions, and difficulty level.
            </p>
          </div>
          <div className="flex flex-col">
            <div className="ml-4 grid grid-cols-2 gap-2">
              <div className="col-span-2">
                <label htmlFor="course-select" className="font-semibold">
                  Select Course
                </label>
                <Select
                  disabled={option === "say"}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses?.map((course) => (
                      <SelectItem
                        key={course.course_id}
                        value={course.course_title}
                      >
                        {course.course_title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="no-scrollbar col-span-2 flex w-full max-w-full items-start justify-start gap-2 overflow-x-auto">
                {selectedCourses.map((course, idx) => (
                  <span
                    key={idx}
                    className="w-24 shrink-0 overflow-hidden truncate rounded-md bg-gray-100 px-4 py-1 text-xs"
                  >
                    {course}
                  </span>
                ))}
              </div>
              <div className="col-span-1">
                <label htmlFor="questions-select" className="font-semibold">
                  No. of Questions
                </label>
                <Select
                  disabled={option === "say"}
                  value={numberQuestions}
                  onValueChange={setNumberQuestions}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="No. of Questions" />
                  </SelectTrigger>
                  <SelectContent>
                    {["10", "20", "30"].map((amt) => (
                      <SelectItem key={amt} value={amt}>
                        {amt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1">
                <label htmlFor="difficulty-select" className="font-semibold">
                  Difficulty Level
                </label>
                <Select
                  disabled={option === "say"}
                  value={difficulty}
                  onValueChange={setDifficulty}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="No. of Questions" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Easy", "Medium", "Hard"].map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          {/* <div className="!mt-8">
            <input
              type="radio"
              id="option2"
              name="options"
              value="option2"
              checked={selectedOption === "option2"}
              onChange={handleOptionChange}
            />
            <label htmlFor="option2" className="ml-2 font-bold">
              Accuracy required to finish
            </label>
            <p className="ml-5 text-sm text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div> */}
          <div>
            <input
              type="radio"
              id="option3"
              name="options"
              value="say"
              checked={option === "say"}
              onChange={(e) => setOption(e.target.value)}
            />
            <label htmlFor="option3" className="ml-2 font-bold">
              Keep going until
            </label>
            <p className="ml-5 text-sm text-gray-400">I say</p>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" onClick={getQuestions} disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : "Start"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
