import { type SyntheticEvent } from 'react'
import Icon from './components/Icon'

const BASE = import.meta.env.BASE_URL

export default function HomeBench() {
  const pauseOthers = (event: SyntheticEvent<HTMLVideoElement>) => {
    document.querySelectorAll('video').forEach(video => { if (video !== event.currentTarget) video.pause() })
  }
  // Desktop: text left, film right. Phones stack as heading → film → text → story link.
  // Second row mirrors it (film left, text right) for the "To your home" half; phones stack heading → film → text.
  return <section className="section story-section bench-section" id="story"><div className="container bench-layout">
    <div className="bench-head"><h2>From our bench.<br />To your home.</h2></div>
    <figure className="bench-media">
      <video controls playsInline preload="none" poster={`${BASE}story-edits/home/poster-clean.webp`} src={`${BASE}story-edits/home/film.mp4?music=country-tech-4`} aria-label="At the tuning bench — 30-second film" onPlay={pauseOthers} />
    </figure>
    <div className="bench-body">
      <h3>Before you trust our booster, meet the bench behind it.</h3>
      <p>We're a small RF team in Shenzhen. Between us we've designed and tuned RF systems for base stations, phones, drones, and radar. This green anti-static bench — oscilloscope, spectrum analyzer, and all — is where Plidépli is built.</p>
      <a className="bench-more" href={`${BASE}stories/`}><strong>Seven chapters, from the first bench to the next production batch.</strong><span className="button button-dark">More of our story<Icon name="arrow" /></span></a>
    </div>
  </div>
  <div className="container bench-install" id="home-install">
    <div className="bench-install-head">
      <p className="eyebrow">To your home</p>
      <h3>A real install, from the tower to the living room.</h3>
    </div>
    <figure className="bench-install-media">
      <video controls playsInline preload="none" poster={`${BASE}install/signal-walkthrough-poster.webp`} src={`${BASE}install/signal-walkthrough.mp4`} aria-label="Signal path walkthrough — 60-second real installation film" onPlay={pauseOthers}>
        <track kind="captions" src={`${BASE}install/signal-walkthrough.en.vtt`} srcLang="en" label="English" default />
      </video>
    </figure>
    <div className="bench-install-copy">
      <p>Outdoor antenna, one coaxial run, the booster on the wall. This setup adds an optional indoor panel — most homes can start with the built-in antenna alone.</p>
      <a className="button button-dark bench-install-cta" href={`${BASE}installation/`}>See the full installation guide<Icon name="arrow" /></a>
      <p className="small-print">Real installation. The white panel antenna is optional and sold separately. Results vary with your signal and setup.</p>
    </div>
  </div></section>
}
