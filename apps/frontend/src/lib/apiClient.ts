"use client"

import { fetchFn } from "./fetchFn";

export const apiClient = {
  post: async <ResponseType>(
    url: string,
    body: unknown,
    header?: HeadersInit
  ) => {
    return await fetchFn<ResponseType>({ method: 'POST', url, body, header });
  },
  get: async <ResponseType>(url: string, header?: HeadersInit) => {
    return await fetchFn<ResponseType>({ method: "GET", url, header });
  },
};
