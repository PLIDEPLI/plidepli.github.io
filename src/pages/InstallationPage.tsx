import { useEffect, useState } from 'react'
import PhotoViewer, { type Photo } from '../components/PhotoViewer'

const BASE = import.meta.env.BASE_URL

const MOUNTS = [
  {
    name: 'Wall mount', key: 'wall', intro: 'Mount the booster on a suitable wall with the bracket arrow pointing up.', steps: [
      ['wall-mark', 'Mark and drill four holes', 'Choose a wall that can support the booster and mounting hardware. Use the bracket to mark the hole positions, then drill four holes.'],
      ['wall-anchor', 'Insert the wall anchors', 'Insert the wall anchors into the holes.'],
      ['wall-bracket', 'Fasten the bracket', 'Fasten the bracket to the wall with expansion screws, with the arrow pointing up.'],
      ['wall-align', 'Prepare the main unit', 'Screw the four included screws into the back of the main unit.'],
      ['wall-finished', 'Hang the main unit', 'Hang the main unit on the wall bracket using the four screws, then slide it down so the screw heads engage in the slots.'],
    ],
  },
  {
    name: 'Overhead crossbar', key: 'pole', intro: 'Use the two hose clamps to attach the bracket to a suitable indoor overhead crossbar.', steps: [
      ['pole-bracket', 'Fasten the bracket', 'Fasten the mounting bracket to the indoor overhead crossbar with two hose clamps, with the bracket facing down.'],
      ['pole-align', 'Prepare the main unit', 'Screw the four included screws into the back of the main unit.'],
      ['pole-finished', 'Hang the main unit', 'Hang the main unit on the bracket, making sure all four screw heads slide securely into the slots.'],
    ],
  },
  {
    name: 'Ceiling mount', key: 'ceiling', intro: 'Choose a suitable indoor overhead surface that can support the booster and mounting hardware. The illustration shows a wooden surface.', steps: [
      ['ceiling-mark', 'Mark and drill four holes', 'Use the bracket to mark the hole positions on the ceiling, then drill four holes.'],
      ['ceiling-anchor', 'Insert the wall anchors', 'Insert the wall anchors into the holes.'],
      ['ceiling-bracket', 'Fasten the bracket', 'Fasten the bracket to the overhead surface with the mounting screws, keeping the bracket facing down.'],
      ['ceiling-align', 'Prepare the main unit', 'Screw the four included screws into the back of the main unit.'],
      ['ceiling-finished', 'Hang the main unit', 'Hang the main unit on the bracket, making sure all four screw heads slide securely into the slots.'],
    ],
  },
]

const INDOOR_ANTENNAS = [
  {
    name: 'Built-in', image: 'selector-switch.jpg', alt: 'The side switch used to activate the built-in indoor antenna',
    heading: 'Use the built-in antenna',
    text: 'Use the side switch to select the built-in indoor antenna. Choose internal mode to use it on its own, or dual mode to use it together with an approved external indoor antenna.',
  },
  {
    name: 'Whip', image: 'whip-antenna-install.png', alt: 'Whip antenna attached directly to the booster',
    heading: 'Mount the whip antenna',
    text: 'Place the booster in a central location where signal is needed. Maintain the required separation from the outdoor antenna. Connect the whip antenna to the booster connector labeled INDOOR.',
  },
  {
    name: 'Panel', image: 'panel-antenna-install.png', alt: 'Panel antenna aiming and wall installation illustration',
    heading: 'Mount the panel antenna',
    text: 'The indoor panel antenna has a directional 120-degree coverage pattern. Mount it on a wall or other vertical surface, facing the area where you need signal and away from obstructions. Connect its cable to the booster port labeled INDOOR.',
  },
  {
    name: 'Ceiling', image: null, alt: '',
    heading: 'Mount the ceiling antenna',
    text: 'The ceiling antenna has an omnidirectional 360-degree coverage pattern. Install it in a central ceiling location, away from metal objects and other materials that could block the signal. Connect its cable to the booster port labeled INDOOR.',
  },
]

