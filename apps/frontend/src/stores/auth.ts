import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthStore = { token: string, setToken: (token: string) => void }

export const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      setToken(token) {
        set({ token })
      },
      token: ''
    }),
    {
      name: 'aprove-me/auth',
    }
  )
)