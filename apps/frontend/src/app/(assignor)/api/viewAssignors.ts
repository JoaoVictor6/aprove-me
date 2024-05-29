"use client";
import { apiClient } from "@/lib/apiClient";
import { useAuthStore } from "@/stores/auth";
import { z } from "zod";
import { AssignorSchema } from "../assignor.schema";

const VIEW_ASSIGNOR_PATH = (...targetColumns: string[]) =>
  `/integrations/assignor?columns=${targetColumns.join(",")}`;
type Assignor = z.infer<typeof AssignorSchema>
type AssignorColumns = keyof Assignor
export const viewAssignor = async <T extends AssignorColumns[]>(
  ...columns: T
) => {
  const token = useAuthStore.getState().token;
  const { data, error } = await apiClient.get<
    Pick<Assignor, T[number]>[]
  >(VIEW_ASSIGNOR_PATH(...columns), {
    ["Authorization"]: `Bearer ${token}`,
  });

  return { data, error };
};

