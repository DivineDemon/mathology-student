import { api } from "./core";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({
        credentials,
        token,
      }: {
        credentials: User;
        token: string;
      }) => ({
        url: "/auth/register",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: credentials,
      }),
    }),
    getUser: builder.query({
      query: (token: string) => ({
        url: "/users/me",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["user"],
      transformResponse: (response: GetUser) => response,
    }),
    updateUser: builder.mutation({
      query: ({
        body,
        token,
      }: {
        body: { name: string; profile_picture_url: string };
        token: string;
      }) => ({
        url: "/users/edit",
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const { useLoginMutation, useGetUserQuery, useUpdateUserMutation } =
  authApi;
