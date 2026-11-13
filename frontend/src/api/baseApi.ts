import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Post } from "../types/post";

type RegisterRequest = {
    email: string;
    password: string;
};

type RegisterResponse = {
    id: number;
    email: string;
};

type LoginRequest = {
    email: string;
    password: string;
};

type LoginResponse = {
    user: {
        id: number;
        email: string;
    };
};

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8000"
    }),
    endpoints: (builder) => ({
        getPosts: builder.query<Post[], void>({
            query: () => "/posts"
        }),
        register: builder.mutation<RegisterResponse, RegisterRequest>({
            query: (data) => ({
                url: "/auth/register",
                method: "POST",
                body: data
            })
        }),
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (data) => ({
                url: "/auth/login",
                method: "POST",
                body: data
            })
        })
    })
});

export const { useGetPostsQuery, useRegisterMutation, useLoginMutation } = baseApi;
