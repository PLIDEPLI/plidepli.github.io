import { useEffect, useState, type FormEvent } from 'react'

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
        <span className="meter__tag">How boosting works · Illustration</span>
        <p className={`meter__state ${on ? 'is-on' : 'is-off'}`}>
          {on ? 'Booster on' : 'Booster off'}
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
        You're on the list. We'll email you when the campaign launches.
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
          {status === 'submitting' ? 'Signing up…' : 'Notify me at launch'}
        </button>
      </form>
      {status === 'error' && (
        <p className="form__error">
          {FORMSPREE_ID
            ? "We couldn't save your email. Please try again."
            : 'Email signup is currently unavailable. Please check back later.'}
        </p>
      )}
    </>
  )
}

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: 'Do I still need to install an outdoor antenna?',
    a: "Yes — that doesn't change. What's built in is the indoor antenna, so internal mode skips a separate indoor antenna and cable run. (External and dual modes are also available if you want more control.) Power is 5V USB-C.",
  },
  {
    q: "Will it work where there's no cell signal?",
    a: "A booster needs an existing outdoor signal to amplify—it can't create one from nothing. If the outdoor signal is weak, that limits what you can expect indoors.",
  },
  {
    q: 'Can I use it in my RV while driving?',
    a: 'No. PLIDEPLI is a fixed device for buildings and stationary use. For RV camp sites, that means parked and stationary use — not while driving or towing.',
  },
  {
    q: 'Which carriers and bands does it support?',
    a: "PLIDEPLI supports five cellular bands: B12, B13, B5, B4, and B2. Compatibility depends on the bands your carrier uses at your location, so we can't promise support based on the carrier's name alone.",
  },
  {
    q: 'How much of my home will it cover?',
    a: 'Coverage is up to about 2,500 square feet, depending on outdoor signal strength and placement. Think of that as a best-case number — actual coverage depends on your walls, layout, and outdoor signal.',
  },
  {
    q: 'Is the gain 65 dB or 70 dB?',
    a: 'The amplifier gain is 65 dB. Total system gain, including the antenna, is about 70 dB—an FCC-measured figure, not a marketing number.',
  },
  {
    q: 'What does FCC Part 20 certification mean?',
    a: 'PLIDEPLI is certified under FCC Part 20 for its fixed cellular booster use, with FCC ID 2BWMS-L5-5B-2006. The certification is under Light Folding Science and Technology Co., Limited (Hong Kong); it does not make this an in-motion RV booster or guarantee coverage in your home.',
  },
  {
    q: 'What will it cost, and when will it ship?',
    a: 'Our target price is about $275—roughly half the price of mainstream brands—but final pricing and a ship date can only be confirmed after crowdfunding. The current prototype is a CNC-machined solid-aluminum unit; Kickstarter funding will pay for injection-molding tooling.',
  },
]

