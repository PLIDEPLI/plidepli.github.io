import { useEffect, useRef, useState, type FormEvent } from 'react'
import Icon from './components/Icon'
import HashNavigation from './components/HashNavigation'
import HomeBench from './HomeBench'
import PhotoViewer from './components/PhotoViewer'
import ProductPage from './pages/ProductPage'
import StoriesPage from './pages/StoriesPage'
import InstallationPage from './pages/InstallationPage'
import { ProductTeaser, LifestyleSection } from './HomeSections'

const BASE = import.meta.env.BASE_URL
const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID as string | undefined
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL as string | undefined
const FCC_URL = 'https://apps.fcc.gov/oetcf/tcb/reports/Tcb731GrantForm.cfm?mode=COPY&RequestTimeout=500&tcb_code=&application_id=%2FxeBkw1BpqfOIvNhtA4odg%3D%3D&fcc_id=2BWMS-L5-5B-2006'


function Wordmark() {
  return <span className="wordmark"><span className="wordmark-signal" aria-hidden="true"><i /><i /><i /><i /></span>PLIDEPLI<span className="wordmark-period">.</span></span>
}

function EmailForm({ id, onPrivacy }: { id: string; onPrivacy: () => void }) {
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
    {status === 'done' ? <div className="signup-success" role="status"><Icon name="check" /><div><strong>You’re on the list.</strong><p>We’ll email you when PLIDEPLI launches on Kickstarter.</p></div></div> :
      <form className="signup-form" onSubmit={submit} aria-label={`${id === 'hero' ? 'First' : 'Final'} launch notification signup`} aria-busy={status === 'submitting'}>
        <label className="sr-only" htmlFor={`${id}-email`}>Email address</label>
        <input id={`${id}-email`} name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" aria-describedby={status === 'error' ? `${id}-error` : undefined} />
        <button className="button button-primary" type="submit" disabled={status === 'submitting'}>{status === 'submitting' ? 'Joining…' : 'Notify me at launch'}<Icon name="arrow" /></button>
      </form>}
    {status === 'error' && <p id={`${id}-error`} className="form-error" role="alert">{FORMSPREE_ID ? 'Your signup didn’t go through. Please try again.' : 'Launch notifications are temporarily unavailable. Please check back soon.'}</p>}
    <p className="signup-note">One launch email. No payment today. <button type="button" onClick={onPrivacy}>Privacy</button></p>
  </div>
}

const INSTALL_STEPS = [
  { title: 'Find your outdoor signal', body: 'Mount the outdoor antenna where your existing cellular signal is strongest. Route its cable inside.' },
  { title: 'Connect your PLIDEPLI', body: 'Connect the outdoor antenna cable to the booster, then connect the supplied 5V power adapter.' },
  { title: 'Bring the signal indoors', body: 'The built-in indoor antenna distributes the amplified signal. Check reception and adjust placement for your space.' },
]

function Installation() {
  const [diagramOpen, setDiagramOpen] = useState(false)
  return <section className="section installation" id="product"><div className="container">
    <div className="section-heading"><div><p className="eyebrow">A simpler setup</p><h2>Your signal.<br />A better way in.</h2></div><p>You already have a signal outside. We designed PLIDEPLI to help bring it inside—with one less antenna to mount.</p></div>
    <div className="installation-grid setup-layout">
      <figure className="setup-diagram"><button type="button" onClick={() => setDiagramOpen(true)} aria-label="Enlarge the simple setup illustration"><img src={`${BASE}product/simple-setup.webp`} alt="House cutaway showing a roof-mounted outdoor antenna connected by cable to the PLIDEPLI booster downstairs, with a separate power connection and the indoor antenna built in" width="2048" height="1024" loading="lazy" /><span>View the setup<Icon name="plus" /></span></button><figcaption>One outdoor cable. Indoor antenna built in. <span>Concept illustration · Not to scale</span></figcaption></figure>
      <div className="installation-steps">{INSTALL_STEPS.map((item, index) => <div className="installation-step" key={item.title}><span className="step-number">{index + 1}</span><span><strong>{item.title}</strong><span className="step-description">{item.body}</span></span></div>)}<p className="small-print">An outdoor signal is required. Antenna separation and building materials affect coverage. Follow the installation instructions for your setup.</p></div>
    </div>
    <div className="mode-note" id="modes"><span className="mode-note-mark" aria-hidden="true">+</span><div><h3>More flexibility, when you need it.</h3><p>Start with the built-in indoor antenna. External and dual modes let you use a separate indoor antenna for different layouts. Final accessory options will be listed at launch.</p></div></div>
    {diagramOpen && <PhotoViewer photos={[{ src: `${BASE}product/simple-setup.webp`, alt: 'PLIDEPLI installation concept: outdoor antenna, cable route, booster with built-in indoor antenna, and power. Not to scale.' }]} initial={0} onClose={() => setDiagramOpen(false)} />}
  </div></section>
}

