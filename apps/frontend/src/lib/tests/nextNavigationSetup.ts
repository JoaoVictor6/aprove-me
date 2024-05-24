import * as nextNavigationFile from "next/navigation";

export const nextNavigationSetup = () => {
  const useRouterSpy = vi.fn();
  vi.spyOn(nextNavigationFile, "useRouter").mockImplementation(useRouterSpy);

  return { useRouterSpy };
};