"use client"

import { useState } from "react"
import { Highlight, themes } from "prism-react-renderer"

export default function CodeBlock({
    language,
    filename,
    code,
}: {
    language: string
    filename?: string
    code: string
}) {
    const [copied, setCopied] = useState(false)

    async function handleCopy() {
        await navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    return (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0c]">
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-2">
                <span className="text-[12px] text-zinc-500">{filename ?? language}</span>
                <button
                    type="button"
                    onClick={handleCopy}
                    className="text-[12px] font-medium text-zinc-500 transition-colors hover:text-indigo-300"
                >
                    {copied ? "Copied" : "Copy"}
                </button>
            </div>

            {/* ___________________ */}

            <div className="overflow-x-auto">
                <Highlight theme={themes.vsDark} code={code} language={language as any}>
                    {({ className, style, tokens, getLineProps, getTokenProps }) => (
                        <pre
                            className={`${className} px-4 py-3.5 text-[13px] leading-relaxed`}
                            style={{
                                ...style,
                                margin: 0,
                                background: "transparent",
                            }}
                        >
                            {tokens.map((line, i) => (
                                <div key={i} {...getLineProps({ line })}>
                                    {line.map((token, key) => (
                                        <span key={key} {...getTokenProps({ token })} />
                                    ))}
                                </div>
                            ))}
                        </pre>
                    )}
                </Highlight>
            </div>
        </div>
    )
}
