type HttpMethod = "POST" | "GET" | "PUT" | "DELETE";

export const fetchFn = async <ResponseType>({ method, url, body, header }: {
  method: HttpMethod,
  url: string,
  body?: unknown,
  header?: HeadersInit
}) => {
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
    const { message } = await response.json() as { message: string }
    return {
      error: { status: response.status, message },
      data: null,
    };
  }

  return {
    error: null,
    data: (await response.json()) as ResponseType,
  };
};
