import { STORY_MEDIA, type StoryPhoto, type StoryFilm } from './story-media'

type Story = {
  id: string
  num: string
  title: string
  hook: string
  body: string[]
  facts: string[]
  photos: StoryPhoto[]
  film: StoryFilm
}

export const STORIES: Story[] = [
  {
    id: 'bench',
    num: '01',
    title: 'The bench',
    hook: 'Meet the people and the place behind Plidépli.',
    body: [
      "We're a small RF team in Shenzhen. Between us we've designed and tuned RF systems for base stations, phones, drones, and radar. This green anti-static bench — oscilloscope, spectrum analyzer, and all — is where Plidépli is built, and where most of the footage you'll see comes from.",
      "These are our own workshop photos and development clips. Explore the boards, antenna tuning, and enclosure iterations below.",
    ],
    facts: [
      'Small Shenzhen RF team',
      'Base stations · phones · drones · radar',
      'ESD bench · oscilloscope · spectrum analyzer',
    ],
    photos: STORY_MEDIA.bench.photos,
    film: STORY_MEDIA.bench.film,
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
    photos: STORY_MEDIA.debugging.photos,
    film: STORY_MEDIA.debugging.film,
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
    photos: STORY_MEDIA.enclosure.photos,
    film: STORY_MEDIA.enclosure.film,
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
    photos: STORY_MEDIA.pcb.photos,
    film: STORY_MEDIA.pcb.film,
  },
  {
    id: 'antenna',
    num: '05',
    title: 'The antenna',
    hook: "Building the antenna in doesn't make the antenna problem disappear.",
    body: [
      "The indoor antenna lives inside the booster. In this film, we adjust copper foil on the antenna prototype. We use a network analyzer to tune its matching across the supported frequencies. An outdoor antenna receives the existing cellular signal.",
      "We tune on a Keysight E5071C, sweeping S-parameters and SWR from 680 MHz to 2.5 GHz. A clean match on the bench is one thing; coverage across the whole unit is another.",
    ],
    facts: [
      'Indoor antenna only — outdoor still required',
      'Keysight E5071C VNA',
      '680 MHz – 2.5 GHz · S-params & SWR',
    ],
    photos: STORY_MEDIA.antenna.photos,
    film: STORY_MEDIA.antenna.film,
  },
  {
    id: 'onoff',
    num: '06',
    title: 'Testing in progress',
    hook: 'A working prototype is the beginning of the testing.',
    body: [
      "A booster can only amplify the signal that already exists outdoors. It can't create one. So the honest test is boring: same spot, same phone, booster off, then booster on.",
      "The footage here shows development work at the bench. We are still preparing controlled home RSRP and speed comparisons. When those measurements are ready, we will share the conditions and the results — including the ones that tell us what needs to improve.",
    ],
    facts: ['Same spot · same phone', 'Off vs on', 'RSRP & speed tests coming'],
    photos: STORY_MEDIA.onoff.photos,
    film: STORY_MEDIA.onoff.film,
  },
  {
    id: 'manufacturing',
    num: '07',
    title: 'Making the next batch',
    hook: "From separate parts to a finished kit.",
    body: [
      "The animation maps the production route we are planning: a die-cast lower housing, an injection-molded upper cover, PCB fabrication, assembly, testing, and packaging. The workshop photographs below show our development work.",
      "The hard part is repeatability — every joint, every shield placement, every mechanical fit has to come out the same, unit after unit. A prototype is a starting point, not proof that production is ready.",
    ],
    facts: [
      'Casting · molding · PCB · assembly · test · pack',
      'Repeatability is the hard part',
      'Prototype ≠ production-ready',
    ],
    photos: STORY_MEDIA.manufacturing.photos,
    film: STORY_MEDIA.manufacturing.film,
  },
]

export const STORY_PHOTO_COUNT = STORIES.reduce((total, story) => total + story.photos.length, 0)
