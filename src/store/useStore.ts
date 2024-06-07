import { create } from 'zustand'

export type User = {
    user: {
        id: number
        name: string | null
        username: string
        email: string
        token: string
        role: string
        gender: string
        birthdate: string
    } | null
}

type UserAction = {
    setUser: (payload: User['user']) => void
}
export const useUserStore = create<User & UserAction>((set) => ({
    user: null,
    setUser: (payload: User['user']) => set({user: payload})
}))
