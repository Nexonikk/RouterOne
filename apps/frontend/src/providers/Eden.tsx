"use client"

import { treaty } from "@elysiajs/eden"
import { createContext, useContext } from "react"
// This is a TYPE-ONLY import — nothing is bundled from the backend at
// runtime, Eden just uses it to give you fully typed `.get()/.post()` calls.
// Adjust this relative path if your monorepo layout differs from
// `apps/web` + `apps/backend`.
import type { App } from "@routerone/backend"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"

export const client = treaty<App>(API_URL, {
    fetch: {
        credentials: "include",
    },
})

export type ElysiaClient = typeof client

const ElysiaClientContext = createContext<ElysiaClient>(client)

export function ElysiaClientContextProvider({ children }: { children: React.ReactNode }) {
    return <ElysiaClientContext.Provider value={client}>{children}</ElysiaClientContext.Provider>
}

export const useElysiaClient = () => useContext(ElysiaClientContext)
