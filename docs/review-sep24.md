# September 24 layout and source review

References: `网站修改 2026-9-23(1).pptx`, `画册 2026-9-24.pdf`, the two files in `网站更换图片`, and `20260923版本视频_高清原版画面_BGM已对齐.mp4`.

| PPT slide | Website implementation |
| --- | --- |
| 1 | Larger, title-case navigation; breadcrumbs removed from all four inner pages. |
| 2 | Home rendering caption updated; the thin proof strip removed. |
| 3 | Product section navigation appears as clickable buttons; cable label is 50 ft with 15 m in the description. |
| 4 | Optional outdoor omni antenna image rotated 180 degrees. |
| 5 | Installation opens with Before Getting Started, the brochure image, and iPhone/Android selection. No hero jump button. |
| 6 | Six-step navigation follows the brochure labels; long prose is justified. |
| 7 | Outdoor antenna cards use the two original line drawings, installation illustrations, and concise summaries. |
| 8 | Wall, overhead crossbar, and ceiling mounting have the supplied 5/3/5 steps and revised images. |
| 9 | Mode switch uses the supplied clean installation image. |
| 10 | Four selectable indoor antenna types; controls and installation text sit to the right on desktop. Ceiling illustration remains blank as requested. |
| 11 | Power instructions include turning on the switch and the specified adapter connection text; registration paragraph removed from this section. |
| 12 | Performance comparison uses the requested sentence, with the missing initial I restored. |
| 13 | Workshop label is outside the photograph, above its left edge. |
| 14 | The third workshop photograph is captioned “Our instruments.” |
| 15 | Horizontal chapter navigation remains visible below the main header while scrolling. |
| 16 | Desktop chapters alternate text/media positions. Media is smaller; active live-action edits are rendered at 960 × 720 with their complete caption strips. Antenna and manufacturing animations retain 1280 × 720. Narrow screens use a readable single column. |
| 17 | Four bench photographs merged with the original hero carousel, with duplicate files removed. The original engineer photograph is retained, resulting in five unique photographs. No duplicate bench gallery below. |

## Layout corrections after preview feedback

- Product and story hero headlines scale with their own column and break between complete phrases.
- Shortened the home hardware headline; explicitly separated the three performance comparison phrases.
- Reduced large headings and balanced natural wrapping elsewhere.
- Replaced the cramped mobile outdoor antenna layout with a single column.
- Restored justified long paragraphs, widened story text columns, and removed their decorative inset.
- Reused the current built-in antenna artwork in the product mode selector.
- Restored Android band-check instructions and the full whip-antenna paragraph. Panel/ceiling placement notes are expandable.
- Removed a prototype photograph repeated in both the testing gallery and assembly sequence.

## Visual review after the second preview

Reviewed actual desktop and mobile section screenshots, including the home introduction, all six installation sections, product inventory, story prose, and FCC documentation.

- Grouped the home introduction's eyebrow and heading together; replaced the disconnected three-column arrangement with two columns.
- Changed the installation directory to three columns by two rows on desktop and a single list on phones, retaining all six labels.
- Gave installation sections consistent step headings and a single reading direction. Moved the signal-reading note into a supporting aside.
- Split step 1 into paragraphs without rewriting its instructions. AntennaSearch is now an underlined, working link.
- Replaced the oversized mounting image grid with sequential illustrated instruction rows. Original step wording and illustrations remain.
- Limited justified text to substantial reading columns; short descriptions and navigation use natural spacing.
- Changed mobile kit contents to an image-and-description list so copy has sufficient width.
- Changed the FCC verification link to the user-specified GenericSearchResult URL and made it legible at normal link size.
- Verified both external links by clicking them in the browser and observing the opened URLs. Checked 35 page/viewport combinations and the affected controls.

## Media provenance

Both public promotional MP4 files are byte-identical to the supplied clean master. SHA-256: `39d03ce26ed45b9d12530a2d42f640d3eccbffa8c7309ae24c37173316c2f8dc`.

The promotional poster and external/dual mode illustrations were regenerated from that master. The client-supplied product and installation images are used directly. Source artwork and workshop photos are retained; unused legacy assets are not loaded by the affected sections.


## September 25 publication review

- Rechecked all 17 revision slides and the current brochure, including the 5/3/5 mounting sequences and all four indoor antenna options.
- Captured all five pages at 1440, 768 and 390 px: 135 section screenshots, plus expanded controls, dialogs and FAQ states. Reviewed every page section visually; checked text bounds and image loading at seven widths from 320 to 1440 px.
- Edited installation English, clarified indoor overhead mounting, restored readable live-text phone instructions, and made the original diagrams zoomable.
- Added the brochure's public contact address, corrected the report download size to 31 MB, and clarified the 5 V adapter instruction.
- Retained justified desktop reading columns. Phone prose uses natural left alignment to avoid excessive word spacing.
- Simplified the story introduction, used compact mobile photo galleries, and corrected tablet headline wrapping.
- Re-rendered the active live-action story films without side bars or clipped captions; preserved each soundtrack. Verified playback and seeking of all seven videos used on the site.
- The owner confirmed amplifier gain above 70 dB, coverage above 2,500 sq ft, and halved indoor-equipment installation time. The specification panel retains 70 dB+ as the manufacturer specification and separately links the FCC measurements. Antenna gain is not presented as amplifier gain.
- At the owner's explicit instruction, the 44-second promotional master remains unchanged: both public MP4 copies have the same SHA-256 as the supplied clean master.
- AntennaSearch opens the requested destination. FCC verification points to the owner's requested GenericSearchResult URL; an automated remote fetch returned 403, so remote FCC content is not claimed as independently verified. The local grant and complete report open successfully.
- Production build, lint, all 35 page/width combinations, anchors, mounting and antenna selectors, carousel, zoom, keyboard controls and mocked signup failure/retry/success checks passed. No live signup was submitted. No deployment or push was performed.