function Faq() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="faq">
      {FAQ_ITEMS.map((item, i) => {
        const isOpen = open === i
        return (
          <div className={`faq__item${isOpen ? ' is-open' : ''}`} key={i}>
            <h3 className="faq__q-wrap">
              <button
                type="button"
                className="faq__q"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{item.q}</span>
                <span className="faq__icon" aria-hidden="true" />
              </button>
            </h3>
            <div
              className="faq__a"
              id={`faq-panel-${i}`}
              hidden={!isOpen}
            >
              <p>{item.a}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const TICKER_ITEMS = [
  'FCC Part 20 certified',
  '65 dB amplifier gain',
  'Five bands · B12 B13 B5 B4 B2',
  '5V USB-C',
  'Engineered in Shenzhen',
  'Coming to Kickstarter',
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
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('.section')
    sections.forEach((el) => el.classList.add('reveal'))

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    sections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

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
            <a href="#faq">FAQ</a>
            <a href="#roadmap">Roadmap</a>
            <a href="#cta" className="btn btn--primary">
              Notify me at launch
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
                PLIDEPLI · Five-band cellular signal booster
              </span>
              <h1 className="hero__title">
                Better signal.
                <br />
                One less antenna to install.
              </h1>
              <p className="hero__sub">
                A cellular booster with the indoor antenna built in. Designed
                for US homes, cabins, and stationary RV campsites. 65 dB
                amplifier gain — up to approximately 70 dB system gain with the
                antenna. You still mount an outdoor log-periodic antenna.
              </p>
              <div className="hero__cta">
                <a href="#cta" className="btn btn--primary">
                  Notify me at launch
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
                  Explore the specs
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
                  65 dB amplifier gain
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
                  5V USB-C power
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
                  CNC-machined solid aluminum prototype
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
              <p className="hero__note">Meet PLIDEPLI in 44 seconds.</p>
            </div>
          </div>
        </section>

        {/* ---------- signal meter ---------- */}
        <section className="meter-band" aria-label="Before and after demo">
          <div className="container">
            <SignalMeter />
            <p className="meter__footnote">
              A booster amplifies an existing cellular signal — it cannot create
              one. You need usable signal outdoors to improve coverage indoors.
              This illustration is not a measured result.
            </p>
          </div>
        </section>

        {/* ---------- scenarios ---------- */}
        <section className="section">
          <div className="container">
            <span className="section__label">Where it fits</span>
            <h2 className="section__title">Signal outside. Connection inside.</h2>
            <div className="scenarios">
              <div className="scenario">
                <h3>The remote cabin</h3>
                <p>
                  Weak signal outdoors can fade further inside. Bring that
                  existing signal into your living space.
                </p>
              </div>
              <div className="scenario">
                <h3>The basement office</h3>
                <p>
                  Concrete, metal, and low-E glass can weaken cellular reception.
                  An outdoor antenna picks up signal beyond those barriers.
                </p>
              </div>
              <div className="scenario">
                <h3>The stationary RV campsite</h3>
                <p>
                  Set up where an outdoor signal is available. Designed for fixed
                  use with your RV parked — not for use while driving.
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
                Better reception shouldn't mean more hardware indoors.
              </h2>
              <p className="section__lede">
                We built the indoor antenna into the booster to simplify setup.
                Outdoor installation still matters.
              </p>
            </div>
            <div className="problem__list">
              <div className="problem__item">
                <h3>One less antenna to mount</h3>
                <p>
                  In internal mode, there's no separate indoor antenna or indoor
                  antenna cable to install. Mount the outdoor antenna and connect
                  it to the unit.
                </p>
              </div>
              <div className="problem__item">
                <h3>Placement still matters</h3>
                <p>
                  Too little separation between the outdoor and indoor antennas
                  can cause feedback and limit performance. A built-in antenna
                  doesn't remove that constraint.
                </p>
              </div>
              <div className="problem__item">
                <h3>A lower price target</h3>
                <p>
                  We're targeting about $275 — roughly half the price of
                  mainstream brand alternatives. Final campaign pricing will be
                  announced at launch.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- spec sheet ---------- */}
        <section className="section spec" id="spec">
          <div className="container">
            <span className="section__label">Technical specifications</span>
            <h2 className="section__title">The details that matter.</h2>
            <p className="section__lede">
              Amplifier gain, system gain, and the conditions behind coverage.
            </p>

            <div className="spec__sheet">
              <div className="spec__head">
                <span>PLIDEPLI · L5-5B · REV A</span>
                <span>FCC ID 2BWMS-L5-5B-2006</span>
              </div>
              <div className="spec__grid">
                <div className="spec__cell">
                  <div className="spec__value spec__value--accent">65 dB</div>
                  <div className="spec__key">Amplifier gain</div>
                  <div className="spec__sub">up to ~70 dB system gain with the antenna</div>
                </div>
                <div className="spec__cell">
                  <div className="spec__value">5</div>
                  <div className="spec__key">Supported bands</div>
                  <div className="spec__sub">B12 · B13 · B5 · B4 · B2</div>
                </div>
                <div className="spec__cell">
                  <div className="spec__value">2,500</div>
                  <div className="spec__key">Indoor coverage</div>
                  <div className="spec__sub">sq. ft. — depends on outdoor signal &amp; placement</div>
                </div>
                <div className="spec__cell">
                  <div className="spec__value">3</div>
                  <div className="spec__key">Antenna modes</div>
                  <div className="spec__sub">internal · external · dual</div>
                </div>
                <div className="spec__cell">
                  <div className="spec__value">US carriers</div>
                  <div className="spec__key">Band compatibility</div>
                  <div className="spec__sub">Verizon, AT&amp;T, T-Mobile where bands match</div>
                </div>
                <div className="spec__cell">
                  <div className="spec__value">Part 20</div>
                  <div className="spec__key">FCC certification</div>
                  <div className="spec__sub">oscillation monitoring, auto-shutdown</div>
                </div>
                <div className="spec__cell">
                  <div className="spec__value">5V USB-C</div>
                  <div className="spec__key">Power input</div>
                  <div className="spec__sub">included adapter or compatible USB-C source</div>
                </div>
                <div className="spec__cell">
                  <div className="spec__value">3 options</div>
                  <div className="spec__key">Unit mounting</div>
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
              Antenna feedback can cause interference. PLIDEPLI monitors for
              oscillation and shuts down automatically when detected.
            </p>
            <p className="spec__sheet-note mono">
              Fixed-location booster: designed for homes, cabins, and stationary
              RV campsite installations — not for use while driving.
            </p>
            <p className="spec__sheet-note mono">
              PLIDEPLI is the brand. The FCC grant is held by our Hong Kong
              entity, Light Folding Science and Technology Co., Limited — the
              same team, under the legal name on the filing.
            </p>
          </div>
        </section>

        {/* ---------- FCC grant ---------- */}
        <section className="section" id="fcc">
          <div className="container">
            <span className="section__label">FCC certification</span>
            <h2 className="section__title">Read the grant.</h2>
            <p className="section__lede">
              The authorization document is here, including the FCC ID, grantee,
              and grant date.
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
            <span className="section__label">Three antenna modes</span>
            <h2 className="section__title">Start with the antenna inside.</h2>
            <div className="modes">
              <div className="mode">
                <span className="mode__name">01 · internal</span>
                <h3>Built in. Ready for the room.</h3>
                <p>
                  Use the indoor antenna inside the booster. No separate indoor
                  antenna to mount or cable to route.
                </p>
              </div>
              <div className="mode">
                <span className="mode__name">02 · external</span>
                <h3>Put the indoor antenna where you need it.</h3>
                <p>
                  Use a separate ceiling antenna to position indoor coverage
                  independently of the booster.
                </p>
              </div>
              <div className="mode">
                <span className="mode__name">03 · dual</span>
                <h3>Use both indoor antennas.</h3>
                <p>
                  Run the built-in and separate indoor antennas together.
                  Coverage depends on layout, antenna separation, and the signal
                  available outdoors.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- install ---------- */}
        <section className="section">
          <div className="container">
            <span className="section__label">Installation</span>
            <h2 className="section__title">One outdoor antenna. Four steps.</h2>
            <div className="install">
              <div className="install__step">
                <span className="install__num">01</span>
                <h3>Find the outdoor signal</h3>
                <p>
                  Check reception around the property. Choose a location with
                  usable signal for the outdoor antenna.
                </p>
              </div>
              <div className="install__step">
                <span className="install__num">02</span>
                <h3>Mount and connect</h3>
                <p>
                  Mount the log-periodic antenna outdoors. Route its cable to the
                  booster, following the installation guide for antenna
                  separation.
                </p>
              </div>
              <div className="install__step">
                <span className="install__num">03</span>
                <h3>Connect power</h3>
                <p>Place the booster indoors and connect 5V USB-C power.</p>
              </div>
              <div className="install__step">
                <span className="install__num">04</span>
                <h3>Check your coverage</h3>
                <p>
                  Test reception where you use your phone. Adjust antenna
                  placement and mode as needed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- story ---------- */}
        <section className="section" id="story">
          <div className="container story">
            <aside className="story__aside">
              <span className="section__label">Our story</span>
              <h2 className="section__title">
                RF engineers. Building under our own name.
              </h2>
            </aside>
            <div className="story__body">
              <p>
                We're a small team in Shenzhen, with backgrounds in physics and
                radio-frequency engineering. We've worked on RF systems for base
                stations, phones, drones, and radar.
              </p>
              <p>
                PLIDEPLI is our chance to take responsibility for the whole
                product — from the circuit to the way it fits into your home.
                We started with cellular reception because it's a problem we
                know well. Building the indoor antenna into the booster removes
                a separate installation step; it doesn't remove the need for an
                outdoor antenna, careful placement, or an existing signal.
              </p>
              <p>
                We'll share the tuning process, test results, and changes along
                the way — including the setups that fall short and the tradeoffs
                we make.
              </p>
              <blockquote className="story__pull">
                Our first working units were CNC-machined from solid aluminum.
                That's the prototype you see here.
              </blockquote>
            </div>
          </div>
        </section>

        {/* ---------- faq ---------- */}
        <section className="section" id="faq">
          <div className="container">
            <span className="section__label">FAQ</span>
            <h2 className="section__title">Questions, answered plainly.</h2>
            <p className="section__lede">
              The honest answers to what people ask most — including the limits.
            </p>
            <Faq />
          </div>
        </section>

        {/* ---------- roadmap ---------- */}
        <section className="section roadmap" id="roadmap">
          <div className="container">
            <span className="section__label">Roadmap</span>
            <h2 className="section__title">First, the booster.</h2>
            <p className="section__lede">
              Two more ideas are on our roadmap. Bringing this product into
              production comes first.
            </p>
            <div className="steps">
              <div className="step">
                <div className="step__num">
                  <em>01</em>
                </div>
                <div>
                  <h3>
                    The cellular signal booster
                    <span className="step__tag">current project</span>
                  </h3>
                  <p>
                    Five supported bands. 65 dB amplifier gain. A built-in indoor
                    antenna. FCC Part 20 certified, with working CNC-machined
                    prototypes.
                  </p>
                </div>
              </div>
              <div className="step">
                <div className="step__num">
                  <em>02</em>
                </div>
                <div>
                  <h3>
                    Travel power bank
                    <span className="step__tag">planned</span>
                  </h3>
                  <p>
                    A power bank with integrated plugs for international travel.
                    Designed to reduce the adapters you carry.
                  </p>
                </div>
              </div>
              <div className="step">
                <div className="step__num">
                  <em>03</em>
                </div>
                <div>
                  <h3>
                    Signal and power hub
                    <span className="step__tag">concept</span>
                  </h3>
                  <p>
                    An integrated device combining cellular boosting and power.
                    Regional band support and regulatory requirements will shape
                    where it can be used.
                  </p>
                </div>
              </div>
            </div>
            <p className="spec__sheet-note mono" style={{ marginTop: 24 }}>
              These future projects are separate from this campaign.
              Specifications and timing are not yet set.
            </p>
          </div>
        </section>

        {/* ---------- mold ---------- */}
        <section className="section">
          <div className="container mold">
            <div>
              <span className="section__label">Why Kickstarter</span>
              <h2 className="section__title">The next step is tooling.</h2>
              <p className="section__lede">
                We have working prototypes machined from solid aluminum.
                Kickstarter will help fund the injection molds for the
                production housing.
              </p>
              <div className="mold__stat">
                <div>
                  <div className="num">65 dB</div>
                  <div className="lbl">amplifier gain · five bands</div>
                </div>
                <div>
                  <div className="num">~$275</div>
                  <div className="lbl">target price · roughly half mainstream</div>
                </div>
                <div>
                  <div className="num">Part 20</div>
                  <div className="lbl">certified · FCC ID 2BWMS-L5-5B-2006</div>
                </div>
              </div>
            </div>
            <div className="mold__card">
              <h3>What the campaign funds</h3>
              <ul>
                <li>Injection-mold tooling for the production housing</li>
                <li>The first production run for backers</li>
                <li>
                  The aluminum units shown are prototypes — the production
                  housing will be injection-molded
                </li>
                <li>
                  Final pricing, milestones, and delivery timing come with the
                  campaign
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ---------- final CTA ---------- */}
        <section className="cta" id="cta">
          <div className="container">
            <h2 className="cta__title">Know when we launch.</h2>
            <p className="cta__sub">
              Leave your email for one message when the Kickstarter campaign
              goes live.
            </p>
            <EmailForm id="cta-form" />
            <p className="form__note">
              Have a technical question? We're happy to explain the details.
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__grid">
          <div className="footer__brand">
            <Wordmark />
            <p style={{ marginTop: 12 }}>
              Cellular signal hardware. Engineered by a small RF team in
              Shenzhen.
            </p>
          </div>
          <div className="footer__meta">
            <div>
              <a href={EBAY_URL} target="_blank" rel="noopener noreferrer">
                Buy on eBay
              </a>
            </div>
            <div>FCC ID 2BWMS-L5-5B-2006</div>
            <div>
              FCC grant held by Light Folding Science and Technology Co.,
              Limited, Hong Kong.
            </div>
            <div>
              Fixed-location use only. An outdoor antenna is required.
            </div>
            <div>Pre-production specifications may change before manufacturing.</div>
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
