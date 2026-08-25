import { useReveal } from '../hooks/useReveal'

const SKILL_CATEGORIES = [
  { name: 'Languages', items: ['Python', 'JavaScript',  'Java', 'C#'] },
  { name: 'Backend', items: ['Django', 'Springboot', 'Node.js', '.NET', 'REST APIs'] },
  { name: 'Frontend', items: ['React', 'Angular'] },
  { name: 'Databases', items: ['PostgreSQL', 'MongoDB','MySQL'] },
  { name: 'AI / Machine Learning', items: ['LightGBM', 'LLM reranking', 'Semantic retrieval', 'NLP'] },
  { name: 'DevOps / Cloud', items: ['Jenkins', 'Docker', 'Azure', 'SonarQube','Nexus','Grafana', 'Prometheus'] },
]

export default function Skills() {
  const gridRef = useReveal()

  return (
    <section className="skills" id="skills">
      <div className="wrap">
        <div className="eyebrow">04 — skills</div>
        <h2 className="section-title">Technical range</h2>
        <p className="section-intro">
          Organized by what each technology does for a system, not alphabetically.
        </p>

        <div className="skills-grid reveal" ref={gridRef}>
          {SKILL_CATEGORIES.map((cat) => (
            <div className="skill-cat" key={cat.name}>
              <h4>{cat.name}</h4>
              <ul>
                {cat.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
