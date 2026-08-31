import { useReveal } from '../hooks/useReveal'

const DEGREE = [
  {
    id: 'EDU . EDU-02',
    title: 'Bachelor in Computer Science',
    inst: 'Faculty of Sciences of Bizerte',
    date: '2020 - 2023',
    grade: 'Graduated with honors',
    side: 'left',
  },
  {
    id: 'EDU . EDU-01',
    title: 'Engineering Degree in Software Engineering',
    inst: 'ESPRIT - Private higher school of engineering and technology',
    date: '2023 - 2026',
    grade: 'Graduated on top of class with high honors',
    side: 'right',
    primary: true,
  },
]

// Path anchor points in a 0-100 (x) by 0-100*rows (y) viewBox, one per
// milestone, alternating sides so the road visually winds left/right.
// The trailing point extends the road past the last milestone.
const ROW_HEIGHT = 100
const POINTS = [
  { x: 22, side: 'left' },
  { x: 78, side: 'right' },
  { x: 50, side: 'end' },
]

function buildPath(points) {
  let d = `M ${points[0].x} 0`
  for (let i = 1; i < points.length; i++) {
    const y0 = (i - 1) * ROW_HEIGHT
    const y1 = i * ROW_HEIGHT
    const x0 = points[i - 1].x
    const x1 = points[i].x
    const midY = (y0 + y1) / 2
    d += ` C ${x0} ${midY}, ${x1} ${midY}, ${x1} ${y1}`
  }
  return d
}

function DegreeCard({ degree }) {
  return (
    <div className="edu-card">
      <div className="degree">{degree.title}</div>
      <div className="inst">{degree.inst}</div>
      <div className="note">{degree.grade}</div>
      <div className="edu-date">{degree.date}</div>
    </div>
  )
}

export default function Education() {
  const rowRef = useReveal()

  const totalRows = POINTS.length - 1
  const pathD = buildPath(POINTS)

  return (
    <section className="education" id="education">
      <div className="wrap">
        <div className="eyebrow">05 — education</div>
        <h2 className="section-title">The road so far</h2>
        <p className="section-intro">
          A quick look at how I got here — and where the road keeps going.
        </p>

        <div className="edu-roadmap reveal" ref={rowRef}>
          <div className="edu-road-inner" style={{ '--rows': totalRows }}>
            <svg
              className="edu-road-svg"
              viewBox={`0 0 100 ${totalRows * ROW_HEIGHT}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d={pathD} className="edu-road-path-bg" />
              <path d={pathD} className="edu-road-path" />
            </svg>

            {DEGREE.map((degree) => (
              <div className={`edu-milestone edu-milestone--${degree.side}`} key={degree.id}>
                <DegreeCard degree={degree} />
              </div>
            ))}

            <div className="edu-milestone edu-milestone--end">
              <div className="edu-card edu-card--end">
                <div className="degree">Open to new opportunities</div>
                <div className="inst">The next stop is wherever I get to build something that matters.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
