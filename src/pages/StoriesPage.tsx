import { useEffect, useState } from 'react'
import { STORIES } from '../stories'
import Icon from '../components/Icon'
import PhotoViewer, { type Photo } from '../components/PhotoViewer'

const BASE = import.meta.env.BASE_URL
const CHAPTER_INTROS = [
  'Every product has a starting point. Ours is a green workbench in Shenzhen, surrounded by RF instruments, half-finished boards, and the tools we use every day.',
  'RF development is a conversation between the design and the measurements. A component change can affect the stages around it, so each adjustment brings us back to the instruments.',
  'The outside of a booster has work to do, too. The enclosure needs to hold the board, support the connectors, and make room for the antenna we wanted to bring inside.',
  'The circuit board is where the five-band design becomes physical: components, traces, connections, and shielding sharing a limited amount of space.',
  'Integrating the indoor antenna is the idea at the heart of PLIDEPLI. It also makes the relationship between the antenna, the board, and the housing especially important.',
  'Laboratory measurements and a useful connection at home answer different questions. This chapter follows the practical work of checking the booster in use.',
  'The next chapter is about building more than one. Tooling, assembly, and validation will turn the prototypes on our bench into the first production run.',
]

function ChapterMedia({ story, onPhoto }: { story: typeof STORIES[number]; onPhoto: (photos: Photo[], index: number) => void }) {
  const [clip, setClip] = useState(0)
  const photos = story.images.map((source, index) => ({ src: BASE + source, alt: `${story.title} — original workshop photo ${index + 1}` }))
  return <div className="chapter-media">
    {story.videos.length > 0 && <div className="chapter-film"><div className="media-heading"><h3>From the workshop</h3><span>{story.videos.length} original {story.videos.length === 1 ? 'clip' : 'clips'}</span></div><video controls playsInline preload="none" poster={story.images[0] ? BASE + story.images[0] : `${BASE}product/connected.webp`} src={BASE + story.videos[clip]} key={story.videos[clip]} aria-label={`${story.title}, clip ${clip + 1}`} /><div className="chapter-clips" role="group" aria-label={`${story.title} video clips`}>{story.videos.map((source, index) => <button key={source} type="button" aria-pressed={clip === index} onClick={() => setClip(index)}><Icon name="play" /><span>Clip {String(index + 1).padStart(2, '0')}</span></button>)}</div></div>}
    {photos.length > 0 && <div className="chapter-photo-collection"><div className="media-heading"><h3>The photo journal</h3><span>{photos.length} {photos.length === 1 ? 'photo' : 'photos'} · Click to enlarge</span></div><div className="chapter-photos">{photos.map((photo, index) => <button type="button" key={photo.src} onClick={() => onPhoto(photos, index)} aria-label={`Enlarge ${story.title} photo ${index + 1}`}><img src={photo.src} alt={photo.alt} width="1600" height="1200" loading="lazy" /><span>{String(index + 1).padStart(2, '0')}</span></button>)}</div></div>}
  </div>
}

export default function StoriesPage() {
  const [viewer, setViewer] = useState<{ photos: Photo[]; index: number } | null>(null)
  useEffect(() => {
    const pauseOthers = (event: Event) => {
      if (event.target instanceof HTMLVideoElement) document.querySelectorAll('video').forEach(video => { if (video !== event.target) video.pause() })
    }
    document.addEventListener('play', pauseOthers, true)
    return () => document.removeEventListener('play', pauseOthers, true)
  }, [])
  return <>
    <section className="stories-hero" id="top"><div className="container"><nav className="breadcrumb" aria-label="Breadcrumb"><a href={BASE}>Home</a><span>/</span><span>Our story</span></nav><div className="stories-hero-grid"><div><p className="eyebrow">An independent team. An open workbench.</p><h1>Built by us.<br />Shared with you.</h1><p>Seven chapters in the making of PLIDEPLI. Meet the people, explore the prototypes, and see the work behind our first cellular booster.</p><a className="text-link" href="#bench">Step inside the workshop<Icon name="arrow" /></a></div><figure><img src={`${BASE}stories/bench/img-8.jpg`} alt="A PLIDEPLI engineer at the RF workbench in Shenzhen" width="1600" height="1200" fetchPriority="high" /><figcaption>Our workshop, Shenzhen. Original team photograph.</figcaption></figure></div><div className="journal-facts"><span>7 chapters</span><span>50 original photographs</span><span>28 development clips</span><span>One product we believe in.</span></div></div></section>
    <section className="story-opening"><div className="container"><p className="eyebrow">Why we’re building PLIDEPLI</p><h2>A simpler setup starts<br />with a different design.</h2><div><p>We set out to make a cellular booster with one less thing to install indoors. Bringing the indoor antenna into the main unit means thinking about the electronics, the enclosure, and the antenna as one design.</p><p>We have working prototypes and an FCC authorization. Now we’re preparing for production tooling. These are the photos and clips from that journey, shared so you can see what your support would help bring to life.</p></div></div></section>
    <div className="container journal-layout"><aside className="chapter-index"><p>Inside the story</p><nav aria-label="Story chapters">{STORIES.map(story => <a key={story.id} href={`#${story.id}`}><span>{story.num}</span>{story.title}</a>)}</nav><a className="journal-back" href={`${BASE}product/`}>Meet the finished design<Icon name="arrow" /></a></aside><div className="chapters">{STORIES.map((story, index) => <article className="story-chapter" id={story.id} key={story.id}><header className="chapter-heading"><p className="eyebrow">Chapter {story.num} / 07</p><h2>{story.title}</h2><p className="chapter-intro">{CHAPTER_INTROS[index]}</p></header><div className="chapter-narrative"><h3>{story.hook}</h3>{story.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>{story.id === 'onoff' && <div className="measurement-note"><strong>Where the results stand</strong><p>These are original development clips. A complete set of controlled home RSRP and speed comparisons is still being prepared; these clips are not presented as a verified coverage claim.</p></div>}<ChapterMedia story={story} onPhoto={(photos, photoIndex) => setViewer({ photos, index: photoIndex })} />{index < STORIES.length - 1 && <a className="next-chapter" href={`#${STORIES[index + 1].id}`}>Next chapter: {STORIES[index + 1].title}<Icon name="arrow" /></a>}</article>)}</div></div>
    <section className="page-crosslink"><div className="container"><div><p className="eyebrow">You’ve seen the work</p><h2>Be part of<br />what comes next.</h2></div><p>Our campaign will help fund the production molds and the first run of PLIDEPLI. Join the list to hear when it begins.</p><a className="button button-dark" href="#cta">Join the launch list<Icon name="arrow" /></a></div></section>
    {viewer && <PhotoViewer photos={viewer.photos} initial={viewer.index} onClose={() => setViewer(null)} />}
  </>
}
