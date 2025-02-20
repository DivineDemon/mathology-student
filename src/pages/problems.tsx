import { useEffect, useState } from "react";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useLoginMutation } from "@/store/services/auth";
import { useGetQuestionsQuery } from "@/store/services/question";

const QuestionsList = () => {
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const [register] = useLoginMutation();
  const { getToken, user } = useKindeAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [atoken, setAtoken] = useState<string | null>(null);
  const [selectedStandard, setSelectedStandard] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const { data, isLoading } = useGetQuestionsQuery(`${atoken}`, {
    skip: !atoken,
    refetchOnMountOrArgChange: true,
  });

  const handleRegister = async () => {
    try {
      await register({
        token: `${atoken}`,
        credentials: {
          name: `${user?.given_name} ${user?.family_name}`,
          email: `${user?.email}`,
          designation: "student",
          account_type: "student",
          profile_picture_url: `${user?.picture}`,
        },
      });
    } catch (error) {
      console.error("Error registering token:", error);
    }
  };

  const handleToken = async () => {
    let token: string | undefined = "";

    if (getToken) {
      token = await getToken();
    }

    setAtoken(token ?? "");
  };

  const totalPages = Math.ceil(data?.length! / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentQuestions = data
    ?.filter((q) => !selectedStandard || q.standard_title === selectedStandard)
    .filter(
      (q) => !selectedDifficulty || q.difficulty_level === selectedDifficulty
    )
    .filter(
      (q) =>
        !selectedStatus ||
        selectedStatus === "All" ||
        q.status === selectedStatus
    )
    .slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRowClick = (questionId: number) => {
    navigate(`/question-attempt/${questionId}`);
  };

  useEffect(() => {
    handleToken();

    if (atoken) {
      handleRegister();
    }
  }, [getToken, atoken]);

  return (
    <div className="w-full overflow-hidden px-4">
      <div className="flex flex-col items-center justify-between md:flex-row">
        <h1 className="mb-6 text-4xl font-extrabold">Questions</h1>
        <div className="relative">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search here"
            className="rounded-md bg-popover py-1.5 pl-10 pr-3"
          />
          <Search className="absolute left-2 top-2 h-6 w-6 text-primary" />
        </div>
      </div>
      <div className="my-4 h-[1.5px] w-full bg-gray-200"></div>

      <div className="h-[calc(100vh-210px)] max-w-[calc(100vw-42px)] overflow-auto">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="size-10 animate-spin text-primary" />
          </div>
        ) : searchQuery ? (
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm text-gray-500">
                  Question Title
                </th>
                <th className="px-4 py-2 text-left text-sm text-gray-500">
                  Course
                </th>
                <th className="px-4 py-2 text-left text-sm text-gray-500">
                  Lesson
                </th>
                <th className="px-4 py-2 text-left text-sm text-gray-500">
                  <select
                    value={selectedStandard}
                    onChange={(e) => setSelectedStandard(e.target.value)}
                    className="border-none bg-background"
                  >
                    <option value="">Standard</option>
                    <option value="K1">K1</option>
                    <option value="K2">K2</option>
                    <option value="K3">K3</option>
                  </select>
                </th>
                <th className="px-4 py-2 text-left text-sm text-gray-500">
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="border-none bg-background"
                  >
                    <option value="">Difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </th>
                <th className="px-4 py-2 text-left text-sm text-gray-500">
                  Tags
                </th>
                <th className="px-4 py-2 text-left text-sm text-gray-500">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border-none bg-background"
                  >
                    <option value="">Status</option>
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentQuestions
                ?.filter((q) =>
                  q.question_title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .map((question) => (
                  <tr
                    key={question.question_id}
                    className="cursor-pointer odd:bg-popover even:bg-gray-100"
                    onClick={() => handleRowClick(question.question_id)}
                  >
                    <td className="px-4 py-4 text-xs capitalize">
                      {question.question_title}
                    </td>
                    <td className="px-4 py-4 text-xs capitalize">
                      {question.course_title}
                    </td>
                    <td className="px-4 py-4 text-xs capitalize">
                      {question.lesson_title}
                    </td>
                    <td className="px-4 py-4 text-xs capitalize">
                      {question.standard_title}
                    </td>
                    <td className="px-4 py-4 text-xs">
                      <div
                        className={`${
                          question.difficulty_level === "easy"
                            ? "text-green-500"
                            : question.difficulty_level === "medium"
                              ? "text-yellow-500"
                              : "text-red-500"
                        }`}
                      >
                        <p className="capitalize">
                          {question.difficulty_level}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs">
                      {question.skill_tags?.slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className={`mr-2 rounded-md border border-gray-400 px-2 py-1 capitalize text-gray-700`}
                        >
                          {tag}
                        </span>
                      ))}
                    </td>
                    <td className="px-4 py-4 text-xs">
                      <div
                        className={`flex items-center gap-2 rounded-md p-1 ${
                          question.status === "Completed"
                            ? "border border-primary bg-primary/20 px-2"
                            : "border border-red-500 bg-red-100 px-2"
                        }`}
                      >
                        <div
                          className={`h-2 w-2 rounded-full ${
                            question.status === "Completed"
                              ? "bg-primary"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <p className="capitalize">{question.status}</p>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm text-gray-500">
                  Question Title
                </th>
                <th className="px-4 py-2 text-left text-sm text-gray-500">
                  Course
                </th>
                <th className="px-4 py-2 text-left text-sm text-gray-500">
                  Lesson
                </th>
                <th className="px-4 py-2 text-left text-sm text-gray-500">
                  <select
                    value={selectedStandard}
                    onChange={(e) => setSelectedStandard(e.target.value)}
                    className="border-none bg-background"
                  >
                    <option value="">Standard</option>
                    <option value="K1">K1</option>
                    <option value="K2">K2</option>
                    <option value="K3">K3</option>
                  </select>
                </th>
                <th className="px-4 py-2 text-left text-sm text-gray-500">
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="border-none bg-background"
                  >
                    <option value="">Difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </th>
                <th className="px-4 py-2 text-left text-sm text-gray-500">
                  Tags
                </th>
                <th className="px-4 py-2 text-left text-sm text-gray-500">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border-none bg-background"
                  >
                    <option value="">Status</option>
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentQuestions?.map((question) => (
                <tr
                  key={question.question_id}
                  className="cursor-pointer odd:bg-popover even:bg-gray-100"
                  onClick={() => handleRowClick(question.question_id)}
                >
                  <td className="px-4 py-4 text-xs capitalize">
                    {question.question_title}
                  </td>
                  <td className="px-4 py-4 text-xs capitalize">
                    {question.course_title}
                  </td>
                  <td className="px-4 py-4 text-xs capitalize">
                    {question.lesson_title}
                  </td>
                  <td className="px-4 py-4 text-xs capitalize">
                    {question.standard_title}
                  </td>
                  <td className="px-4 py-4 text-xs">
                    <div
                      className={`${
                        question.difficulty_level === "easy"
                          ? "text-green-500"
                          : question.difficulty_level === "medium"
                            ? "text-yellow-500"
                            : "text-red-500"
                      }`}
                    >
                      <p className="capitalize">{question.difficulty_level}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs">
                    {question.skill_tags?.slice(0, 2).map((tag, i) => (
                      <span
                        key={i}
                        className={`mr-2 rounded-md border border-gray-400 px-2 py-1 capitalize text-gray-700`}
                      >
                        {tag}
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-4 text-xs">
                    <div
                      className={`flex items-center gap-2 rounded-md p-1 ${
                        question.status === "Completed"
                          ? "border border-primary bg-primary/20 px-2"
                          : "border border-red-500 bg-red-100 px-2"
                      }`}
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${
                          question.status === "Completed"
                            ? "bg-primary"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <p className="capitalize">{question.status}</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <div>
          Showing{" "}
          <span className="font-bold">
            {startIndex + 1}-
            {Math.min(startIndex + itemsPerPage, data?.length!)}
          </span>{" "}
          from&nbsp;
          <span className="font-bold">{data?.length}</span> data
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-2xl border-2 bg-gray-100 px-2 py-2 text-xs text-primary"
          >
            <ChevronLeft />
          </button>
          <div className="rounded-2xl border-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`rounded-2xl px-4 py-2 ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-2xl border-2 bg-gray-100 px-2 py-2 text-xs text-primary"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionsList;
