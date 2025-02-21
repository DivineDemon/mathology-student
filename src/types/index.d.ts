declare type User = {
  name: string;
  email: string;
  designation: string;
  account_type: string;
  profile_picture_url: string;
};

declare type GlobalState = {
  token: string | null;
};

declare type GetUser = {
  user_id: string;
  name: string;
  email: string;
  designation: string;
  account_type: student;
  profile_picture_url: string;
  created_at: string;
  updated_at: string;
  total_attempts?: number;
};

declare type GetCourses = {
  total: number;
  page: number;
  size: number;
  courses: {
    course_title: string;
    course_id: number;
    user_id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
  }[];
};

declare type PostCourse = {
  course_title: string;
};

declare type GetCourse = {
  course_title: string;
  course_id: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};

declare type PostLesson = {
  lesson_title: string;
  lesson_description: string;
  lesson_header: string;
  lesson_file: string;
  course_id: number;
  standard_id: number;
  skill_tags: string[];
};

declare type GetLesson = {
  lesson_title: string;
  lesson_description: string;
  lesson_header: string;
  lesson_file: string;
  lesson_id: number;
  user_id: string;
  course_title: string;
  standard_title: string;
  skill_tags: string[];
  created_at: string;
  updated_at: string;
};

declare type PutLesson = {
  lesson_title: string;
  lesson_description: string;
  lesson_header: string;
  lesson_file: string;
  skill_tags: string[];
};

declare type GetStandards = {
  total: number;
  page: number;
  size: number;
  standards: {
    standard_title: strin0g;
    standard_id: number;
    created_at: string;
    updated_at: string;
  }[];
};

declare type PostStandard = {
  standard_title: string;
};

declare type GetStandard = {
  standard_title: strin0g;
  standard_id: number;
  created_at: string;
  updated_at: string;
};

declare type GetQuestion = {
  question_title: string;
  question_description: string;
  status: string;
  difficulty_level: string;
  question_type: Practice;
  answer_type: MCQs;
  solution_file: string;
  question_id: number;
  user_id: string;
  lesson_title: string;
  course_title: string;
  standard_title: string;
  skill_tags: string[];
  created_at: string;
  updated_at: string;
  total_attempts?: number;
};

declare type PutQuestion = {
  question_title: string;
  question_description: string;
  status: string;
  difficulty_level: string;
  question_type: Practice;
  answer_type: MCQs;
  solution_file: string;
  skill_tags: string[];
};

declare type PostQuestions = {
  question_title: string;
  question_description: string;
  status: string;
  difficulty_level: string;
  question_type: Practice;
  answer_type: MCQs;
  solution_file: string;
  course_id: number;
  lesson_id: number;
  standard_id: number;
  skill_tags: string[];
};

declare type GetQuestions = {
  total: number;
  page: number;
  size: number;
  questions: GetQuestion[];
};

declare type PostMath = {
  question_id: number;
  image_url: string;
};

declare type PostStatistics = {
  user_id: string;
  question_id: Number;
};

declare type GetUserStatistics = {
  weekly_counts?: {
    date: string;
    count: number;
  }[];
  monthly_counts?: {
    date: string;
    count: number;
  }[];
  yearly_counts?: {
    date: string;
    count: number;
  }[];
};

declare type Stats = {
  date: string;
  count: number;
};
