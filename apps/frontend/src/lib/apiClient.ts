"use client"
type HttpMethod = "POST" | "GET" | "PUT" | "DELETE";

const fetchFn = async <ResponseType>(
  method: HttpMethod,
  url: string,
  body?: unknown,
  header?: HeadersInit
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_BASE}${url}`,
    {
      method,
      headers: {
        ["Content-Type"]: "application/json",
        ...header,
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    return {
      error: { status: response.status, message: await response.json() },
      data: null,
    };
  }

  return {
    error: null,
    data: (await response.json()) as ResponseType,
  };
};

const apiClient = {
  post: async <ResponseType>(
    url: string,
    body: unknown,
    header?: HeadersInit
  ) => {
    return await fetchFn<ResponseType>("POST", url, body, header);
  },
  get: async <ResponseType>(url: string, header?: HeadersInit) => {
    return await fetchFn<ResponseType>("GET", url, header);
  },
};
