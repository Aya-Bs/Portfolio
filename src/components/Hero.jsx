import { useReveal } from '../hooks/useReveal'
import { useTypewriter } from '../hooks/useTypewriter'
import heroImg from '../assets/hero.png'
import Aya from '../assets/me.jpg'


export default function Hero() {
  const panelRef = useReveal()
  const { displayed, done } = useTypewriter('Aya Boukhris', { speed: 90, startDelay: 300 })

  return (
    <section className="hero" id="hero">
      <div className="wrap hero-grid">
        <div>
          <h1 className="typewriter-name">
            {displayed}
            <span className={`typewriter-cursor${done ? ' typewriter-cursor--blink' : ''}`}>|</span>
          </h1>
          <div className="role-line">
            Full-Stack Software Engineer<span className="sep">/</span>DevOps Engineer<span className="sep">/</span>Applied AI
          </div>
          <p className="pitch">
            From your imagination to a real product,<br/> I bring your ideas to life through code and creativity.
          </p>
          <div className="cta-row">
            <a href="mailto:aya.boukhriis@gmail.com" className="btn btn-solid-2">
              Let's Chat!
            </a>
           
          </div>
        </div>

        <div className="hero-portrait">
          <img src={Aya} alt="Aya Boukhris" className="hero-portrait-img" />
        </div>
      </div>
    </section>
  )
}