export default function InstallationPage() {
  const [phone, setPhone] = useState<'iphone' | 'android'>('iphone')
  const [mount, setMount] = useState(0)
  const [photo, setPhoto] = useState<number | null>(null)
  const [guidePhoto, setGuidePhoto] = useState<Photo | null>(null)
  const [indoor, setIndoor] = useState(0)
  const selected = MOUNTS[mount]
  const selectedIndoor = INDOOR_ANTENNAS[indoor]
  // One film plays at a time on this page.
  useEffect(() => {
    const pauseOthers = (event: Event) => {
      if (event.target instanceof HTMLVideoElement) document.querySelectorAll('video').forEach(video => { if (video !== event.target) video.pause() })
    }
    document.addEventListener('play', pauseOthers, true)
    return () => document.removeEventListener('play', pauseOthers, true)
  }, [])

  return <>
    <section className="installation-page-hero" id="top"><div className="container installation-hero-grid">
      <div><h1>Before Getting<br />Started</h1><p>Before installing the booster and antennas, check the cellular band your phone uses at your location.</p><p className="installation-note">Your phone must use a supported band: B12, B13, B5, B4, or B2. Check the band itself; a carrier name or 5G icon alone does not confirm compatibility.</p>{phone === 'iphone' && <ol className="phone-reading-steps"><li>Turn off Wi-Fi. Dial <code>*3001#12345#*</code> and tap Call.</li><li>Open All Metrics or the menu, then select LTE.</li><li>Look for Band Info or Band and compare the number with the supported bands above.</li></ol>}</div>
      <div className="phone-band-guide">
        <div className="segmented-controls phone-tabs" role="group" aria-label="Phone type">{(['iphone', 'android'] as const).map(type => <button type="button" key={type} aria-pressed={phone === type} onClick={() => setPhone(type)}>{type === 'iphone' ? 'iPhone' : 'Android'}</button>)}</div>
        <div className="before-start-visual" aria-live="polite">{phone === 'iphone' ? <button type="button" className="guide-image-button" onClick={() => setGuidePhoto({ src: `${BASE}brochure/before-getting-started.png`, alt: "How to check your cellular band on iPhone" })} aria-label="Enlarge the iPhone band-check guide"><img src={`${BASE}brochure/before-getting-started.png`} alt="Dial *3001#12345#* and press Call. Open All Metrics, select LTE, then look for Band Info or Band." width="1742" height="1873" /><span>Enlarge guide</span></button> : <div className="android-band-instructions"><h3>On Android</h3><p>Open LTE Discovery, tap “SIGNALS,” and look for the LTE band number.</p><p>Compare it with the supported bands listed here. If the band is unavailable, check your phone’s network settings or ask your carrier.</p></div>}</div>
      </div>
    </div></section>

    <section className="section kit-contents" id="in-the-box"><div className="container kit-contents-grid">
      <div className="kit-contents-copy">
        <header className="installation-heading"><p className="eyebrow">Before you begin</p><h2>What's in the box.</h2></header>
        <p>Unpack the kit and check every part against the installation guide before you start.</p>
        <ul className="kit-contents-list"><li>Booster with built-in indoor antenna</li><li>Directional outdoor antenna</li><li>Coaxial cable</li><li>Power adapter</li><li>Mounting hardware</li></ul>
      </div>
      <figure className="install-film kit-contents-film">
        <video controls playsInline preload="none" poster={`${BASE}install/unboxing-poster.webp`} src={`${BASE}install/unboxing.mp4`} aria-label="Unboxing — 60-second film of the kit contents"><track kind="captions" src={`${BASE}install/unboxing.en.vtt`} srcLang="en" label="English" default /></video>
      </figure>
    </div></section>

    <nav className="installation-step-nav container" aria-label="Six installation steps">{[
      ['find-signal', 'Find the Location with the Strongest Signal'], ['outdoor-antenna', 'Mount the Outdoor Antenna'],
      ['mounting', 'Mount the Signal Booster'], ['indoor-mode', 'Mount the Indoor Antenna'],
      ['power-up', 'Power Up'], ['check-performance', 'Measuring Booster Performance'],
    ].map(([id, label], index) => <a key={id} href={`#${id}`}><span className="installation-nav-number">0{index + 1}</span><span className="installation-nav-label">{label}</span></a>)}</nav>

    <section className="section before-install" id="find-signal"><div className="container signal-guidance">
      <div className="signal-copy">
        <header className="installation-heading"><p className="eyebrow">Step 1</p><h2>Find the strongest signal.</h2></header>
        <p>Find the location with the strongest signal outside your building for placement of your outdoor antenna using your cell phone. Generally, it is found above the roof line on the side facing the nearest cell tower and as high as possible.</p>
        <p className="signal-tower-link">For help locating nearby towers, visit <a className="inline-link" href="https://www.antennasearch.com/" target="_blank" rel="noopener noreferrer">www.antennasearch.com</a>.</p>
        <p>Check the bar indicator on your cell phone display from several locations outside your building, and note where the signal appears the strongest. Allow 30–60 seconds for the phone to update its reading. Please be patient and repeat your signal check several times.</p>
      </div>
      <aside><h3>Use a consistent reading.</h3><p>Cell phone bars are only an approximation of signal strength and vary from phone to phone.</p><p>Use a signal-strength reading in dBm when available. On iPhone, check Field Test mode; on Android, look in your phone’s network status or signal app.</p><p>Cellular signal readings are usually negative. A value closer to zero indicates a stronger signal—for example, −80 dBm is stronger than −100 dBm.</p></aside>
    </div></section>

    <section className="section outdoor-install" id="outdoor-antenna"><div className="container">
      <div className="section-heading"><div><p className="eyebrow">Step 2</p><h2>Mount the outdoor antenna.</h2></div><p>Mount the outdoor antenna where reception is strongest. Keep at least 25 ft of vertical separation or 50 ft of horizontal separation from the indoor antenna, with the antennas facing away from each other.</p></div>
      <div className="outdoor-antenna-grid">
        <article><figure className="antenna-outline"><img src={`${BASE}brochure/omni-antenna-outline.png`} alt="Line drawing of the optional omni-directional outdoor antenna" width="341" height="359" /></figure><div><h3>Omni-directional antenna</h3><span className="antenna-availability">Optional</span></div><p className="antenna-description">The omni antenna receives and transmits signals in all directions around it. Mount the antenna at the highest possible elevation and in an upright position.</p><figure className="antenna-install"><button type="button" className="guide-image-button" onClick={() => setGuidePhoto({ src: `${BASE}brochure/omni-antenna-install.png`, alt: "Omni-directional antenna mounting illustration" })} aria-label="Enlarge omni outdoor antenna installation"><img src={`${BASE}brochure/omni-antenna-install.png`} alt="Omni-directional antenna mounting illustration" width="1394" height="677" loading="lazy" /><span>Enlarge illustration</span></button></figure></article>
        <article><figure className="antenna-outline"><img src={`${BASE}brochure/directional-antenna-outline.png`} alt="Line drawing of the included directional outdoor antenna" width="341" height="359" /></figure><div><h3>Directional antenna</h3><span className="antenna-availability">Included in the kit</span></div><p className="antenna-description">Mount the directional antenna at the highest possible location above the roof line and aim it toward your nearest carrier’s cell tower. Keep the connections loose enough to rotate the antenna while adjusting its direction, then tighten them securely.</p><figure className="antenna-install"><button type="button" className="guide-image-button" onClick={() => setGuidePhoto({ src: `${BASE}brochure/directional-antenna-install.png`, alt: "Directional LPDA antenna mounting illustration" })} aria-label="Enlarge directional outdoor antenna installation"><img src={`${BASE}brochure/directional-antenna-install.png`} alt="Directional LPDA antenna mounting illustration" width="621" height="299" loading="lazy" /><span>Enlarge illustration</span></button></figure></article>
      </div>
      <details className="installation-details outdoor-connection-notes"><summary>Mounting clearance and cable connection</summary><p>Keep the outdoor antenna above the roofline and at least 12 inches from metal obstructions and other antennas. Attach its bracket to a suitable mast or pole; the outdoor mounting pole is optional.</p><p>Connect the coaxial cable to the outdoor antenna, route it indoors, and connect it to the booster port labeled OUTDOOR. Keep the power disconnected until the installation is complete.</p></details>
    </div></section>

    <section className="section mounting-section" id="mounting"><div className="container">
      <div className="section-heading"><div><p className="eyebrow">Step 3</p><h2>Mount the signal booster.</h2></div><p>Choose a well-ventilated indoor location near a power outlet, away from excessive heat, direct sunlight, and moisture. Do not place the booster in an airtight enclosure. Use mounting hardware suitable for your wall or ceiling material.</p></div>
      <div className="segmented-controls mount-tabs" role="group" aria-label="Mounting method">{MOUNTS.map((item, index) => <button type="button" key={item.key} aria-pressed={mount === index} onClick={() => { setMount(index); setPhoto(null) }}>{item.name}</button>)}</div>
      <div className="mount-summary" aria-live="polite"><h3>{selected.name}</h3><p>{selected.intro}</p></div>
      <ol className="mount-sequence" key={selected.key}>{selected.steps.map(([file, title, description], index) => <li key={file}><button className="mount-step-image" type="button" onClick={() => setPhoto(index)} aria-label={`Enlarge step ${index + 1}: ${title}`}><img src={`${BASE}product/${file}.png`} alt={`${selected.name} step ${index + 1}: ${title}`} width="355" height="355" loading="lazy" /></button><header className="mount-step-heading"><span className="mount-step-number">Step {index + 1}</span><h3>{title}</h3></header><p>{description}</p></li>)}</ol>
    </div></section>

    <section className="section indoor-mode-guide" id="indoor-mode"><div className="container">
      <div className="section-heading"><div><p className="eyebrow">Step 4</p><h2>Choose your indoor antenna.</h2></div><p>Use the built-in antenna, an approved external indoor antenna, or both in dual mode. Maintain the required separation from the outdoor antenna in every mode.</p></div>
      <div className="indoor-antenna-explorer">
        <div className={`indoor-antenna-visual${selectedIndoor.image ? "" : " is-empty"}`}>{selectedIndoor.image ? <button type="button" className="guide-image-button" onClick={() => setGuidePhoto({ src: `${BASE}brochure/${selectedIndoor.image}`, alt: selectedIndoor.alt })} aria-label={`Enlarge ${selectedIndoor.name.toLowerCase()} antenna illustration`}><img src={`${BASE}brochure/${selectedIndoor.image}`} alt={selectedIndoor.alt} loading="lazy" /><span>Enlarge illustration</span></button> : <div className="illustration-pending" aria-hidden="true" />}</div>
        <div className="indoor-antenna-copy"><div className="indoor-antenna-tabs" role="group" aria-label="Indoor antenna type">{INDOOR_ANTENNAS.map((item, index) => <button type="button" key={item.name} aria-pressed={indoor === index} onClick={() => setIndoor(index)}>{item.name}</button>)}</div><div aria-live="polite"><h3>{selectedIndoor.heading}</h3><p>{selectedIndoor.text}</p></div>
          {(indoor === 2 || indoor === 3) && <details className="installation-details"><summary>Placement notes</summary>{indoor === 2 ? <><p>Aim the panel toward the area where you need signal and away from the outdoor antenna.</p><p>Mount it at approximately the height where you normally use your phone.</p></> : <><p>Install the ceiling antenna at least 6.6 ft (2 m) above the floor, away from metal ductwork, concrete columns, and other dense materials that can block the signal.</p><p>Keep it away from large electronic devices, such as servers and power distribution panels, that could cause interference.</p></>}</details>}
        </div>
      </div>
      <div className="indoor-mode-film">
        <figure className="install-film">
          <video controls playsInline preload="none" poster={`${BASE}install/installation-options-poster.webp`} src={`${BASE}install/installation-options.mp4`} aria-label="Two installation options — 60-second film"><track kind="captions" src={`${BASE}install/installation-options.en.vtt`} srcLang="en" label="English" default /></video>
        </figure>
        <div className="indoor-mode-film-copy">
          <h3>Two setups, one booster.</h3>
          <p>The film installs the booster twice: first with its built-in antenna, then with a separate indoor panel. Set the mode before you connect power.</p>
          <dl className="mode-list">
            <div><dt>Internal</dt><dd>The built-in antenna covers the room around the booster.</dd></div>
            <div><dt>External</dt><dd>A separate indoor antenna covers a room away from the booster.</dd></div>
            <div><dt>Dual</dt><dd>Both indoor antennas work together.</dd></div>
          </dl>
          <p className="small-print">The white panel antenna shown is optional and sold separately.</p>
        </div>
      </div>
    </div></section>

    <section className="section power-check" id="power-up"><div className="container split-feature"><div><p className="eyebrow">Step 5</p><h2>Power up.</h2><ol><li>Keep the power disconnected until the outdoor antenna is connected and your chosen indoor antenna mode is set. In external or dual mode, connect the indoor antenna before powering on.</li><li>Connect the power adapter cord to the signal booster and plug it into the power outlet.</li><li>Turn on the power switch. The LED indicators will light to show the booster’s operating status.</li></ol></div><img src={`${BASE}product/connected.webp`} alt="Plidépli main unit with antenna cables connected" width="1254" height="1254" loading="lazy" /></div></section>

    <section className="section performance-guide" id="check-performance"><div className="container"><div className="section-heading"><div><p className="eyebrow">Step 6</p><h2>Compare your signal.</h2></div><p>Compare readings in the same place, using the same phone and cellular band, with Wi-Fi turned off.</p></div><div className="comparison-grid"><article><span>Before</span><h3>Record your baseline.</h3><p>With the booster off and Wi-Fi disabled, note the cellular signal strength in the same place where you will repeat the test.</p></article><article><span>After</span><h3>Switch on and compare.</h3><p>If the signal strength reading with the booster on is higher (closer to zero) than the reading with it off, the booster is improving your received signal.</p></article></div><p className="instruction-tip">If the reading does not improve, check the cable connections, LED indicators, and separation between the indoor and outdoor antennas. If you use a directional outdoor antenna, check its aim toward the cell tower.</p></div></section>

    {guidePhoto && <PhotoViewer photos={[guidePhoto]} initial={0} onClose={() => setGuidePhoto(null)} />}
    {photo !== null && <PhotoViewer photos={selected.steps.map(([file, title]) => ({ src: `${BASE}product/${file}.png`, alt: `${selected.name}: ${title}` }))} initial={photo} onClose={() => setPhoto(null)} />}
  </>
}
