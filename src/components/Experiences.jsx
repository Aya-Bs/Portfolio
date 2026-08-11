import { useReveal } from '../hooks/useReveal'

const EXPERIENCES = [
  {
    id: 'EXP · SOF-01',
    title: 'Software & ML Engineer Intern',
    org: 'Sofrecom Tunisia',
    dates: 'Feb 2026 → Jul 2026',
    status: { label: 'shipped', variant: 'default' },
    primary: true,
    paragraphs: [
      `Project managers had no structured, automated way to assess project health — reviews were manual and inconsistent. I built <strong>SofAssess PM</strong>, an AI-powered platform that scores project health against a 9-axis assessment framework and generates intelligent, actionable recommendations.`,
      `I designed the semantic retrieval and LLM-based reranking layer behind the recommendation engine, and built the surrounding platform — RBAC, bilingual support, API monitoring, automated reporting, and questionnaire versioning — end-to-end across a 4-sprint Scrum cycle.`,
    ],
    metrics: [
      { value: '89.7%', label: 'precision' },
      { value: '40×', label: 'faster inference' },
      { value: '9', label: 'assessment axes' },
      { value: '4', label: 'sprints' },
    ],
    tags: [
      { label: 'React' },
      { label: 'Django' },
      { label: 'PostgreSQL' },
      { label: 'Azure' },
      { label: 'LightGBM' },
      { label: 'LLM reranking' },
      { label: 'Semantic retrieval' },
      { label: 'RBAC', dim: true },
      { label: 'Bilingual (EN/FR)', dim: true },
      { label: 'API monitoring', dim: true },
    ],
  },
  {
    id: 'EXP · NCT-01',
    title: 'Software Development Engineer Intern',
    org: 'Nicetek Tunisia',
    dates: 'Jun 2025 → Aug 2025',
    status: { label: 'delivered', variant: 'warm' },
    primary: false,
    paragraphs: [
      `Startups had no direct channel for finding and connecting with interns. I built a full-stack matching platform end-to-end, from API design to UI, connecting startups with interns based on role and availability.`,
    ],
    metrics: [],
    tags: [{ label: 'NestJS' }, { label: 'Angular' }, { label: 'MongoDB' }],
  },
]

function ExperienceCard({ exp }) {
  return (
    <article className={`log-card${exp.primary ? ' primary' : ''}`}>
      <div className="log-head">
        <div>
          <div className="log-id">{exp.id}</div>
          <div className="log-title-row">
            <span className="log-title">{exp.title}</span>
            <span className={`status-pill${exp.status.variant === 'warm' ? ' warm' : ''}`}>
              {exp.status.label}
            </span>
          </div>
          <div className="log-org">{exp.org}</div>
        </div>
        <div className="log-dates">{exp.dates}</div>
      </div>

      <div className="log-body">
        {exp.paragraphs.map((p, i) => (
          <p className="log-copy" key={i} dangerouslySetInnerHTML={{ __html: p }} />
        ))}

        {exp.metrics.length > 0 && (
          <div className="log-metrics">
            {exp.metrics.map((m) => (
              <span className="metric-chip" key={m.label}>
                <b>{m.value}</b> {m.label}
              </span>
            ))}
          </div>
        )}

        <div className="log-tags">
          {exp.tags.map((tag) => (
            <span className={`tag${tag.dim ? ' dim' : ''}`} key={tag.label}>
              {tag.label}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}

export default function Experiences() {
  const listRef = useReveal()

  return (
    <section className="log-section" id="experience">
      <div className="wrap">
        <div className="eyebrow">02 — experience</div>
        <h2 className="section-title">Where I've worked</h2>
        <p className="section-intro">
          Two internships, both full-stack, both shipped to real users — with increasing
          ownership over ML and system design.
        </p>

        <div className="log-list reveal" ref={listRef}>
          {EXPERIENCES.map((exp) => (
            <ExperienceCard exp={exp} key={exp.id} />
          ))}
        </div>
      </div>
    </section>
  )
}
