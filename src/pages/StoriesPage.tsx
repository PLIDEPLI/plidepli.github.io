import { useEffect, useState } from 'react'
import { STORIES, STORY_PHOTO_COUNT } from '../stories'
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
  const photos = story.photos.map(photo => ({ src: BASE + photo.src, alt: `${photo.alt} ${photo.kind}.` }))
  return <div className="chapter-media">
    <div className="chapter-film">
      <div className="media-heading"><h3>{story.id === 'manufacturing' ? 'The path to production' : story.id === 'pcb' ? 'A study of the boards' : 'A moment in the making'}</h3><span>{story.id === 'manufacturing' ? '30-second process animation' : '30-second chapter film'}</span></div>
      <video controls playsInline preload="none" poster={BASE + story.film.poster} src={BASE + story.film.src} aria-label={`${story.title} — 30-second ${story.id === 'manufacturing' ? 'process animation' : 'film'}`} />
      <p className="film-editorial-note">{story.id === 'manufacturing' ? 'Original animation of our planned manufacturing workflow. Simplified shapes and test displays are illustrative; this is not factory footage or measured test data.' : `Edited from our workshop footage${['enclosure', 'pcb', 'antenna'].includes(story.id) ? ' and selected images' : ''}.`} Original instrumental soundtrack.</p>
    </div>
    <div className="chapter-photo-collection">
      <div className="media-heading"><h3>The story in pictures</h3><span>{photos.length} selected images · Click to enlarge</span></div>
      <div className="chapter-photos curated-photos">{story.photos.map((photo, index) => <figure key={photo.src}>
        <button type="button" onClick={() => onPhoto(photos, index)} aria-label={`Enlarge ${story.title} photo ${index + 1}`}><img src={BASE + photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" style={{ objectPosition: photo.position, objectFit: photo.height > photo.width ? 'contain' : 'cover' }} /><span>View photo</span></button>
        <figcaption><span>{photo.kind}</span><p>{photo.alt}</p></figcaption>
      </figure>)}</div>
    </div>
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
    <section className="stories-hero" id="top"><div className="container"><nav className="breadcrumb" aria-label="Breadcrumb"><a href={BASE}>Home</a><span>/</span><span>Our story</span></nav><div className="stories-hero-grid"><div><p className="eyebrow">An independent team. An open workbench.</p><h1>From corporate cogs.<br />To our own workbench.</h1><p>We spent years building pieces of other people’s products. PLIDEPLI is our chance to build something whole—and know the people it’s for.</p><a className="text-link" href="#origin">Why we started<Icon name="arrow" /></a></div><figure><img src={`${BASE}stories/bench/img-8.jpg`} alt="A PLIDEPLI engineer at the RF workbench in Shenzhen" width="1600" height="1200" fetchPriority="high" /><figcaption>Our workshop, Shenzhen. Original team photograph.</figcaption></figure></div><div className="journal-facts"><span>7 chapters</span><span>{STORY_PHOTO_COUNT} selected images</span><span>7 films · 30 seconds each</span><span>One product we believe in.</span></div></div></section>
    <section className="story-opening origin-story" id="origin"><div className="container">
      <div className="origin-heading"><p className="eyebrow">The origin</p><h2>Why we stepped out<br />of the machine.</h2><blockquote>“Life is too short to build things you don’t love.”</blockquote></div>
      <div className="origin-copy">
        <p>We are physics graduates and RF engineers. For years, we worked inside some of the world’s largest technology companies, designing the electromagnetic and radio-frequency systems behind base stations, smartphones, drones, and radar.</p>
        <p>We learned a great deal. But over time, the work began to feel further from the people it was meant to serve. We found ourselves chasing incremental specifications for internal targets, with little room to ask whether those changes made anyone’s life better. We each owned a fragment of a product. Rarely did we get to see the whole picture.</p>
        <p>We wanted that connection back: to meet the people using our work, understand what mattered to them, and take responsibility for a product from the first idea to the finished thing.</p>
        <p>So we began spending our nights and weekends doing what had drawn us to engineering in the first place—experimenting with electromagnetic fields, asking questions, and building. This time, we could choose the problem and decide why it was worth solving.</p>
        <p>PLIDEPLI grew out of that decision. It is our attempt to make cellular boosting simpler, and to build a more direct relationship with the people who need it. We have working prototypes and an FCC authorization. There is still work ahead, and we want to bring you into it.</p>
        <a className="text-link" href="#bench">See where that decision took us<Icon name="arrow" /></a>
      </div>
    </div></section>
    <div className="container journal-layout"><aside className="chapter-index"><p>Inside the story</p><nav aria-label="Story chapters">{STORIES.map(story => <a key={story.id} href={`#${story.id}`}><span>{story.num}</span>{story.title}</a>)}</nav><a className="journal-back" href={`${BASE}product/`}>Meet the finished design<Icon name="arrow" /></a></aside><div className="chapters">{STORIES.map((story, index) => <article className="story-chapter" id={story.id} key={story.id}><header className="chapter-heading"><p className="eyebrow">Chapter {story.num} / 07</p><h2>{story.title}</h2><p className="chapter-intro">{CHAPTER_INTROS[index]}</p></header><div className="chapter-narrative"><h3>{story.hook}</h3>{story.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>{story.id === 'onoff' && <div className="measurement-note"><strong>Where the results stand</strong><p>This film shows development work at the bench. Controlled home RSRP and speed comparisons are still being prepared. The edit is not a measured before-and-after demonstration.</p></div>}<ChapterMedia story={story} onPhoto={(photos, photoIndex) => setViewer({ photos, index: photoIndex })} />{index < STORIES.length - 1 && <a className="next-chapter" href={`#${STORIES[index + 1].id}`}>Next chapter: {STORIES[index + 1].title}<Icon name="arrow" /></a>}</article>)}</div></div>
    <section className="page-crosslink"><div className="container"><div><p className="eyebrow">You’ve seen the work</p><h2>Be part of<br />what comes next.</h2></div><p>Our campaign will help fund the production molds and the first run of PLIDEPLI. Join the list to hear when it begins.</p><a className="button button-dark" href="#cta">Join the launch list<Icon name="arrow" /></a></div></section>
    {viewer && <PhotoViewer photos={viewer.photos} initial={viewer.index} onClose={() => setViewer(null)} />}
  </>
}
