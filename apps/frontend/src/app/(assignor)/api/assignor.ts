"use client"

import { apiClient } from "@/lib/apiClient"

const assignorUrls = {
  create: '/integrations/auth'
}

export const authAssignor = async ({ login, password }: { login: string, password: string }) => {
  const { error, data } = await apiClient.post<{token: string}>(assignorUrls.create, { login, password })
  if (error) throw new Error('Error handling not implemented!', { cause: error })

  console.log(data)
}