import { useEffect, useRef, useState, type FormEvent } from 'react'
import Icon from './components/Icon'
import HashNavigation from './components/HashNavigation'
import HomeBench from './HomeBench'
import PhotoViewer from './components/PhotoViewer'
import ProductPage from './pages/ProductPage'
import StoriesPage from './pages/StoriesPage'
import InstallationPage from './pages/InstallationPage'
import FccPage from './pages/FccPage'
import { ProductTeaser, ModesSection, LifestyleSection } from './HomeSections'

import { CAMPAIGN_PRICE, CONTACT_EMAIL, EARLY_BIRD_SAVING, LATER_PRICE } from './product-info'

const BASE = import.meta.env.BASE_URL
const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID as string | undefined



function Wordmark() {
  return <span className="brand-logo" aria-hidden="true" style={{ maskImage: `url(${BASE}brand/plidepli-logo.png)`, WebkitMaskImage: `url(${BASE}brand/plidepli-logo.png)` }} />
}

function EmailForm({ id, onPrivacy, showPrivacyNote = true }: { id: string; onPrivacy: () => void; showPrivacyNote?: boolean }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')
  const request = useRef<AbortController | null>(null)
  useEffect(() => () => request.current?.abort(), [])
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (request.current || !email.trim()) return
    if (!FORMSPREE_ID) { setStatus('error'); return }
    const controller = new AbortController()
    request.current = controller
    setStatus('submitting')
    const timeout = window.setTimeout(() => controller.abort(), 15000)
    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: id }), signal: controller.signal,
      })
      setStatus(response.ok ? 'done' : 'error')
    } catch { setStatus('error') }
    finally { window.clearTimeout(timeout); request.current = null }
  }
  return <div className="signup">
    {status === 'done' ? <div className="signup-success" role="status"><Icon name="check" /><div><strong>You’re on the list.</strong><p>We’ll email you when Plidépli launches on Kickstarter.</p></div></div> :
      <form className="signup-form" onSubmit={submit} aria-label={`${id === 'hero' ? 'First' : 'Final'} launch notification signup`} aria-busy={status === 'submitting'}>
        <label className="sr-only" htmlFor={`${id}-email`}>Email address</label>
        <input id={`${id}-email`} name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" aria-describedby={status === 'error' ? `${id}-error` : undefined} />
        <button className="button button-primary" type="submit" disabled={status === 'submitting'}>{status === 'submitting' ? 'Joining…' : 'Notify me at launch'}<Icon name="arrow" /></button>
      </form>}
    {status === 'error' && <p id={`${id}-error`} className="form-error" role="alert">{FORMSPREE_ID ? 'Your signup didn’t go through. Please try again.' : 'Launch notifications are temporarily unavailable. Please check back soon.'}</p>}
    {showPrivacyNote && <p className="signup-note"><button type="button" onClick={onPrivacy}>Privacy</button></p>}
  </div>
}

const INSTALL_STEPS = [
  { title: 'Find your outdoor signal', body: 'Mount the outdoor antenna where your existing cellular signal is strongest. Route its cable inside.' },
  { title: 'Connect your Plidépli', body: 'Connect the outdoor antenna cable to the OUTDOOR port. Set the mode switch to Internal, then plug in the supplied power adapter.' },
  { title: 'Bring the signal indoors', body: 'The built-in indoor antenna distributes the amplified signal. Check reception and adjust placement as needed.' },
]

