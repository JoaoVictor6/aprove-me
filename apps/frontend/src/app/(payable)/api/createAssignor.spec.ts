import { apiClient } from "@/lib/apiClient";
import { useAuthStore } from "@/stores/auth";
import { faker } from "@faker-js/faker";
import { createAssignor } from "./createAssignor";

export const assignorFactory = () => ({
  document: faker.string.alphanumeric(),
  email: faker.internet.email(),
  id: faker.string.uuid(),
  name: faker.person.firstName(),
  phone: faker.phone.number(),
});

describe("createAssignor", () => {
  const tokenSetup = () => {
    const token = faker.string.uuid();
    vi.spyOn(useAuthStore, "getState").mockImplementation(() => ({
      token,
      setToken: () => {},
    }));

    return { token };
  };
  it("send jwt token on header", async () => {
    const { token } = tokenSetup();
    const expectedAuthHeader = (token: string) => ({
      ["Authorization"]: `Bearer ${token}` as const,
    });
    const assignorMock = assignorFactory();
    const apiClientPostSpy = vi.fn();
    vi.spyOn(apiClient, "post").mockImplementation(apiClientPostSpy);
    apiClientPostSpy.mockImplementation(() => ({ data: null, error: null }));

    await createAssignor(assignorMock);

    expect(apiClientPostSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.anything(),
      expect.objectContaining(expectedAuthHeader(token))
    );
  });
  it("return assignor data if success", async () => {
    tokenSetup();
    const assignorMock = assignorFactory();
    const apiClientPostSpy = vi.fn();
    vi.spyOn(apiClient, "post").mockImplementation(apiClientPostSpy);
    apiClientPostSpy.mockResolvedValue({ data: assignorMock, error: null });

    const { data } = await createAssignor(assignorMock);

    expect(data).toStrictEqual(assignorMock);
  });
  it("return error field filled if response not has OK status code", async () => {
    tokenSetup();
    const assignorMock = assignorFactory();
    const apiClientPostSpy = vi.fn();
    const apiClientErrorReturn = { message: '', status: 111 }
    vi.spyOn(apiClient, "post").mockImplementation(apiClientPostSpy);
    apiClientPostSpy.mockResolvedValue({ data: null, error: apiClientErrorReturn });

    const { error } = await createAssignor(assignorMock);

    expect(error).toStrictEqual(apiClientErrorReturn);
  });
});