const FAQS = [
  ['Will this work in my home?', 'PLIDEPLI is designed for fixed installations in US homes and cabins where a usable cellular signal is available outside. Your carrier’s local bands must match B12, B13, B5, B4, or B2. Walls, layout, and antenna placement affect the indoor result.'],
  ['What if there is no signal outside?', 'A booster amplifies an existing signal. It cannot create cellular coverage where there is no usable outdoor signal. Check reception at the planned outdoor antenna location before choosing a booster.'],
  ['Do I still need an outdoor antenna?', 'Yes. An outdoor antenna and its cable are required. The antenna built into PLIDEPLI is the indoor antenna, which means internal mode does not need a separate indoor antenna or its cable run.'],
  ['Which carriers and networks are supported?', 'The supported bands are B12, B13, B5, B4, and B2. Compatibility with Verizon, AT&T, T-Mobile, or another provider depends on the bands used at your location. A carrier name or a 5G icon alone does not confirm compatibility.'],
  ['Can I use it in a moving vehicle?', 'PLIDEPLI is designed for fixed installations. It is not offered as an in-motion vehicle booster. The current campaign focuses on homes and cabins.'],
  ['What do I need to do before using it?', 'Register the booster with your wireless provider and obtain their consent before use. Use the approved antennas and cables and follow the installation instructions, including antenna separation requirements.'],
  ['What will it cost, and what comes in the box?', 'Our target price is approximately $275. Final campaign pricing, the complete kit contents, and any optional accessories will be published when the Kickstarter campaign launches. Joining the notification list is free and does not place an order.'],
  ['When will it ship? What will the production version look like?', 'We have working prototypes and are preparing for production tooling. The campaign will help fund injection molds and the first production run. The prototypes shown are CNC-machined aluminum; the production housing will be injection-molded. Final milestones, shipping estimates, and warranty terms will be published with the campaign.'],
]

function PrivacyDialog({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => { const el = dialog.current; el?.showModal(); const previous = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { el?.close(); document.body.style.overflow = previous } }, [])
  return <dialog ref={dialog} className="privacy-dialog" onCancel={(event) => { event.preventDefault(); onClose() }} onClick={(event) => { if (event.target === event.currentTarget) onClose() }} aria-labelledby="privacy-title"><div className="privacy-content"><button type="button" className="dialog-close" onClick={onClose} aria-label="Close privacy notice">×</button><p className="eyebrow">PLIDEPLI</p><h2 id="privacy-title">Your email, explained.</h2><p>This signup is operated by PLIDEPLI, the brand of Light Folding Science and Technology Co., Limited, Hong Kong.</p><p>We collect the email address you enter and which signup form you used so we can notify you when our Kickstarter campaign launches. Signing up does not place an order or authorize a payment.</p><p>Submissions are processed by Formspree, our form service. It may process technical information needed to deliver the form and prevent spam. Read <a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noreferrer">Formspree’s privacy policy</a>.</p><p>We use this list for the launch notification described on this page. This site does not include advertising trackers or an analytics service.</p>{CONTACT_EMAIL && <p>For questions or removal from the launch list, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>}<button type="button" className="button button-dark" onClick={onClose}>Back to PLIDEPLI</button></div></dialog>
}