function Installation() {
  const [diagramOpen, setDiagramOpen] = useState(false)
  return <section className="section installation" id="how-it-works"><div className="container">
    <div className="section-heading"><div><h2>Your signal.<br />A better way in.</h2></div><p>You already have a signal outside. Three steps bring it in. (Internal mode)</p></div>
    <div className="installation-grid setup-layout">
      <figure className="setup-diagram"><button type="button" onClick={() => setDiagramOpen(true)} aria-label="Enlarge the simple setup illustration"><img src={`${BASE}product/simple-setup.webp`} alt="House cutaway showing a roof-mounted outdoor antenna connected by cable to the Plidépli booster downstairs, with a separate power connection and the indoor antenna built in" width="2048" height="1024" loading="lazy" /></button></figure>
      <div className="installation-steps">{INSTALL_STEPS.map((item, index) => <div className="installation-step" key={item.title}><span className="step-number">{index + 1}</span><span><strong>{item.title}</strong><span className="step-description">{item.body}</span></span></div>)}</div>
    </div>
    {diagramOpen && <PhotoViewer photos={[{ src: `${BASE}product/simple-setup.webp`, alt: 'Plidépli installation concept: outdoor antenna, cable route, booster with built-in indoor antenna, and power. Not to scale.' }]} initial={0} onClose={() => setDiagramOpen(false)} />}
  </div></section>
}



function PrivacyDialog({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => { const el = dialog.current; el?.showModal(); const previous = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { el?.close(); document.body.style.overflow = previous } }, [])
  return <dialog ref={dialog} className="privacy-dialog" onCancel={(event) => { event.preventDefault(); onClose() }} onClick={(event) => { if (event.target === event.currentTarget) onClose() }} aria-labelledby="privacy-title"><div className="privacy-content"><button type="button" className="dialog-close" onClick={onClose} aria-label="Close privacy notice">×</button><p className="eyebrow">Plidépli</p><h2 id="privacy-title">Your email, explained.</h2><p>This signup is operated by Plidépli, the brand of Light Folding Science and Technology Co., Limited, Hong Kong.</p><p>We collect the email address you enter and which signup form you used so we can notify you when our Kickstarter campaign launches. Signing up does not place an order or authorize a payment.</p><p>Submissions are processed by Formspree, our form service. It may process technical information needed to deliver the form and prevent spam. Read <a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noreferrer">Formspree’s privacy policy</a>.</p><p>We use this list for the launch notification described on this page. This site does not include advertising trackers or an analytics service.</p>{CONTACT_EMAIL && <p>For questions or removal from the launch list, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>}<button type="button" className="button button-dark" onClick={onClose}>Back to Plidépli</button></div></dialog>
}

