import { useReveal } from '../hooks/useReveal'

const DEGREE = [
  {
    id :'EDU . EDU-01',
    title:'Engineering Degree in Software Engineering',
    inst:'ESPRIT - Private higher school of engineering and technology',
    date:'2023 - 2026',
    grade:'Graduated on top of class with high honors',
    primary: true

  },
  {
    id :'EDU . EDU-02',
    title:'Bachelor in Computer Science',
    inst:'Faculty of Sciences of Bizerte',
    date:'2020 - 2023',
    grade:'Graduated with honors',
    primary: false

  }
  

]
function DegreeCard({degree}){
  return (
    <div className={`edu-row${degree.primary ? ' primary' : ''}`}>
      <div className="edu-main">
        <div className="degree">{degree.title}</div>
        <div className="inst">{degree.inst}</div>
        <div className="note">{degree.grade}</div>
      </div>
      <div className="edu-date">{degree.date}</div>
    </div>
  )
}
export default function Education() {
  const rowRef = useReveal()

  return (
    <section className="education" id="education">
      <div className="wrap">
        <div className="eyebrow">05 — education</div>

        <div className="edu-list reveal" ref={rowRef}>
          {DEGREE.map((degree) => (
            <DegreeCard degree={degree} key={degree.id} />
          ))}
            
        </div>
      </div>
    </section>
  )
}
