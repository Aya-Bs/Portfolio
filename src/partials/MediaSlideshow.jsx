import { useEffect, useRef, useState } from 'react'

export default function MediaSlideshow({ media }) {
  const items = [
    ...(media?.images || []).map((m) => ({ ...m, type: 'image' })),
    ...(media?.videos || []).map((m) => ({ ...m, type: 'video' })),
  ]

  const trackRef = useRef(null)
  const scrollIntervalRef = useRef(null)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => {
    if (lightboxIndex === null) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [lightboxIndex])

  if (items.length === 0) return null

  const startScrolling = (dir) => {
    stopScrolling()
    scrollIntervalRef.current = setInterval(() => {
      const el = trackRef.current
      if (!el) return
      el.scrollBy({ left: dir * 6, behavior: 'auto' })
    }, 16)
  }

  const stopScrolling = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current)
      scrollIntervalRef.current = null
    }
  }

  const openLightbox = (i) => setLightboxIndex(i)
  const closeLightbox = () => setLightboxIndex(null)
  const showPrev = (e) => {
    e.stopPropagation()
    setLightboxIndex((i) => (i - 1 + items.length) % items.length)
  }
  const showNext = (e) => {
    e.stopPropagation()
    setLightboxIndex((i) => (i + 1) % items.length)
  }

  const ZOOM_SCALE = 1.4

  const handleItemHover = (e) => {
    const el = e.currentTarget
    const track = trackRef.current
    if (!track) return

    const elRect = el.getBoundingClientRect()
    const trackRect = track.getBoundingClientRect()

    // Compute the item's projected bounds once it scales up (centered growth),
    // since the browser hasn't applied the hover transform at mouseenter time yet.
    const normalWidth = elRect.width
    const normalHeight = elRect.height
    const centerX = elRect.left + normalWidth / 2
    const zoomedWidth = normalWidth * ZOOM_SCALE
    const zoomedLeft = centerX - zoomedWidth / 2
    const zoomedRight = centerX + zoomedWidth / 2

    const overflowLeft = trackRect.left - zoomedLeft
    const overflowRight = zoomedRight - trackRect.right

    if (overflowLeft > 0) {
      track.scrollBy({ left: -overflowLeft - 8, behavior: 'smooth' })
    } else if (overflowRight > 0) {
      track.scrollBy({ left: overflowRight + 8, behavior: 'smooth' })
    }
  }

  return (
    <div className="media-strip-wrap">
      <button
        type="button"
        className="media-arrow media-arrow-left"
        onMouseEnter={() => startScrolling(-1)}
        onMouseLeave={stopScrolling}
        aria-label="Scroll left"
      >
        ‹
      </button>

      <div className="media-strip" ref={trackRef}>
        {items.map((item, i) => (
          <div
            className="media-item"
            key={item.path || i}
            onClick={() => openLightbox(i)}
            onMouseEnter={handleItemHover}
          >
            {item.type === 'video' ? (
              <>
                <video src={item.path} muted loop playsInline />
                <span className="media-video-badge" aria-label="Video" title="Video">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <polygon points="6 4 20 12 6 20 6 4" />
                  </svg>
                </span>
              </>
            ) : (
              <img src={item.path} alt="" loading="lazy" />
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        className="media-arrow media-arrow-right"
        onMouseEnter={() => startScrolling(1)}
        onMouseLeave={stopScrolling}
        aria-label="Scroll right"
      >
        ›
      </button>

      {lightboxIndex !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button type="button" className="lightbox-close" onClick={closeLightbox} aria-label="Close">
            ✕
          </button>
          <button type="button" className="lightbox-nav lightbox-prev" onClick={showPrev} aria-label="Previous">
            ‹
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            {items[lightboxIndex].type === 'video' ? (
              <video src={items[lightboxIndex].path} controls autoPlay />
            ) : (
              <img src={items[lightboxIndex].path} alt="" />
            )}
          </div>

          <button type="button" className="lightbox-nav lightbox-next" onClick={showNext} aria-label="Next">
            ›
          </button>
        </div>
      )}
    </div>
  )
}
