import { useReveal } from '../hooks/useReveal'

export default function About() {
  const blocksRef = useReveal()

  return (
    <section className="about" id="about">
      <div className="wrap">
        <div className="eyebrow">01 — about</div>
        <div className="about-grid">
          <div className="about-label">how i work</div>

          <div className="about-blocks reveal" ref={blocksRef}>
            <div className="about-block">
              <h3>Engineering mindset</h3>
              <p>
                I gravitate toward systems with real operational constraints — correctness,
                performance, and deployability — over toy problems. I'm comfortable owning a
                feature from design through production, not just the part that's easy to demo.
              </p>
            </div>

            <div className="about-block">
              <h3>How I approach problems</h3>
              <p>
                I like turning ambiguous requirements into something structured and measurable.
                At Sofrecom, that meant formalizing "project health" — a fuzzy, subjective
                judgment call — into a 9-axis assessment framework an ML pipeline could actually
                score.
              </p>
              <ul>
                <li>
                  Comfortable moving across the stack: backend, frontend, data, and the
                  infrastructure that ships it
                </li>
                <li>
                  Bias toward applying ML pragmatically — precision and inference speed matter
                  as much as model choice
                </li>
                <li>
                  Prefer shipping a working, monitored version over a perfect but undeployed one
                </li>
              </ul>
            </div>

            <div className="about-block">
              <h3>Ownership</h3>
              <p>
                I delivered SofAssess PM's ML recommendation pipeline through a full 4-sprint
                Scrum cycle — from framework design to a production feature with measured
                precision and latency, not just a notebook.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
