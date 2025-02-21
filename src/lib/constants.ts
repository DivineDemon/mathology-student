import { Eye, TvMinimalPlay } from "lucide-react";

import Book from "@/assets/img/book.svg";
import Profile from "@/assets/img/profile.svg";
import Question from "@/assets/img/question.svg";

export const items = [
  {
    title: "Questions",
    url: "/problems",
    icon: Question,
  },
  {
    title: "Practices",
    url: "/practices",
    icon: Book,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: Profile,
  },
];

export const mockQuestions = [
  {
    id: 1,
    title: "What is the value of π (pi) ",
    course: "Mathematics",
    topic: "Identify rational & irrational numbers",
    standard: "K1",
    difficulty: "Intermediate",
    tags: ["Math", "Geometry"],
    status: "Completed",
  },
  {
    id: 2,
    title: "What is the value of π (pi)",
    course: "Mathematics",
    topic: "Identify rational & irrational numbers",
    standard: "k2",
    difficulty: "Intermediate",
    tags: ["Math", "Algebra"],
    status: "Pending",
  },
  {
    id: 3,
    title: "What is the value of π (pi)",
    course: "Mathematics",
    topic: "Identify rational & irrational numbers",
    standard: "K3",
    difficulty: "Advanced",
    tags: ["Math", "Calculus"],
    status: "Pending",
  },
  {
    id: 4,
    title: "What is the value of π (pi)",
    course: "Mathematics",
    topic: "Identify rational & irrational numbers",
    standard: "K3",
    difficulty: "Beginner",
    tags: ["Math", "Geometry"],
    status: "Completed",
  },
  {
    id: 5,
    title: "What is the value of π (pi)",
    course: "Mathematics",
    topic: "Identify rational & irrational numbers",
    standard: "K2",
    difficulty: "Advanced",
    tags: ["Math", "Factorial"],
    status: "Pending",
  },
  {
    id: 6,
    title: "What is the value of π (pi)",
    course: "Mathematics",
    topic: "Identify rational & irrational numbers",
    standard: "K3",
    difficulty: "Beginner",
    tags: ["Math", "Quadratic"],
    status: "Pending",
  },
  {
    id: 7,
    title: "What is the value of π (pi)",
    course: "Mathematics",
    topic: "Identify rational & irrational numbers",
    standard: "K1",
    difficulty: "Intermediate",
    tags: ["Math", "Triangles"],
    status: "Completed",
  },
  {
    id: 8,
    title: "What is the value of π (pi)",
    course: "Mathematics",
    topic: "Identify rational & irrational numbers",
    standard: "K1",
    difficulty: "Advanced",
    tags: ["Math", "Integration"],
    status: "Pending",
  },
  {
    id: 9,
    title: "What is the value of π (pi)",
    course: "Mathematics",
    topic: "Identify rational & irrational numbers",
    standard: "K3",
    difficulty: "Beginner",
    tags: ["Math", "Probability"],
    status: "Completed",
  },
  {
    id: 10,
    title: "What is the value of π (pi)",
    course: "Mathematics",
    topic: "Identify rational & irrational numbers",
    standard: "K2",
    difficulty: "Beginner",
    tags: ["Math", "Simplification"],
    status: "Pending",
  },
];

export const practice = [
  {
    id: 1,
    title: "What is the value of π (pi) to two decimal places?",
    video: TvMinimalPlay,

    difficulty: "Intermediate",

    view: Eye,
  },
  {
    id: 2,
    title: "Solve for x: 2x + 5 = 15",
    course: TvMinimalPlay,

    difficulty: "Intermediate",
    status: Eye,
  },
  {
    id: 3,
    title: "What is the derivative of 3x² + 5x - 7?",
    course: TvMinimalPlay,

    difficulty: "Advanced",
    status: Eye,
  },
  {
    id: 4,
    title: "Calculate the area of a circle with a radius of 5 cm.",
    course: TvMinimalPlay,

    difficulty: "Beginner",
    status: Eye,
  },
  {
    id: 5,
    title: "Solve: 5! (factorial of 5)",
    course: TvMinimalPlay,

    difficulty: "Advanced",
    status: Eye,
  },
  {
    id: 6,
    title: "What is the solution to the quadratic equation x² - 4x + 3 = 0?",
    course: TvMinimalPlay,

    difficulty: "Beginner",
    status: Eye,
  },
  {
    id: 7,
    title:
      "If a triangle has sides 3 cm, 4 cm, and 5 cm, what type of triangle is it?",
    course: TvMinimalPlay,

    difficulty: "Intermediate",
    status: Eye,
  },
  {
    id: 8,
    title: "Evaluate the integral of x² dx.",
    course: TvMinimalPlay,

    difficulty: "Advanced",
    status: Eye,
  },
  {
    id: 9,
    title: "Find the probability of rolling a sum of 7 on two dice.",
    course: TvMinimalPlay,

    difficulty: "Beginner",
    status: Eye,
  },
  {
    id: 10,
    title: "Simplify the expression: (2x + 3)(x - 4).",
    course: TvMinimalPlay,

    difficulty: "Beginner",
    status: Eye,
  },
];
