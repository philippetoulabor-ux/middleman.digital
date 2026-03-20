'use client'

import { useEffect } from "react"
import dynamic from "next/dynamic"
import { logoConfig } from "@/lib/landing-config"
import { getProjectBySlug } from "@/content/projects"

const LogoViewer = dynamic(
  () => import("@/components/LogoViewer"),
  { ssr: false, loading: () => <div className="logo-placeholder" /> }
)

const SpinModelViewer = dynamic(
  () => import("@/components/3DspinModelViewer"),
  { ssr: false, loading: () => <div className="model-viewer-placeholder" /> }
)

const lsCandleProject = getProjectBySlug("ls-candle")
const modelUrl = lsCandleProject?.modelUrl ?? "/web/kerze_web/candle.glb"
const timelapseVideoUrl =
  lsCandleProject?.timelapseVideoUrl ??
  "/web/kerze_web/ls-candle-zeitraffer.mov"
const viewerProps = lsCandleProject?.viewerProps ?? {
  rimColor: "#FFF4E0",
  rimIntensity: 0.28,
  cameraDistance: 2.9,
  modelOffsetX: 0,
}

export default function LsCandlePage() {
  useEffect(() => {
    const link = document.createElement("link")
    link.rel = "preload"
    link.href = modelUrl
    link.as = "fetch"
    document.head.appendChild(link)
    return () => link.remove()
  }, [])

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
    <div className="page-ls-candle">
      <header>
        <LogoViewer config={{ ...logoConfig, followMouse: false }} />
      </header>
      <main className="project-page-main">
        <div className="ls-candle-split">
          <div className="ls-candle-video-wrap">
            <video
              className="ls-candle-video"
              src={timelapseVideoUrl}
              autoPlay
              loop
              muted
              playsInline
              aria-label="Kerzen Zeitraffer"
            />
          </div>
          <div className="model-viewer-frame">
            <SpinModelViewer
              className="model-viewer-in-frame"
              modelUrl={modelUrl}
              rimColor={viewerProps.rimColor}
              rimIntensity={viewerProps.rimIntensity}
              modelScale={1}
              cameraDistance={viewerProps.cameraDistance}
              modelOffsetX={viewerProps.modelOffsetX ?? 0}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
