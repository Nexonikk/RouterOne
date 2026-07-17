"use client";

import { QueryProvider } from "@/providers/QueryProvider";
import { ElysiaClientContextProvider } from "@/providers/Eden";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ElysiaClientContextProvider>{children}</ElysiaClientContextProvider>
    </QueryProvider>
  );
}
