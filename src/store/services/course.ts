import { api } from "./core";

export const courseApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCourses: build.query({
      query: (token: string) => ({
        url: `/courses/`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["courses"],
      transformResponse: (response: GetCourses) => response.courses,
    }),
    postCourse: build.mutation({
      query: (body: PostCourse) => ({
        url: "/courses",
        method: "POST",
        body,
      }),
      invalidatesTags: ["courses"],
    }),
    getCourse: build.query({
      query: (id: string) => ({
        url: `/courses/${id}`,
        method: "GET",
      }),
      providesTags: ["course"],
      transformResponse: (response: GetCourse) => response,
    }),
    putCourse: build.mutation({
      query: ({ id, body }: { id: string; body: PostCourse }) => ({
        url: `/courses/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["course", "courses"],
    }),
    deleteCourse: build.mutation({
      query: (id: string) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["courses"],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  usePostCourseMutation,
  useGetCourseQuery,
  usePutCourseMutation,
  useDeleteCourseMutation,
} = courseApi;
