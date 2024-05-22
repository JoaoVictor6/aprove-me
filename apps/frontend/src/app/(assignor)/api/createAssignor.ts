"use client"
import { apiClient } from "@/lib/apiClient"
import { useAuthStore } from "@/stores/auth"
import { z } from "zod"
import { AssignorSchema } from "../schema"

const CREATE_ASSIGNOR_PATH = '/integrations/assignor'

export const createAssignor = async (assignor: Omit<z.infer<typeof AssignorSchema>, "id">) => {
  const token = useAuthStore.getState().token

  const { data, error } = await apiClient.post<z.infer<typeof AssignorSchema>>(CREATE_ASSIGNOR_PATH, assignor, { ['Authorization']: `Bearer ${token}`})

  return { data, error }
}