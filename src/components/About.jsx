import { useReveal } from '../hooks/useReveal'
import ParticlePortrait from '../partials/ParticlePortrait'
import Aya from '../assets/me.jpg'

export default function About() {
  const blocksRef = useReveal()

  return (
    <section className="about" id="about">
      <div className="wrap">
        <div className="eyebrow">01 — about</div>
        <div className="about-grid">
          <div className="about-label"></div>
 <ParticlePortrait src={Aya} />
          <div className="about-blocks reveal" ref={blocksRef}>
            <div className="about-block">
              <h2 className='section-title'>Get to know me </h2>
              <p>
                I am an engineering graduate from ESPRIT, with a background in computer science and a focus on software development. 
                <br />
                
                I love creating things and solving mysteries, and I find that code is my language to do that.
                <br />
                Throughout my work, I had the opportunity to design and create various software applications, while exploring areas I find particularly interesting, such as DevOps and ML.
                <br />
                <br />
                I am currently looking for my first opportunity as a Software Engineer. I want to work in an environment where I can build things that matter, where work feels like creating rather than simply executing, and where I can keep learning, growing, and becoming a better engineer.
                <br />
                <br />
                Aside from coding, I like doing nerdy things, I read, solve puzzles, create. I love learning about fashion and quite literally everything else.
                <br/>
                <br/>
                Oh, I dream of traveling the world, having the coolest wardrobe and owning a beach house. Small dreams, you see.
              </p>
              
            </div>
            
            
          </div>
         
        </div>
      </div>
    </section>
  )
}
