'use client'

import { useState, useCallback } from 'react'

/**
 * Wiederverwendbare durchklickbare Slideshow.
 * @param {string[]} images - Array von Bild-URLs
 * @param {object} [options] - Optionale Props (className, maxWidth, etc.)
 */
export default function ImageSlideshow({ images = [], className = '', maxWidth = 600, height = 450 }) {
  const [index, setIndex] = useState(0)

  if (!images.length) return null

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % images.length)
  }, [images.length])

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + images.length) % images.length)
  }, [images.length])

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width
    if (x < width / 2) goPrev()
    else goNext()
  }

  return (
    <div className={`image-slideshow ${className}`.trim()} style={{ maxWidth }}>
      <div className="image-slideshow-inner" style={{ height }}>
        <button
          type="button"
          className="image-slideshow-btn image-slideshow-btn-prev"
          onClick={goPrev}
          aria-label="Vorheriges Bild"
        >
          ←
        </button>
        <div
          className="image-slideshow-viewport"
          style={{ height }}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') goPrev()
            if (e.key === 'ArrowRight') goNext()
          }}
          aria-label="Klicken: links = zurück, rechts = weiter"
        >
          <img
            src={images[index]}
            alt=""
            className="image-slideshow-img"
            draggable={false}
          />
        </div>
        <button
          type="button"
          className="image-slideshow-btn image-slideshow-btn-next"
          onClick={goNext}
          aria-label="Nächstes Bild"
        >
          →
        </button>
      </div>
    </div>
  )
}
