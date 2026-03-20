'use client'

import Link from "next/link"
import { useParams } from "next/navigation"
import { getProjectBySlug } from "@/content/projects"
import { getPageMeta } from "@/content/pages"

export default function ProjektPage() {
  const params = useParams()
  const slug = params?.slug ?? ""
  const project = getProjectBySlug(slug)
  const meta = getPageMeta(slug)

  const title = meta?.title ?? project?.name ?? slug

  return (
    <div className="project-placeholder-page">
      <header style={{ padding: "2vw", textAlign: "center" }}>
        <Link href="/" style={{ fontSize: "1.5rem", color: "#1a1814", textDecoration: "none" }}>
          ← Zurück
        </Link>
      </header>
      <main style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: "2rem",
        textAlign: "center",
      }}>
        <h1 style={{ fontSize: "2rem", color: "#1a1814", marginBottom: "0.5rem" }}>
          {title}
        </h1>
        <p style={{ color: "#9e9a92" }}>Diese Seite ist noch in Arbeit.</p>
      </main>
    </div>
  )
}
