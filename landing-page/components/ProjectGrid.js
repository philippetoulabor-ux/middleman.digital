'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"

const VIDEO_EXTS = new Set(["mp4", "webm", "mov", "ogg"])

function isVideo(src) {
  if (!src) return false
  const ext = src.split("?")[0].split(".").pop()?.toLowerCase()
  return !!ext && VIDEO_EXTS.has(ext)
}

export default function ProjectGrid({ projects = [] }) {
  const wrapperRef = useRef(null)
  const previewVideoRef = useRef(null)
  const activeKeyRef = useRef(null)

  const [isTouch, setIsTouch] = useState(false)
  const [active, setActive] = useState(null) // { project, key }
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [ratiosCache, setRatiosCache] = useState({}) // { [previewSrc]: w/h }
  const [previewHeightPx, setPreviewHeightPx] = useState(450)

  activeKeyRef.current = active?.key ?? null

  useLayoutEffect(() => {
    const el = wrapperRef.current
    if (!el || typeof window === "undefined") return
    const val = getComputedStyle(el).getPropertyValue("--pg-preview-height").trim()
    const num = parseFloat(val)
    if (!isNaN(num)) setPreviewHeightPx(num)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia("(hover: none)")
    const update = () => setIsTouch(!!mq.matches)
    update()
    mq.addEventListener?.("change", update)
    return () => mq.removeEventListener?.("change", update)
  }, [])

  useEffect(() => {
    if (isTouch) return
    if (!active) return

    const onMove = (e) => setMouse({ x: e.clientX, y: e.clientY })
    document.addEventListener("mousemove", onMove)
    return () => document.removeEventListener("mousemove", onMove)
  }, [active, isTouch])

  useEffect(() => {
    // stop/reset video when active preview changes
    const v = previewVideoRef.current
    if (!v) return
    v.pause()
    v.currentTime = 0
  }, [active?.key])

  const preview = active?.project?.preview || ""
  const previewIsVideo = isVideo(preview)
  const previewHeight = previewHeightPx
  const ratio = preview ? ratiosCache[preview] : null
  const previewWidth = ratio ? Math.round(previewHeight * ratio) : 300

  const previewPos = useMemo(() => {
    const CURSOR_OFFSET = 20
    const EDGE_MARGIN = 32
    const vw = typeof window !== "undefined" ? window.innerWidth : 0
    const vh = typeof window !== "undefined" ? window.innerHeight : 0

    let x = mouse.x + CURSOR_OFFSET
    let y = mouse.y + CURSOR_OFFSET

    if (vw) {
      if (x + previewWidth > vw - EDGE_MARGIN) x = mouse.x - previewWidth - CURSOR_OFFSET
      if (x < EDGE_MARGIN) x = EDGE_MARGIN
    }
    if (vh) {
      if (y + previewHeight > vh - EDGE_MARGIN) y = mouse.y - previewHeight - CURSOR_OFFSET
      if (y < EDGE_MARGIN) y = EDGE_MARGIN
    }

    return { left: x, top: y }
  }, [mouse.x, mouse.y, previewWidth, previewHeight])

  return (
    <div id="grid-container" ref={wrapperRef} className="pg-wrapper">
      <div className="project-grid pg-grid">
        {projects.map((project, i) => {
          const href = project?.href || ""
          const clickable = !!href
          const key = `${i}-${project?.name ?? ""}-${href}`

          return (
            <a
              key={key}
              href={href || undefined}
              className={`pg-cell${clickable ? " is-clickable" : ""}`}
              onMouseEnter={() => {
                if (isTouch) return
                setActive({ project, key })
              }}
              onMouseLeave={() => {
                if (isTouch) return
                setActive(null)
              }}
            >
              <span className="pg-name">{project?.name ?? ""}</span>
              <span className="pg-cat">{project?.category ?? ""}</span>
            </a>
          )
        })}
      </div>

      {!isTouch && active && preview ? (
        <div
          className="pg-preview"
          style={{
            display: "block",
            width: `${previewWidth}px`,
            height: `${previewHeight}px`,
            left: `${previewPos.left}px`,
            top: `${previewPos.top}px`,
          }}
        >
          {previewIsVideo ? (
            <video
              ref={previewVideoRef}
              className="pg-preview-video"
              style={{ display: "block" }}
              muted
              playsInline
              loop
              src={preview}
              onLoadedMetadata={(e) => {
                const v = e.currentTarget
                if (v.videoWidth && v.videoHeight && activeKeyRef.current === active?.key) {
                  const r = v.videoWidth / v.videoHeight
                  setRatiosCache((prev) => ({ ...prev, [preview]: r }))
                }
                v.currentTime = 0
                v.play().catch(() => {})
              }}
            />
          ) : (
            <img
              className="pg-preview-img"
              style={{ display: "block" }}
              src={preview}
              alt=""
              onLoad={(e) => {
                const img = e.currentTarget
                if (img.naturalWidth && img.naturalHeight && activeKeyRef.current === active?.key) {
                  const r = img.naturalWidth / img.naturalHeight
                  setRatiosCache((prev) => ({ ...prev, [preview]: r }))
                }
              }}
            />
          )}
        </div>
      ) : null}
    </div>
  )
}
