import { api } from "./core";

export const standardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStandards: builder.query({
      query: () => ({
        url: `/standards/`,
        method: "GET",
      }),
      providesTags: ["standards"],
      transformResponse: (response: GetStandards) => response.standards,
    }),
    postStandard: builder.mutation({
      query: (body: PostStandard) => ({
        url: "/standards/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["standards"],
    }),
    getStandard: builder.query({
      query: (id: string) => ({
        url: `/standards/${id}`,
        method: "GET",
      }),
      providesTags: ["standard"],
      transformResponse: (response: GetStandard) => response,
    }),
    putStandard: builder.mutation({
      query: ({ id, body }: { id: string; body: PostStandard }) => ({
        url: `/standards/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["standard", "standards"],
    }),
    deleteStandard: builder.query({
      query: (id: string) => ({
        url: `/standards/${id}`,
        method: "DELETE",
      }),
      // @ts-ignore
      invalidatesTags: ["standards"],
    }),
  }),
});

export const {
  useGetStandardsQuery,
  usePostStandardMutation,
  useGetStandardQuery,
  usePutStandardMutation,
  useDeleteStandardQuery,
} = standardApi;
