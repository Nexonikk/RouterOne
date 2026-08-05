import type { DocsPage } from "@/types/docs"

// ============================================================================
// Content for every page rendered under /docs/[slug], plus the two
// standalone top-tab sections (api-reference, client-sdks). Each entry is
// self-contained: the ContentBlock[] drives both the rendered body and the
// "On this page" table of contents (via matching ids).
// ============================================================================

export const docsPages: Record<string, DocsPage> = {
    overview: {
        slug: "overview",
        eyebrow: "Overview",
        title: "Welcome to the Platform",
        description: "One routing layer for every model you want to call.",
        toc: [
            { id: "what-is-this", label: "What this platform does", depth: 1 },
            { id: "why-a-router", label: "Why route instead of calling direct", depth: 1 },
            { id: "core-capabilities", label: "Core capabilities", depth: 1 },
            { id: "next-steps", label: "Next steps", depth: 1 },
        ],
        blocks: [
            {
                type: "paragraph",
                text: "The Platform gives you a single endpoint in front of hundreds of language models, so switching providers is a config change instead of a rewrite. Fallbacks, cost-aware routing, and provider selection are handled automatically underneath that endpoint.",
            },
            { type: "heading", depth: 2, id: "what-is-this", text: "What this platform does" },
            {
                type: "paragraph",
                text: "Every request goes through one gateway. Behind it, requests are scored, matched to the cheapest capable provider, and retried against a fallback chain if a provider is degraded — without any change on your side.",
            },
            {
                type: "heading",
                depth: 2,
                id: "why-a-router",
                text: "Why route instead of calling direct",
            },
            {
                type: "list",
                items: [
                    "One integration instead of one per provider — auth, retries, and streaming are handled once.",
                    "Automatic failover keeps requests moving when an upstream provider has an outage.",
                    "Cost-aware selection routes each request to the cheapest provider that still meets your quality bar.",
                ],
            },
            { type: "heading", depth: 2, id: "core-capabilities", text: "Core capabilities" },
            {
                type: "table",
                rows: [
                    {
                        approach: "API",
                        href: "/docs/api-reference",
                        bestFor: "Full control, any language, no dependencies",
                    },
                    {
                        approach: "Client SDKs",
                        href: "/docs/client-sdks",
                        bestFor: "Type-safe model calls with minimal overhead",
                    },
                    {
                        approach: "Agent SDK",
                        bestFor: "Building agents with tool use, loops, and state",
                    },
                ],
            },
            {
                type: "callout",
                tone: "info",
                text: "New to the platform? The Quickstart walks through your first request in under five minutes.",
                href: "quickstart",
            },
            { type: "heading", depth: 2, id: "next-steps", text: "Next steps" },
            {
                type: "paragraph",
                text: "Continue to Quickstart for a working request, or read Principles first if you want to understand the routing and fallback model before writing code.",
            },
        ],
    },
    quickstart: {
        slug: "quickstart",
        eyebrow: "Overview",
        title: "Quickstart",
        description: "Get started with RouterOne",
        toc: [
            {
                id: "using-the-api",
                label: "Using the RouterOne API",
                depth: 1,
            },
            {
                id: "using-the-api-in-code",
                label: "Using the RouterOne API in code",
                depth: 1,
            },
            {
                id: "using-the-openai-sdk",
                label: "Using the OpenAI SDK",
                depth: 1,
            },
            {
                id: "third-party-sdks",
                label: "Using third-party SDKs",
                depth: 1,
            },
        ],
        blocks: [
            {
                type: "paragraph",
                text: "RouterOne provides a unified OpenAI-compatible API that gives you access to many AI models through a single endpoint. You can integrate directly with the RouterOne API using standard HTTP requests or use the official OpenAI SDK with minimal configuration changes.",
            },
            {
                type: "table",
                rows: [
                    {
                        approach: "API",
                        href: "/docs/api-reference",
                        bestFor: "Full control, any language, no dependencies",
                    },
                    {
                        approach: "OpenAI SDK",
                        bestFor: "Existing OpenAI applications with minimal code changes",
                    },
                ],
            },
            {
                type: "callout",
                tone: "info",
                text: "Looking for information about rate limits, pricing, or free models? Check the FAQ before getting started.",
            },

            {
                type: "heading",
                depth: 2,
                id: "using-the-api",
                text: "Using the RouterOne API",
            },
            {
                type: "paragraph",
                text: "RouterOne is OpenAI-compatible and can be called using standard HTTP requests. Any client capable of making HTTPS requests can communicate with the API using the OpenAI Chat Completions format.",
            },
            {
                type: "code",
                language: "bash",
                filename: "quickstart.sh",
                code: `curl -X POST https://routeroneai.vercel.app/api/v1/chat/completions \\
  -H "Authorization: Bearer $ROUTERONE_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "google/gemini-3.5-flash",
    "messages": [
      {
        "role": "user",
        "content": "What is the meaning of life?"
      }
    ]
  }'`,
            },
            {
                type: "paragraph",
                text: "Streaming responses are also supported.",
            },

            {
                type: "heading",
                depth: 2,
                id: "using-the-api-in-code",
                text: "Using the RouterOne API in code",
            },
            {
                type: "paragraph",
                text: "RouterOne is a standard REST API and can be used from any programming language capable of making HTTP requests.",
            },
            {
                type: "code",
                language: "typescript",
                filename: "quickstart.ts",
                code: `const response = await fetch(
  "https://routeroneai.vercel.app/api/v1/chat/completions",
  {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${process.env.ROUTERONE_API_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3.5-flash",
      messages: [
        {
          role: "user",
          content: "What is the meaning of life?",
        },
      ],
    }),
  }
)

const json = await response.json()

console.log(json)`,
            },
            {
                type: "code",
                language: "python",
                filename: "quickstart.py",
                code: `import os
import requests

response = requests.post(
    "https://routeroneai.vercel.app/api/v1/chat/completions",
    headers={
        "Authorization": f"Bearer {os.getenv('ROUTERONE_API_KEY')}",
        "Content-Type": "application/json",
    },
    json={
        "model": "google/gemini-3.5-flash",
        "messages": [
            {
                "role": "user",
                "content": "What is the meaning of life?"
            }
        ],
    },
)

print(response.json())`,
            },
            {
                type: "code",
                language: "go",
                filename: "quickstart.go",
                code: `package main

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"os"
)

func main() {
	body := []byte(\`{
  "model": "google/gemini-3.5-flash",
  "messages": [
    {
      "role": "user",
      "content": "What is the meaning of life?"
    }
  ]
}\`)

	req, err := http.NewRequest(
		"POST",
		"https://routeroneai.vercel.app/api/v1/chat/completions",
		bytes.NewBuffer(body),
	)
	if err != nil {
		panic(err)
	}

	req.Header.Set("Authorization", "Bearer "+os.Getenv("ROUTERONE_API_KEY"))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}

	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}

	fmt.Println(string(responseBody))
}`,
            },

            {
                type: "heading",
                depth: 2,
                id: "using-the-openai-sdk",
                text: "Using the OpenAI SDK",
            },
            {
                type: "paragraph",
                text: "RouterOne is OpenAI-compatible, so you can use the official OpenAI SDK by configuring the RouterOne base URL and API key.",
            },
            {
                type: "code",
                language: "typescript",
                filename: "openai-sdk.ts",
                code: `import OpenAI from "openai"

const client = new OpenAI({
  baseURL: "https://routeroneai.vercel.app/api/v1",
  apiKey: process.env.ROUTERONE_API_KEY,
})

const completion = await client.chat.completions.create({
  model: "google/gemini-3.5-flash",
  messages: [
    {
      role: "user",
      content: "What is the meaning of life?"
    }
  ],
})

console.log(completion)`,
            },

            {
                type: "heading",
                depth: 2,
                id: "third-party-sdks",
                text: "Using third-party SDKs",
            },
            {
                type: "paragraph",
                text: "RouterOne also works with OpenAI-compatible libraries including LangChain, Vercel AI SDK, and LlamaIndex. In most cases, you only need to configure the RouterOne base URL and API key to use your existing integration.",
            },
        ],
    },
    principles: {
        slug: "principles",
        eyebrow: "Overview",
        title: "Principles",
        description: "The rules the router follows when choosing a provider.",
        toc: [
            { id: "compatibility-first", label: "Compatibility first", depth: 1 },
            { id: "fail-open", label: "Fail open, not closed", depth: 1 },
            { id: "cost-transparency", label: "Cost transparency", depth: 1 },
            { id: "no-lock-in", label: "No lock-in", depth: 1 },
        ],
        blocks: [
            {
                type: "paragraph",
                text: "These are the constraints the routing layer is designed around. They explain why the API behaves the way it does in edge cases — degraded providers, ties in price, and partial outages.",
            },
            { type: "heading", depth: 2, id: "compatibility-first", text: "Compatibility first" },
            {
                type: "paragraph",
                text: "Every provider is normalized to the same request and response shape before it reaches you. A model swap should never require touching your parsing code.",
            },
            { type: "heading", depth: 2, id: "fail-open", text: "Fail open, not closed" },
            {
                type: "paragraph",
                text: "If a provider errors, times out, or returns a malformed response, the request is retried against the next provider in the fallback chain before an error is ever returned to you.",
            },
            {
                type: "callout",
                tone: "warning",
                text: "Fallbacks change which provider serves a request, not which model family responds — a request routed away from an unavailable provider still targets an equivalent model.",
            },
            { type: "heading", depth: 2, id: "cost-transparency", text: "Cost transparency" },
            {
                type: "paragraph",
                text: "Every response includes the exact provider used and the exact cost incurred, in the response body — no separate dashboard lookup required to reconcile spend.",
            },
            { type: "heading", depth: 2, id: "no-lock-in", text: "No lock-in" },
            {
                type: "paragraph",
                text: "Requests use the OpenAI-compatible schema by design, so leaving the platform is a base-URL change, not a migration project.",
            },
        ],
    },

    models: {
        slug: "models",
        eyebrow: "Models & Routing",
        title: "Models",
        description: "Browse available models and how they're grouped.",
        toc: [
            { id: "model-families", label: "Model families", depth: 1 },
            { id: "choosing-a-model", label: "Choosing a model", depth: 1 },
            { id: "aliases", label: "Aliases and version pinning", depth: 1 },
        ],
        blocks: [
            {
                type: "paragraph",
                text: 'Models are addressed as "publisher/model-name", the same convention across every provider, so switching families is a string change in your request.',
            },
            { type: "heading", depth: 2, id: "model-families", text: "Model families" },
            {
                type: "list",
                items: [
                    "Frontier — highest capability, priced per the underlying provider, best for complex reasoning.",
                    "Balanced — strong quality at a lower cost, the default for most production traffic.",
                    "Fast — smallest latency, best for high-volume or interactive use cases.",
                ],
            },
            { type: "heading", depth: 2, id: "choosing-a-model", text: "Choosing a model" },
            {
                type: "paragraph",
                text: "Start with a Balanced model, measure quality against your task, and move up to Frontier only for the fraction of requests that need it — most traffic doesn't.",
            },
            { type: "heading", depth: 2, id: "aliases", text: "Aliases and version pinning" },
            {
                type: "paragraph",
                text: "An alias like meta/llama-3.1-70b always resolves to the current recommended build. Pin an exact version with a date suffix if you need output to stay fixed across a provider update.",
            },
            {
                type: "code",
                language: "json",
                filename: "model-ids.json",
                code: `{
  "alias": "meta/llama-3.1-70b",
  "pinned": "meta/llama-3.1-70b@2026-05-01"
}`,
            },
        ],
    },

    faqs: {
        slug: "faqs",
        eyebrow: "Overview",
        title: "FAQs",
        description: "Answers to the questions we get most.",
        toc: [
            { id: "billing", label: "Billing", depth: 1 },
            { id: "reliability", label: "Reliability", depth: 1 },
            { id: "data-handling", label: "Data handling", depth: 1 },
        ],
        blocks: [
            { type: "heading", depth: 2, id: "billing", text: "Billing" },
            {
                type: "paragraph",
                text: "You're billed per request at the price of whichever provider actually served it, visible in each response — there's no separate subscription tier for routing itself.",
            },
            { type: "heading", depth: 2, id: "reliability", text: "Reliability" },
            {
                type: "paragraph",
                text: "Each model has multiple upstream providers where possible. If your primary provider is degraded, the request fails over automatically within the same call.",
            },
            { type: "heading", depth: 2, id: "data-handling", text: "Data handling" },
            {
                type: "paragraph",
                text: "Requests are proxied, not stored, by default. Providers may apply their own retention policies, listed per-provider on the Models page.",
            },
            {
                type: "callout",
                tone: "info",
                text: "Can't find an answer here? Open a ticket from Report Feedback in the sidebar.",
            },
        ],
    },
}

