export type StoryPhoto = { src: string; alt: string; kind: string; width: number; height: number; position: string }
export type StoryFilm = { src: string; poster: string }
export const STORY_MEDIA: Record<string, { photos: StoryPhoto[]; film: StoryFilm }> = {
  "bench": {
    "photos": [
      {
        "src": "story-edits/bench/photo-1.webp",
        "alt": "The workspace we are making our own.",
        "kind": "Workshop photograph",
        "width": 1600,
        "height": 1200,
        "position": "50% 50%"
      },
      {
        "src": "story-edits/bench/photo-2.webp",
        "alt": "An engineer at the RF workbench.",
        "kind": "Workshop photograph",
        "width": 1600,
        "height": 1200,
        "position": "50% 50%"
      },
      {
        "src": "story-edits/bench/photo-3.webp",
        "alt": "The instruments behind the daily work.",
        "kind": "Workshop photograph",
        "width": 1600,
        "height": 1200,
        "position": "50% 50%"
      },
      {
        "src": "story-edits/bench/photo-4.webp",
        "alt": "Another view of the workshop.",
        "kind": "Workshop photograph",
        "width": 1600,
        "height": 1200,
        "position": "50% 50%"
      },
      {
        "src": "story-edits/bench/photo-5.webp",
        "alt": "Parts and prototypes between revisions.",
        "kind": "Workshop photograph",
        "width": 1600,
        "height": 1200,
        "position": "50% 50%"
      },
      {
        "src": "story-edits/bench/photo-6.webp",
        "alt": "Components kept within reach.",
        "kind": "Workshop photograph",
        "width": 1600,
        "height": 1200,
        "position": "50% 50%"
      }
    ],
    "film": {
      "src": "story-edits/bench/film.mp4?score=scene-2",
      "poster": "story-edits/bench/poster.webp"
    }
  },
  "debugging": {
    "photos": [
      {
        "src": "story-edits/debugging/photo-1.webp",
        "alt": "Checking the board at the bench.",
        "kind": "Workshop photograph",
        "width": 1600,
        "height": 1200,
        "position": "50% 50%"
      },
      {
        "src": "story-edits/debugging/photo-2.webp",
        "alt": "A component adjustment in progress.",
        "kind": "Workshop photograph",
        "width": 1600,
        "height": 1200,
        "position": "50% 50%"
      },
      {
        "src": "story-edits/debugging/photo-3.webp",
        "alt": "The prototype connected to the test setup.",
        "kind": "Workshop photograph",
        "width": 1600,
        "height": 1200,
        "position": "50% 50%"
      }
    ],
    "film": {
      "src": "story-edits/debugging/film.mp4?score=scene-2",
      "poster": "story-edits/debugging/poster.webp"
    }
  },
  "enclosure": {
    "photos": [
      {
        "src": "story-edits/enclosure/photo-1.webp",
        "alt": "Enclosure prototypes compared side by side.",
        "kind": "Workshop photograph",
        "width": 1600,
        "height": 1200,
        "position": "50% 50%"
      },
      {
        "src": "story-edits/enclosure/photo-2.webp",
        "alt": "Comparing the shape and mechanical details.",
        "kind": "Workshop photograph",
        "width": 1600,
        "height": 1200,
        "position": "50% 50%"
      },
      {
        "src": "story-edits/enclosure/photo-3.webp?v=frame-2",
        "alt": "A closer look at the enclosure prototype.",
        "kind": "Frame from workshop footage",
        "width": 1280,
        "height": 720,
        "position": "50% 50%"
      }
    ],
    "film": {
      "src": "story-edits/enclosure/film.mp4?score=scene-2",
      "poster": "story-edits/enclosure/poster.webp"
    }
  },
  "pcb": {
    "photos": [
      {
        "src": "story-edits/pcb/photo-1.webp",
        "alt": "Circuit board panels before assembly.",
        "kind": "Workshop photograph",
        "width": 1600,
        "height": 1200,
        "position": "50% 50%"
      },
      {
        "src": "story-edits/pcb/photo-2.webp",
        "alt": "A board fitted inside its metal frame.",
        "kind": "Workshop photograph",
        "width": 900,
        "height": 1600,
        "position": "50% 50%"
      },
      {
        "src": "story-edits/pcb/photo-3.webp",
        "alt": "Inside the prototype, with shielding and antenna components.",
        "kind": "Workshop photograph",
        "width": 1600,
        "height": 1200,
        "position": "50% 50%"
      }
    ],
    "film": {
      "src": "story-edits/pcb/film.mp4?score=scene-2",
      "poster": "story-edits/pcb/poster.webp"
    }
  },
  "antenna": {
    "photos": [
      {
        "src": "story-edits/antenna/photo-1.webp",
        "alt": "The antenna and RF test setup.",
        "kind": "Workshop photograph",
        "width": 1600,
        "height": 1200,
        "position": "50% 50%"
      },
      {
        "src": "story-edits/antenna/photo-2.webp",
        "alt": "Antenna components alongside the prototype.",
        "kind": "Workshop photograph",
        "width": 1600,
        "height": 1200,
        "position": "50% 50%"
      },
      {
        "src": "story-edits/antenna/photo-3.webp",
        "alt": "The integrated antenna inside the housing.",
        "kind": "Workshop photograph",
        "width": 1600,
        "height": 1200,
        "position": "50% 50%"
      },
      {
        "src": "story-edits/antenna/photo-4.webp",
        "alt": "A network-analyzer reading from development.",
        "kind": "Workshop photograph",
        "width": 1600,
        "height": 1200,
        "position": "50% 50%"
      },
      {
        "src": "story-edits/antenna/photo-5.webp",
        "alt": "A closer look at the matching measurements.",
        "kind": "Workshop photograph",
        "width": 1600,
        "height": 1200,
        "position": "50% 50%"
      },
      {
        "src": "story-edits/antenna/photo-6.webp",
        "alt": "Another measurement from the tuning process.",
        "kind": "Workshop photograph",
        "width": 1600,
        "height": 1200,
        "position": "50% 50%"
      }
    ],
    "film": {
      "src": "story-edits/antenna/film.mp4?score=scene-2",
      "poster": "story-edits/antenna/poster.webp"
    }
  },
  "onoff": {
    "photos": [
      {
        "src": "story-edits/onoff/photo-1.webp",
        "alt": "Working on the prototype at the test bench.",
        "kind": "Frame from workshop footage",
        "width": 1280,
        "height": 720,
        "position": "50% 50%"
      },
      {
        "src": "story-edits/onoff/photo-2.webp",
        "alt": "Adjusting the test setup.",
        "kind": "Frame from workshop footage",
        "width": 1280,
        "height": 720,
        "position": "50% 50%"
      },
      {
        "src": "story-edits/onoff/photo-3.webp",
        "alt": "Checking the instruments during development.",
        "kind": "Frame from workshop footage",
        "width": 960,
        "height": 544,
        "position": "50% 50%"
      }
    ],
    "film": {
      "src": "story-edits/onoff/film.mp4?score=scene-2",
      "poster": "story-edits/onoff/poster.webp"
    }
  },
  "manufacturing": {
    "photos": [
      {
        "src": "story-edits/manufacturing/photo-1.webp",
        "alt": "Working with a solder-paste printing stencil.",
        "kind": "Frame from workshop footage",
        "width": 1280,
        "height": 720,
        "position": "50% 50%"
      },
      {
        "src": "story-edits/manufacturing/photo-2.webp",
        "alt": "Assembling the board and shielding.",
        "kind": "Frame from workshop footage",
        "width": 720,
        "height": 1280,
        "position": "50% 50%"
      },
      {
        "src": "story-edits/manufacturing/photo-3.webp",
        "alt": "Formed metal parts from the development work.",
        "kind": "Workshop photograph",
        "width": 1600,
        "height": 1200,
        "position": "50% 50%"
      }
    ],
    "film": {
      "src": "story-edits/manufacturing/film.mp4?score=scene-2",
      "poster": "story-edits/manufacturing/poster.webp"
    }
  }
}
