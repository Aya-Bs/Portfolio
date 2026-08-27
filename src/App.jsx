import { useState } from 'react'

import './App.css'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experiences from './components/Experiences'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Education from './components/Education'
import CursorTrail from './components/CursorTrail'
import Constellation from './components/Constellation'
import { useActiveSection } from './hooks/useActiveSection'

const SECTION_IDS = ['hero', 'about', 'experience', 'projects', 'skills', 'education']

export default function App() {
  const activeSection = useActiveSection(SECTION_IDS)

  return (
    <>
      <Constellation />
      <CursorTrail />
      <Navbar />

      <main id="top">
        <Hero />
        <About />
        <Experiences />
        <Projects />
        <Skills />
        <Education />
      </main>


      <div className="statusbar">
        <div className="sb-left">
          <span className="sb-item">
            <span className="sb-dot"></span> section: <span id="sb-section">{activeSection}</span>
          </span>
          <span className="sb-item sb-hide-mobile">branch: main</span>
        </div>
        <div className="sb-right">
          <span className="sb-item sb-hide-mobile">stack: react · django · azure</span>
          <span className="sb-item">status: open to work</span>
        </div>
      </div>
    </>
  )
}

