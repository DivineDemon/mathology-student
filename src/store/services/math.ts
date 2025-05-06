import { api } from "./core";

export const mathApi = api.injectEndpoints({
  endpoints: (build) => ({
    postMathQuery: build.mutation({
      query: (body: PostMath) => ({
        url: "/math/query",
        method: "POST",
        body,
      }),
    }),
    postMathSol: build.mutation({
      query: ({
        question_id,
        query,
        token,
      }: {
        question_id: number;
        query: string;
        token: string;
      }) => ({
        url: "/math/solution",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          question_id,
          query,
        },
      }),
    }),
    postMathSolution: build.mutation({
      query: ({
        question_id,
        query,
        token,
      }: {
        question_id: number;
        query: string;
        token: string;
      }) => ({
        url: "/math/query",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          question_id,
          query,
        },
      }),
    }),
    postMathSolveMath: build.mutation({
      query: ({ body, token }: { body: PostMath; token: string }) => ({
        url: "/math/solve-math",
        method: "POST",
        body,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      transformResponse: (response: { solution: string }) => response.solution,
    }),
    chatbot: build.mutation({
      query: ({
        question_title,
        query,
        token,
      }: {
        question_title: string;
        query: string;
        token: string;
      }) => ({
        url: "/math/query",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          question_title,
          query,
        },
      }),
    }),
    mathSupportAIBot: build.mutation({
      query: ({
        query,
        token,
      }: {
        query: string;
        token: string;
      }) => ({
        url: "/math/support/ai-bot",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: { query },
      }),
    }),
  }),
});
export const {
  usePostMathQueryMutation,
  usePostMathSolutionMutation,
  usePostMathSolveMathMutation,
  useChatbotMutation,
  usePostMathSolMutation,
  useMathSupportAIBotMutation,
} = mathApi;
