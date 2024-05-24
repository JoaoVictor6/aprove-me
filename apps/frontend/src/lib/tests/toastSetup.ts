import * as useToastFile from "@/components/ui/use-toast";

export const toastSetup = () => {
  const toastSpy = vi.fn();
  // @ts-expect-error return type error
  vi.spyOn(useToastFile, "useToast").mockImplementation(() => ({
    toast: toastSpy,
  }));

  return { toastSpy };
};