import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mic2, Headphones, ArrowRight, Play, Zap, Globe, BookOpen, Clock, Menu, X, ChevronRight } from 'lucide-react'

/* ── Headphones Illustration ───────────────────────────── */
function HeadphonesArt() {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
      {/* Background blobs */}
      <div style={{ position: 'absolute', width: 320, height: 320, background: 'radial-gradient(circle, #FDECD9 0%, #FAF7F0 70%)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', width: 370, height: 370, border: '1px dashed #E8C9A5', borderRadius: '50%', opacity: 0.5 }} />

      {/* Headphones SVG */}
      <svg width="340" height="310" viewBox="0 0 340 310" style={{ position: 'relative', zIndex: 1 }}>
        {/* Headband */}
        <path d="M 54 170 C 54 52 286 52 286 170" fill="none" stroke="#6B3220" strokeWidth="28" strokeLinecap="round" />

        {/* Left ear cup */}
        <ellipse cx="52" cy="188" rx="48" ry="58" fill="#8B3A1C" />
        <ellipse cx="52" cy="188" rx="37" ry="46" fill="#C04A26" />
        <ellipse cx="52" cy="188" rx="25" ry="32" fill="#D86030" />
        <ellipse cx="52" cy="188" rx="13" ry="17" fill="#E87040" opacity="0.75" />

        {/* Right ear cup */}
        <ellipse cx="288" cy="188" rx="48" ry="58" fill="#8B3A1C" />
        <ellipse cx="288" cy="188" rx="37" ry="46" fill="#C04A26" />
        <ellipse cx="288" cy="188" rx="25" ry="32" fill="#D86030" />
        <ellipse cx="288" cy="188" rx="13" ry="17" fill="#E87040" opacity="0.75" />

        {/* Waveform bars */}
        {[108, 124, 140, 157, 174, 191, 208, 224, 240].map((x, i) => {
          const h = [14, 28, 44, 58, 66, 52, 38, 24, 14][i]
          const isMain = i >= 3 && i <= 5
          return <rect key={x} x={x - 5} y={293 - h} width="10" height={h} rx="5" fill={isMain ? '#E85D2A' : '#E8C5A5'} opacity={isMain ? 1 : 0.65} />
        })}
      </svg>

      {/* Decorative dots */}
      {[
        { top: 55, right: 60, size: 11, color: '#E85D2A', opacity: 0.5 },
        { top: 95, right: 90, size: 7, color: '#7A9B57', opacity: 0.55 },
        { bottom: 70, left: 55, size: 9, color: '#E8A33D', opacity: 0.5 },
        { top: 60, left: 70, size: 6, color: '#6B3220', opacity: 0.3 },
      ].map((d, i) => (
        <div key={i} style={{ position: 'absolute', ...d, width: d.size, height: d.size, borderRadius: '50%', background: d.color, opacity: d.opacity }} />
      ))}

      {/* Playing card decoration */}
      <div style={{
        position: 'absolute', bottom: 30, right: 30, background: '#fff',
        border: '1px solid #E8E1D7', borderRadius: 12, padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 10,
        boxShadow: '0 4px 16px rgba(43,42,39,0.1)',
      }}>
        <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#E85D2A,#C44D20)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Play size={16} color="#fff" style={{ marginLeft: 2 }} />
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2B2A27' }}>Now Playing</div>
          <div style={{ fontSize: '0.68rem', color: '#777', marginTop: 1 }}>AI Podcast · 12 min</div>
        </div>
        {/* Mini waveform */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 20 }}>
          {[10, 16, 20, 14, 18, 12, 20].map((h, i) => (
            <div key={i} className="wave-bar" style={{ width: 3, height: h, background: '#E85D2A', borderRadius: 2, animationDelay: `${i * 0.08}s` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Main ──────────────────────────────────────────────── */
export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ background: '#FAF7F0', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ═══════ NAVBAR ═══════ */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #E8E1D7', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container-app" style={{ display: 'flex', alignItems: 'center', height: 64, gap: 24 }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, background: '#0B5D48', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Headphones size={17} color="#E85D2A" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#2B2A27', letterSpacing: '-0.01em' }}>VOXORA</span>
          </Link>

          {/* Centre links — desktop */}
          <div className="hidden md:flex" style={{ flex: 1, justifyContent: 'center', gap: 4 }}>
            {['Home', 'Explore', 'About'].map(l => (
              <a key={l} href="#" className="btn-ghost" style={{ fontSize: '0.9375rem', color: '#555' }}>{l}</a>
            ))}
          </div>

          {/* Right actions — desktop */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <Link to="/login" className="btn-ghost" style={{ color: '#555', fontSize: '0.9375rem' }}>Login</Link>
            <Link to="/register" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.875rem' }}>Get Started</Link>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#555', display: 'flex' }}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden" style={{ borderTop: '1px solid #E8E1D7', padding: '12px 24px 16px' }}>
            {['Home', 'Explore', 'About'].map(l => <a key={l} href="#" className="btn-ghost" style={{ display: 'block', marginBottom: 2, color: '#555' }}>{l}</a>)}
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <Link to="/login"    className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Login</Link>
              <Link to="/register" className="btn-primary"   style={{ flex: 1, justifyContent: 'center' }}>Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ═══════ HERO ═══════ */}
      <section className="container-app" style={{ paddingTop: 72, paddingBottom: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'center' }}>
          {/* Left — text */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FFF3EE', border: '1px solid rgba(232,93,42,0.2)', borderRadius: 99, padding: '5px 12px', marginBottom: 24 }}>
              <Zap size={12} color="#E85D2A" />
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#E85D2A', letterSpacing: '0.03em' }}>AI-POWERED PERSONALIZED PODCASTS</span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.25rem)', fontWeight: 800, color: '#2B2A27', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 20 }}>
              Turn Ideas into<br />
              <span style={{ color: '#E85D2A' }}>Listening</span><br />
              Experiences.
            </h1>

            <p style={{ fontSize: '1.0625rem', color: '#777', lineHeight: 1.7, marginBottom: 32, maxWidth: 440 }}>
              Create personalized podcasts from any topic, tailored to your knowledge level, style, language, and time.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link to="/register" className="btn-primary" style={{ padding: '12px 24px', fontSize: '0.9375rem' }}>
                Create Your Podcast <ArrowRight size={16} />
              </Link>
              <a href="#how" className="btn-secondary" style={{ padding: '12px 24px', fontSize: '0.9375rem' }}>
                <Play size={16} /> Explore Podcasts
              </a>
            </div>
          </div>

          {/* Right — illustration */}
          <div>
            <HeadphonesArt />
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section id="how" style={{ background: '#fff', padding: '72px 0' }}>
        <div className="container-app">
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#2B2A27', marginBottom: 56, letterSpacing: '-0.02em' }}>
            How VOXORA Works?
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32, alignItems: 'start' }}>
            {[
              { icon: BookOpen, label: 'Choose a Topic', desc: 'Pick any subject you want to explore.', color: '#FFF3EE', iconColor: '#E85D2A' },
              { icon: Zap,      label: 'Personalize',    desc: 'Select your level, style, language, and duration.', color: '#F0FAF4', iconColor: '#0B5D48' },
              { icon: Play,     label: 'Generate & Listen', desc: 'Get your AI podcast with transcript and key takeaways.', color: '#FFFAEE', iconColor: '#E8A33D' },
            ].map(({ icon: Icon, label, desc, color, iconColor }, i) => (
              <div key={label} style={{ textAlign: 'center', position: 'relative' }}>
                {/* Connector arrow */}
                {i < 2 && (
                  <div className="hidden md:block" style={{ position: 'absolute', top: 28, right: -20, color: '#E8E1D7', zIndex: 1 }}>
                    <ChevronRight size={24} />
                  </div>
                )}
                <div style={{ width: 60, height: 60, background: color, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Icon size={26} color={iconColor} />
                </div>
                <h3 style={{ fontWeight: 700, color: '#2B2A27', marginBottom: 8, fontSize: '1.0625rem' }}>{label}</h3>
                <p style={{ color: '#777', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: 220, margin: '0 auto' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FEATURES ═══════ */}
      <section style={{ padding: '72px 0' }}>
        <div className="container-app">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#2B2A27', letterSpacing: '-0.02em', marginBottom: 12 }}>
              Everything You Need to Learn Better
            </h2>
            <p style={{ color: '#777', maxWidth: 480, margin: '0 auto', lineHeight: 1.65 }}>
              VOXORA combines AI, personalization, and multilingual support into one seamless experience.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20 }}>
            {[
              { icon: Zap,       color: '#FFF3EE', iconColor: '#E85D2A', title: 'AI-Powered Generation',   desc: 'State-of-the-art language models craft engaging, accurate scripts on any topic.' },
              { icon: Globe,     color: '#F0F7FF', iconColor: '#3B82F6', title: 'Multilingual Support',     desc: 'Generate podcasts in 13+ Indian and international languages.' },
              { icon: BookOpen,  color: '#F0FAF4', iconColor: '#0B5D48', title: 'Personalized Content',     desc: 'Adapts to your background — student, professional, researcher, or curious learner.' },
              { icon: Clock,     color: '#FFFAEE', iconColor: '#E8A33D', title: 'Flexible Duration',        desc: 'From 2-minute briefs to 45-minute deep dives — your schedule, your choice.' },
            ].map(({ icon: Icon, color, iconColor, title, desc }) => (
              <div key={title} style={{ background: '#fff', border: '1px solid #E8E1D7', borderRadius: 14, padding: '24px', boxShadow: '0 2px 8px rgba(43,42,39,0.05)', transition: 'box-shadow 0.2s, transform 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(43,42,39,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(43,42,39,0.05)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ width: 48, height: 48, background: color, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon size={22} color={iconColor} />
                </div>
                <h3 style={{ fontWeight: 700, color: '#2B2A27', marginBottom: 8, fontSize: '1rem' }}>{title}</h3>
                <p style={{ color: '#777', fontSize: '0.875rem', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FEATURED PODCASTS ═══════ */}
      <section style={{ background: '#fff', padding: '72px 0' }}>
        <div className="container-app">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.875rem)', fontWeight: 800, color: '#2B2A27', letterSpacing: '-0.02em' }}>
                Explore What You Can Listen To
              </h2>
              <p style={{ color: '#777', marginTop: 6, fontSize: '0.9375rem' }}>Sample AI-generated podcasts across popular topics</p>
            </div>
            <Link to="/register" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#E85D2A', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
              View all <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {[
              { title: 'Renewable Energy: A Sustainable Future', topic: 'Environment', dur: '12 min', level: 'Intermediate', grad: 'linear-gradient(135deg,#22c55e,#15803d)', emoji: '🌱', desc: 'Explore how renewable energy works and its role in a greener tomorrow.' },
              { title: 'Artificial Intelligence in Daily Life',   topic: 'Technology',  dur: '10 min', level: 'Beginner',      grad: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', emoji: '🤖', desc: 'How AI powers your phone, recommendations, and smart home devices.' },
              { title: 'The Indian Economy: An Overview',        topic: 'Economics',   dur: '20 min', level: 'Intermediate', grad: 'linear-gradient(135deg,#f59e0b,#b45309)', emoji: '📈', desc: "India's economic story — from agriculture to global IT powerhouse." },
            ].map(({ title, topic, dur, level, grad, emoji, desc }) => (
              <div key={title} style={{ background: '#fff', border: '1px solid #E8E1D7', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 8px rgba(43,42,39,0.06)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(43,42,39,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(43,42,39,0.06)' }}
              >
                {/* Artwork */}
                <div style={{ height: 160, background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, position: 'relative' }}>
                  {emoji}
                  <div style={{ position: 'absolute', bottom: 10, right: 12, background: 'rgba(0,0,0,0.5)', color: '#fff', borderRadius: 99, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, backdropFilter: 'blur(4px)' }}>
                    <Clock size={11} /> {dur}
                  </div>
                </div>
                {/* Content */}
                <div style={{ padding: '16px 18px' }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                    <span className="badge badge-orange">{topic}</span>
                    <span className="badge badge-gray">{level}</span>
                  </div>
                  <h3 style={{ fontWeight: 700, color: '#2B2A27', marginBottom: 8, fontSize: '0.9375rem', lineHeight: 1.35 }}>{title}</h3>
                  <p style={{ color: '#777', fontSize: '0.8125rem', lineHeight: 1.55, marginBottom: 14 }}>{desc}</p>
                  <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#E85D2A', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
                    <span style={{ width: 28, height: 28, background: '#FFF3EE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Play size={12} style={{ marginLeft: 1 }} />
                    </span>
                    Listen now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section style={{ padding: '72px 0' }}>
        <div className="container-app">
          <div style={{ background: 'linear-gradient(135deg,#0B5D48 0%,#094A39 100%)', borderRadius: 20, padding: 'clamp(40px,6vw,72px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: -40, left: -40, width: 180, height: 180, background: 'rgba(232,93,42,0.1)', borderRadius: '50%' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Mic2 size={36} color="#E85D2A" style={{ marginBottom: 16 }} />
              <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', fontWeight: 800, color: '#fff', marginBottom: 16, letterSpacing: '-0.02em' }}>
                Ready to Transform How You Learn?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '1.0625rem', lineHeight: 1.65, marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
                Join VOXORA and start generating personalized AI podcasts on any topic, in your language, at your level — in seconds.
              </p>
              <Link to="/register" className="btn-primary" style={{ padding: '13px 28px', fontSize: '1rem' }}>
                Create Your First Podcast <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer style={{ background: '#fff', borderTop: '1px solid #E8E1D7', padding: '48px 0 32px' }}>
        <div className="container-app">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, marginBottom: 36 }}>
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, background: '#0B5D48', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Headphones size={15} color="#E85D2A" />
                </div>
                <span style={{ fontWeight: 800, color: '#2B2A27', fontSize: '1.05rem' }}>VOXORA</span>
              </div>
              <p style={{ color: '#777', fontSize: '0.875rem', lineHeight: 1.65, maxWidth: 280 }}>
                AI-powered personalized podcast generator — turning any topic into a customized audio learning experience.
              </p>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, color: '#2B2A27', fontSize: '0.875rem', marginBottom: 14 }}>Platform</h4>
              {['Home', 'Explore', 'Create Podcast', 'My Podcasts'].map(l => (
                <a key={l} href="#" style={{ display: 'block', color: '#777', fontSize: '0.875rem', marginBottom: 8, textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#E85D2A'}
                  onMouseLeave={e => e.currentTarget.style.color = '#777'}
                >{l}</a>
              ))}
            </div>
            <div>
              <h4 style={{ fontWeight: 700, color: '#2B2A27', fontSize: '0.875rem', marginBottom: 14 }}>Account</h4>
              {[['Login', '/login'], ['Register', '/register']].map(([l, h]) => (
                <Link key={l} to={h} style={{ display: 'block', color: '#777', fontSize: '0.875rem', marginBottom: 8, textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#E85D2A'}
                  onMouseLeave={e => e.currentTarget.style.color = '#777'}
                >{l}</Link>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid #E8E1D7', paddingTop: 20, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ color: '#AAA', fontSize: '0.8125rem' }}>© {new Date().getFullYear()} VOXORA · AI Podcast Generator. All rights reserved.</span>
            <span style={{ color: '#AAA', fontSize: '0.8125rem' }}>Built with React · Vite · Tailwind CSS</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
