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
    postAttemptQuestion: builder.query({
      query: ({ id, body }: { id: string; body: string }) => ({
        url: `/questions/${id}/attempt/`,
        method: "POST",
        body,
      }),
      //@ts-ignore
      invalidatesTags: ["questions"],
    }),
  }),
});
export const {
  useGetQuestionQuery,
  useGetQuestionsQuery,
  usePostQuestionsQuery,
  usePostAttemptQuestionQuery,
} = standardApi;
