import { useState } from 'react'

export default function BandCheck() {
  const [phone, setPhone] = useState<'iPhone' | 'Android'>('iPhone')
  return <div className="band-check">
    <h2>Check your phone’s band.</h2>
    <div className="segmented-controls" role="group" aria-label="Phone type">
      {(['iPhone', 'Android'] as const).map(name => <button key={name} type="button" aria-pressed={phone === name} onClick={() => setPhone(name)}>{name}</button>)}
    </div>
    <div className="band-instructions" aria-live="polite">
      {phone === 'iPhone' ? <ol>
        <li>Turn off Wi-Fi. In the Phone app, dial <code>*3001#12345#*</code> and tap the call button to open Field Test.</li>
        <li>Open All Metrics, then LTE or 5G/NR serving-cell information.</li>
        <li>Look for Band Info, Band, or <code>freq_band_ind</code>. Match that number to a supported band below.</li>
      </ol> : <ol>
        <li>Turn off Wi-Fi and check whether your phone’s network information shows the current cellular band.</li>
        <li>If it does not, the brochure describes using LTE Discovery: open SIGNALS and read the band number.</li>
        <li>For signal strength, open Settings → About phone → SIM status or Network. Note the dBm reading for comparison.</li>
      </ol>}
    </div>
    <div className="supported-bands" aria-label="Supported cellular bands">{['B12', 'B13', 'B5', 'B4', 'B2'].map(band => <span key={band}>{band}</span>)}</div>
    <p>Menus vary by phone and software version. A carrier name or 5G icon alone does not confirm band compatibility.</p>
  </div>
}
