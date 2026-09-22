import { useState } from 'react'
import Icon from '../components/Icon'
import PhotoViewer from '../components/PhotoViewer'

import { CAMPAIGN_PRICE } from '../product-info'

const BASE = import.meta.env.BASE_URL
const GALLERY = [
  ['kit', 'The complete kit', 'Plidépli kit with booster, outdoor antenna, cable, power adapter and packaging'],
  ['booster', 'The booster', 'White Plidépli booster from an angled view'],
  ['standing', 'Desktop placement', 'Plidépli standing upright with connected antenna cables'],
  ['connected', 'Desktop placement', 'Close view of the Plidépli housing and connected cables'],
]
const MODES = [
  { title: 'Internal', heading: 'Start with what’s built in.', text: 'Use the indoor antenna integrated into the booster. It keeps the room-side setup together and removes the separate indoor antenna cable run.', image: 'mode-internal' },
  { title: 'External', heading: 'Place coverage independently.', text: 'Connect a separate approved indoor antenna when your layout calls for a different antenna position. The booster and indoor antenna can then be placed separately.', image: 'mode-external' },
  { title: 'Dual', heading: 'Work with both indoor antennas.', text: 'Use the built-in antenna together with a separate approved indoor antenna. Positioning and antenna separation still determine how the system works in your space.', image: 'mode-dual' },
]