export const apiReferencePage: DocsPage = {
    slug: "api-reference",
    eyebrow: "API Reference",
    title: "API Reference",
    description: "The raw HTTP surface behind every SDK.",
    toc: [
        { id: "base-url", label: "Base URL", depth: 1 },
        { id: "authentication", label: "Authentication", depth: 1 },
        { id: "rate-limits", label: "Rate limits", depth: 1 },
    ],
    blocks: [
        {
            type: "paragraph",
            text: "Every SDK is a thin wrapper over this HTTP API. If a client library doesn't expose something you need, the endpoint is always callable directly.",
        },
        { type: "heading", depth: 2, id: "base-url", text: "Base URL" },
        { type: "code", language: "text", code: "https://api.platform.dev/v1" },
        { type: "heading", depth: 2, id: "authentication", text: "Authentication" },
        {
            type: "paragraph",
            text: "Pass your key as a bearer token. Keys are scoped to a project and can be rotated without downtime by issuing a new key before revoking the old one.",
        },
        {
            type: "code",
            language: "bash",
            code: `curl https://api.platform.dev/v1/chat/completions \\
  -H "Authorization: Bearer $PLATFORM_API_KEY"`,
        },
        { type: "heading", depth: 2, id: "rate-limits", text: "Rate limits" },
        {
            type: "paragraph",
            text: "Limits are applied per project and returned in the response headers on every call, so you can back off before hitting a 429 rather than after.",
        },
    ],
}

export const clientSdksPage: DocsPage = {
    slug: "client-sdks",
    eyebrow: "Client SDKs",
    title: "Client SDKs",
    description: "Typed wrappers for TypeScript and Python.",
    toc: [
        { id: "typescript", label: "TypeScript", depth: 1 },
        { id: "python", label: "Python", depth: 1 },
    ],
    blocks: [
        {
            type: "paragraph",
            text: "Both SDKs mirror the HTTP API one-to-one, so anything documented in the API Reference maps directly to a typed method here.",
        },
        { type: "heading", depth: 2, id: "typescript", text: "TypeScript" },
        { type: "code", language: "bash", code: "npm install @platform/sdk" },
        { type: "heading", depth: 2, id: "python", text: "Python" },
        { type: "code", language: "bash", code: "pip install platform-sdk" },
    ],
}