export default function App() {
  const [privacy, setPrivacy] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const page = window.location.pathname.replace(import.meta.env.BASE_URL, '').split('/')[0]

  const video = useRef<HTMLVideoElement>(null)
  // Shared by the hero and film-section buttons: bring the product film into view and start it.
  const playFilm = () => {
    video.current?.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    video.current?.focus({ preventScroll: true })
    video.current?.play().catch(() => {})
  }
  return <>
    <HashNavigation />
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="header"><div className="container header-inner">
      <a href={BASE} aria-label="Plidépli home"><Wordmark /></a>
      <nav id="site-navigation" className={menuOpen ? 'site-nav is-open' : 'site-nav'} aria-label="Main navigation">
        <a href={BASE} aria-current={page === '' ? 'page' : undefined}>Home</a>
        <a href={`${BASE}product/`} aria-current={page === 'product' ? 'page' : undefined}>The Booster</a>
        <a href={`${BASE}installation/`} aria-current={page === 'installation' ? 'page' : undefined}>Installation</a>
        <a href={`${BASE}stories/`} aria-current={page === 'stories' ? 'page' : undefined}>Our Story</a>
        <a href={`${BASE}fcc/`} aria-current={page === 'fcc' ? 'page' : undefined} onClick={() => setMenuOpen(false)}>FCC & Specs</a>
      </nav>
      <div className="header-actions"><a className="button button-header" href="#cta" onClick={() => setMenuOpen(false)}>Launch updates<Icon name="arrow" /></a><button className="menu-toggle" type="button" aria-controls="site-navigation" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button></div>
    </div></header>
    <main id="main">
      {page === 'product' ? <ProductPage /> : page === 'stories' ? <StoriesPage /> : page === 'installation' ? <InstallationPage /> : page === 'fcc' ? <FccPage /> : <>
      <section className="hero" id="top"><div className="container hero-grid">
        <div className="hero-intro"><p className="launch-status"><span />Coming to Kickstarter</p><h1>Better signal.<br />Less to install.</h1><p className="hero-description">Plidépli is the cellular booster with the indoor antenna built in{'\u2060'}—made for homes and cabins.</p></div>
        <figure className="hero-product kit-hero"><p className="kit-heading">What’s in the box.</p><div className="product-frame"><img src={`${BASE}product/kit.webp`} width="1672" height="941" alt="Plidépli kit rendering with signal booster, outdoor antenna, cable, power adapter and packaging" fetchPriority="high" /><button type="button" className="frame-privacy" onClick={() => setPrivacy(true)}>Privacy</button><button className="text-button hero-film-button" type="button" onClick={playFilm}><span className="play-icon" aria-hidden="true"><Icon name="play" /></span>Watch the product film</button></div><figcaption>Product rendering · Final contents at launch</figcaption></figure>
        <div className="hero-action"><div className="hero-price"><span>Early-bird price</span><strong>{CAMPAIGN_PRICE}</strong><span className="price-later"><s>{LATER_PRICE}</s> later price · {EARLY_BIRD_SAVING}. (No payment today)</span></div><EmailForm id="hero" onPrivacy={() => setPrivacy(true)} showPrivacyNote={false} /><p className="hero-condition"><span><Icon name="check" />FCC certified.</span><span><Icon name="check" />Outdoor antenna included.</span><span><Icon name="check" />Supports all U.S. carriers on the North American standard five bands.</span></p></div>
      </div></section>
      <ProductTeaser />
      <ModesSection />
      <Installation />
      <section className="film-section" id="film"><div className="container film-grid"><div><h2>The whole setup.</h2><p>The built-in antenna, external and dual modes, wall, ceiling or pole mounting—and what changes when you switch it on.</p><button className="text-button" type="button" onClick={playFilm}><span className="play-icon" aria-hidden="true"><Icon name="play" /></span>Watch the product film</button><p className="small-print film-note">Rendered scenes. Results vary with your signal and setup.</p></div><video ref={video} controls playsInline preload="none" poster={`${BASE}video/poster.jpg`} tabIndex={0} aria-label="Plidépli product film" onPlay={event => document.querySelectorAll('video').forEach(other => { if (other !== event.currentTarget) other.pause() })}><source src={`${BASE}video/promo-country-tech.mp4?v=clean-master-sep23`} type="video/mp4" />Your browser does not support video playback.</video></div></section>
      <LifestyleSection />
      <HomeBench />
      </>}
      <section className="final-cta" id="cta"><div className="container final-cta-grid"><div><h2>Be there on<br />launch day.</h2><p>One email when we go live on Kickstarter.</p></div><div className="final-signup"><div className="final-price"><span>Early-bird price</span><strong>{CAMPAIGN_PRICE}</strong><span className="price-later"><s>{LATER_PRICE}</s> later price · {EARLY_BIRD_SAVING}. (No payment today)</span></div><EmailForm id="footer" onPrivacy={() => setPrivacy(true)} showPrivacyNote={false} /></div></div></section>
    </main>
    <footer className="footer"><div className="container"><div className="footer-bottom"><span>© {new Date().getFullYear()} Plidépli</span><span>Light Folding Science and Technology Co., Limited · Hong Kong</span><nav className="footer-nav" aria-label="Footer"><a href={`${BASE}fcc/`}>FCC & Specs</a><button type="button" onClick={() => setPrivacy(true)}>Privacy</button><a href={`mailto:${CONTACT_EMAIL}`}>Contact us</a></nav></div></div></footer>
    {privacy && <PrivacyDialog onClose={() => setPrivacy(false)} />}
  </>
}
