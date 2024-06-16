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

type CartCount = {
    cartCount: number
    setCartCount: (payload: number) => void
}

export const useUserStore = create<User & UserAction>((set) => ({
    user: null,
    setUser: (payload: User['user']) => set({user: payload})
}))

export const useCartCount = create<CartCount>((set) => ({
    cartCount: 0,
    setCartCount: (payload: number) => set({cartCount: payload})
}))
