"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

type FAQItem = {
    question: string
    answer: string
}

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02]">
            {items.map((item, index) => {
                const isOpen = openIndex === index

                return (
                    <div
                        key={item.question}
                        className="border-b border-white/[0.08] last:border-b-0"
                    >
                        <button
                            type="button"
                            onClick={() => setOpenIndex(isOpen ? null : index)}
                            aria-expanded={isOpen}
                            className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left transition-colors hover:bg-white/[0.03]"
                        >
                            <span className="text-[15px] font-medium text-zinc-100">
                                {item.question}
                            </span>

                            <ChevronDown
                                className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 ${
                                    isOpen ? "rotate-180 text-zinc-300" : ""
                                }`}
                            />
                        </button>

                        <div
                            className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                            }`}
                        >
                            <div className="overflow-hidden">
                                <div className="px-5 pb-5 pr-12 text-[14px] leading-7 text-zinc-400">
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
