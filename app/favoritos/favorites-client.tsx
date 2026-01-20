"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Heart } from "lucide-react"
import ClassCard from "@/components/content/class-card"
import { createClient } from "@/lib/supabase/client"
import type { Class } from "@/types/content"

interface FavoritesClientProps {
  favorites: Array<{ id: string; class: Class }>
  userId: string
}

export default function FavoritesClient({ favorites: initialFavorites, userId }: FavoritesClientProps) {
  const [favorites, setFavorites] = useState(initialFavorites)

  const removeFavorite = async (classId: string) => {
    const supabase = createClient()

    await supabase.from("user_favorites").delete().eq("user_id", userId).eq("class_id", classId)

    setFavorites(favorites.filter((f) => f.class.id !== classId))
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-foreground text-background py-16">
        <div className="container mx-auto px-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-background/70 hover:text-background transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al dashboard
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl font-medium">Mis Favoritos</h1>
          <p className="text-background/70 mt-2">{favorites.length} clases guardadas</p>
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {favorites.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((item) => (
                <ClassCard
                  key={item.id}
                  classData={item.class}
                  isFavorite
                  onToggleFavorite={() => removeFavorite(item.class.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
              <h2 className="font-serif text-2xl font-medium mb-2">No tienes favoritos aún</h2>
              <p className="text-muted-foreground mb-6">
                Guarda las clases que más te gusten para acceder a ellas fácilmente
              </p>
              <Link
                href="/clases"
                className="inline-flex items-center justify-center px-6 py-3 bg-foreground text-background rounded-full hover:bg-foreground/90 transition-colors"
              >
                Explorar clases
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
