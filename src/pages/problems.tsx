import { useEffect, useState } from "react";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import BotIcon from "@/components/bot-icon";
import NotFound from "@/components/not-found";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, truncateString } from "@/lib/utils";
import { useLoginMutation } from "@/store/services/auth";
import { useGetQuestionsQuery } from "@/store/services/question";
import { useGetStandardsQuery } from "@/store/services/standard";

const ITEMS_PER_PAGE = 10;

const Problems = () => {
  const navigate = useNavigate();
  const [register] = useLoginMutation();
  const { getToken, user } = useKindeAuth();
  const [token, setToken] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null
  );
  const [selectedStandard, setSelectedStandard] = useState<string | null>(null);

  const { data, isLoading } = useGetQuestionsQuery(`${token}`, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  const { data: standards } = useGetStandardsQuery(`${token}`, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  const filteredData = data
    ?.filter((q) => q.question_type === "Actual")
    .filter((q) => {
      return (
        (!searchQuery ||
          q.question_title.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (!selectedStandard || q.standard_title === selectedStandard) &&
        (!selectedDifficulty || q.difficulty_level === selectedDifficulty)
      );
    });

  const currentData = filteredData?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalItems = filteredData?.length || 0;
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

  const handleUserRegister = async () => {
    await register({
      token: `${token}`,
      credentials: {
        account_type: "student",
        designation: "Student",
        email: `${user?.email}`,
        profile_picture_url: `${user?.picture}`,
        name: `${user?.given_name} ${user?.family_name}`,
      },
    });
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleToken = async () => {
    let token: string | undefined = "";

    if (getToken) {
      token = await getToken();
    }

    setToken(token || "");
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const delta = 2;
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pageNumbers.push(i);
      } else if (
        (i === currentPage - delta - 1 || i === currentPage + delta + 1) &&
        totalPages > 7
      ) {
        pageNumbers.push("...");
      }
    }

    return pageNumbers.map((page, index) => {
      if (page === "...") {
        return (
          <span key={index} className="px-2 text-gray-500">
            ...
          </span>
        );
      }
      return (
        <button
          type="button"
          key={index}
          onClick={() => handlePageChange(Number(page))}
          className={cn(
            "size-[40px] rounded-2xl bg-gray-100 font-semibold text-black",
            {
              "bg-primary text-white": page === currentPage,
            }
          )}
        >
          {page}
        </button>
      );
    });
  };

  useEffect(() => {
    handleToken();

    if (token) {
      handleUserRegister();
    }

    localStorage.removeItem("option");
    localStorage.removeItem("questions");
  }, [getToken, token]);

  return (
    <div className="flex h-screen w-full flex-col items-start justify-start">
      <nav className="flex h-16 w-full shrink-0 items-center justify-between border-b px-5 py-2.5">
        <div className="flex items-center justify-center gap-4">
          <SidebarTrigger className="block lg:hidden" />
          <div className="text-3xl font-bold lg:text-4xl">Questions</div>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center justify-center rounded-lg border border-primary/20 bg-white pl-2.5">
            <Search className="text-primary" />
            <Input
              type="text"
              placeholder="Search by Question Title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-none bg-transparent shadow-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  className="flex w-40 justify-between"
                  variant="outline"
                >
                  <span> All Standard </span>
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-24">
                <DropdownMenuItem onClick={() => setSelectedStandard(null)}>
                  All
                </DropdownMenuItem>
                {standards?.map((standard) => (
                  <DropdownMenuItem
                    key={standard.standard_id}
                    onClick={() => setSelectedStandard(standard.standard_title)}
                  >
                    {standard.standard_title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-40" type="button" variant="outline">
                  <span> Difficulty Level</span> <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedDifficulty(null)}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedDifficulty("easy")}>
                  Easy
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedDifficulty("medium")}
                >
                  Medium
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedDifficulty("hard")}>
                  Hard
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <BotIcon />
          </div>
        </div>
      </nav>
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <Loader2 className="size-10 animate-spin text-primary" />
        </div>
      ) : //@ts-ignore
      currentData?.length > 0 ? (
        <div className="mx-auto flex h-full w-full flex-col justify-between gap-5 p-5">
          <div className="w-full">
            <Table>
              <TableHeader className="">
                <TableRow>
                  <TableHead>Question Title</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Lesson Tittle </TableHead>
                  <TableHead>Standard</TableHead>
                  <TableHead>Difficulty Level</TableHead>
                  <TableHead>Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className={cn("text-md", "")}>
                {currentData?.map((question, index) => (
                  <TableRow
                    key={index}
                    className={cn(
                      "cursor-pointer bg-gray-100 hover:bg-gray-200",
                      {
                        "bg-white": index % 2 === 0,
                      }
                    )}
                    onClick={() =>
                      navigate(`/question-attempt/${question.question_id}`)
                    }
                    title={question.question_title}
                  >
                    <TableCell className="font-medium">
                      {question.question_title}
                    </TableCell>
                    <TableCell className="">{question.course_title}</TableCell>
                    <TableCell className="">{question.lesson_title}</TableCell>
                    <TableCell className="text-start">
                      {question.standard_title}
                    </TableCell>
                    <TableCell>
                      <div className="flex w-full items-center justify-start">
                        <div
                          className={cn(
                            "w-fit text-center font-semibold capitalize",
                            {
                              "rounded-lg bg-green-200 px-2 py-0.5 text-green-700":
                                question.difficulty_level === "easy",
                              "rounded-lg bg-[#FEEBC8] px-2 py-0.5 text-yellow-700":
                                question.difficulty_level === "medium",
                              "rounded-lg bg-red-200 px-2 py-0.5 text-red-700":
                                question.difficulty_level === "hard",
                            }
                          )}
                        >
                          {question.difficulty_level}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "flex w-full gap-1.5 overflow-hidden truncate px-2"
                      )}
                    >
                      {question.skill_tags.slice(0, 2).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className={cn(
                            "w-fit shrink-0 rounded-md bg-white px-2 text-center font-medium",
                            { "bg-muted": index % 2 === 0 }
                          )}
                        >
                          {truncateString(tag, 5)}
                        </span>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex w-full items-center justify-between p-2">
            <span className="text-sm">
              Showing&nbsp;
              <span className="font-semibold">
                {startItem}-{endItem}
              </span>
              &nbsp; from <span className="font-semibold">{totalItems}</span>
              &nbsp; Questions
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-2xl border-2 border-gray-300 bg-gray-100 p-2.5 text-primary hover:bg-primary hover:text-white"
              >
                <ChevronLeft className="size-4" />
              </button>
              <div className="w-fit rounded-2xl border-2 border-gray-300 bg-gray-100 text-primary">
                {renderPagination()}
              </div>
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-2xl border-2 border-gray-300 bg-gray-100 p-2.5 text-primary hover:bg-primary hover:text-white"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <NotFound />
        </div>
      )}
    </div>
  );
};

export default Problems;
