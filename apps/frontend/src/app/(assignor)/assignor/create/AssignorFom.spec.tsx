import { Form } from "@/components/ui/form";
import { nextNavigationSetup } from "@/lib/tests/nextNavigationSetup";
import { toastSetup } from "@/lib/tests/toastSetup";
import { faker } from "@faker-js/faker";
import { zodResolver } from "@hookform/resolvers/zod";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { FormState, useForm } from "react-hook-form";
import { z } from "zod";
import * as createAssignorFile from "../../api/createAssignor";
import {
  AssignorSchema,
  DOCUMENT_REQUIRED_ERROR,
  EMAIL_INVALID_ERROR,
  NAME_REQUIRED_ERROR,
  PHONE_REQUIRED_ERROR
} from "../../assignor.schema";
import { AssignorForm } from "./AssignorForm";

const assignorCreateSchema = AssignorSchema.omit({ id: true });
const AssignorFormWrapper = (
  formState?: Partial<FormState<z.infer<typeof assignorCreateSchema>>>
) => {
  return function FakeComponent() {
    const form = useForm<z.infer<typeof assignorCreateSchema>>({
      resolver: zodResolver(assignorCreateSchema),
      defaultValues: {
        document: "",
        email: "",
        name: "",
        phone: "",
      },
    });

    if (formState) {
      return (
        <Form {...form} formState={{ ...form.formState, ...formState }}>
          <AssignorForm />
        </Form>
      );
    }

    return (
      <Form {...form}>
        <AssignorForm />
      </Form>
    ) as ReactNode;
  };
};

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("CreateAssignorForm component", () => {
  it("render CPF/CNPJ, Email, Nome, Telefone and button field", () => {
    const FormComponent = AssignorFormWrapper();
    nextNavigationSetup();

    render(<FormComponent />);

    expect(screen.getByLabelText("CPF/CNPJ")).toBeDefined();
    expect(screen.getByLabelText("Email")).toBeDefined();
    expect(screen.getByLabelText("Nome")).toBeDefined();
    expect(screen.getByLabelText("Telefone")).toBeDefined();
    expect(screen.getByText("Submit")).toBeDefined();
  });
  it("if field value is invalid show ui feedback for field", async () => {
    const FormComponent = AssignorFormWrapper();
    render(<FormComponent />);
    await waitFor(() => {
      const button = screen.getByText("Submit");

      fireEvent.click(button);
    });

    expect(screen.getByText(PHONE_REQUIRED_ERROR)).toBeDefined();
    expect(screen.getByText(NAME_REQUIRED_ERROR)).toBeDefined();
    expect(screen.getByText(EMAIL_INVALID_ERROR)).toBeDefined();
    expect(screen.getByText(DOCUMENT_REQUIRED_ERROR)).toBeDefined();
  });
  it("if submitting form, disable submit button", async () => {
    const FormComponent = AssignorFormWrapper({ isSubmitting: true });
    const { useRouterSpy } = nextNavigationSetup();
    useRouterSpy.mockReturnValue({ push: vi.fn() });
    toastSetup();

    render(<FormComponent />);
    await waitFor(() => {
      const submitButton = screen.getByText("Submit");

      fireEvent.click(submitButton);
    });

    expect(screen.getByText("Submit")).toBeDisabled();
  });
  it("send assignor form infos to api", async () => {
    const { useRouterSpy } = nextNavigationSetup();
    useRouterSpy.mockReturnValue({ push: vi.fn() });
    toastSetup();
    const FormComponent = AssignorFormWrapper();
    const createAssignorStub = vi.fn();
    vi.spyOn(createAssignorFile, "createAssignor").mockImplementation(
      createAssignorStub
    );
    createAssignorStub.mockResolvedValue({ data: null, error: null });
    const assignorInfo: z.infer<typeof assignorCreateSchema> = {
      document: faker.string.alphanumeric(),
      email: faker.internet.email(),
      name: faker.person.firstName(),
      phone: faker.phone.number(),
    };

    render(<FormComponent />);
    await waitFor(() => {
      const document = screen.getByLabelText("CPF/CNPJ");
      const email = screen.getByLabelText("Email");
      const name = screen.getByLabelText("Nome");
      const phone = screen.getByLabelText("Telefone");
      const submitButton = screen.getByText("Submit");

      fireEvent.change(document, {
        target: { value: assignorInfo.document },
      });
      fireEvent.change(email, {
        target: { value: assignorInfo.email },
      });
      fireEvent.change(name, {
        target: { value: assignorInfo.name },
      });
      fireEvent.change(phone, {
        target: { value: assignorInfo.phone },
      });

      fireEvent.click(submitButton);
    });

    expect(createAssignorStub).toBeCalledWith(assignorInfo);
  });
});
