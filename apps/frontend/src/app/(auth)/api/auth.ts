"use client"

import { apiClient } from "@/lib/apiClient"
import { StatusCodes } from "http-status-codes"

const authUrls = {
  create: '/integrations/auth'
}

export const UNAUTHORIZED_ERROR_MESSAGE = 'Usuário e/ou senha inválidos'

export const auth = async ({ login, password }: { login: string, password: string }): Promise<{
  error: string,
  data: null
} | {
  error: null,
  data: { token: string }
}> => {
  const { error, data } = await apiClient.post<{token: string}>(authUrls.create, { login, password })
  if (error) {
    if(error.status === StatusCodes.UNAUTHORIZED) {
      return {
        error: UNAUTHORIZED_ERROR_MESSAGE,
        data: null
      }
    }
    return {
      error: error.message,
      data: null
    }
  }

  return {
    error: null,
    data
  }
}