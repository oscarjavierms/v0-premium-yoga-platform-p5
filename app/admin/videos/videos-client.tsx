"use client"

import { useState } from "react"
import { ExternalLink, Eye, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { EmptyState } from "../components/empty-state"

interface VideoItem {
  id: string
  title: string
  slug: string
  vimeo_id: string | null
  duration_minutes: number | null
  is_published: boolean
  created_at: string
  instructor?: { name: string } | null
  program?: { title: string } | null
}

interface VideosClientProps {
  videos: VideoItem[]
  classes: { id: string; title: string }[]
}

export function VideosClient({ videos }: VideosClientProps) {
  const [search, setSearch] = useState("")
  const [previewVideo, setPreviewVideo] = useState<VideoItem | null>(null)

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(search.toLowerCase()) ||
      video.vimeo_id?.includes(search) ||
      video.instructor?.name?.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-medium">Videos (Vimeo)</h1>
          <p className="text-muted-foreground mt-1">{videos.length} videos en clases</p>
        </div>
      </div>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-800">
          <strong>Nota:</strong> Los videos se gestionan a través de las clases. Cada clase puede tener un video de
          Vimeo asociado. Aquí puedes ver todos los videos y acceder a ellos rápidamente.
        </p>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Buscar por título, ID de Vimeo o instructor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {filteredVideos.length === 0 ? (
        <EmptyState
          icon={Video}
          title="Sin videos"
          description={
            search ? "No se encontraron videos" : "Añade videos de Vimeo a las clases desde la sección Clases"
          }
          actionLabel={!search ? "Ir a Clases" : undefined}
          actionHref={!search ? "/admin/clases" : undefined}
        />
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium">Clase</th>
                <th className="text-left px-6 py-4 text-sm font-medium">Vimeo ID</th>
                <th className="text-left px-6 py-4 text-sm font-medium">Duración</th>
                <th className="text-left px-6 py-4 text-sm font-medium">Programa</th>
                <th className="text-left px-6 py-4 text-sm font-medium">Estado</th>
                <th className="text-right px-6 py-4 text-sm font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredVideos.map((video) => (
                <tr key={video.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{video.title}</p>
                      <p className="text-sm text-muted-foreground">{video.instructor?.name || "Sin instructor"}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-sm bg-muted px-2 py-1 rounded">{video.vimeo_id}</code>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">{video.duration_minutes || "-"} min</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">{video.program?.title || "-"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        video.is_published ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {video.is_published ? "Publicado" : "Borrador"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setPreviewVideo(video)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>{video.title}</DialogTitle>
                            <DialogDescription>Vimeo ID: {video.vimeo_id}</DialogDescription>
                          </DialogHeader>
                          <div className="aspect-video bg-black rounded-lg overflow-hidden">
                            <iframe
                              src={`https://player.vimeo.com/video/${video.vimeo_id}`}
                              className="w-full h-full"
                              allow="autoplay; fullscreen"
                              allowFullScreen
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                      <a href={`https://vimeo.com/${video.vimeo_id}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
