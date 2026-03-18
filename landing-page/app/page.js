'use client'

import dynamic from "next/dynamic"
import { logoConfig, gridProjects } from "@/lib/landing-config"

const LogoViewer = dynamic(
  () => import("@/components/LogoViewer"),
  { ssr: false, loading: () => <div className="logo-placeholder" /> }
)

const ProjectGrid = dynamic(
  () => import("@/components/ProjectGrid"),
  { ssr: false }
)

export default function Home() {
  return (
    <>
      <header>
        <LogoViewer config={logoConfig} />
      </header>
      <main>
        <ProjectGrid projects={gridProjects} />
      </main>
    </>
  )
}
