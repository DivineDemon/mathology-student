import { api } from "./core";

export const standardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getQuestion: builder.query({
      query: ({ id, token }: { id: string; token: string }) => ({
        url: `/questions/id/?question_id=${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["questions"],
      transformResponse: (response: GetQuestion) => response,
    }),
    putQuestion: builder.query({
      query: ({ id, body }: { id: string; body: PutQuestion }) => ({
        url: `/questions/${id}`,
        method: "PUT",
        body,
      }),
      //@ts-ignore
      invalidatesTags: ["questions", "question"],
    }),
    deleteQuestion: builder.query({
      query: (id: string) => ({
        url: `/questions/${id}`,
        method: "DELETE",
      }),
      //@ts-ignore
      invalidatesTags: ["questions"],
    }),
    getQuestions: builder.query({
      query: (token: string) => ({
        url: `/questions/`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["questions"],
      transformResponse: (response: GetQuestions) => response.questions,
    }),
    postQuestions: builder.query({
      query: (body: PostQuestions) => ({
        url: `/questions/`,
        method: "POST",
        body,
      }),
      //@ts-ignore
      invalidatesTags: ["questions"],
    }),
    postAttemptQuestion: builder.mutation({
      query: ({ id, token }: { id: number; token: string }) => ({
        url: `/questions/${id}/attempt/`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getQuestionAttempts: builder.query({
      query: ({ id, token }: { id: number; token: string }) => ({
        url: `/questions/${id}/attempts/`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      transformResponse: (response: {
        question_id: number;
        total_attempts: number;
      }) => response.total_attempts,
    }),
  }),
});
export const {
  useGetQuestionQuery,
  useGetQuestionsQuery,
  usePostQuestionsQuery,
  useGetQuestionAttemptsQuery,
  usePostAttemptQuestionMutation,
} = standardApi;
