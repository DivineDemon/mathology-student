import { api } from "./core";

export const lessonApi = api.injectEndpoints({
  endpoints: (build) => ({
    getLessons: build.query({
      query: () => ({
        url: `/lessons/`,
        method: "GET",
      }),
      providesTags: ["lessons"],
      transformResponse: (response: string) => response,
    }),
    postLesson: build.mutation({
      query: (body: PostLesson) => ({
        url: "/lessons/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["lessons"],
    }),
    getLesson: build.query({
      query: (id: string) => ({
        url: `/lessons/${id}`,
        method: "GET",
      }),
      providesTags: ["lesson"],
      transformResponse: (response: GetLesson) => response,
    }),
    putLesson: build.mutation({
      query: ({ id, body }: { id: string; body: PutLesson }) => ({
        url: `/lessons/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["lessons", "lesson"],
    }),
  }),
});

export const {
  useGetLessonsQuery,
  usePostLessonMutation,
  useGetLessonQuery,
  usePutLessonMutation,
} = lessonApi;
