import { useReveal } from '../hooks/useReveal'

const STATS = [
  { num: '89.7%', label: 'ML recommendation precision' },
  { num: '40×', label: 'faster inference' },
  { num: '9', label: 'assessment axes covered' },
  { num: '4', label: 'sprint delivery cycle' },
]

export default function Hero() {
  const panelRef = useReveal()

  return (
    <section className="hero" id="hero">
      <div className="wrap hero-grid">
        <div>
          <h1>Aya Boukhris</h1>
          <div className="role-line">
            Junior Software Engineer<span className="sep">/</span>Full-Stack
            <span className="sep">/</span>DevOps<span className="sep">/</span>Applied AI
          </div>
          <p className="pitch">
            I build and ship full-stack systems end-to-end — from backend architecture and
            databases, through machine learning features, to cloud deployment. Most recently, I
            shipped an AI-powered assessment platform now used by project managers at Sofrecom
            Tunisia.
          </p>
          <div className="cta-row">
            <a href="#projects" className="btn btn-solid">
              View projects →
            </a>
            <a href="#experience" className="btn">
              See experience
            </a>
          </div>
        </div>

        <div className="stat-panel reveal" ref={panelRef}>
          <div className="stat-panel-head">
            <span>sofassess_pm / metrics</span>
            <span className="live">live</span>
          </div>
          {STATS.map((stat) => (
            <div className="stat" key={stat.label}>
              <span className="num">{stat.num}</span>
              <span className="label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
