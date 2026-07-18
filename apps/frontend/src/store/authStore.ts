"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface AuthState {
    pendingEmail: string | null
    setPendingEmail: (email: string) => void
    clearPendingEmail: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            pendingEmail: null,
            setPendingEmail: (email) => set({ pendingEmail: email }),
            clearPendingEmail: () => set({ pendingEmail: null }),
        }),
        {
            name: "routerone-auth",
            // sessionStorage, not localStorage — clears itself when the tab closes,
            // and we don't want a half-finished signup lingering forever
            storage: createJSONStorage(() => sessionStorage),
        },
    ),
)
