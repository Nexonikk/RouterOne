import Link from "next/link"
import type { TableRow } from "@/types/docs"

export default function ApproachTable({ rows }: { rows: TableRow[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <table className="w-full border-collapse text-left text-[14px]">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.03]">
            <th className="px-5 py-3 font-semibold text-white">Approach</th>
            <th className="px-5 py-3 font-semibold text-white">Best for</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.approach} className={idx !== rows.length - 1 ? "border-b border-white/[0.06]" : ""}>
              <td className="px-5 py-3 align-top">
                {row.href ? (
                  <Link
                    href={`/docs/${row.href}`}
                    className="font-medium text-indigo-300 underline decoration-indigo-500/40 underline-offset-4 hover:text-indigo-200"
                  >
                    {row.approach}
                  </Link>
                ) : (
                  <span className="font-medium text-zinc-200 underline decoration-zinc-700 underline-offset-4">
                    {row.approach}
                  </span>
                )}
              </td>
              <td className="px-5 py-3 align-top text-zinc-400">{row.bestFor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
