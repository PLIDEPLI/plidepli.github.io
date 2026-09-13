import Icon from './components/Icon'
const BASE = import.meta.env.BASE_URL

export function ProductTeaser() {
  return <section className="section product-teaser"><div className="container">
    <div className="section-heading"><div><p className="eyebrow">Purpose-built, inside and out</p><h2>Less hardware in the room.<br />More thought in the box.</h2></div><p>A five-band booster. An integrated indoor antenna. Flexible mounting. Every part has a job to do.</p></div>
    <div className="teaser-grid">
      <a className="teaser-main" href={`${BASE}product/#inside`}><div className="teaser-image"><img src={`${BASE}product/antenna-inside.webp`} alt="Rendering of the built-in indoor antenna inside the PLIDEPLI booster" width="1230" height="1278" loading="lazy" /></div><div><h3>The indoor antenna is already inside.</h3><p>One less antenna to mount. One less indoor antenna cable to run.</p><span className="text-link">Look inside<Icon name="arrow" /></span></div></a>
      <div className="teaser-side"><a href={`${BASE}product/#gallery`}><img src={`${BASE}product/connected.webp`} alt="PLIDEPLI connected booster rendering" width="1254" height="1254" loading="lazy" /><div><h3>Designed for your space.</h3><p>Explore the hardware from every angle.</p><Icon name="arrow" /></div></a><a href={`${BASE}installation/`}><img src={`${BASE}product/wall-finished.webp`} alt="Rendering of PLIDEPLI installed on a wall" width="1254" height="1254" loading="lazy" /><div><h3>A place that works for you.</h3><p>Explore wall, pole, and overhead mounting.</p><Icon name="arrow" /></div></a></div>
    </div><p className="render-note">Product visualizations. Final production details will be confirmed with the campaign.</p>
  </div></section>
}

export function LifestyleSection() {
  return <section className="lifestyle-section"><img src={`${BASE}product/cabin-lifestyle.webp`} alt="Illustrative cabin scene with a woman speaking on her phone beside a window" width="1774" height="887" loading="lazy" /><div className="container lifestyle-content"><p className="eyebrow">Made for the moments that matter</p><h2>Stay in the conversation.<br />Stay where you are.</h2><p>For your home office, your everyday living space, or your cabin escape. Start with the signal outside. Bring it closer to your life inside.</p><a className="button button-primary" href={`${BASE}product/#fit`}>Find out if it fits your space<Icon name="arrow" /></a></div><span className="lifestyle-credit">Illustrative scene</span></section>
}
