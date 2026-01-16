import './App.css'
import { useEffect, useState } from 'react'
import { ThemeProvider } from './components/themes/ThemeProvider'
import ParticlesBackground from './components/common/ParticlesBackground'
import SignatureOverlay from './components/common/SignatureOverlay'
import { AboutSection } from './components/about/About'
import { HomeSection } from './components/home/Home'
import { ContactSection } from './components/contact/Contact'
import { Footer } from './components/footer/Footer'
import { Navigation } from './components/navigation/Navigation'
import { SkillsSection } from './components/skills/Skills'
import { ProjectsSection } from './components/projects/Projects'
import { ScrollToTop } from './components/scrolltotop/ScrollToTop'

export default function App() {
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const sections = ['home', 'about', 'skills', 'projects', 'contact']
    const onScroll = () => {
      const scrollPos = window.scrollY + 120
      let current = 'home'
      for (const id of sections) {
        const el = document.getElementById(id)
        if (!el) continue
        const offsetTop = el.getBoundingClientRect().top + window.scrollY
        if (scrollPos >= offsetTop) current = id
      }
      setActiveSection(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <ParticlesBackground />
        <SignatureOverlay />

        <div className="relative z-10">
          <Navigation activeSection={activeSection} />

          <main>
            <HomeSection />
            <AboutSection />
            <SkillsSection />
            <ProjectsSection />
            <ContactSection />
          </main>

          <Footer />
          <ScrollToTop />
        </div>
      </div>
    </ThemeProvider>
  )
}
