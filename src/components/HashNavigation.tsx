import { useEffect } from 'react'

// Static page entries mount React after the browser first looks for the fragment.
// Reapply it once the content and fonts exist, with one final load correction.
export default function HashNavigation() {
  useEffect(() => {
    let active = true
    let initialNavigation = true
    let frame = 0
    const scrollToHash = () => {
      if (!active || !window.location.hash) return
      let id: string
      try { id = decodeURIComponent(window.location.hash.slice(1)) } catch { return }
      if (['fcc', 'spec', 'roadmap', 'faq'].includes(id) && window.location.pathname === import.meta.env.BASE_URL) {
        window.location.replace(import.meta.env.BASE_URL + 'fcc/#' + id)
        return
      }
      document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'instant' })
    }
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(scrollToHash) }
    const stopInitial = () => { initialNavigation = false }
    const onLoad = () => { if (initialNavigation) schedule() }
    schedule()
    document.fonts.ready.then(() => { if (active && initialNavigation) schedule() })
    window.addEventListener('load', onLoad)
    window.addEventListener('hashchange', schedule)
    const interactions = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const
    interactions.forEach(event => window.addEventListener(event, stopInitial, { passive: true }))
    return () => {
      active = false
      cancelAnimationFrame(frame)
      window.removeEventListener('load', onLoad)
      window.removeEventListener('hashchange', schedule)
      interactions.forEach(event => window.removeEventListener(event, stopInitial))
    }
  }, [])
  return null
}
