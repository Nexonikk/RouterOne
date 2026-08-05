import ApproachTable from "@/components/docs/ApproachTable"
import CodeBlock from "@/components/docs/CodeBlock"
import InfoCallout from "@/components/docs/InfoCallout"
import type { ContentBlock } from "@/types/docs"

export default function DocsBlockRenderer({ blocks }: { blocks: ContentBlock[] }) {
    return (
        <div className="flex flex-col gap-5">
            {blocks.map((block, idx) => (
                <DocsBlock key={idx} block={block} />
            ))}
        </div>
    )
}

function DocsBlock({ block }: { block: ContentBlock }) {
    switch (block.type) {
        case "paragraph":
            return <p className="text-[15px] leading-7 text-zinc-400">{block.text}</p>

        case "heading": {
            const Tag = block.depth === 2 ? "h2" : "h3"
            return (
                <Tag
                    id={block.id}
                    className={
                        block.depth === 2
                            ? "mt-4 scroll-mt-32 text-[22px] font-semibold tracking-tight text-white"
                            : "mt-2 scroll-mt-32 text-[17px] font-semibold text-white"
                    }
                >
                    {block.text}
                </Tag>
            )
        }

        case "table":
            return <ApproachTable rows={block.rows} />

        case "callout":
            return <InfoCallout tone={block.tone} text={block.text} href={block.href} />

        case "code":
            return (
                <CodeBlock language={block.language} filename={block.filename} code={block.code} />
            )

        case "list":
            return (
                <ul className="flex flex-col gap-2">
                    {block.items.map((item) => (
                        <li key={item} className="flex gap-3 text-[15px] leading-7 text-zinc-400">
                            <span className="mt-[11px] h-1 w-1 shrink-0 rounded-full bg-indigo-400" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            )

        default:
            return null
    }
}
