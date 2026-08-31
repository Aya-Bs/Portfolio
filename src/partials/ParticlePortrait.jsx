import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'

/* ---------------------------------------------------------------
   ParticlePortrait
   Samples an image into a particle field rendered with a single
   THREE.Points / BufferGeometry mesh. Idle particles drift subtly;
   hovering the container scatters them outward, then they smoothly
   reassemble on hover-out. Respects prefers-reduced-motion (falls
   back to a static pixelated <img>).
   Usage: <ParticlePortrait src={heroImg} />
------------------------------------------------------------------ */

const DEFAULT_PARTICLE_TARGET = 10000

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = (e) => setReduced(e.matches)
    mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange)
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', onChange) : mq.removeListener(onChange)
    }
  }, [])
  return reduced
}

/* Sample an image into position/color arrays using an offscreen canvas.
   Sampling is done on a grid; grid density is chosen so the total
   sampled particle count lands within [minCount, maxCount]. */
function sampleImage(img, minCount = 3000, maxCount = 6000) {
  const naturalW = img.naturalWidth || img.width
  const naturalH = img.naturalHeight || img.height
  if (!naturalW || !naturalH) return null

  const canvas = document.createElement('canvas')
  const sampleW = 220
  const sampleH = Math.round((naturalH / naturalW) * sampleW)
  canvas.width = sampleW
  canvas.height = sampleH
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, 0, 0, sampleW, sampleH)
  const { data } = ctx.getImageData(0, 0, sampleW, sampleH)

  // Determine a stride so total candidate points land near target count.
  const totalPixels = sampleW * sampleH
  const target = Math.min(maxCount, Math.max(minCount, DEFAULT_PARTICLE_TARGET))
  let stride = Math.max(1, Math.floor(Math.sqrt(totalPixels / target)))

  const positions = []
  const colors = []
  const aspect = sampleW / sampleH

  for (let y = 0; y < sampleH; y += stride) {
    for (let x = 0; x < sampleW; x += stride) {
      const idx = (y * sampleW + x) * 4
      const r = data[idx]
      const g = data[idx + 1]
      const b = data[idx + 2]
      const a = data[idx + 3]
      if (a < 40) continue // skip transparent background pixels
      const brightness = (r + g + b) / 3
      if (brightness < 8 && a < 255) continue // skip near-black transparent-ish edges

      // Normalize to -1..1 range, preserving aspect ratio on X.
      const nx = (x / sampleW - 0.5) * 2 * aspect
      const ny = -(y / sampleH - 0.5) * 2
      positions.push(nx, ny, (Math.random() - 0.5) * 0.15)
      colors.push(r / 255, g / 255, b / 255)
    }
  }

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors),
    count: positions.length / 3,
  }
}

function ParticleField({ src, hovered }) {
  const { size, invalidate } = useThree()
  const pointsRef = useRef(null)
  const [sampled, setSampled] = useState(null)

  useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      if (cancelled) return
      const result = sampleImage(img)
      if (result) setSampled(result)
    }
    img.src = src
    return () => {
      cancelled = true
    }
  }, [src])

  // Per-particle scatter direction + speed, computed once per sample.
  const scatter = useMemo(() => {
    if (!sampled) return null
    const dirs = new Float32Array(sampled.count * 3)
    const speeds = new Float32Array(sampled.count)
    const seeds = new Float32Array(sampled.count)
    for (let i = 0; i < sampled.count; i++) {
      const angle = Math.random() * Math.PI * 2
      const upward = Math.random() * 0.6
      dirs[i * 3] = Math.cos(angle)
      dirs[i * 3 + 1] = Math.sin(angle) * 0.6 + upward
      dirs[i * 3 + 2] = (Math.random() - 0.5) * 1.4
      speeds[i] = 0.6 + Math.random() * 0.9
      seeds[i] = Math.random() * Math.PI * 2
    }
    return { dirs, speeds, seeds }
  }, [sampled])

  const progress = useRef(0) // 0 = assembled, 1 = fully scattered
  const basePositions = useRef(null)
  const workPositions = useRef(null)

  useEffect(() => {
    if (!sampled) return
    basePositions.current = sampled.positions
    workPositions.current = new Float32Array(sampled.positions)
  }, [sampled])

  useFrame((state, delta) => {
    if (!sampled || !scatter || !pointsRef.current) return
    const target = hovered ? 1 : 0
    const easeSpeed = hovered ? 1.6 : 2.0
    progress.current += (target - progress.current) * Math.min(1, delta * easeSpeed)
    if (Math.abs(progress.current - target) < 0.0009) progress.current = target

    const t = state.clock.elapsedTime
    const base = basePositions.current
    const work = workPositions.current
    const { dirs, speeds, seeds } = scatter
    const p = progress.current
    // smoothstep easing for organic feel
    const eased = p * p * (3 - 2 * p)

    for (let i = 0; i < sampled.count; i++) {
      const ix = i * 3
      const idle = 0.012
      const wobbleX = Math.sin(t * 0.8 + seeds[i]) * idle
      const wobbleY = Math.cos(t * 0.7 + seeds[i] * 1.3) * idle
      const scatterAmt = eased * speeds[i] * 0.9

      work[ix] = base[ix] + wobbleX + dirs[ix] * scatterAmt
      work[ix + 1] = base[ix + 1] + wobbleY + dirs[ix + 1] * scatterAmt
      work[ix + 2] = base[ix + 2] + dirs[ix + 2] * scatterAmt * 0.6
    }

    const geom = pointsRef.current.geometry
    geom.attributes.position.array.set(work)
    geom.attributes.position.needsUpdate = true
    invalidate()
  })

  if (!sampled) return null

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={sampled.count}
          array={sampled.positions.slice()}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={sampled.count}
          array={sampled.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={Math.max(0.012, 2.2 / Math.max(size.width, 320))}
        vertexColors
        transparent
        opacity={0.95}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function StaticFallback({ src }) {
  return (
    <img
      src={src}
      alt="Portrait"
      className="portrait-static-fallback"
      style={{ imageRendering: 'pixelated', width: '100%', height: 'auto' }}
    />
  )
}

export default function ParticlePortrait({ src }) {
  const reducedMotion = usePrefersReducedMotion()
  const [hovered, setHovered] = useState(false)
  const containerRef = useRef(null)

  if (reducedMotion) {
    return (
      <div className="particle-portrait particle-portrait--static">
        <StaticFallback src={src} />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="particle-portrait"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Canvas
        orthographic
        camera={{ zoom: 220, position: [0, 0, 5] }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        frameloop="always"
      >
        <ParticleField src={src} hovered={hovered} />
      </Canvas>
    </div>
  )
}
