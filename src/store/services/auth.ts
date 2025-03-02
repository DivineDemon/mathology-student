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
      transformResponse: (response: GetUser) => response,
    }),
  }),
});

export const { useLoginMutation, useGetUserQuery } = authApi;
