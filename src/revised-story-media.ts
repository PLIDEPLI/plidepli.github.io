import { STORY_MEDIA, type StoryPhoto } from './story-media'

const realPhoto = (file: string, alt: string, width = 1600, height = 1200): StoryPhoto => ({ src: 'story-edits/revision-sep22/' + file, alt, width, height, kind: 'Workshop photograph', position: '50% 50%' })
export const REVISED_PHOTOS: Record<string, StoryPhoto[]> = {
  bench: [],
  pcb: [STORY_MEDIA.pcb.photos[0], realPhoto('board-evolution.webp', 'Bare boards and assembled prototypes: several revisions, compared together.')],
  enclosure: [STORY_MEDIA.enclosure.photos[0], realPhoto('enclosure-side.webp', 'The enclosure profiles compared at bench height.')],
  onoff: STORY_MEDIA.onoff.photos.slice(1).reverse(),
  manufacturing: [STORY_MEDIA.manufacturing.photos[0]],
}
export const ASSEMBLY_PHOTOS: StoryPhoto[] = [
  STORY_MEDIA.onoff.photos[0],
  realPhoto('populated-board.webp', 'The populated circuit board fitted in its metal frame.', 900, 1600),
  realPhoto('open-assembly.webp', 'A partly assembled prototype, with its antenna cover off.'),
  realPhoto('closed-prototype.webp', 'The assembled prototype, with its antenna connector and mode selector accessible.', 1200, 701),
]
