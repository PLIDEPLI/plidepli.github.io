import { useState, type FormEvent } from 'react'

type FormStatus = 'idle' | 'submitting' | 'done' | 'error'

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID as string | undefined
const BASE = import.meta.env.BASE_URL
const EBAY_URL = 'https://ebay.io/m/HqC0BV'

function Wordmark() {
  return (
    <span className="wordmark">
      <span className="wordmark__mark" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      PLIDEPLI
    </span>
  )
}

function SignalMeter() {
  const [on, setOn] = useState(false)
  return (
    <div className="meter">
      <div className="meter__status">
        <span className="meter__tag">the same room · before &amp; after</span>
        <p className={`meter__state ${on ? 'is-on' : 'is-off'}`}>
          {on ? 'Signal is great.' : 'Signal is gone.'}
        </p>
      </div>

      <div className={`meter__bars ${on ? 'is-on' : 'is-off'}`} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <button
        type="button"
        className={`switch ${on ? 'is-on' : ''}`}
        onClick={() => setOn((v) => !v)}
        aria-pressed={on}
        aria-label={on ? 'Turn booster off' : 'Turn booster on'}
      />
    </div>
  )
}

function EmailForm({ id }: { id: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const value = email.trim()
    if (!value) return

    if (!FORMSPREE_ID) {
      setStatus('error')
      return
    }

    setStatus('submitting')
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email: value }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="form__done">
        You're on the list. We'll write once when the campaign goes live.
      </div>
    )
  }

  return (
    <>
      <form id={id} className="form" onSubmit={handleSubmit}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-label="Email address"
        />
        <button
          type="submit"
          className="btn btn--primary"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Signing up…' : 'Get notified'}
        </button>
      </form>
      {status === 'error' && (
        <p className="form__error">
          {FORMSPREE_ID
            ? 'Something went wrong. Try again, or email us directly.'
            : 'Email signup is not wired up yet.'}
        </p>
      )}
    </>
  )
}

const TICKER_ITEMS = [
  'FCC Part 20 certified',
  '65–70 dB gain',
  'Five bands · B12 B13 B5 B4 B2',
  '5V USB-C powered',
  'Built by RF engineers',
  'Coming to Kickstarter soon',
]

