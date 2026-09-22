import { useState } from 'react'

const BASE = import.meta.env.BASE_URL
const PHOTOS = [
  ['story-edits/bench/photo-1.webp', 'Our workshop in Shenzhen. Room to build something of our own.'],
  ['story-edits/revision-sep22/engineer.webp', 'At the bench: bringing an RF design into the real world.'],
  ['story-edits/bench/photo-3.webp', 'The instruments we return to, one adjustment at a time.'],
]

export default function WorkshopCarousel() {
  const [index, setIndex] = useState(0)
  const move = (delta: number) => setIndex(value => (value + delta + PHOTOS.length) % PHOTOS.length)
  return <figure className="workshop-carousel" aria-label="Our workshop in pictures" aria-roledescription="carousel" tabIndex={0} onKeyDown={event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1) }
  }}>
    <div className="workshop-slide"><img src={BASE + PHOTOS[index][0]} alt={PHOTOS[index][1]} width="1600" height="1200" fetchPriority="high" /><span className="workshop-badge">An independent team.<br />An open workbench.</span></div>
    <figcaption aria-live="polite">{PHOTOS[index][1]}</figcaption>
    <div className="carousel-controls"><span>{String(index + 1).padStart(2, '0')} / 03</span><button type="button" onClick={() => move(-1)} aria-label="Previous workshop photo">←</button><button type="button" onClick={() => move(1)} aria-label="Next workshop photo">→</button></div>
  </figure>
}
