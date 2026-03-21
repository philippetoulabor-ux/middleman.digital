'use client'

import { useEffect } from "react"
import dynamic from "next/dynamic"
import { logoConfig } from "@/lib/landing-config"

const LogoViewer = dynamic(
  () => import("@/components/LogoViewer"),
  { ssr: false, loading: () => <div className="logo-placeholder" /> }
)

export default function ClayPage() {
  useEffect(() => {
    const { style: htmlStyle } = document.documentElement
    const { style: bodyStyle } = document.body
    const prevHtml = htmlStyle.overflow
    const prevBody = bodyStyle.overflow
    htmlStyle.overflow = "hidden"
    bodyStyle.overflow = "hidden"
    return () => {
      htmlStyle.overflow = prevHtml
      bodyStyle.overflow = prevBody
    }
  }, [])

  return (
    <div className="page-clay">
      <header>
        <LogoViewer config={{ ...logoConfig, followMouse: false }} />
      </header>
      <main className="project-page-main" />
    </div>
  )
}
