import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChangeEvent, PointerEvent as ReactPointerEvent } from 'react'

const BASE = import.meta.env.BASE_URL

type Story = {
  id: string
  num: string
  title: string
  hook: string
  body: string[]
  facts: string[]
  images: string[]
  videos: string[]
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1)
const imgs = (dir: string, n: number) =>
  range(n).map((i) => `stories/${dir}/img-${i}.jpg`)
const vids = (dir: string, n: number) =>
  range(n).map((i) => `stories/${dir}/vid-${i}.mp4`)

const STORIES: Story[] = [
  {
    id: 'bench',
    num: '01',
    title: 'The bench',
    hook: 'Before you trust our booster, meet the bench behind it.',
    body: [
      "We're a small RF team in Shenzhen. Between us we've designed and tuned RF systems for base stations, phones, drones, and radar. This green anti-static bench — oscilloscope, spectrum analyzer, and all — is where PLIDEPLI is built, and where most of the footage you'll see comes from.",
      "We'll show the tuning as it actually happens, not a cleaned-up cut. A picture of test equipment doesn't prove a product works — the measurements do. Those come next.",
    ],
    facts: [
      'Small Shenzhen RF team',
      'Base stations · phones · drones · radar',
      'ESD bench · oscilloscope · spectrum analyzer',
    ],
    images: imgs('bench', 17),
    videos: vids('bench', 1),
  },
  {
    id: 'debugging',
    num: '02',
    title: 'Debugging',
    hook: "It powers on. That's where the debugging starts.",
    body: [
      "Powering on is the easy part. On an RF board, stages talk to each other — change the matching in one place and you've moved something three stages down. The soldering you see is only the last few minutes of a much longer loop.",
      "What matters is what we measured before the change, what we measured after, and whether the difference is real. That's the part worth showing — not just the iron going in.",
    ],
    facts: ['Power-on ≠ done', 'RF stages interact', 'Measure before, then after'],
    images: imgs('debugging', 9),
    videos: vids('debugging', 12),
  },
  {
    id: 'enclosure',
    num: '03',
    title: 'The enclosure',
    hook: 'This enclosure has been through more than five versions.',
    body: [
      "The first versions were 3D printed — you can see the layer lines if you look closely. The current prototype is CNC-machined from solid aluminum. In between, we learned the housing is never just a box.",
      "It has to hold the board, support the connectors, and work with the built-in antenna. The material you choose and where each part sits are RF decisions, not just aesthetic ones.",
    ],
    facts: [
      '5+ enclosure revisions',
      '3D print → CNC solid aluminum',
      'Material & placement are RF questions',
    ],
    images: imgs('enclosure', 8),
    videos: vids('enclosure', 4),
  },
  {
    id: 'pcb',
    num: '04',
    title: 'The boards',
    hook: "More PCB revisions don't automatically mean a better product.",
    body: [
      "Five bands and a built-in antenna on one board means routing, spacing, and shielding all shape the signal. We've spun several board revisions, but the count alone tells you nothing.",
      "What matters is what changed, why we changed it, and what the measurements showed. Iteration without a reason is just motion.",
    ],
    facts: ['Five bands, one board', 'Routing · spacing · shielding', 'Revisions ≠ performance'],
    images: imgs('pcb', 7),
    videos: [],
  },
  {
    id: 'antenna',
    num: '05',
    title: 'The antenna',
    hook: "Building the antenna in doesn't make the antenna problem disappear.",
    body: [
      "What's built in is the indoor antenna. You still mount an outdoor antenna — that requirement doesn't go away. Getting the built-in one right means matching it on a network analyzer.",
      "We tune on a Keysight E5071C, sweeping S-parameters and SWR from 680 MHz to 2.5 GHz. A clean match on the bench is one thing; coverage across the whole unit is another.",
    ],
    facts: [
      'Indoor antenna only — outdoor still required',
      'Keysight E5071C VNA',
      '680 MHz – 2.5 GHz · S-params & SWR',
    ],
    images: imgs('antenna', 8),
    videos: vids('antenna', 2),
  },
  {
    id: 'onoff',
    num: '06',
    title: 'The off/on test',
    hook: 'To know if a booster works, turn it off.',
    body: [
      "A booster can only amplify the signal that already exists outdoors. It can't create one. So the honest test is boring: same spot, same phone, booster off, then booster on.",
      "We're running the full RSRP and speed comparisons now. When the measured data is ready we'll publish it — including the results that aren't flattering.",
    ],
    facts: ['Same spot · same phone', 'Off vs on', 'RSRP & speed tests coming'],
    images: [],
    videos: vids('onoff', 4),
  },
  {
    id: 'manufacturing',
    num: '07',
    title: 'Manufacturing',
    hook: "One working prototype doesn't tell you how the next one will perform.",
    body: [
      "This is solder-paste printing, reflow, shield-can assembly, and sheet-metal forming. Getting a single unit working is the easy milestone.",
      "The hard part is repeatability — every joint, every shield placement, every mechanical fit has to come out the same, unit after unit. A prototype is a starting point, not proof that production is ready.",
    ],
    facts: [
      'Solder paste · reflow · shield can · sheet metal',
      'Repeatability is the hard part',
      'Prototype ≠ production-ready',
    ],
    images: imgs('manufacturing', 1),
    videos: vids('manufacturing', 5),
  },
]

