import { useReveal } from '../hooks/useReveal'


export default function Hero() {
  const panelRef = useReveal()

  return (
    <section className="hero" id="hero">
      <div className="wrap hero-grid">
        <div>
          <h1>Aya Boukhris</h1>
          <div className="role-line">
            Full-Stack Software Engineer<span className="sep">/</span>DevOps Engineer<span className="sep">/</span>Applied AI
          </div>
          <p className="pitch">
            From your imagination to a real product, I bring your ideas to life through design and code.
          </p>
          <div className="cta-row">
            <a href="#projects" className="btn btn-solid">
              Let's Chat!
            </a>
           
          </div>
        </div>

       
      </div>
    </section>
  )
}
