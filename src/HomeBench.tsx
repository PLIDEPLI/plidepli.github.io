import { type SyntheticEvent } from 'react'
import Icon from './components/Icon'

const BASE = import.meta.env.BASE_URL

export default function HomeBench() {
  const pauseOthers = (event: SyntheticEvent<HTMLVideoElement>) => {
    document.querySelectorAll('video').forEach(video => { if (video !== event.currentTarget) video.pause() })
  }
  return <section className="section story-section bench-section" id="story"><div className="container">
    <div className="bench-opening">
      <div><h2>From our bench.<br />To your home.</h2></div>
      <div className="bench-introduction">
        <h3>Before you trust our booster, meet the bench behind it.</h3>
        <p>We're a small RF team in Shenzhen. Between us we've designed and tuned RF systems for base stations, phones, drones, and radar. This green anti-static bench — oscilloscope, spectrum analyzer, and all — is where Plidépli is built.</p>
      </div>
    </div>
    <div className="bench-films bench-film-single"><figure>
      <video controls playsInline preload="none" poster={`${BASE}story-edits/home/poster.webp`} src={`${BASE}story-edits/home/film.mp4?music=country-tech-4`} aria-label="At the tuning bench — 30-second film" onPlay={pauseOthers} />

    </figure></div>
    <a className="story-more" href={`${BASE}stories/`}><span><strong>This is just the beginning of our story.</strong></span><span className="button button-dark">More of our story<Icon name="arrow" /></span></a>
  </div></section>
}