function formatTime(t: number) {
  if (!Number.isFinite(t) || t <= 0) return '0:00'
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

function VideoPlayer({
  videos,
  poster,
  active,
}: {
  videos: string[]
  poster?: string
  active: boolean
}) {
  const [idx, setIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const shellRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active) videoRef.current?.pause()
  }, [active])

  // Track fullscreen state so the toggle icon can flip between expand/collapse.
  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  // The video element is remounted on clip change (key={videos[idx]}),
  // so (re)attach listeners and reset state whenever idx changes.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    setPlaying(false)
    setCurrentTime(0)
    setDuration(0)

    const onTime = () => setCurrentTime(v.currentTime)
    const onDuration = () => setDuration(v.duration || 0)
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)

    v.addEventListener('timeupdate', onTime)
    v.addEventListener('loadedmetadata', onDuration)
    v.addEventListener('durationchange', onDuration)
    v.addEventListener('play', onPlay)
    v.addEventListener('pause', onPause)
    return () => {
      v.removeEventListener('timeupdate', onTime)
      v.removeEventListener('loadedmetadata', onDuration)
      v.removeEventListener('durationchange', onDuration)
      v.removeEventListener('play', onPlay)
      v.removeEventListener('pause', onPause)
    }
  }, [idx])

  const togglePlay = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  }, [])

  const seek = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current
    if (!v) return
    const value = Number(e.target.value)
    if (!Number.isFinite(value)) return
    v.currentTime = value
    setCurrentTime(value)
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    } else {
      shellRef.current?.requestFullscreen().catch(() => {})
    }
  }, [])

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="story-video">
      <div className="story-video__shell" ref={shellRef}>
        <video
          ref={videoRef}
          key={videos[idx]}
          playsInline
          preload="metadata"
          poster={poster ? BASE + poster : undefined}
          src={BASE + videos[idx]}
          onClick={togglePlay}
        />
        <div
          className="story-video__controls"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="story-video__btn"
            onClick={togglePlay}
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <rect x="3.5" y="2.5" width="3" height="11" rx="1" />
                <rect x="9.5" y="2.5" width="3" height="11" rx="1" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M4.5 2.9a.6.6 0 0 1 .9-.52l8.1 5.1a.6.6 0 0 1 0 1.04l-8.1 5.1a.6.6 0 0 1-.9-.52V2.9Z" />
              </svg>
            )}
          </button>
          <input
            type="range"
            className="story-video__range"
            min={0}
            max={duration || 0}
            step={0.05}
            value={Math.min(currentTime, duration || 0)}
            onChange={seek}
            style={{
              background: `linear-gradient(to right, var(--accent) ${progress}%, rgba(255,255,255,.45) ${progress}%)`,
            }}
            aria-label="Seek video"
          />
          <span className="story-video__time">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <button
            type="button"
            className="story-video__btn story-video__btn--fs"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 2.5V6H2.5" />
                <path d="M10 2.5V6h3.5" />
                <path d="M10 13.5V10h3.5" />
                <path d="M6 13.5V10H2.5" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2.5 6V2.5H6" />
                <path d="M10 2.5h3.5V6" />
                <path d="M13.5 10v3.5H10" />
                <path d="M6 13.5H2.5V10" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {videos.length > 1 && (
        <div className="story-video__clips">
          <span className="story-video__label">Clips</span>
          <div className="story-video__thumbs" aria-label="Video clips">
            {videos.map((v, i) => (
              <button
                key={v}
                type="button"
                className={`story-video__thumb${i === idx ? ' is-active' : ''}`}
                onClick={() => setIdx(i)}
                aria-label={`Play clip ${i + 1} of ${videos.length}`}
                aria-pressed={i === idx}
              >
                {String(i + 1).padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ImageGallery({
  images,
  onOpen,
}: {
  images: string[]
  onOpen: (index: number) => void
}) {
  const [featured, setFeatured] = useState(0)

  return (
    <div
      className="story-gallery"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="story-gallery__head">
        <span className="story-gallery__label">
          {images.length} photo{images.length === 1 ? '' : 's'}
        </span>
      </div>
      <div className="story-gallery__strip" aria-label="Photo gallery">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            className={`story-gallery__thumb${i === featured ? ' is-active' : ''}`}
            onClick={() => {
              setFeatured(i)
              onOpen(i)
            }}
            aria-label={`Open photo ${i + 1} of ${images.length}`}
            aria-current={i === featured}
          >
            <img src={BASE + src} alt="" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  )
}

function Lightbox({
  images,
  index,
  onClose,
  onNav,
}: {
  images: string[]
  index: number
  onClose: () => void
  onNav: (delta: number) => void
}) {
  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') onNav(-1)
      else if (e.key === 'ArrowRight') onNav(1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onNav])

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={onClose}
    >
      <button
        type="button"
        className="lightbox__close"
        onClick={onClose}
        aria-label="Close image viewer"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M5 5 15 15M15 5 5 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <button
        type="button"
        className="lightbox__nav lightbox__nav--prev"
        onClick={(e) => {
          e.stopPropagation()
          onNav(-1)
        }}
        aria-label="Previous image"
      >
        <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M12.5 4 6.5 10l6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <figure className="lightbox__figure" onClick={(e) => e.stopPropagation()}>
        <img src={BASE + images[index]} alt={`Photo ${index + 1} of ${images.length}`} />
        <figcaption>
          {index + 1} / {images.length}
        </figcaption>
      </figure>
      <button
        type="button"
        className="lightbox__nav lightbox__nav--next"
        onClick={(e) => {
          e.stopPropagation()
          onNav(1)
        }}
        aria-label="Next image"
      >
        <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M7.5 4 13.5 10l-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}

export default function StoryCarousel() {
  const [active, setActive] = useState(0)
  const [drag, setDrag] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [lightbox, setLightbox] = useState<{
    images: string[]
    index: number
  } | null>(null)

  const startX = useRef(0)
  const dragRef = useRef(0)
  const didDrag = useRef(false)
  const count = STORIES.length

  const go = useCallback(
    (i: number) => {
      setActive(((i % count) + count) % count)
    },
    [count],
  )

  const goRelative = useCallback(
    (delta: number) => {
      setActive((prev) => (((prev + delta) % count) + count) % count)
    },
    [count],
  )

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return
    const target = e.target as HTMLElement
    if (target.closest('video, button, a, input, select, textarea')) return
    startX.current = e.clientX
    dragRef.current = 0
    didDrag.current = false
    setDragging(true)
    setDrag(0)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging) return
    const d = e.clientX - startX.current
    if (Math.abs(d) > 5) didDrag.current = true
    dragRef.current = d
    setDrag(d)
  }

  function endDrag() {
    if (!dragging) return
    setDragging(false)
    const d = dragRef.current
    if (d < -80) goRelative(1)
    else if (d > 80) goRelative(-1)
    dragRef.current = 0
    setDrag(0)
  }

  const openLightbox = useCallback((images: string[], index: number) => {
    setLightbox({ images, index })
  }, [])

  const closeLightbox = useCallback(() => setLightbox(null), [])

  const navLightbox = useCallback((delta: number) => {
    setLightbox((prev) => {
      if (!prev) return prev
      const n = prev.images.length
      return { ...prev, index: (((prev.index + delta) % n) + n) % n }
    })
  }, [])

  return (
    <div className="story-carousel">
      <div
        className={`story-carousel__viewport${dragging ? ' is-dragging' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={(e) => {
          if (didDrag.current) {
            e.preventDefault()
            e.stopPropagation()
            didDrag.current = false
          }
        }}
      >
        <div
          className="story-carousel__track"
          style={{
            transform: `translateX(calc(${-active * 100}% + ${drag}px))`,
            transition: dragging
              ? 'none'
              : 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {STORIES.map((story, i) => (
            <div
              key={story.id}
              className="story-carousel__slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`Story ${story.num} of ${count}`}
              aria-hidden={i !== active}
              inert={i !== active}
            >
              <div className="story-slide__inner">
                <div className="story-slide__text">
                  <span className="story-slide__num">
                    {story.num} <span className="story-slide__of">/ 07</span>
                  </span>
                  <h3 className="story-slide__title">{story.title}</h3>
                  <p className="story-slide__hook">{story.hook}</p>
                  {story.body.map((p, bi) => (
                    <p key={bi} className="story-slide__body">
                      {p}
                    </p>
                  ))}
                  <ul className="story-slide__facts">
                    {story.facts.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>

                <div className="story-media">
                  {story.videos.length > 0 && (
                    <VideoPlayer
                      videos={story.videos}
                      poster={story.images[0]}
                      active={i === active}
                    />
                  )}
                  {story.images.length > 0 && (
                    <ImageGallery
                      images={story.images}
                      onOpen={(index) => openLightbox(story.images, index)}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="story-carousel__nav">
        <button
          type="button"
          className="story-carousel__arrow"
          onClick={() => goRelative(-1)}
          aria-label="Previous story"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M12.5 4 6.5 10l6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div
          className="story-carousel__dots"
          role="tablist"
          aria-label="Choose a story"
        >
          {STORIES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              className={`story-carousel__dot${i === active ? ' is-active' : ''}`}
              onClick={() => go(i)}
              aria-label={`Go to story ${s.num}: ${s.title}`}
              aria-selected={i === active}
            />
          ))}
        </div>
        <button
          type="button"
          className="story-carousel__arrow"
          onClick={() => goRelative(1)}
          aria-label="Next story"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M7.5 4 13.5 10l-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={closeLightbox}
          onNav={navLightbox}
        />
      )}
    </div>
  )
}
