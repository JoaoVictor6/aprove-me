"use client"
import { apiClient } from "@/lib/apiClient"
import { useAuthStore } from "@/stores/auth"
import { z } from "zod"
import { CreatePayableSchema, PayableSchema } from "../payable.schema"

const CREATE_PAYABLE_PATH = '/integrations/payable'

export const createPayable = async (assignor: z.infer<typeof CreatePayableSchema>) => {
  const token = useAuthStore.getState().token

  const { data, error } = await apiClient.post<z.infer<typeof PayableSchema>>(CREATE_PAYABLE_PATH, assignor, { ['Authorization']: `Bearer ${token}`})

  return { data, error }
}