import { useReveal } from '../hooks/useReveal'

const PROJECTS = [
  {
    id: 'PRJ · PMWA',
    title: 'Lavoro - Project Management Web Application',
    org: 'Personal project',
    copy: `Most lightweight PM tools don't handle real team structure — roles, permissions, ownership. I built a collaborative platform with a proper role/permission model, team and project management, task tracking, and AI-assisted productivity features layered on top.`,
    tags: [{ label: 'Node.js' }, { label: 'React' }, { label: 'MongoDB' }],
  },
  {
    id: 'PRJ · JRNL',
    title: 'AI Personal Journal',
    org: 'Personal project',
    copy: `A journaling app that reads mood and sentiment from what you write, and turns it into personalized insights and AI-assisted writing prompts — built to explore applying NLP to a genuinely personal, everyday use case rather than a benchmark dataset.`,
    tags: [{ label: 'Django' }, { label: 'NLP' }, { label: 'Sentiment analysis' }],
  },
]

function ProjectCard({ project }) {
  return (
    <article className="log-card">
      <div className="log-head">
        <div>
          {/* <div className="log-id">{project.id}</div> */}
          <div className="log-title-row">
            <span className="log-title">{project.title}</span>
          </div>
          <div className="log-org">{project.org}</div>
        </div>
      </div>

      <div className="log-body">
        <p className="log-copy">{project.copy}</p>
        <div className="log-tags">
          {project.tags.map((tag) => (
            <span className="tag" key={tag.label}>
              {tag.label}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}

export default function Projects() {
  const listRef = useReveal()

  return (
    <section className="log-section" id="projects">
      <div className="wrap">
        <div className="eyebrow">03 — projects</div>
        <h2 className="section-title">What I build on my own</h2>
        <p className="section-intro">
          Self-directed work — where I made the architecture calls, not just the implementation
          ones.
        </p>

        <div className="log-list reveal" ref={listRef}>
          {PROJECTS.map((project) => (
            <ProjectCard project={project} key={project.id} />
          ))}
        </div>
      </div>
    </section>
  )
}
