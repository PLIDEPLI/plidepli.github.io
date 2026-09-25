import { useRef, useState } from 'react'
import Icon from './components/Icon'
import PhotoViewer from './components/PhotoViewer'
const BASE = import.meta.env.BASE_URL

export function ProductTeaser() {
  return <section className="section product-teaser" id="built-in"><div className="container">
    <div className="section-heading"><div><h2>Less hardware.<br />More thought.</h2></div><p>Thick walls. A basement office. A cabin at the edge of coverage. Plidépli is a North American standard five-band booster with the indoor antenna built in—so every part has a job, and there are fewer parts.</p></div>
    <div className="teaser-grid">
      <a className="teaser-main" href={`${BASE}product/#inside`}><div className="teaser-image"><img src={`${BASE}product/antenna-inside.webp`} alt="Plidépli circuit board with the built-in indoor antenna highlighted" width="1230" height="1278" loading="lazy" /></div><div><h3>The indoor antenna is already inside.</h3><p>One less antenna to mount. One less indoor antenna cable to run.</p><span className="text-link">Look inside<Icon name="arrow" /></span></div></a>
      <div className="teaser-side"><a href={`${BASE}product/#gallery`}><img src={`${BASE}product/connected.webp`} alt="Plidépli connected booster rendering" width="1254" height="1254" loading="lazy" /><div><h3>See it from every side.</h3><p>Ports, switch and finish, up close.</p><Icon name="arrow" /></div></a><a href={`${BASE}installation/#mounting`}><img src={`${BASE}product/wall-finished.webp`} alt="Rendering of Plidépli installed on a wall" width="1254" height="1254" loading="lazy" /><div><h3>Wall, ceiling or pole.</h3><p>Three ways to mount it, step by step.</p><Icon name="arrow" /></div></a></div>
    </div>
  </div></section>
}

const MODES = [
  {
    key: 'internal', label: 'Internal', tag: 'Default',
    title: 'The antenna inside.',
    text: 'Use the built-in indoor antenna. Nothing extra to mount, no indoor cable to run.',
    image: 'mode-internal-line.webp',
    alt: 'Internal mode line drawing: the outdoor antenna is cabled to the Plidépli booster on the main floor, and coverage comes from the booster itself.',
  },
  {
    key: 'external', label: 'External', tag: 'Optional antenna',
    title: 'Coverage where you need it.',
    text: 'Connect a separate indoor antenna when the room that needs signal is away from the booster.',
    image: 'mode-external-line.webp',
    alt: 'External mode line drawing: the booster is cabled to a separate wall-mounted indoor antenna, which provides the coverage.',
  },
  {
    key: 'dual', label: 'Dual', tag: 'Optional antenna',
    title: 'Both, working together.',
    text: 'Use the built-in antenna and a separate indoor antenna at the same time—for example, a main floor and a basement. In a closed environment, dual mode nearly doubles your range.',
    image: 'mode-dual-line.webp',
    alt: 'Dual mode line drawing: the booster covers the main floor with its built-in antenna while a ceiling antenna covers the basement.',
  },
]

export function ModesSection() {
  const [enlarged, setEnlarged] = useState<number | null>(null)
  const [active, setActive] = useState(0)
  const track = useRef<HTMLDivElement>(null)
  // Phones show the cards as a swipe track; the dots follow and control it.
  const onScroll = () => {
    const el = track.current
    if (!el) return
    const cards = Array.from(el.children) as HTMLElement[]
    const start = cards[0].offsetLeft
    const distance = (card: HTMLElement) => Math.abs(card.offsetLeft - start - el.scrollLeft)
    setActive(cards.reduce((best, card, index) => distance(card) < distance(cards[best]) ? index : best, 0))
  }
  const goTo = (index: number) => {
    const card = track.current?.children[index] as HTMLElement | undefined
    card?.scrollIntoView({ inline: 'start', block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }
  return <section className="section modes-section" id="modes"><div className="container">
    <div className="section-heading"><div><h2>Built in by default.<br />Expand when needed.</h2></div><p>One mode switch on the side sets how Plidépli covers your home. Most homes start with the antenna inside. Larger or split layouts can add a separate indoor antenna.</p></div>
    <div className="mode-cards" ref={track} onScroll={onScroll}>{MODES.map((mode, index) => <article className="mode-card" key={mode.key}>
      <button type="button" className="mode-card-image" onClick={() => setEnlarged(index)} aria-label={`Enlarge the ${mode.label.toLowerCase()} mode illustration`}><img src={`${BASE}product/${mode.image}`} alt={mode.alt} width="1600" height="1014" loading="lazy" /></button>
      <div className="mode-card-body"><p className="mode-card-label"><span>{mode.label}</span><span className="mode-tag">{mode.tag}</span></p><h3>{mode.title}</h3><p>{mode.text}</p></div>
    </article>)}</div>
    <div className="mode-dots" role="group" aria-label="Antenna mode cards">{MODES.map((mode, index) => <button type="button" key={mode.key} aria-label={`Show ${mode.label.toLowerCase()} mode`} aria-current={active === index ? 'true' : undefined} onClick={() => goTo(index)}><span /></button>)}</div>
    <p className="modes-note">External and dual modes need an approved indoor antenna, sold separately.</p>
    {enlarged !== null && <PhotoViewer photos={MODES.map(mode => ({ src: `${BASE}product/${mode.image}`, alt: mode.alt, caption: `${mode.label} mode · Illustration, not to scale` }))} initial={enlarged} onClose={() => setEnlarged(null)} />}
  </div></section>
}

export function LifestyleSection() {
  return <section className="lifestyle-section" id="use-cases"><img src={`${BASE}product/cabin-lifestyle.webp`} alt="Illustrative cabin scene with a woman speaking on her phone beside a window" width="1774" height="887" loading="lazy" /><div className="container lifestyle-content"><h2 className="phrase-heading"><span>Stay in the conversation.</span><span>Stay where you are.</span></h2><p>For the home office, the living room, the cabin up the road. Stay on the call without walking to the porch.</p><a className="button button-primary" href={`${BASE}product/#fit`}>Find out if it works for your home<Icon name="arrow" /></a></div><span className="lifestyle-credit">Illustrative scene</span></section>
}
