# RouterOne — Next.js frontend (`apps/web`)

This is a straight port of the Bun+React (`apps/frontend`) app to Next.js 15
App Router, using Bun as the package manager/runtime, wired to your Elysia
backend via `@elysiajs/eden`. It is a **drop-in sibling** to `apps/frontend`,
not a replacement — nothing in `apps/backend` was touched.

## 1. Where this goes

Copy (or unzip) this folder into your monorepo as `apps/web`:

```
OneAPI/
  apps/
    ai-backend/
    backend/
    frontend/       <- your existing Bun+React app, untouched
    web/             <- this new Next.js app
  packages/
    db/
    ui/
```

Then add it to your root `package.json` workspaces (if not using a glob like
`"apps/*"` already):

```json
{
  "workspaces": ["apps/*", "packages/*"]
}
```

## 2. Two assumptions I had to make

I ported everything you sent 1:1, but I don't have your `apps/backend`
routing code (`app.ts`, `auth/index.ts`), so **two things are guesses** based
on naming patterns already visible in your pasted files (`auth["sign-in"]`,
`auth["sign-up"]`, `auth.profile.get()`):

1. **`GET /auth/profile`** — used by `useAuth()` (`src/hooks/useAuth.ts`) to
   check if the user is logged in, for `ProtectedRoute`. Your `Credits.tsx`
   already calls this exact endpoint, so this one is confirmed correct.
2. **`POST /auth/sign-out`** — used by `useSignOut()`
   (`src/hooks/useSignOut.ts`). This one is **not confirmed** — if your real
   route is named differently (e.g. `auth.logout`), update that one line.

If `GET /auth/profile` returns 401/error when there's no session cookie (as
opposed to erroring for some other reason), `ProtectedRoute` will work
exactly like your old `ProtectedRoute.tsx` did.

## 3. Backend `App` type import

`src/providers/Eden.tsx` imports the type (not the runtime code) like this:

```ts
import type { App } from "../../../backend/src/app";
```

This assumes `apps/web` sits next to `apps/backend`, and that
`apps/backend/src/app.ts` has `export type App = typeof app` (or similar) —
the same type your old `Eden.tsx` imported as `@routerone/backend`. If you'd
rather use the package name instead of a relative path, add this to
`apps/backend/package.json`:

```json
{ "name": "@routerone/backend", "types": "./src/app.ts" }
```

and change the import back to `import type { App } from "@routerone/backend"`.
`package.json` in this app already lists `"@routerone/backend": "workspace:*"`
as a dependency for that case — delete it if you stick with the relative path.

## 4. Backend URL & CORS

Copy `.env.local.example` to `.env.local` and set your backend URL:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

This app runs on **port 3001** (`bun run dev` below) so it doesn't collide
with `apps/frontend` on 3000/whatever it already uses. Make sure your Elysia
`cors()` plugin in `apps/backend` allows `http://localhost:3001` as an origin
and `credentials: true`, or the cookie-based session won't come through.

## 5. Install & run

```bash
cd apps/web
bun install
bun run dev
```

Visit http://localhost:3001.

## 6. What was ported

| Old (React Router)              | New (Next.js App Router)         |
|----------------------------------|-----------------------------------|
| `App.tsx` route table            | `src/app/*/page.tsx` files        |
| `frontend.tsx` (entry)           | `src/app/layout.tsx`              |
| `providers/Eden.tsx`             | `src/providers/Eden.tsx`          |
| `ElysiaClientContextProvider`    | `src/providers/Providers.tsx`     |
| `components/ProtectedRoute.tsx`  | `src/components/ProtectedRoute.tsx` (client-side, wraps each protected page) |
| `components/DashboardLayout.tsx` | `src/components/DashboardLayout.tsx` (uses `usePathname`/`next/link`) |
| `components/Footer.tsx`          | `src/components/Footer.tsx`       |
| `pages/Landing.tsx`              | `src/app/page.tsx`                |
| `pages/Signin.tsx`               | `src/app/signin/page.tsx`         |
| `pages/Signup.tsx`               | `src/app/signup/page.tsx`         |
| `pages/Dashboard.tsx`            | `src/app/dashboard/page.tsx`      |
| `pages/Credits.tsx`              | `src/app/credits/page.tsx`        |
| `pages/ApiKeys.tsx`              | `src/app/api-keys/page.tsx`       |
| `hooks/useSignOut.ts`            | `src/hooks/useSignOut.ts` (redirects via `next/navigation`) |
| `components/ui/*`                | `src/components/ui/*` (same shadcn-style primitives: button, card, input, label) |

All React Query hooks, mutations, and Eden calls (`elysiaClient["api-keys"].get()`,
`.post()`, `.put()`, `({id}).delete()`, `elysiaClient.models.get()`,
`elysiaClient.payments.onramp.post()`, `elysiaClient.auth["sign-in"].post()`,
`elysiaClient.auth["sign-up"].post()`) are untouched — same field names
(`credisConsumed` typo included, since that's what your backend actually
returns), same logic, same UI/Tailwind classes.

**Every page except `/`, `/signin`, `/signup` is a client component wrapped
in `<ProtectedRoute>`** — unauthenticated users get redirected to `/signin`,
matching your old router-based `ProtectedRoute`.

## 7. `RouterOne.png` logo

I didn't have your actual logo file, so `src/components/Logo.tsx` renders a
placeholder (Zap icon in a rounded box) everywhere `RouterOne.png` was used.
Drop your real file at `public/RouterOne.png` and swap `<Logo />` for
`<img src="/RouterOne.png" .../>` if you want the original branding back.
