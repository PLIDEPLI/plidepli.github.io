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

export const STORIES: Story[] = [
  {
    id: 'bench',
    num: '01',
    title: 'The bench',
    hook: 'Meet the people and the place behind PLIDEPLI.',
    body: [
      "We're a small RF team in Shenzhen. Between us we've designed and tuned RF systems for base stations, phones, drones, and radar. This green anti-static bench — oscilloscope, spectrum analyzer, and all — is where PLIDEPLI is built, and where most of the footage you'll see comes from.",
      "These are our own workshop photos and development clips. Explore the boards, antenna tuning, and enclosure iterations below.",
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
    hook: "Five cellular bands. Many rounds at the bench.",
    body: [
      "Five bands and a built-in antenna on one board means routing, spacing, and shielding all shape the signal. These photos document several stages of our board development.",
      "Each revision gives us another opportunity to refine the layout and test the assembled hardware.",
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
      "The indoor antenna lives inside the booster. We use a network analyzer to tune its matching across the supported frequencies. An outdoor antenna receives the existing cellular signal.",
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
    hook: "Preparing to build the next batch.",
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
