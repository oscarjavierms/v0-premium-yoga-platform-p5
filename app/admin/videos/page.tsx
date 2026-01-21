import { createClient } from "@/lib/supabase/server"
import { VideosClient } from "./videos-client"

export const metadata = {
  title: "Videos (Vimeo) | Admin",
}

export default async function AdminVideosPage() {
  const supabase = await createClient()

  // Get all classes with vimeo_id
  const { data: classesWithVideos } = await supabase
    .from("classes")
    .select(
      `
      id,
      title,
      slug,
      vimeo_id,
      duration_minutes,
      is_published,
      created_at,
      instructor:instructors(name),
      program:programs(title)
    `,
    )
    .not("vimeo_id", "is", null)
    .order("created_at", { ascending: false })

  const { data: allClasses } = await supabase.from("classes").select("id, title").order("title")

  return (
    <div className="p-4 lg:p-8">
      <VideosClient videos={classesWithVideos || []} classes={allClasses || []} />
    </div>
  )
}
