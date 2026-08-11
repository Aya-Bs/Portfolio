import { useEffect, useState } from 'react'

/**
 * Watches a list of section ids and returns whichever one is currently
 * in view, so the status bar (or nav) can reflect scroll position.
 */
export function useActiveSection(sectionIds, defaultId = sectionIds[0]) {
  const [active, setActive] = useState(defaultId)

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { threshold: 0.4, rootMargin: '-80px 0px -50% 0px' }
    )

    elements.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [sectionIds])

  return active
}
