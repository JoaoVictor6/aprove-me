import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthStore = { token: string, setToken: (token: string) => void }

export const useAuthStore = create(
  persist<AuthStore>(
    (_get, set) => ({
      setToken(token) {
        set().token = token;
      },
      token: ''
    }),
    {
      name: 'aprove-me/auth',
    }
  )
)