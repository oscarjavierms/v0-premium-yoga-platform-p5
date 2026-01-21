import Link from "next/link"
import { createServerClient } from "@/lib/supabase/server"
<Link
  key={i.id}
  href={`/instructor/${i.slug}`}
  className="group flex items-center gap-4 rounded-2xl border border-black/10 bg-white p-6 transition hover:border-black/20"
>
  <div className="h-14 w-14 rounded-full border border-black/10 bg-black/5 flex items-center justify-center overflow-hidden">
    <span className="text-xs font-medium text-black/70">
      {i.name
        ?.split(" ")
        .map((p: string) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()}
    </span>
  </div>

  <div className="min-w-0">
    <div className="truncate text-base font-medium text-black">
      {i.name}
    </div>
  </div>
</Link>
