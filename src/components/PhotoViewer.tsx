import { useEffect, useRef, useState } from 'react'

export type Photo = { src: string; alt: string }

export default function PhotoViewer({ photos, initial, onClose }: { photos: Photo[]; initial: number; onClose: () => void }) {
  const [index, setIndex] = useState(initial)
  const dialog = useRef<HTMLDialogElement>(null)
  const move = (delta: number) => setIndex(value => (value + delta + photos.length) % photos.length)
  useEffect(() => {
    const element = dialog.current
    element?.showModal()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { element?.close(); document.body.style.overflow = previous }
  }, [])
  return <dialog ref={dialog} className="photo-viewer" aria-label="Photo viewer" onCancel={event => { event.preventDefault(); onClose() }} onKeyDown={event => { if (event.key === 'ArrowRight') { event.preventDefault(); move(1) } if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1) } }} onClick={event => { if (event.target === event.currentTarget) onClose() }}>
    <button className="photo-close" type="button" onClick={onClose} aria-label="Close photo viewer">×</button>
    <figure><img src={photos[index].src} alt={photos[index].alt} /><figcaption aria-live="polite">{photos[index].alt}<span>{index + 1} / {photos.length}</span></figcaption></figure>
    {photos.length > 1 && <div className="photo-controls"><button type="button" onClick={() => move(-1)} aria-label="Previous photo">←</button><button type="button" onClick={() => move(1)} aria-label="Next photo">→</button></div>}
  </dialog>
}
