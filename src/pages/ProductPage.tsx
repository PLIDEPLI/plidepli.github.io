import { useState } from 'react'
import Icon from '../components/Icon'
import PhotoViewer from '../components/PhotoViewer'

const BASE = import.meta.env.BASE_URL
const GALLERY = [
  ['kit', 'The complete kit', 'Plidépli kit with booster, outdoor antenna, cable, power adapter and packaging'],
  ['booster', 'The booster', 'White Plidépli booster from an angled view'],
  ['standing', 'Desktop placement', 'Plidépli standing upright with connected antenna cables'],
  ['connected', 'Desktop placement', 'Close view of the Plidépli housing and connected cables'],
]
const MODES = [
  { title: 'Internal', heading: 'Start with what’s built in.', text: 'Use the indoor antenna integrated into the booster. It keeps the room-side setup together and removes the separate indoor antenna cable run.', image: 'mode-internal', note: 'A good starting point when the booster can be placed near the area you want to serve.' },
  { title: 'External', heading: 'Place coverage independently.', text: 'Connect a separate approved indoor antenna when your layout calls for a different antenna position. The booster and indoor antenna can then be placed separately.', image: 'mode-external', note: 'An external indoor antenna and cable are additional hardware. Final accessory options will be listed at launch.' },
  { title: 'Dual', heading: 'Work with both indoor antennas.', text: 'Use the built-in antenna together with a separate approved indoor antenna. Positioning and antenna separation still determine how the system works in your space.', image: 'mode-dual', note: 'Dual mode does not guarantee double the coverage. The outdoor signal and room layout still matter.' },
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
        <button type="button" className="gallery-main" onClick={() => setViewing(true)} aria-label="Enlarge product image"><img src={photos[selected].src} alt={photos[selected].alt} width="1672" height="941" fetchPriority="high" /><span>Click to explore</span></button>
        <div className="gallery-thumbs" role="group" aria-label="Product views">{GALLERY.map(([file, label], index) => <button type="button" key={file} aria-pressed={selected === index} onClick={() => setSelected(index)}><img src={`${BASE}product/${file}.webp`} alt="" width="140" height="100" /><span>{label}</span></button>)}</div>
        <p className="render-note">Product renderings. Final finish, kit contents, and accessory options at launch.</p>
      </div><div className="product-detail-copy"><p className="eyebrow">Plidépli cellular signal booster</p><h1>A stronger connection.<br />A simpler setup.</h1><p className="product-lede">Bring your existing outdoor cell signal inside, with the indoor antenna built right into the booster.</p><div className="product-price"><strong>~$275</strong><span>Target campaign price<br />Final pricing at launch</span></div><a className="button button-dark" href="#cta">Notify me at launch<Icon name="arrow" /></a><p className="product-free">Coming to Kickstarter. Join free. No payment today.</p><ul className="product-points"><li><Icon name="check" />Desk-friendly design</li><li><Icon name="check" />Flexible internal & external antenna switching</li><li><Icon name="check" />Five supported cellular bands</li><li><Icon name="check" />FCC certified</li></ul></div></div>
    </div></section>
    <nav className="product-subnav" aria-label="Product sections"><div className="container"><a href="#inside">Built-in antenna</a><a href="#modes">Three modes</a><a href="#kit">The components</a><a href="#fit">Will it work for me?</a></div></nav>
    <section className="section inside-section" id="inside"><div className="container split-feature"><div><p className="eyebrow">The difference is inside</p><h2>One less antenna.<br />By design.</h2><p>A conventional room-side setup separates the booster and indoor antenna. Plidépli brings them together in one housing.</p><p>In internal mode, you can skip mounting a separate indoor antenna and routing its cable. You still install an outdoor antenna and run its cable to the booster.</p><div className="inline-fact"><strong>The indoor antenna.<br />Built in.</strong><span>The outdoor antenna remains separate.</span></div></div><figure className="inside-image"><img src={`${BASE}product/antenna-inside.webp`} alt="Cutaway rendering highlighting the indoor antenna inside Plidépli" width="1230" height="1278" loading="lazy" /><figcaption>Internal antenna visualization</figcaption></figure></div></section>
    <section className="section mode-section" id="modes"><div className="container"><div className="section-heading"><div><p className="eyebrow">Adapt the setup to your room</p><h2>One booster.<br />Three ways to use it.</h2></div><p>Start with the antenna inside. Add a separate indoor antenna when the layout calls for it.</p></div><div className="mode-explorer"><div className="mode-visual"><img key={mode} src={`${BASE}product/${MODES[mode].image}.webp`} alt={`${MODES[mode].title} mode product illustration`} width="1254" height="1254" loading="lazy" /><span>Product illustration</span></div><div className="mode-information"><div className="segmented-controls" role="group" aria-label="Antenna modes">{MODES.map((item, index) => <button type="button" key={item.title} aria-pressed={mode === index} onClick={() => setMode(index)}>{item.title}</button>)}</div><div aria-live="polite"><h3>{MODES[mode].heading}</h3><p>{MODES[mode].text}</p></div></div></div></div></section>
    <section className="section kit-section" id="kit"><div className="container"><div className="section-heading"><div><p className="eyebrow">Get to know the hardware</p><h2>A system that<br />works together.</h2></div></div><div className="component-grid">{[
      ['booster', 'The booster', 'Amplifies the received cellular signal and houses the built-in indoor antenna.'],
      ['outdoor-antenna', 'Outdoor antenna', 'Receives the available outdoor signal and connects to the booster by cable.'],
      ['outdoor-cable', 'Outdoor cable', 'Connects the outdoor antenna to the booster’s outdoor antenna port.'],
      ['bracket', 'Mounting bracket', 'Supports different fixed mounting arrangements for the main unit.'],
      ['power-adapter', 'Power adapter', 'Provides the booster’s required power. Use the adapter specified for the kit.'],
    ].map(([file, title, description]) => <article key={file}><div><img src={`${BASE}product/${file}.webp`} alt={`${title} product rendering`} width="1254" height="1254" loading="lazy" /></div><h3>{title}</h3><p>{description}</p></article>)}</div><aside className="optional-accessories"><p className="eyebrow">Optional accessories</p><h3>More ways to place your indoor signal.</h3><div><p><strong>External indoor antenna</strong>For external or dual mode when a separate indoor antenna suits the room.</p><p><strong>Indoor antenna cable</strong>Connects the optional indoor antenna to the booster. Use the approved antenna and cable combination.</p></div></aside></div></section>
    <section className="section fit-section" id="fit"><div className="container"><div className="section-heading"><div><p className="eyebrow">Start with the right conditions</p><h2>A good fit starts<br />outside your home.</h2></div><p>A booster is one part of the connection. Check these three things before deciding whether it suits your space.</p></div><div className="fit-grid">{[
      ['An outdoor signal', 'You can receive a usable cellular signal at the planned outdoor antenna location. A booster cannot create signal where none is available.'],
      ['A supported band', 'Your carrier uses B12, B13, B5, B4, or B2 at your location. Carrier names and 5G icons alone do not establish compatibility.'],
      ['A suitable installation', 'You can mount the outdoor antenna, route its cable, and maintain the antenna separation required by the final installation instructions.'],
    ].map(([title, body], index) => <article key={title}><span>{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}</div><div className="fit-bottom"><p>Designed for fixed installations in US homes and cabins. Indoor coverage varies with the outdoor signal, walls, and placement.</p><a className="button button-dark" href={`${BASE}installation/`}>Explore installation<Icon name="arrow" /></a></div></div></section>
    {viewing && <PhotoViewer photos={photos} initial={selected} onClose={() => setViewing(false)} />}
  </>
}
