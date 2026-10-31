import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn, scrollToSection } from '@/lib/utils'

interface NavItem {
  label: string
  target: string
  type: 'section' | 'anchor'
}

const navItems: NavItem[] = [
  { label: 'Home',         target: 'hero',         type: 'section' },
  { label: 'Explore',      target: 'destinations', type: 'section' },
  { label: 'Cities',       target: 'destinations', type: 'section' },
  { label: 'About Jordan', target: 'about',        type: 'section' },
  { label: 'Gallery',      target: 'gallery',      type: 'section' },
]

export function Navigation() {
  const [isScrolled, setIsScrolled]         = useState(false)
  const [mobileOpen, setMobileOpen]         = useState(false)
  const [activeSection, setActiveSection]   = useState('hero')
  const mobileMenuRef                        = useRef<HTMLDivElement>(null)

  /* ── Scroll watcher ── */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60)

      // highlight active section
      const sections = ['hero', 'destinations', 'about', 'gallery']
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActiveSection(id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* ── Close mobile menu on outside click ── */
  useEffect(() => {
    if (!mobileOpen) return
    const handler = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [mobileOpen])

  /* ── Prevent body scroll when mobile menu is open ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  function handleNav(target: string) {
    scrollToSection(target)
    setMobileOpen(false)
  }

  return (
    <header
      role="banner"
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled ? 'nav-glass py-3' : 'py-5 bg-gradient-to-b from-black/60 to-transparent'
      )}
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <button
          onClick={() => handleNav('hero')}
          className="flex flex-col items-start group cursor-pointer border-none bg-transparent"
          aria-label="Welcome to Jordan — go to top"
        >
          <span className="text-sandstone-400 font-cinematic text-xs tracking-[0.35em] uppercase opacity-80 group-hover:opacity-100 transition-opacity">
            Welcome to
          </span>
          <span className="text-white font-cinematic text-xl font-semibold tracking-widest leading-none group-hover:text-sandstone-300 transition-colors">
            JORDAN
          </span>
        </button>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {navItems.map(item => (
            <li key={item.label}>
              <button
                onClick={() => handleNav(item.target)}
                className={cn(
                  'underline-anim font-sans text-sm tracking-wider uppercase cursor-pointer border-none bg-transparent transition-colors duration-200',
                  activeSection === item.target
                    ? 'text-sandstone-400'
                    : 'text-stone-300 hover:text-white'
                )}
                aria-current={activeSection === item.target ? 'page' : undefined}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => handleNav('destinations')}
            className="btn-secondary text-xs"
            aria-label="Discover Jordan destinations"
          >
            <span>Discover Jordan</span>
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors"
          onClick={() => setMobileOpen(v => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          'md:hidden fixed top-0 right-0 h-full w-72 z-50 nav-glass shadow-2xl',
          'transform transition-transform duration-300 ease-out',
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <span className="font-cinematic text-sandstone-400 text-lg tracking-widest">JORDAN</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-white p-1.5 rounded-md hover:bg-white/10 transition-colors"
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        <ul className="flex flex-col py-4" role="list">
          {navItems.map(item => (
            <li key={item.label}>
              <button
                onClick={() => handleNav(item.target)}
                className={cn(
                  'w-full text-left px-6 py-4 font-sans text-sm tracking-wider uppercase border-none bg-transparent cursor-pointer transition-colors',
                  activeSection === item.target
                    ? 'text-sandstone-400 bg-white/5'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                )}
              >
                {item.label}
              </button>
            </li>
          ))}
          <li className="px-6 pt-6 pb-2">
            <button
              onClick={() => handleNav('destinations')}
              className="btn-primary w-full justify-center text-xs"
            >
              <span>Discover Jordan</span>
            </button>
          </li>
        </ul>
      </div>
    </header>
  )
}
