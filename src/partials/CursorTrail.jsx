import { useEffect, useRef } from 'react'

// Curated set of subtle, abstract glyphs.
const GLYPHS = ['✦', '✧', '಄', '○', '·', '+', '∿', '∘','♡','★','✿','₊⊹','๋࣭ ⭑','𓇼','⌖','˙ᵕ˙','﹫','#']

const MAX_GLYPH_POOL = 40 // hard cap on concurrently-alive glyph nodes

export default function CursorTrail() {
  const layerRef = useRef(null)
  const glyphLayerRef = useRef(null)
  const cursorRef = useRef(null)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      return undefined
    }

    const glyphLayer = glyphLayerRef.current
    const cursorEl = cursorRef.current

    // Latest raw pointer sample (updated synchronously on every pointermove).
    const pointer = { x: -100, y: -100, lastEmitX: -100, lastEmitY: -100, hasMoved: false }
    let liveGlyphCount = 0
    let rafId = null
    let isFinePointer = false

    const handlePointerMove = (e) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.hasMoved = true

      // Treat anything that isn't a touch contact as a "fine" pointer (mouse, pen, etc.).
      const pointerIsFine = e.pointerType !== 'touch'
      if (pointerIsFine !== isFinePointer) {
        isFinePointer = pointerIsFine
        document.body.classList.toggle('cursor-trail-active', isFinePointer)
      }
      cursorEl.style.opacity = isFinePointer ? '1' : '0'

      // Move the cursor element directly, no React state/re-render.
      cursorEl.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`
    }

    const handlePointerDown = () => {
      cursorEl.classList.add('cursor-trail-dot--active')
    }
    const handlePointerUp = () => {
      cursorEl.classList.remove('cursor-trail-dot--active')
    }
    const handlePointerLeave = () => {
      if (isFinePointer) cursorEl.style.opacity = '0'
    }
    const handlePointerEnter = () => {
      if (isFinePointer) cursorEl.style.opacity = '1'
    }

    const spawnGlyph = (x, y, speed) => {
      if (liveGlyphCount >= MAX_GLYPH_POOL) return

      const el = document.createElement('span')
      el.className = 'cursor-glyph'
      el.textContent = GLYPHS[(Math.random() * GLYPHS.length) | 0]

      // Randomize look so the trail feels organic, not repetitive.
      const jitterX = (Math.random() - 0.5) * 14
      const jitterY = (Math.random() - 0.5) * 14
      const rotation = (Math.random() - 0.5) * 60
      const scale = 0.55 + Math.random() * (0.55 + Math.min(speed / 1600, 0.5))
      const drift = 10 + Math.random() * 18
      const driftAngle = Math.random() * Math.PI * 2
      const driftX = Math.cos(driftAngle) * drift
      const driftY = Math.sin(driftAngle) * drift - 6 // slight upward bias
      const duration = 550 + Math.random() * 450

      el.style.left = `${x + jitterX}px`
      el.style.top = `${y + jitterY}px`
      el.style.setProperty('--rot', `${rotation}deg`)
      el.style.setProperty('--scale', scale.toFixed(2))

      glyphLayer.appendChild(el)
      liveGlyphCount++

      const animation = el.animate(
        [
          { opacity: 0, transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale * 0.6})` },
          { opacity: 0.85, offset: 0.18, transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})` },
          {
            opacity: 0,
            transform: `translate(calc(-50% + ${driftX}px), calc(-50% + ${driftY}px)) rotate(${rotation}deg) scale(${scale * 0.85})`,
          },
        ],
        { duration, easing: 'ease-out', fill: 'forwards' }
      )

      animation.onfinish = () => {
        el.remove()
        liveGlyphCount--
      }
    }

    // Main animation loop: samples pointer position/velocity and decides
    // whether to emit a glyph — decoupled from raw pointermove event rate.
    const tick = () => {
      if (pointer.hasMoved) {
        const dx = pointer.x - pointer.lastEmitX
        const dy = pointer.y - pointer.lastEmitY
        const dist = Math.sqrt(dx * dx + dy * dy)

        // Slower movement -> require more distance before spawning (sparse).
        // Faster movement -> lower distance threshold (denser), but clamped.
        const speed = dist // per-frame distance acts as a velocity proxy
        const threshold = Math.max(10, 34 - speed * 0.35)

        if (dist > threshold) {
          spawnGlyph(pointer.x, pointer.y, speed)
          pointer.lastEmitX = pointer.x
          pointer.lastEmitY = pointer.y
        }
      }
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerdown', handlePointerDown, { passive: true })
    window.addEventListener('pointerup', handlePointerUp, { passive: true })
    document.addEventListener('mouseleave', handlePointerLeave)
    document.addEventListener('mouseenter', handlePointerEnter)
    rafId = requestAnimationFrame(tick)

    return () => {
      document.body.classList.remove('cursor-trail-active')
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      document.removeEventListener('mouseleave', handlePointerLeave)
      document.removeEventListener('mouseenter', handlePointerEnter)
      if (rafId) cancelAnimationFrame(rafId)
      if (glyphLayer) glyphLayer.innerHTML = ''
    }
  }, [])

  return (
    <div className="cursor-trail-layer" ref={layerRef} aria-hidden="true">
      <div className="cursor-glyph-layer" ref={glyphLayerRef} />
      <div className="cursor-trail-dot" ref={cursorRef} />
    </div>
  )
}
