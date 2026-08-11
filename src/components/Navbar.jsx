import { useState } from 'react'

const NAV_LINKS = [
  { href: '#about', label: 'about' },
  { href: '#experience', label: 'experience' },
  { href: '#projects', label: 'projects' },
  { href: '#skills', label: 'skills' },
  { href: '#education', label: 'education' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="nav">
      <div className="nav-inner">
        <a href="#top" className="logo">
          aya<span className="dot">.</span>dev
        </a>

        <nav className={`routes${menuOpen ? ' open' : ''}`} id="routes">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <a href="/resume.pdf" className="btn" download>
            ↓ resume
          </a>
          <a href="#contact" className="btn btn-solid">
            contact
          </a>
          <button
            className="menu-toggle"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span></span>
          </button>
        </div>
      </div>
    </header>
  )
}
