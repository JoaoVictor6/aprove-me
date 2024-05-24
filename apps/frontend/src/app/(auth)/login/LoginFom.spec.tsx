import { Form } from "@/components/ui/form";
import * as useToastFile from "@/components/ui/use-toast";
import * as authStore from "@/stores/auth";
import { faker } from "@faker-js/faker";
import { zodResolver } from "@hookform/resolvers/zod";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as nextNavigationFile from "next/navigation";
import { ReactNode } from "react";
import { FormState, useForm } from "react-hook-form";
import { z } from "zod";
import * as authFile from "../api/auth";
import { LoginForm } from "./LoginForm";
import {
  ADD_VALID_LOGIN_MESSAGE,
  ADD_VALID_PASSWORD_MESSAGE,
  loginSchema,
} from "./login.schema";

const authFunctionSetup = () => {
  const authFnSpy = vi.fn();
  vi.spyOn(authFile, "auth").mockImplementation(authFnSpy);
  return { authFnSpy };
};
const toastSetup = () => {
  const toastSpy = vi.fn();
  // @ts-expect-error return type error
  vi.spyOn(useToastFile, "useToast").mockImplementation(() => ({
    toast: toastSpy,
  }));

  return { toastSpy };
};
const authStoreSetup = () => {
  const setTokenSpy = vi.fn();
  vi.spyOn(authStore, "useAuthStore").mockImplementation(() => setTokenSpy);

  return { setTokenSpy };
};
const LoginFormWrapper = (
  formState?: Partial<FormState<z.infer<typeof loginSchema>>>
) => {
  return function FakeComponent() {
    const form = useForm<z.infer<typeof loginSchema>>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
        login: "",
        password: "",
      },
    });

    if (formState) {
      return (
        <Form {...form} formState={{ ...form.formState, ...formState }}>
          <LoginForm />
        </Form>
      );
    }

    return (
      <Form {...form}>
        <LoginForm />
      </Form>
    ) as ReactNode;
  };
};
const nextNavigationSetup = () => {
  const useRouterSpy = vi.fn();
  vi.spyOn(nextNavigationFile, "useRouter").mockImplementation(useRouterSpy);

  return { useRouterSpy };
};
const fillAndSubmitLoginForm = () => {
  const password = screen.getByLabelText("Password");
  const submitButton = screen.getByText("Submit");
  const login = screen.getByLabelText("Login");

  fireEvent.change(login, {
    target: { value: faker.internet.exampleEmail() },
  });
  fireEvent.change(password, {
    target: { value: faker.internet.password() },
  });
  fireEvent.click(submitButton);
};

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("LoginForm component", () => {
  it("render login, password and button field", () => {
    const FormComponent = LoginFormWrapper();
    nextNavigationSetup();

    render(<FormComponent />);

    expect(screen.getByLabelText("Password")).toBeDefined();
    expect(screen.getByLabelText("Login")).toBeDefined();
    expect(screen.getByText("Submit")).toBeDefined();
  });
  it("if field value is invalid show ui feedback for field", async () => {
    const FormComponent = LoginFormWrapper();
    render(<FormComponent />);
    await waitFor(() => {
      const button = screen.getByText("Submit");

      fireEvent.click(button);
    });

    expect(screen.getByText(ADD_VALID_LOGIN_MESSAGE)).toBeDefined();
    expect(screen.getByText(ADD_VALID_PASSWORD_MESSAGE)).toBeDefined();
  });
  it("if submitting form, disable submit button", async () => {
    const token = "token";
    const FormComponent = LoginFormWrapper({ isSubmitting: true });
    authStoreSetup();
    const { useRouterSpy } = nextNavigationSetup();
    useRouterSpy.mockReturnValue({ push: vi.fn() });
    toastSetup();
    const { authFnSpy } = authFunctionSetup();
    authFnSpy.mockResolvedValue({
      data: { token },
      error: null,
    });

    render(<FormComponent />);
    await waitFor(() => {
      fillAndSubmitLoginForm();
    });

    expect(screen.getByText("Submit")).toBeDisabled();
  });
  it("set received token on useAuthStore", async () => {
    const { useRouterSpy } = nextNavigationSetup();
    useRouterSpy.mockReturnValue({ push: vi.fn() });
    toastSetup();
    const token = "token";
    const { authFnSpy } = authFunctionSetup();
    authFnSpy.mockResolvedValue({
      data: { token },
      error: null,
    });
    const { setTokenSpy } = authStoreSetup();
    const FormComponent = LoginFormWrapper();

    render(<FormComponent />);
    await waitFor(() => {
      fillAndSubmitLoginForm();
    });

    expect(setTokenSpy).toBeCalledWith(token);
  });
});
