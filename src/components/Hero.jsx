import { useReveal } from '../hooks/useReveal'
import PortraitConstellation from './PortraitConstellation'
import heroImg from '../assets/hero.png'


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
            From your imagination to a real product,<br/> I bring your ideas to life through code and creativity.
          </p>
          <div className="cta-row">
            <a href="#projects" className="btn btn-solid">
              Let's Chat!
            </a>
           
          </div>
        </div>

        {/* <div className="hero-portrait">
          <img src={Me} width={500} height={460} />
        </div> */}
      </div>
    </section>
  )
}
