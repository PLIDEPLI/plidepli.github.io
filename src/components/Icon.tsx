export default function Icon({ name }: { name: 'arrow' | 'check' | 'play' | 'plus' | 'download' }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === 'arrow' && <path d="M5 12h14m-5-5 5 5-5 5" />}
    {name === 'check' && <path d="m5 12 4 4L19 6" />}
    {name === 'play' && <path d="m9 5 11 7-11 7V5Z" />}
    {name === 'plus' && <path d="M12 5v14M5 12h14" />}
    {name === 'download' && <path d="M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5" />}
  </svg>
}