function Ticker() {
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span className="ticker__item" key={i}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

function App() {
  return (
    <>
      <header className="header">
        <div className="container header__inner">
          <a href="#top" aria-label="PLIDEPLI home">
            <Wordmark />
          </a>
          <nav className="nav" aria-label="Primary">
            <a href="#spec">Specs</a>
            <a href="#fcc">Certification</a>
            <a href="#modes">Modes</a>
            <a href="#story">Story</a>
            <a href="#roadmap">Roadmap</a>
            <a href="#cta" className="btn btn--primary">
              Get notified
            </a>
          </nav>
        </div>
      </header>

      <Ticker />

      <main id="top">
        {/* ---------- hero ---------- */}
        <section className="hero">
          <div className="container hero__grid">
            <div>
              <span className="hero__eyebrow">
                <span className="hero__dot" aria-hidden="true" />
                PLIDEPLI · a cellular signal booster
              </span>
              <h1 className="hero__title">Plug it in. Forget it exists.</h1>
              <p className="hero__sub">
                A five-band, 65–70 dB cellular booster with the indoor antenna
                built in.{' '}
                <strong>One outdoor antenna to mount — half the install</strong>{' '}
                of a two-antenna system. FCC Part 20 certified, built by RF
                engineers at the source of the supply chain, priced at about
                half what the big brands charge.
              </p>
              <div className="hero__cta">
                <a href="#cta" className="btn btn--primary">
                  Get notified at launch
                </a>
                <a
                  href={EBAY_URL}
                  className="btn btn--ghost"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buy on eBay
                </a>
                <a href="#spec" className="btn btn--ghost">
                  Read the specs
                </a>
              </div>
              <div className="hero__trust">
                <span>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M3 8.5 6.5 12 13 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  FCC Part 20 certified
                </span>
                <span>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M3 8.5 6.5 12 13 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  65–70 dB gain
                </span>
                <span>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M3 8.5 6.5 12 13 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  5V USB-C powered
                </span>
                <span>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M3 8.5 6.5 12 13 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  B12 · B13 · B5 · B4 · B2
                </span>
                <span>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M3 8.5 6.5 12 13 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Machined aluminum prototype
                </span>
              </div>
            </div>

            <div className="hero__media">
              <div className="video-shell">
                <video
                  controls
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={`${BASE}video/poster.jpg`}
                >
                  <source src={`${BASE}video/promo.mp4`} type="video/mp4" />
                </video>
              </div>
              <p className="hero__note">44 seconds. The whole product, no fluff.</p>
            </div>
          </div>
        </section>

        {/* ---------- signal meter ---------- */}
        <section className="meter-band" aria-label="Before and after demo">
          <div className="container">
            <SignalMeter />
            <p className="meter__footnote">
              A booster amplifies what's already there. Zero bars outside means
              nothing to amplify — we'll be honest about that every time.
            </p>
          </div>
        </section>

        {/* ---------- scenarios ---------- */}
        <section className="section">
          <div className="container">
            <span className="section__label">Where it fixes things</span>
            <h2 className="section__title">Built for the places signal dies.</h2>
            <div className="scenarios">
              <div className="scenario">
                <h3>The remote cabin</h3>
                <p>
                  One bar on the roof, nothing inside. A good booster turns that
                  into calls and texts that actually go through.
                </p>
              </div>
              <div className="scenario">
                <h3>The basement office</h3>
                <p>
                  Concrete, metal, low-E glass — they all eat signal. Boost from
                  where the signal still exists.
                </p>
              </div>
              <div className="scenario">
                <h3>The parked campsite</h3>
                <p>
                  Boondocking with a weak-but-present signal. Usable data
                  without driving to a hill first.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- problem ---------- */}
        <section className="section">
          <div className="container split">
            <div>
              <span className="section__label">The problem</span>
              <h2 className="section__title">
                The old way meant two antennas, a drill, and $550.
              </h2>
              <p className="section__lede">
                Two frustrations at once. The big brands charge premium prices,
                and the install is a project.
              </p>
            </div>
            <div className="problem__list">
              <div className="problem__item">
                <h3>Two antennas to mount</h3>
                <p>
                  A separate outdoor antenna and a separate indoor antenna,
                  each with its own cable run through a wall. Most boosters are
                  a Saturday of DIY before you hear a dial tone.
                </p>
              </div>
              <div className="problem__item">
                <h3>Spotty coverage</h3>
                <p>
                  Antennas too close, a leak in the loop — the booster feeds
                  back into itself and does nothing.
                </p>
              </div>
              <div className="problem__item">
                <h3>A brand tax</h3>
                <p>
                  The market-leading home booster runs $550 for 65 dB. The bill
                  of materials on these things is a fraction of that.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- spec sheet ---------- */}
        <section className="section spec" id="spec">
          <div className="container">
            <span className="section__label">Spec sheet</span>
            <h2 className="section__title">The numbers, with nothing left out.</h2>
            <p className="section__lede">
              Here's the whole product. We'd rather you read this than our
              adjectives.
            </p>

            <div className="spec__sheet">
              <div className="spec__head">
                <span>PLIDEPLI · L5-5B · REV A</span>
                <span>FCC ID 2BWMS-L5-5B-2006</span>
              </div>
              <div className="spec__grid">
                <div className="spec__cell">
                  <div className="spec__value spec__value--accent">65–70 dB</div>
                  <div className="spec__key">Gain</div>
                  <div className="spec__sub">65 dB amplifier gain · up to 70 dB system gain with the antenna</div>
                </div>
                <div className="spec__cell">
                  <div className="spec__value">5</div>
                  <div className="spec__key">Bands</div>
                  <div className="spec__sub">B12 · B13 · B5 · B4 · B2</div>
                </div>
                <div className="spec__cell">
                  <div className="spec__value">2,500</div>
                  <div className="spec__key">Coverage</div>
                  <div className="spec__sub">sq. ft. per spec — real results vary by site</div>
                </div>
                <div className="spec__cell">
                  <div className="spec__value">3</div>
                  <div className="spec__key">Modes</div>
                  <div className="spec__sub">internal · external · dual</div>
                </div>
                <div className="spec__cell">
                  <div className="spec__value">All US</div>
                  <div className="spec__key">Carriers</div>
                  <div className="spec__sub">Verizon, AT&amp;T, T-Mobile &amp; more</div>
                </div>
                <div className="spec__cell">
                  <div className="spec__value">Part 20</div>
                  <div className="spec__key">FCC certification</div>
                  <div className="spec__sub">self-monitors for oscillation, auto-shutdown</div>
                </div>
                <div className="spec__cell">
                  <div className="spec__value">5V USB-C</div>
                  <div className="spec__key">Power</div>
                  <div className="spec__sub">runs off the included adapter, a power bank, or the rig</div>
                </div>
                <div className="spec__cell">
                  <div className="spec__value">3-way</div>
                  <div className="spec__key">Mount</div>
                  <div className="spec__sub">wall · ceiling · pole bracket</div>
                </div>
              </div>
            </div>

            <div className="band-strip" aria-label="Supported bands">
              {[
                ['B12', 'Lower 700 MHz'],
                ['B13', 'Upper 700 MHz'],
                ['B5', 'Cellular 850'],
                ['B4', 'AWS 1700/2100'],
                ['B2', 'PCS 1900'],
              ].map(([band, label]) => (
                <div className="band" key={band}>
                  <span className="band__name">{band}</span>
                  <span className="band__gain">{label}</span>
                </div>
              ))}
            </div>

            <p className="spec__sheet-note mono">
              What that certification does: an uncertified booster can oscillate
              and knock the tower offline for your whole neighborhood. Ours
              detects the loop and shuts itself down first.
            </p>
            <p className="spec__sheet-note mono">
              One honest limit: this is a fixed-location booster (FCC class:
              fixed). It's built for homes, cabins, and campsites with the rig
              parked — not for boosting while you drive.
            </p>
            <p className="spec__sheet-note mono">
              The paperwork: PLIDEPLI is the brand. The FCC grant itself is held
              by our Hong Kong entity, Light Folding Science and Technology Co.,
              Limited — same team, just the name on the filing.
            </p>
          </div>
        </section>

        {/* ---------- FCC grant ---------- */}
        <section className="section" id="fcc">
          <div className="container">
            <span className="section__label">FCC certification</span>
            <h2 className="section__title">Here's the actual grant.</h2>
            <p className="section__lede">
              Not a claim — the grant itself. FCC ID, grantee, date, all public.
            </p>

            <div className="cert">
              <a
                className="cert__sheet"
                href={`${BASE}fcc/grant-page-1.png`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open the full-resolution FCC grant"
              >
                <img
                  src={`${BASE}fcc/grant-page-1.png`}
                  alt="FCC Grant of Equipment Authorization for PLIDEPLI, FCC ID 2BWMS-L5-5B-2006"
                  loading="lazy"
                />
              </a>
              <div className="cert__facts">
                <div className="cert__fact">
                  <span className="cert__label">FCC ID</span>
                  <div className="cert__value cert__value--mono">2BWMS-L5-5B-2006</div>
                </div>
                <div className="cert__fact">
                  <span className="cert__label">Grantee</span>
                  <div className="cert__value">
                    Light Folding Science and Technology Co., Ltd.
                  </div>
                </div>
                <div className="cert__fact">
                  <span className="cert__label">Date of grant</span>
                  <div className="cert__value">Aug 19, 2026</div>
                </div>
                <div className="cert__fact">
                  <span className="cert__label">Device class</span>
                  <div className="cert__value">
                    Part 20 wideband consumer booster (CMRS)
                  </div>
                </div>
              </div>
              <p className="cert__note">
                Click the image for the full-resolution grant.{' '}
                <a
                  href={`${BASE}fcc/grant-page-2.png`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View page 2
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* ---------- modes ---------- */}
        <section className="section" id="modes">
          <div className="container">
            <span className="section__label">Three modes</span>
            <h2 className="section__title">Start internal. Add range when you need it.</h2>
            <div className="modes">
              <div className="mode">
                <span className="mode__name">01 · internal</span>
                <h3>The antenna's built in.</h3>
                <p>
                  No separate indoor antenna to mount. The only thing that goes
                  outside is the donor antenna — the unit rebroadcasts on its own.
                </p>
              </div>
              <div className="mode">
                <span className="mode__name">02 · external</span>
                <h3>Spread the signal wider.</h3>
                <p>
                  Add the ceiling antenna for a larger, more even coverage area
                  across a big or multi-story space.
                </p>
              </div>
              <div className="mode">
                <span className="mode__name">03 · dual</span>
                <h3>Both at once.</h3>
                <p>
                  Built-in and external together nearly double your range, for
                  the deep basements and the far-off-grid sites.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- install ---------- */}
        <section className="section">
          <div className="container">
            <span className="section__label">Install</span>
            <h2 className="section__title">Four steps to done.</h2>
            <div className="install">
              <div className="install__step">
                <span className="install__num">01</span>
                <h3>Find the signal</h3>
                <p>
                  Walk the yard with your phone, find where the signal is
                  strongest outside.
                </p>
              </div>
              <div className="install__step">
                <span className="install__num">02</span>
                <h3>Mount the antenna</h3>
                <p>
                  One outdoor antenna — the only thing that goes outside.
                </p>
              </div>
              <div className="install__step">
                <span className="install__num">03</span>
                <h3>Plug it in</h3>
                <p>5V USB-C. No special wiring, no hole in the wall.</p>
              </div>
              <div className="install__step">
                <span className="install__num">04</span>
                <h3>Forget it</h3>
                <p>It rebroadcasts inside. You stop thinking about it.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- story ---------- */}
        <section className="section" id="story">
          <div className="container story">
            <aside className="story__aside">
              <span className="section__label">Who's building this</span>
              <h2 className="section__title">
                A small team of RF engineers, done building other people's
                products.
              </h2>
            </aside>
            <div className="story__body">
              <p>
                We're physics graduates. For years we designed the RF insides of
                the things you use every day — base stations, phones, drones,
                radar — inside big companies where a spec sheet lands on your
                desk already cut into fragments, and you optimize parameters for
                someone three layers up who will never hold the thing.
              </p>
              <p>
                Life's too short to build things you don't love. So we started
                spending nights and weekends on our own workbench, doing what we
                actually trained for, on our own terms, for people we can
                actually talk to.
              </p>
              <p>
                We started with cellular signal, because it's our home turf. A
                signal booster should behave like an electrical outlet — plug it
                in, it works, you forget it. So that's what we built.
              </p>
              <blockquote className="story__pull">
                We machined the first units out of solid aluminum on a CNC mill.
                It's not a rendering. It works.
              </blockquote>
            </div>
          </div>
        </section>

        {/* ---------- roadmap ---------- */}
        <section className="section roadmap" id="roadmap">
          <div className="container">
            <span className="section__label">Roadmap</span>
            <h2 className="section__title">Step one of a longer plan.</h2>
            <p className="section__lede">
              We're not building a one-off gadget. We're building the tools
              we've been wishing existed.
            </p>
            <div className="steps">
              <div className="step">
                <div className="step__num">
                  <em>01</em>
                </div>
                <div>
                  <h3>
                    The signal booster
                    <span className="step__tag">now</span>
                  </h3>
                  <p>
                    Five bands, 65–70 dB, FCC Part 20 certified, indoor antenna
                    built in. The thing on this page.
                  </p>
                </div>
              </div>
              <div className="step">
                <div className="step__num">
                  <em>02</em>
                </div>
                <div>
                  <h3>The universal power bank</h3>
                  <p>
                    A power bank with true global wall plugs, so you stop
                    carrying a bag of adapters and cables across borders.
                  </p>
                </div>
              </div>
              <div className="step">
                <div className="step__num">
                  <em>03</em>
                </div>
                <div>
                  <h3>The global hub</h3>
                  <p>
                    Where the two meet: signal boost and power in one box, with
                    universal plugs built in. One device to stay connected and
                    powered, no matter what country you land in.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- mold ---------- */}
        <section className="section">
          <div className="container mold">
            <div>
              <span className="section__label">Why Kickstarter</span>
              <h2 className="section__title">The campaign is for one thing: the mold.</h2>
              <p className="section__lede">
                We can machine ten units on a CNC. Ten thousand needs injection
                tooling, and that tooling costs more than we can float on our
                own.
              </p>
              <div className="mold__stat">
                <div>
                  <div className="num">65–70 dB</div>
                  <div className="lbl">gain, five bands</div>
                </div>
                <div>
                  <div className="num">~50%</div>
                  <div className="lbl">of what the big brands charge</div>
                </div>
                <div>
                  <div className="num">Part 20</div>
                  <div className="lbl">FCC certified, filed ourselves</div>
                </div>
              </div>
            </div>
            <div className="mold__card">
              <h3>What your money goes to</h3>
              <ul>
                <li>Injection-mold tooling for the production housing</li>
                <li>Not salaries. Not marketing. Just the tooling.</li>
                <li>The first production run, shipped to backers</li>
                <li>
                  You get a 65–70 dB booster for about half the price of the
                  big brands
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ---------- final CTA ---------- */}
        <section className="cta" id="cta">
          <div className="container">
            <h2 className="cta__title">Be first in line when we launch.</h2>
            <p className="cta__sub">
              No spam. One email when the campaign goes live — and technical
              answers if you ask for them.
            </p>
            <EmailForm id="cta-form" />
            <p className="form__note">We're engineers, not a marketing team.</p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__grid">
          <div className="footer__brand">
            <Wordmark />
            <p style={{ marginTop: 12 }}>
              A cellular signal booster built by RF engineers at the source of
              the supply chain.
            </p>
          </div>
          <div className="footer__meta">
            <div>
              <a href={EBAY_URL} target="_blank" rel="noopener noreferrer">
                Available on eBay
              </a>
            </div>
            <div>FCC ID 2BWMS-L5-5B-2006</div>
            <div>Grant held by Light Folding Science and Technology Co., Ltd.</div>
            <div>Pre-production specs may shift slightly before mass production.</div>
            <div>
              &copy; {new Date().getFullYear()} PLIDEPLI
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
