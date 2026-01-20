import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Cormorant_Garamond } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
})

export const metadata: Metadata = {
  title: "Tu Academia | Bienestar que sostiene vidas exigentes",
  description:
    "Plataforma de bienestar funcional para profesionales de alto rendimiento. Yoga, meditación, respiración y movilidad diseñados para personas que lideran.",
  keywords: ["yoga", "bienestar", "alto rendimiento", "meditación", "wellness", "profesionales"],
  openGraph: {
    title: "Tu Academia | Bienestar para el Alto Rendimiento",
    description: "Sistema de bienestar funcional para personas que lideran.",
    type: "website",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${cormorant.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
