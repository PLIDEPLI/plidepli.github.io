import { useState, type SyntheticEvent } from 'react'
import Icon from './components/Icon'
import PhotoViewer from './components/PhotoViewer'

const BASE = import.meta.env.BASE_URL

export default function HomeBench() {
  const [photoOpen, setPhotoOpen] = useState(false)
  const pauseOthers = (event: SyntheticEvent<HTMLVideoElement>) => {
    document.querySelectorAll('video').forEach(video => { if (video !== event.currentTarget) video.pause() })
  }
  return <section className="section story-section bench-section" id="story"><div className="container">
    <div className="bench-opening">
      <div><p className="eyebrow">Small team. Real engineering.</p><h2>From our bench.<br />To your home.</h2></div>
      <div className="bench-introduction">
        <h3>Before you trust our booster, meet the bench behind it.</h3>
        <p>We're a small RF team in Shenzhen. Between us we've designed and tuned RF systems for base stations, phones, drones, and radar. This green anti-static bench — oscilloscope, spectrum analyzer, and all — is where PLIDEPLI is built, and where most of the footage you'll see comes from.</p>
        <p>We'll show the tuning as it actually happens, not a cleaned-up cut. A picture of test equipment doesn't prove a product works — the measurements do. Those come next.</p>
      </div>
    </div>
    <div className="bench-films">{[1, 2].map(number => <figure key={number}>
      <video controls playsInline preload="none" poster={`${BASE}bench/tuning-${number}-poster.webp`} src={`${BASE}bench/tuning-${number}.mp4`} aria-label={`Original RF tuning footage ${number}`} onPlay={pauseOthers} />
      <figcaption><span>0{number} / At the tuning bench</span><span>Original workshop footage</span></figcaption>
    </figure>)}</div>
    <figure className="bench-photograph"><button type="button" onClick={() => setPhotoOpen(true)} aria-label="Enlarge our Shenzhen RF workbench photo"><img src={`${BASE}bench/workbench.webp`} alt="Our green anti-static workbench in Shenzhen, with RF instruments and PLIDEPLI prototypes" width="1600" height="1200" loading="lazy" /><span>Explore the workbench<Icon name="plus" /></span></button><figcaption><span>The bench behind PLIDEPLI.</span><span>Shenzhen · Original team photograph</span></figcaption></figure>
    <a className="story-more" href={`${BASE}stories/`}><span><strong>This is just the beginning of our story.</strong><span>Explore all seven chapters, 50 workshop photos, and our original development clips.</span></span><span className="button button-dark">More of our story<Icon name="arrow" /></span></a>
  </div>{photoOpen && <PhotoViewer photos={[{ src: `${BASE}bench/workbench.webp`, alt: 'The PLIDEPLI RF workbench in Shenzhen. Original team photograph.' }]} initial={0} onClose={() => setPhotoOpen(false)} />}</section>
}
