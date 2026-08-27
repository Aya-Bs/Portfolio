import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import MediaSlideshow from './MediaSlideshow'

const PROJECTS = [
  {
    id: 'PRJ · PMWA',
    topic:'Full-Stack MERN',
    title: 'Lavoro - Project Management Web Application',
    org: 'Academic project',
    copy: `
    Most lightweight PM tools don't handle real team structures: roles, permissions, and ownership. I built a collaborative platform around these needs, combining team and project management, task tracking, and AI-assisted productivity features.
    <ul>
    <li>Contributed to UML design and project planning using <strong>GitHub Projects</strong>.</li>
    <li><strong>Implemented administrator features</strong>, including user monitoring, role management, and alerting.</li>
    <li><strong>Developed project and task management features</strong>, from RESTful CRUD operations to dashboards and more complex workflows.</li>
    <li><strong>Built AI-assisted features</strong> for generating project details and tasks from project descriptions.</li>
    <li><strong>Implemented productivity features </strong>including Kanban boards and GitHub task export.</li>
    </ul>
    `,
     link:'https://github.com/Aya-Bs/Lavoro/tree/Aya',
    tags: [{ label: 'Node.js' }, { label: 'React' }, { label: 'MongoDB' }],
    remark:'My most organized project',
     media:
      {
        images :[
          {path:'public/screenshots/lavoro/kanban.png'}
        ],
        videos:[]
      }
  },
  {
    id: 'PRJ · JRNL',
    topic:'AI Personal Journal',
    title: 'MindMuse - AI Personal Journal',
    org: 'Academic project',
    copy: `
    Designed and developed an AI-powered personal journal web application that analyzes sentiment in journal entries and turns it into personalized insights. 
    <br> Designed the experience around making journaling engaging and interactive rather than simply storing entries.
    <ul>
    <li>Implemented journal entry CRUD, voice recording, and sentiment analysis to generate personalized insights.</li>
    <li>Integrated<strong> Gemini API</strong> for AI-assisted writing suggestions to encourage users to keep writing.</li>
    <li>Created an interactive visual garden with<strong> Three.js</strong> to visualize journal activity.</li>
    </ul>
    `,
     link:'https://github.com/firaszn/Django-Project/tree/entry',
    tags: [{ label: 'Django' }, { label: 'NLP' }, { label: 'Sentiment analysis' }],
    remark:'My coolest project',
     media:
      {
        images :[
          {path:'public/screenshots/python-journal/journal-entry.png'},
          {path:'public/screenshots/python-journal/garden.png'},
          
        ],
        videos:[
          {path:'public/screenshots/python-journal/demo.mp4'}
        ]
      }
  },
  {
    id: 'PRJ · DVPS',
    topic:'CI/CD Pipeline',
    title: 'CI/CD Pipeline',
    org: 'Personal project',
    copy: [
      `Designed and implemented a CI/CD pipeline to automate code build, testing, integration and deployment using Jenkins, SonarQube, Nexus, and Docker.
    
    <ul>
    <li>Configured automated builds and continuous integration using <strong>Jenkins</strong> and webhook-triggered pipelines.</li>
    <li>Integrated <strong>SonarQube</strong> for static code analysis and <strong>Nexus</strong> for artifact management.</li>
    <li>Containerized the application with <strong>Docker</strong> and configured <strong>Prometheus/Grafana</strong> for monitoring.</li>
    </ul>
    `
  ],
    link:'https://github.com/Aya-Bs/Devops-project/tree/Aya',
    tags: [{ label: 'Jenkins' }, { label: 'SonarQube' }, { label: 'Docker' },{ label: 'Nexus' }, { label: 'ngrok' }, { label: 'Grafana' }],
    remark:'My biggest huh?! moment',
     media:
      {
        images :[
          {path:'public/screenshots/devops/devops1.png'},
          {path:'public/screenshots/devops/devops2.png'},
          {path:'public/screenshots/devops/devops3.png'},
        ],
        videos:[]
      }

  },
  {
    id: 'PRJ · MCRSV',
    topic:'Microservices Architecture',
    title: 'Booki - Microservices-Based Book Sale App',
    org: 'Academic project',
    copy: [
      `Developed a book sale web application using a microservices architecture
    
    <ul>
    <li><strong>Developed a user management microservice </strong>, including JWT authentication, account management, and secure API access.</li>
    <li><strong>Implemented service discovery</strong> with Eureka and centralized routing through an API Gateway.</li>
    <li><strong>Built inter-service communication</strong> using Feign clients and REST APIs, with Docker-based containerization.</li>
    <li>Integrated the Angular frontend with backend services, ensuring secure and dynamic data flows.</li>
    </ul>
    `
  ],
   link:'https://github.com/Sarra-Sahli/Booki/tree/user-service',
    tags: [{ label: 'Springboot' }, { label: 'Angular' }, { label: 'Docker' }],
    remark:'The project that made me cry',
     media:
      {
        images :[],
        videos:[]
      }
  }


]

function ProjectCard({ project }) {
  return (
    <article className="log-card">
      {project.link && (
        <a
          className="log-link-icon"
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open project link"
          title="Open project link"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      )}
      <div className="log-head">
        <div>
          {/* <div className="log-id">{project.id}</div> */}
          <div className="log-id">{project.remark}</div> 
          <div className="log-title-row">
            <span className="log-title">{project.title}</span>
          </div>
          <div className="log-org">{project.org}</div>
        </div>
      </div>

      <div className="log-body">
        {Array.isArray(project.copy) ? (
          project.copy.map((c, i) => (
            <p className="log-copy" key={i} dangerouslySetInnerHTML={{ __html: c }} />
          ))
        ) : (
          <p className="log-copy" dangerouslySetInnerHTML={{ __html: project.copy }} />
        )}
        <div className="log-tags">
          {project.tags.map((tag) => (
            <span className="tag" key={tag.label}>
              {tag.label}
            </span>
          ))}
        </div>

        <MediaSlideshow media={project.media} />
      </div>
    </article>
  )
}

export default function Projects() {
  const listRef = useReveal()
  const [active, setActive] = useState(0)

  return (
    <section className="log-section" id="projects">
      <div className="wrap">
        <div className="eyebrow">03 — projects</div>
        <h2 className="section-title">What I build on my own</h2>
        <p className="section-intro">
          Self-directed work — where I was the client, the manager and the sorcerer.
        </p>

        <div className="timeline-layout reveal" ref={listRef}>
          <nav className="timeline-rail" aria-label="Projects timeline">
            <span className="timeline-line" aria-hidden="true" />
            {PROJECTS.map((project, i) => (
              <button
                type="button"
                key={project.id}
                className={`timeline-item${i === active ? ' active' : ''}`}
                onClick={() => setActive(i)}
              >
                <span className="timeline-org-name">{project.topic}</span>
                <span className="timeline-marker">✦</span>
              </button>
            ))}
          </nav>

          <div className="timeline-content" key={PROJECTS[active].id}>
            <ProjectCard project={PROJECTS[active]} />
          </div>
        </div>

        {/* <p className="section-intro">
          Each of these projects allowed not only to explore new technologies but to also discover new approaches to solving problems and considering to user needs.
        </p> */}
      </div>
    </section>
  )
}
