import { api } from "./core";

export const mathApi = api.injectEndpoints({
  endpoints: (builder) => ({
    postUserStatistics: builder.mutation({
      query: (body: PostStatistics) => ({
        url: "/statistics/",
        method: "POST",
        body,
      }),
    }),
    getUserStatistics: builder.query({
      query: ({ period, token }: { period: string; token: string }) => ({
        url: `/user-statistics/user/solved-questions/?period=${period}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["statistics"],
      transformResponse: (response: GetUserStatistics, _, { period }) => {
        if (period === "weekly") {
          return response.weekly_counts;
        }
        if (period === "monthly") {
          return response.monthly_counts;
        }
        if (period === "yearly") {
          return response.yearly_counts;
        }
      },
    }),
    getUserStatisticsSkills: builder.query({
      query: (token: string) => ({
        url: "/user-statistics/skill-level",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["statistics"],
      transformResponse: (response: { skill_level: number }) => response,
    }),

    getTotalAttempts: builder.query({
      query: (token: string) => ({
        url: "/user-statistics/total-attempts",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["statistics"],
      transformResponse: (response: { total_attempts: number }) => response,
    }),
  }),
});

export const {
  usePostUserStatisticsMutation,
  useGetUserStatisticsQuery,
  useGetUserStatisticsSkillsQuery,
  useGetTotalAttemptsQuery,
} = mathApi;