export default function ProductPage() {
  const [selected, setSelected] = useState(0)
  const [viewing, setViewing] = useState(false)
  const [mode, setMode] = useState(0)
  const photos = GALLERY.map(([file, , alt], index) => ({ src: `${BASE}product/${file}.webp`, alt: `${alt}. Product rendering.`, caption: index === 1 ? '' : index > 1 ? 'Desktop setup' : 'The Plidépli signal booster kit. Product rendering.' }))
  return <>
    <section className="product-page-hero" id="top"><div className="container">
      <nav className="breadcrumb" aria-label="Breadcrumb"><a href={BASE}>Home</a><span>/</span><span>The booster</span></nav>
      <div className="product-detail-grid"><div id="gallery" className="product-gallery">
        <button type="button" className="gallery-main" onClick={() => setViewing(true)} aria-label="Enlarge product image"><img src={photos[selected].src} alt={photos[selected].alt} width="1672" height="941" fetchPriority="high" /></button>
        <div className="gallery-thumbs" role="group" aria-label="Product views">{GALLERY.map(([file, label], index) => <button type="button" key={file} aria-pressed={selected === index} onClick={() => setSelected(index)}><img src={`${BASE}product/${file}.webp`} alt="" width="140" height="100" /><span>{label}</span></button>)}</div>
      </div><div className="product-detail-copy"><p className="eyebrow">Plidépli cellular signal booster</p><h1>A stronger connection.<br />A simpler setup.</h1><p className="product-lede">Bring your existing outdoor cell signal inside, with the indoor antenna built right into the booster.</p><div className="product-price"><strong>{CAMPAIGN_PRICE}</strong><span>Target campaign price</span></div><a className="button button-dark" href="#cta">Notify me at launch<Icon name="arrow" /></a><ul className="product-points"><li><Icon name="check" />Desk-friendly design</li><li><Icon name="check" />Flexible internal & external antenna switching</li><li><Icon name="check" />Five supported cellular bands</li><li><Icon name="check" />FCC certified</li></ul></div></div>
    </div></section>
    <nav className="product-subnav" aria-label="Product sections"><div className="container"><a href="#inside">Built-in antenna</a><a href="#modes">Three modes</a><a href="#kit">The components</a><a href="#fit">Will it work for me?</a></div></nav>
    <section className="section inside-section" id="inside"><div className="container split-feature"><div><h2>One less antenna.<br />By design.</h2><p>A conventional room-side setup separates the booster and indoor antenna. Plidépli brings them together in one housing.</p><p>In internal mode, you can skip mounting a separate indoor antenna and routing its cable. You still install an outdoor antenna and run its cable to the booster.</p><div className="inline-fact"><strong>The indoor antenna.<br />Built in.</strong></div></div><figure className="inside-image"><img src={`${BASE}product/antenna-inside.webp`} alt="Cutaway rendering highlighting the indoor antenna inside Plidépli" width="1230" height="1278" loading="lazy" /></figure></div></section>
    <section className="section mode-section" id="modes"><div className="container"><div className="section-heading"><div><h2>One booster.<br />Three ways to use it.</h2></div><p>Start with the antenna inside. Add a separate indoor antenna when the layout calls for it.</p></div><div className="mode-explorer"><div className="mode-visual"><img key={mode} src={`${BASE}product/${MODES[mode].image}.webp`} alt={`${MODES[mode].title} mode product illustration`} width="1254" height="1254" loading="lazy" /></div><div className="mode-information"><div className="segmented-controls" role="group" aria-label="Antenna modes">{MODES.map((item, index) => <button type="button" key={item.title} aria-pressed={mode === index} onClick={() => setMode(index)}>{item.title}</button>)}</div><div aria-live="polite"><h3>{MODES[mode].heading}</h3><p>{MODES[mode].text}</p></div></div></div></div></section>
    <section className="section kit-section" id="kit"><div className="container"><div className="section-heading"><div><h2>A system that<br />works together.</h2></div></div><div className="component-grid">{[
      ['booster', 'The booster', 'Amplifies the received cellular signal and houses the built-in indoor antenna.'],
      ['outdoor-antenna', 'Outdoor antenna', 'Receives the available outdoor signal and connects to the booster by cable.'],
      ['coaxial-cable', '15 m outdoor cable', 'A 50 ft coaxial cable connects the outdoor antenna to the booster.'],
      ['bracket', 'Mounting kit', 'Bracket and hardware for fixed installation. Installation guide included.'],
      ['power-adapter', 'Power adapter', 'Provides the booster’s required power. Use the adapter specified for the kit.'],
    ].map(([file, title, description]) => <article key={file}><div><img src={file === 'coaxial-cable' ? `${BASE}brochure/coaxial-cable.png` : `${BASE}product/${file}.webp`} alt={`${title} product rendering`} width="1254" height="1254" loading="lazy" /></div><h3>{title}</h3><p>{description}</p></article>)}</div><aside className="optional-accessories"><p className="eyebrow">Optional accessories</p><h3>More ways to place your indoor signal.</h3><div className="accessory-grid">{[['whip-antenna', 'Whip antenna'], ['panel-antenna', 'Panel antenna'], ['ceiling-antenna', 'Ceiling dome antenna'], ['low-profile-antenna', 'Low-profile ceiling antenna'], ['coaxial-cable', 'Indoor antenna cable'], ['omni-antenna', 'Outdoor omni antenna'], ['outdoor-mast', 'Outdoor mounting pole']].map(([file, label]) => <figure key={file}><img src={`${BASE}brochure/${file}.png`} alt={label} loading="lazy" width="160" height="160" /><figcaption>{label}</figcaption></figure>)}</div><p>Optional accessories are sold separately. Use the approved antenna and cable combination for your mode.</p></aside></div></section>
    <section className="section fit-section" id="fit"><div className="container"><div className="section-heading"><div><h2>A good fit starts<br />outside your home.</h2></div><p>For fixed US homes and cabins, start with these three checks. Your outdoor signal, walls, and antenna placement determine indoor coverage.</p></div><div className="fit-grid">{[
      ['An outdoor signal', 'You can receive a usable cellular signal at the planned outdoor antenna location. A booster cannot create signal where none is available.'],
      ['A supported band', 'Your carrier uses B12, B13, B5, B4, or B2 at your location. Carrier names and 5G icons alone do not establish compatibility.'],
      ['A suitable installation', 'You can mount the outdoor antenna, route its cable, and maintain the antenna separation required by the final installation instructions.'],
    ].map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div><div className="fit-bottom"><a className="button button-dark" href={`${BASE}installation/`}>Explore installation<Icon name="arrow" /></a></div></div></section>
    {viewing && <PhotoViewer photos={photos} initial={selected} onClose={() => setViewing(false)} />}
  </>
}
