import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import MediaSlideshow from './MediaSlideshow'

const EXPERIENCES = [
  {
    id: 'EXP · EXP-01',
    title: 'Software & ML Engineer Intern',
    org: 'Orange Telecom - Sofrecom Tunisia',
    dates: 'Feb 2026 → Jul 2026',
    
    primary: true,
    paragraphs: [
      `Helped project managers at Sofrecom move from a manual project health assessment process to <strong>SofAssess PM</strong>, a digital platform that assesses and analyzes project maturity across different aspects and uses AI to rank and provide the best corrective recommendations on weak areas.

      <ul>
        <li><strong>Designed the solution end-to-end</strong>, from product backlog and sprint planning to technology selection, architecture, development, testing, deployment, and delivery, under the supervision of the Product Owner.</li>
        <li><strong>Developed the platform's core features</strong>, including RBAC, bilingual support, guided assessment, API monitoring, and automated data extraction.</li>
        <li><strong>Built the AI recommendation pipeline</strong>, following a CRISP-DM approach from data cleaning and feature engineering to model evaluation and selection, then integrating semantic retrieval and ranking to generate relevant corrective recommendations for problematic project axes.</li>
        <li><strong>Led development across the project following a Scrum workflow</strong>, applying engineering best practices with a focus on security, performance, and maintainability.</li>
        <li><strong>Tested and deployed a complete solution</strong>, delivering a functional application ready for project managers to use.</li>
      </ul>
`,
    ],
    metrics: [
      {value : 'Digitalized', label: ' workflow'},
      
      { value: '89.7%', label: 'precision' },

      { value: '40×', label: 'faster inference' },
      
    ],
    tags: [
      { label: 'React' },
      { label: 'Django' },
      { label: 'PostgreSQL' },
      { label: 'Azure' },
      { label: 'LightGBM' },
      { label: 'LLM reranking' },
      { label: 'Semantic retrieval' },
      
    ],
    remark:'My most serious project',
    media:
      {
        images :[],
        videos:[]
      }
  },
  {
    id: 'EXP · EXP-02',
    title: 'Software Development Engineer Intern',
    org: 'Nicetek Tunisia',
    dates: 'Jun 2025 → Aug 2025',
   
    primary: false,
    paragraphs: [
      `Collaborated in an agile team to develop a web platform connecting startups seeking talent with students looking for internship opportunities.

      <ul>
        <li><strong>Developed administrator features</strong> for monitoring users, internship applications, and platform activity.</li>
        <li><strong>Implemented frontend components and integrated REST APIs</strong>, improving data flow between the interface and backend services.</li>
        <li><strong>Collaborated within an agile development team</strong> to integrate features and improve the overall user experience.</li>
      </ul>

      `,
      
    ],
    metrics:[],
    tags: [{ label: 'NestJS' }, { label: 'Angular' }, { label: 'MongoDB' }],
    remark:'Good idea, no time project',
    media:
      {
        images :[],
        videos:[]
      }

    
    
  },
  {
    id: 'EXP · EXP-03',
    title: 'Software Development Engineer Intern',
    org: 'Todten France',
    dates: 'Feb 2023 → May 2023',
   
    primary: false,
    paragraphs: [
      `Designed and developed a video and audio streaming web application as part of a final-year project.

      <ul>
        <li><strong>Implemented user management and authentication</strong>, including JWT-based authentication, account management, and secure API access.</li>
        <li><strong>Developed audio and video streaming features</strong>, integrating frontend components with backend APIs to support media playback.</li>
        <li><strong>Designed REST APIs</strong> for application features and documented the system's technical architecture and implementation.</li>
        <li><strong>Delivered a functional prototype</strong> following software engineering and development best practices.</li>
      </ul>


      `,
      
    ],
    metrics:[],
    tags: [{ label: '.NET' }, { label: 'Angular' }, { label: 'PostgreSQL' }],
    remark:'My first serious project',
    media:
      {
        images :[
      {path: 'public/screenshots/todten/login.png'},
      {path: 'public/screenshots/todten/home.png'},
      {path: 'public/screenshots/todten/music.png'},
      {path: 'public/screenshots/todten/musicdetails.png'},
      {path: 'public/screenshots/todten/movies.png'},
      {path: 'public/screenshots/todten/audiobooks.png'},
    ],
        videos:[]
      }
    
  },
]

function ExperienceCard({ exp }) {
  return (
    <article className={`log-card${exp.primary ? ' primary' : ''}`}>
      <div className="log-head">
        <div>
          {/* <div className="log-id">{exp.id}</div> */}
           <div className="log-id">{exp.remark}</div> 
          <div className="log-title-row">
            <span className="log-title">{exp.title}</span>
            
          </div>
          <div className="log-org">{exp.org}</div>
        </div>
        
        <div className="log-dates">{exp.dates}</div>
        <div className="log-tags">
          {exp.tags.map((tag) => (
            <span className={`tag${tag.dim ? ' dim' : ''}`} key={tag.label}>
              {tag.label}
            </span>
          ))}
        </div>
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

        <MediaSlideshow media={exp.media} />
      </div>
    </article>
  )
}

export default function Experiences() {
  const listRef = useReveal()
  const [active, setActive] = useState(0)

  return (
    <section className="log-section" id="experience">
      <div className="wrap">
        <div className="eyebrow">02 — experience</div>
        <h2 className="section-title">Where I've worked</h2>
        <p className="section-intro">
          Many internships, where I either collaborated or worked alone, on bringing real ideas to life and making clients happy .
        </p>

        <div className="timeline-layout reveal" ref={listRef}>
          <nav className="timeline-rail" aria-label="Experience timeline">
            <span className="timeline-line" aria-hidden="true" />
            {EXPERIENCES.map((exp, i) => (
              <button
                type="button"
                key={exp.id}
                className={`timeline-item${i === active ? ' active' : ''}`}
                onClick={() => setActive(i)}
              >
                <span className="timeline-org-name">{exp.org}</span>
                <span className="timeline-marker">✦</span>
              </button>
            ))}
          </nav>

          <div className="timeline-content" key={EXPERIENCES[active].id}>
            <ExperienceCard exp={EXPERIENCES[active]} />
          </div>
        </div>
      </div>
    </section>
  )
}
