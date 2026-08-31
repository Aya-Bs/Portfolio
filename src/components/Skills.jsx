import { useReveal } from '../hooks/useReveal'

// Simple Icons slugs (https://simpleicons.org) served via jsdelivr CDN as
// plain SVGs — no package install needed. Colored with currentColor so they
// pick up the surrounding text color automatically.
const ICON_SLUGS = {
  'Python': 'python',
  'JavaScript': 'javascript',
  'TypeScript': 'typescript',
  'Java': 'openjdk',
  'C#': 'csharp',
  'React': 'react',
  'Angular': 'angular',
  'Django': 'django',
  'Spring Boot': 'springboot',
  'Node.js': 'nodedotjs',
  '.NET': 'dotnet',
  'REST APIs': 'openapiinitiative',
  'PostgreSQL': 'postgresql',
  'MongoDB': 'mongodb',
  'SQL': 'mysql',
  'LightGBM': 'lightgbm',
  'NLP': 'huggingface',
  'Semantic Retrieval': 'elasticsearch',
  'LLM Reranking': 'openai',
  'Jenkins': 'jenkins',
  'Docker': 'docker',
  'Azure': 'microsoftazure',
  'SonarQube': 'sonarqube',
  'Nexus': 'sonatype',
  'Prometheus': 'prometheus',
  'Grafana': 'grafana',
}

const iconUrl = (slug) => `https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/${slug}.svg`

const SKILL_CATEGORIES = [
  { name: 'Languages', area: 'lang', items: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C#'] },
  { name: 'Frontend', area: 'front', items: ['React', 'Angular'] },
  { name: 'Backend', area: 'back', items: ['Django', 'Spring Boot', 'Node.js', '.NET', 'REST APIs'] },
  { name: 'Data / Databases', area: 'data', items: ['PostgreSQL', 'MongoDB', 'SQL'] },
  { name: 'AI / Machine Learning', area: 'ai', items: ['LightGBM', 'NLP', 'Semantic Retrieval', 'LLM Reranking'] },
  { name: 'DevOps / Cloud', area: 'devops', items: ['Jenkins', 'Docker', 'Azure', 'SonarQube', 'Nexus', 'Prometheus', 'Grafana'] },
]

// Decorative constellation motif: a handful of scattered stars, thin
// connecting lines and small orbit arcs. Purely visual — sits behind the
// cards and never carries content.
function SkillsConstellation() {
  return (
    <svg
      className="skills-constellation"
      viewBox="0 0 1000 620"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <line x1="60" y1="40" x2="230" y2="140" className="sk-line" />
      <line x1="230" y1="140" x2="205" y2="300" className="sk-line" />
      <line x1="740" y1="70" x2="900" y2="160" className="sk-line" />
      <line x1="520" y1="330" x2="640" y2="420" className="sk-line" />
      <line x1="120" y1="470" x2="260" y2="540" className="sk-line" />
      <line x1="780" y1="440" x2="880" y2="520" className="sk-line" />

      <circle cx="60" cy="40" r="2.4" className="sk-star" />
      <circle cx="230" cy="140" r="1.8" className="sk-star" />
      <circle cx="205" cy="300" r="2.2" className="sk-star" />
      <circle cx="740" cy="70" r="2" className="sk-star" />
      <circle cx="900" cy="160" r="2.6" className="sk-star" />
      <circle cx="520" cy="330" r="1.8" className="sk-star" />
      <circle cx="640" cy="420" r="2.2" className="sk-star" />
      <circle cx="120" cy="470" r="2" className="sk-star" />
      <circle cx="260" cy="540" r="1.6" className="sk-star" />
      <circle cx="780" cy="440" r="2.4" className="sk-star" />
      <circle cx="880" cy="520" r="1.8" className="sk-star" />
      <circle cx="430" cy="60" r="1.6" className="sk-star" />
      <circle cx="960" cy="330" r="2" className="sk-star" />

      <ellipse cx="420" cy="470" rx="70" ry="26" className="sk-orbit" />
      <ellipse cx="850" cy="260" rx="46" ry="46" className="sk-orbit" />
      <ellipse cx="150" cy="230" rx="34" ry="34" className="sk-orbit" />
    </svg>
  )
}

function SkillCluster({ cat }) {
  return (
    <div className={`skill-cluster skill-cluster--${cat.area}`}>
      <h3>{cat.name}</h3>
      <ul>
        {cat.items.map((item) => {
          const slug = ICON_SLUGS[item]
          return (
            <li key={item}>
              {slug && (
                <span
                  className="skill-icon"
                  style={{ maskImage: `url(${iconUrl(slug)})`, WebkitMaskImage: `url(${iconUrl(slug)})` }}
                  aria-hidden="true"
                />
              )}
              {item}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function Skills() {
  const gridRef = useReveal()

  return (
    <section className="skills" id="skills">
      <div className="wrap">
        <div className="eyebrow">04 — skills</div>
        <h2 className="section-title">Technical range</h2>
        <p className="section-intro">
          The stack I reach for, grouped by what each part does for a system.
        </p>

        <div className="skills-map reveal" ref={gridRef}>
          <SkillsConstellation />
          {SKILL_CATEGORIES.map((cat) => (
            <SkillCluster cat={cat} key={cat.name} />
          ))}
        </div>
      </div>
    </section>
  )
}
