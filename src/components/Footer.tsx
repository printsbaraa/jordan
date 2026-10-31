import { scrollToSection } from '@/lib/utils'
import { JordanFlag } from './JordanFlag'
import { Github, Mail, Globe, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

const footerLinks = [
  {
    heading: 'Explore',
    links: [
      { label: 'Destinations', action: () => scrollToSection('destinations') },
      { label: 'About Jordan', action: () => scrollToSection('about') },
      { label: 'Gallery',      action: () => scrollToSection('gallery') },
    ],
  },
  {
    heading: 'Official Resources',
    links: [
      { label: 'Jordan Tourism Board', href: 'https://www.visitjordan.com/', external: true },
      { label: 'Ministry of Tourism',  href: 'https://tourism.gov.jo/',      external: true },
      { label: 'Royal Jordanian',       href: 'https://www.rj.com/',          external: true },
    ],
  },
  {
    heading: 'Travel Info',
    links: [
      { label: 'Jordan Pass',     href: 'https://www.jordanpass.jo/', external: true },
      { label: 'Visit Petra',     href: 'https://www.visitpetra.jo/', external: true },
      { label: 'Aqaba Tourism',   href: 'https://www.visitorjordan.com/', external: true },
    ],
  },
]

export function Footer() {
  return (
    <footer
      className="relative bg-desert-900 border-t border-white/5 pt-20 pb-8"
      aria-label="Site footer"
    >
      {/* Top Jordan flag stripe */}
      <div aria-hidden="true" className="absolute top-0 left-0 right-0">
        <div className="flex h-1">
          <div className="flex-1 bg-black" />
          <div className="flex-1 bg-[#007A3D]" />
          <div className="flex-1 bg-white/80" />
          <div className="flex-1 bg-[#CE1126]" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <p className="text-sandstone-500 font-sans text-xs tracking-[0.4em] uppercase mb-1">Welcome to</p>
              <h2 className="font-cinematic text-3xl text-white tracking-widest">JORDAN</h2>
            </div>
            <p className="font-sans text-stone-400 text-sm leading-relaxed mb-6">
              A premium digital experience celebrating the beauty, history, and warmth of the
              Hashemite Kingdom of Jordan.
            </p>

            <JordanFlag variant="full" height={48} className="opacity-80" />
          </div>

          {/* Link columns */}
          {footerLinks.map(col => (
            <div key={col.heading}>
              <h3 className="font-sans text-white text-xs tracking-[0.35em] uppercase mb-5">
                {col.heading}
              </h3>
              <ul className="space-y-3">
                {col.links.map(link => (
                  <li key={link.label}>
                    {'action' in link ? (
                      <button
                        onClick={link.action}
                        className="font-sans text-stone-400 hover:text-sandstone-300 text-sm transition-colors underline-anim cursor-pointer border-none bg-transparent"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className="font-sans text-stone-400 hover:text-sandstone-300 text-sm transition-colors underline-anim"
                      >
                        {link.label}
                        {link.external && (
                          <span className="ml-1 text-stone-600" aria-hidden="true">↗</span>
                        )}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <p className="font-sans text-stone-600 text-xs text-center sm:text-left">
            © 2026 Welcome to Jordan. A premium tourism experience project.
            <br />
            <span className="text-stone-700">
              Photography credits: Wikimedia Commons contributors (CC BY-SA / Public Domain).
            </span>
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://visitjordan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-500 hover:text-sandstone-400 transition-colors"
              aria-label="Visit Jordan official website"
            >
              <Globe size={18} />
            </a>
            <a
              href="mailto:info@visitjordan.com"
              className="text-stone-500 hover:text-sandstone-400 transition-colors"
              aria-label="Contact Jordan Tourism"
            >
              <Mail size={18} />
            </a>
            <Link
              to="/admin/login"
              className="text-stone-500 hover:text-sandstone-400 transition-colors flex items-center gap-1 text-xs"
              title="لوحة تحكم المشرف (Admin Portal)"
              aria-label="Admin Portal Login"
            >
              <Shield size={16} />
              <span className="hidden sm:inline">Admin</span>
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-500 hover:text-sandstone-400 transition-colors"
              aria-label="GitHub repository"
            >
              <Github size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
