import { useEffect, useState } from 'react'
import { STORIES } from '../stories'
import Icon from '../components/Icon'
import PhotoViewer, { type Photo } from '../components/PhotoViewer'

import WorkshopCarousel from '../components/WorkshopCarousel'
import { ASSEMBLY_PHOTOS } from '../revised-story-media'

const BASE = import.meta.env.BASE_URL
const CHAPTER_INTROS = [
  'Every product has a starting point. Ours is a green workbench in Shenzhen, surrounded by RF instruments, half-finished boards, and the tools we use every day.',
  'RF development is a conversation between the design and the measurements. A component change can affect the stages around it, so each adjustment brings us back to the instruments.',
  'The outside of a booster has work to do, too. The enclosure needs to hold the board, support the connectors, and make room for the antenna we wanted to bring inside.',
  'The circuit board is where the five-band design becomes physical: components, traces, connections, and shielding sharing a limited amount of space.',
  'Integrating the indoor antenna is the idea at the heart of Plidépli. It also makes the relationship between the antenna, the board, and the housing especially important.',
  'Laboratory measurements and a useful connection at home answer different questions. This chapter follows the practical work of checking the booster in use.',
  'The next chapter is about building more than one. Tooling, assembly, and validation will turn the prototypes on our bench into the first production run.',
]

function ChapterMedia({ story, onPhoto }: { story: typeof STORIES[number]; onPhoto: (photos: Photo[], index: number) => void }) {
  const photos = story.photos.map(photo => ({ src: BASE + photo.src, alt: `${photo.alt} ${photo.kind}.` }))
  return <div className="chapter-media">
    {story.film && <div className="chapter-film">
      <div className="media-heading"><h3>{story.id === 'manufacturing' ? 'The path to production' : story.id === 'antenna' ? 'Four steps toward a thinner antenna' : 'A moment in the making'}</h3></div>
      <video controls playsInline preload="none" poster={BASE + story.film.poster} src={BASE + story.film.src} aria-label={`${story.title} — 30-second ${story.id === 'manufacturing' ? 'process animation' : 'film'}`} >{story.id === 'onoff' && <track kind="captions" src={BASE + 'story-edits/revision-sep22/testing.en.vtt'} srcLang="en" label="English" default />}</video>
    </div>}
    <div className={`chapter-photo-collection ${story.film ? '' : 'photo-essay'}`}>

      <div className="chapter-photos curated-photos">{story.photos.map((photo, index) => <figure key={photo.src}>
        <button type="button" onClick={() => onPhoto(photos, index)} aria-label={`Enlarge ${story.title} photo ${index + 1}`}><img src={BASE + photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" style={{ objectPosition: photo.position, objectFit: photo.height > photo.width ? 'contain' : 'cover' }} /></button>
        <figcaption><p>{photo.alt}</p></figcaption>
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
    <section className="stories-hero" id="top"><div className="container"><nav className="breadcrumb" aria-label="Breadcrumb"><a href={BASE}>Home</a><span>/</span><span>Our story</span></nav><div className="stories-hero-grid"><div><h1>From corporate cogs.<br />To our own workbench.</h1><p>We spent years building pieces of other people’s products. Plidépli is our chance to build something whole—and know the people it’s for.</p></div><WorkshopCarousel /></div></div></section>
    <section className="story-opening origin-story" id="origin"><div className="container">
      <div className="origin-heading"><h2>Why we stepped out<br />of the machine.</h2><blockquote>“Life is too short to build things you don’t love.”</blockquote></div>
      <div className="origin-copy">
        <p>We are physics graduates and RF engineers. For years, we worked inside some of the world’s largest technology companies, designing the electromagnetic and radio-frequency systems behind base stations, smartphones, drones, and radar.</p>
        <p>We learned a great deal. But over time, the work began to feel further from the people it was meant to serve. We found ourselves chasing incremental specifications for internal targets, with little room to ask whether those changes made anyone’s life better. We each owned a fragment of a product. Rarely did we get to see the whole picture.</p>
        <p>We wanted that connection back: to meet the people using our work, understand what mattered to them, and take responsibility for a product from the first idea to the finished thing.</p>
        <p>So we began spending our nights and weekends doing what had drawn us to engineering in the first place—experimenting with electromagnetic fields, asking questions, and building. This time, we could choose the problem and decide why it was worth solving.</p>
        <p>Plidépli grew out of that decision. It is our attempt to make cellular boosting simpler, and to build a more direct relationship with the people who need it. We have working prototypes and an FCC authorization. There is still work ahead, and we want to bring you into it.</p>

      </div>
    </div></section>
    <div className="container journal-layout"><aside className="chapter-index"><p>Inside the story</p><nav aria-label="Story chapters">{STORIES.map(story => <a key={story.id} href={`#${story.id}`}><span>{story.num}</span>{story.title}</a>)}</nav></aside><div className="chapters">{STORIES.map((story, index) => <article className="story-chapter" id={story.id} key={story.id}><header className="chapter-heading"><p className="eyebrow">Chapter {story.num} / 07</p><h2>{story.title}</h2><p className="chapter-intro">{CHAPTER_INTROS[story.id === 'pcb' ? 3 : story.id === 'enclosure' ? 2 : index]}</p></header><div className="chapter-narrative"><h3>{story.hook}</h3>{story.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>{story.id === 'onoff' && <div className="measurement-note"><strong>Three checks, three different questions</strong><ol><li>Gain across the supported cellular bands.</li><li>Output power and spectral purity with a signal generator and spectrum analyzer.</li><li>Built-in antenna isolation and connectivity.</li></ol></div>}<ChapterMedia story={story} onPhoto={(photos, photoIndex) => setViewer({ photos, index: photoIndex })} />{story.id === 'onoff' && <div className="assembly-flow"><div className="media-heading"><h3>From the bench to an enclosed prototype</h3></div><div className="chapter-photos curated-photos">{ASSEMBLY_PHOTOS.map((photo, photoIndex) => <figure key={photo.src}><button type="button" onClick={() => setViewer({ photos: ASSEMBLY_PHOTOS.map(item => ({ src: BASE + item.src, alt: item.alt })), index: photoIndex })} aria-label={`Enlarge assembly photo ${photoIndex + 1}`}><img src={BASE + photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" /></button><figcaption><span>0{photoIndex + 1}</span><p>{photo.alt}</p></figcaption></figure>)}</div></div>}{index < STORIES.length - 1 && <a className="next-chapter" href={`#${STORIES[index + 1].id}`}>Next chapter: {STORIES[index + 1].title}<Icon name="arrow" /></a>}</article>)}</div></div>
    <section className="page-crosslink"><div className="container"><div><h2>Be part of<br />what comes next.</h2></div><p>Our campaign will help fund the production molds and the first run of Plidépli. Join the list to hear when it begins.</p><a className="button button-dark" href="#cta">Join the launch list<Icon name="arrow" /></a></div></section>
    {viewer && <PhotoViewer photos={viewer.photos} initial={viewer.index} onClose={() => setViewer(null)} />}
  </>
}
