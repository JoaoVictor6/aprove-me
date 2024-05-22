import { faker } from "@faker-js/faker";
import { fetchFn } from "./fetchFn";

describe("fetchFn", () => {
  const mockGlobalFetch = ({
    ok,
    apiResponse,
    status,
  }: {
    ok: boolean;
    apiResponse?: unknown;
    status?: number;
  }) => {
    const globalFetchStub = vi.fn(() => ({
      json: vi.fn().mockResolvedValue(apiResponse),
      ok,
      status,
    }));
    vi.stubGlobal("fetch", globalFetchStub);
    return { globalFetchStub };
  };
  it("set method on fetch", async () => {
    const urlMock = faker.internet.url();
    const methodMock = faker.internet.httpMethod() as "GET" | "POST";
    const { globalFetchStub } = mockGlobalFetch({ ok: true });

    await fetchFn(methodMock, urlMock);

    expect(globalFetchStub).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ method: methodMock })
    );
  });
  it("inject Content-Type on header by default", async () => {
    const { globalFetchStub } = mockGlobalFetch({ ok: true });
    const urlMock = faker.internet.url();
    const methodMock = faker.internet.httpMethod() as "GET" | "POST";
    const headerObjectParam = { ["Authorization"]: "TOKEN" };
    const expectedHeaderOnFetch = {
      ...headerObjectParam,
      ["Content-Type"]: "application/json",
    };

    await fetchFn(methodMock, urlMock, undefined, headerObjectParam);

    expect(globalFetchStub).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining(expectedHeaderOnFetch),
      })
    );
  });
  it("if response is not ok, return response json and status on error property", async () => {
    const urlMock = faker.internet.url();
    const methodMock = faker.internet.httpMethod() as "GET" | "POST";
    const apiErrorJson = { message: "any error" };
    const mockHttpStatusCode = faker.internet.httpStatusCode();
    mockGlobalFetch({
      ok: false,
      apiResponse: apiErrorJson,
      status: mockHttpStatusCode,
    });

    const { error } = await fetchFn(methodMock, urlMock);

    expect(error).toStrictEqual({
      message: apiErrorJson.message,
      status: mockHttpStatusCode,
    });
  });
  it("if response is ok, return response json on data property", async () => {
    const urlMock = faker.internet.url();
    const methodMock = faker.internet.httpMethod() as "GET" | "POST";
    const responseJsonObject = { test: "test" };
    mockGlobalFetch({ ok: true, apiResponse: responseJsonObject });

    const { data } = await fetchFn(methodMock, urlMock);

    expect(data).toStrictEqual(responseJsonObject);
  });
});
