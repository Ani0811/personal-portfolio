import './App.css'
import { useEffect, useState } from 'react'
import { ThemeProvider } from './components/themes/ThemeProvider'
import ParticlesBackground from './components/common/ParticlesBackground'
import GlitterOverlay from './components/common/GlitterOverlay'
import { AboutSection } from './components/about/About'
import { HeroSection } from './components/herosection/HeroSection'
import { ContactSection } from './components/contact/Contact'
import { CertificationsSection } from './components/certifications/Certifications'
import { Footer } from './components/footer/Footer'
import { Navigation } from './components/navigation/Navigation'
import { SkillsSection } from './components/skills/Skills'
import { ProjectsSection } from './components/projects/Projects'
import { ScrollToTop } from './components/scrolltotop/ScrollToTop'

export default function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const sections = ['home', 'about', 'skills', 'projects', 'certifications', 'contact']
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
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        {/* Global particles + glitter overlay */}
        <ParticlesBackground 
          style={{ 
            opacity: activeSection === 'home' ? 0.3 : 1,
            transition: 'opacity 0.6s ease'
          }} 
        />
        <GlitterOverlay intensity={1.0} />

        <div className="relative z-10 flex-1 flex flex-col">
          <Navigation activeSection={activeSection} onMobileMenuChange={setMobileMenuOpen} />

          <main className="flex-1">
            <HeroSection />
            <AboutSection />
            <SkillsSection />
            <ProjectsSection />
            <CertificationsSection />
            <ContactSection />
          </main>

          <Footer />
        </div>
        <ScrollToTop mobileMenuOpen={mobileMenuOpen} />
      </div>
    </ThemeProvider>
  )
}
