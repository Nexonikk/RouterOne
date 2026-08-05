import DocsBreadcrumb from "@/components/docs/DocsBreadcrumb"
import CopyPageButton from "@/components/docs/CopyPageButton"

export default function DocsPageHeader({
    eyebrow,
    title,
    description,
}: {
    eyebrow: string
    title: string
    description: string
}) {
    return (
        <div className="mb-8 flex flex-col gap-3">
            <div className="flex flex-col-reverse items-start justify-between gap-4 sm:flex-row">
                <div className="flex flex-col gap-3">
                    <DocsBreadcrumb eyebrow={eyebrow} />
                    <h1 className="text-[26px] font-semibold tracking-tight text-white sm:text-[34px]">
                        {title}
                    </h1>
                </div>
                <CopyPageButton />
            </div>
            <p className="text-[15px] text-zinc-500 sm:text-[16px]">{description}</p>
        </div>
    )
}
