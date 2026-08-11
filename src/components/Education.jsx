import { useReveal } from '../hooks/useReveal'

export default function Education() {
  const rowRef = useReveal()

  return (
    <section className="education" id="education">
      <div className="wrap">
        <div className="eyebrow">05 — education</div>

        <div className="edu-row reveal" ref={rowRef}>
          <div className="edu-main">
            <div className="degree">Engineering Degree, Web Development</div>
            <div className="inst">ESPRIT</div>
            <div className="note">Final-year internship completed at Sofrecom Tunisia →</div>
          </div>
          <div className="edu-date">2021 — 2026</div>
        </div>
      </div>
    </section>
  )
}
