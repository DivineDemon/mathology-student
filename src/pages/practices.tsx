import { useEffect, useState } from "react";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Modal from "@/components/modal-prctice";
import { Button } from "@/components/ui/button";
import { useGetQuestionsQuery } from "@/store/services/question";

const QuestionsList = () => {
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const { getToken } = useKindeAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedStandard, setSelectedStandard] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    handleToken();
  }, [getToken]);

  return (
    <div className="w-full overflow-hidden px-4">
      <div className="flex flex-col items-center justify-between md:flex-row">
        <div className="flex flex-col">
          <h1 className="text-4xl font-extrabold">Practices</h1>
          <p className="font-semibold text-gray-400">Retrieval: 24/100</p>
        </div>
        <div className="relative">
          <Button onClick={openModal}>Start Practice</Button>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Start Practice">
        <div className="mt-4 flex justify-end gap-2">
          <Button>Start</Button>
        </div>
      </Modal>

      <div className="my-4 h-[1.5px] w-full bg-gray-200"></div>

      <div className="h-[calc(100vh-210px)] max-w-[calc(100vw-42px)] overflow-auto">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="size-10 animate-spin text-primary" />
          </div>
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
                  Topic
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
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
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
                ?.filter((question) => question.question_type === "Practice")
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
                      {question.skill_tags.slice(0, 2).map((tag, i) => (
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