export default function App() {
  const [privacy, setPrivacy] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const page = window.location.pathname.replace(import.meta.env.BASE_URL, '').split('/')[0]

  const video = useRef<HTMLVideoElement>(null)
  return <>
    <HashNavigation />
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="header"><div className="container header-inner">
      <a href={BASE} aria-label="PLIDEPLI home"><Wordmark /></a>
      <nav id="site-navigation" className={menuOpen ? 'site-nav is-open' : 'site-nav'} aria-label="Main navigation">
        <a href={BASE} aria-current={page === '' ? 'page' : undefined}>Home</a>
        <a href={`${BASE}product/`} aria-current={page === 'product' ? 'page' : undefined}>The booster</a>
        <a href={`${BASE}installation/`} aria-current={page === 'installation' ? 'page' : undefined}>Installation</a>
        <a href={`${BASE}stories/`} aria-current={page === 'stories' ? 'page' : undefined}>Our story</a>
        <a href={`${BASE}#fcc`} onClick={() => setMenuOpen(false)}>FCC & specs</a>
      </nav>
      <div className="header-actions"><a className="button button-header" href="#cta" onClick={() => setMenuOpen(false)}>Get launch updates<Icon name="arrow" /></a><button className="menu-toggle" type="button" aria-controls="site-navigation" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button></div>
    </div></header>
    <main id="main">
      {page === 'product' ? <ProductPage /> : page === 'stories' ? <StoriesPage /> : page === 'installation' ? <InstallationPage /> : <>
      <section className="hero" id="top"><div className="container hero-grid">
        <div className="hero-intro"><p className="launch-status"><span />Coming to Kickstarter</p><h1>Better signal.<br />Less to install.</h1><p className="hero-description">Meet the cellular booster with the indoor antenna built in. Made for a better connection in your home or cabin.</p></div>
        <figure className="hero-product kit-hero"><div className="product-frame"><img src={`${BASE}product/kit.webp`} width="1672" height="941" alt="PLIDEPLI kit rendering with signal booster, outdoor antenna, cable, power adapter and packaging" fetchPriority="high" /></div><figcaption><span>Meet the PLIDEPLI signal booster kit.</span><span>Product rendering · Final contents at launch</span></figcaption><a className="hero-product-link" href={`${BASE}product/`}>Take a closer look<Icon name="arrow" /></a></figure>
        <div className="hero-action"><div className="hero-price"><span>Target price</span><strong>~$275</strong><span>Final pricing at launch</span></div><EmailForm id="hero" onPrivacy={() => setPrivacy(true)} /><p className="hero-condition">For fixed US installations. An outdoor antenna and existing outdoor signal are required.</p></div>
      </div><div className="container hero-bottom"><a href="#fcc"><Icon name="check" />FCC Part 20 certified</a><span>Five cellular bands</span><span>Indoor antenna built in</span><a href="#product">Explore the booster<Icon name="arrow" /></a></div></section>
      <section className="intro-section"><div className="container intro-grid"><p className="eyebrow">A little less hardware.<br />A little more connection.</p><h2>For the calls you shouldn’t<br className="desktop-break" /> have to take outside.</h2><p>Thick walls. A basement office. A cabin just beyond easy reception. PLIDEPLI is built around one idea: bringing your existing outdoor signal into the space where you actually use your phone.</p></div></section>
      <ProductTeaser />
      <Installation />
      <LifestyleSection />
      <section className="film-section" id="film"><div className="container film-grid"><div><p className="eyebrow">Meet PLIDEPLI</p><h2>One small change<br />to your setup.</h2><p>See the built-in antenna, installation options, and the idea behind the booster in our 44-second product film.</p><button className="text-button" type="button" onClick={() => { video.current?.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); video.current?.focus(); video.current?.play().catch(() => {}) }}><span className="play-icon"><Icon name="play" /></span>Watch the product film</button><p className="small-print">Product visualization. Actual coverage depends on your outdoor signal and installation.</p></div><video ref={video} controls playsInline preload="none" poster={`${BASE}video/poster.jpg`} tabIndex={0} aria-label="PLIDEPLI 44-second product film"><source src={`${BASE}video/promo.mp4`} type="video/mp4" />Your browser does not support video playback.</video></div></section>
      <HomeBench />
      <section className="section evidence-section" id="fcc"><div className="container evidence-grid"><div className="evidence-copy"><p className="eyebrow">Evidence you can open</p><h2>The engineering.<br />On the record.</h2><p>Our FCC authorization and test report are here to read. See the device, supported frequencies, and compliance measurements for yourself.</p><div className="certification-stamp"><span className="certification-icon"><Icon name="check" /></span><div><strong>FCC Part 20 certified</strong><span>FCC ID: 2BWMS-L5-5B-2006</span></div></div><p className="small-print">Granted August 19, 2026 to Light Folding Science and Technology Co., Limited, Hong Kong—the legal entity behind PLIDEPLI.</p><div className="document-links"><a href={`${BASE}fcc/fcc-grant.pdf`} target="_blank" rel="noreferrer"><Icon name="download" />Read the authorization<span>PDF</span></a><a href={`${BASE}fcc/fcc-test-report.pdf`} target="_blank" rel="noreferrer"><Icon name="download" />Read the test report<span>85 pages · 29 MB</span></a><a className="fcc-record" href={FCC_URL} target="_blank" rel="noreferrer">Open the official FCC record<Icon name="arrow" /></a></div></div>
        <div className="spec-sheet" id="spec"><div className="spec-sheet-heading"><span>PLIDEPLI</span><span>Five-band cellular booster</span></div><dl><div><dt>Indoor antenna</dt><dd>Built in</dd></div><div><dt>Cellular bands</dt><dd>B12 / B13 / B5 / B4 / B2</dd></div><div><dt>Measured amplifier gain</dt><dd>61.27–64.69 dB<span>Across tested bands and signal types</span></dd></div><div><dt>Power input</dt><dd>5V USB-C<span>Use the supplied power adapter</span></dd></div><div><dt>Antenna modes</dt><dd>Internal / external / dual</dd></div><div><dt>Designed for</dt><dd>Fixed indoor installations</dd></div></dl><p>Gain values: FCC test report, page 18. Coverage varies with outdoor signal, building materials, and placement. Home RSRP and speed comparisons are still being prepared.</p></div>
      </div></section>
      <section className="section campaign-section" id="roadmap"><div className="container"><div className="section-heading"><div><p className="eyebrow">The next chapter needs you</p><h2>Help bring PLIDEPLI<br />off the workbench.</h2></div><p>The prototypes are working. The next investment is production tooling. Kickstarter will help fund the injection molds and our first production run.</p></div><ol className="roadmap"><li className="complete"><span className="milestone-marker"><Icon name="check" /></span><span className="milestone-status">Complete</span><h3>Working prototypes</h3><p>Board development, antenna tuning, and CNC-machined housings.</p></li><li className="complete"><span className="milestone-marker"><Icon name="check" /></span><span className="milestone-status">Complete</span><h3>FCC certification</h3><p>Authorization granted. The documents are available above.</p></li><li className="current"><span className="milestone-marker"><span /></span><span className="milestone-status">Up next</span><h3>Kickstarter & tooling</h3><p>Fund production molds and confirm the final campaign details.</p></li><li><span className="milestone-marker" /><span className="milestone-status">To follow</span><h3>First production run</h3><p>Trial production, validation, and delivery to our first backers.</p></li></ol><div className="campaign-note"><p>Shown today: aluminum prototypes.<br /><strong>Planned for production: injection-molded housing.</strong></p><p>Final specifications, kit contents, shipping estimates, and warranty terms will be published with the campaign.</p></div></div></section>
      <section className="section faq-section" id="faq"><div className="container faq-grid"><div><p className="eyebrow">Before you join</p><h2>A few good<br />questions.</h2>{CONTACT_EMAIL && <p className="contact-note">Something else on your mind?<br /><a href={`mailto:${CONTACT_EMAIL}`}>Talk to our team<Icon name="arrow" /></a></p>}</div><div className="faq-list">{FAQS.map(([question, answer]) => <details key={question}><summary>{question}<Icon name="plus" /></summary><p>{answer}</p></details>)}</div></div></section>
      </>}
      <section className="final-cta" id="cta"><div className="container final-cta-grid"><div><p className="launch-status"><span />Be here for the beginning</p><h2>Great things start<br />with a connection.</h2><p>Join the launch list. Help a small engineering team take the next step.</p></div><div className="final-signup"><div className="final-price"><span>PLIDEPLI cellular booster</span><strong>~$275<span>target price</span></strong></div><EmailForm id="footer" onPrivacy={() => setPrivacy(true)} /><p className="final-disclaimer">Coming to Kickstarter. Final pricing and delivery timing will be announced with the campaign.</p></div></div></section>
    </main>
    <footer className="footer"><div className="container"><div className="footer-top"><div><a href={BASE} aria-label="PLIDEPLI home"><Wordmark /></a><p>Independent RF engineering.<br />Built with care in Shenzhen.</p></div><div className="footer-links"><a href={`${BASE}product/`}>The booster</a><a href={`${BASE}installation/`}>Installation</a><a href={`${BASE}stories/`}>Our story</a><a href={`${BASE}fcc/fcc-grant.pdf`} target="_blank" rel="noreferrer">FCC authorization</a><button type="button" onClick={() => setPrivacy(true)}>Privacy</button>{CONTACT_EMAIL && <a href={`mailto:${CONTACT_EMAIL}`}>Contact</a>}</div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} PLIDEPLI</span><span>Light Folding Science and Technology Co., Limited · Hong Kong</span><span>FCC ID 2BWMS-L5-5B-2006</span></div></div></footer>
    {privacy && <PrivacyDialog onClose={() => setPrivacy(false)} />}
  </>
}
