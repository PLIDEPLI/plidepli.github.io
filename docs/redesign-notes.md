# PLIDEPLI landing page — September 2026

## Design direction

All four pages open on the same cool-paper surface, with ink headings and muted supporting copy. The homepage's separate silver gradient and decorative rings have been removed. Navy anchors the shared navigation, launch sections, selected evidence sections and footer; mint identifies launch actions and signal details. The white-background kit render blends into the shared surface without changing the source artwork. Navigation includes Home and a single active-page indicator on every page.

The setup overview uses a wide AI-restyled version of the user's house diagram with three HTML steps and enlargement. The homepage team section uses the requested workbench introduction, a 30-second edit from the two specified tuning videos, and one specified workbench photograph. See `home-bench-assets.md` and `simple-setup-image.md` for provenance.

Cross-page fragment navigation now runs after React mounts and again when fonts and initial loading settle. Initial corrections stop on user interaction. Browser checks verify the actual FCC section position below the sticky navigation after arriving from each subpage and refreshing, on desktop and mobile.

An independent hardware team inviting its first supporters into the workshop. The supplied complete-kit rendering leads the homepage; the engineering story explains why the product exists and what support will fund.

- Deep navy `#071E2D`: navigation, launch section and primary structure.
- Ink `#123044`: readable headings and text on light backgrounds.
- Cool paper `#F3F7F9`: every page's opening section, product surfaces and supporting sections. White `#FFFFFF`: reading sections.
- Signal mint `#30D8B7`: launch action and small signal details.
- Muted blue `#607684`: supporting text.
- Space Grotesk for headings and Inter for body text, self-hosted Latin fonts only.
- Left-aligned copy; two-column product and evidence layouts; genuine workshop photography.

The distinguishing feature is the actual hardware and people. The installation diagram and real photographs can be enlarged. No autoplay, animated ticker, artificial before/after readings, or hidden scroll-reveal content.

## Pages and content

- `/`: complete-kit hero, target price and signup; everyday use; product details and page links; installation overview; illustrative cabin scene; existing product film; team story and full-journal link; FCC documents, milestones, FAQ and signup.
- `/product/`: five-view enlarged gallery, built-in antenna cutaway, three selectable antenna modes, component gallery and suitability checks.
- `/stories/`: a polished founder origin story, seven chapters, a persistent desktop chapter directory, 27 selected images and seven 30-second films. Videos load on request; starting a film pauses the others. Images include clearly labelled workshop photographs, video frames.
- `/installation/`: planning overview, outdoor antenna, selectable wall (5 steps), pole/rail (3 steps) and overhead (5 steps) mounting render sequences, image enlargement and connection checks.

Each address has a real generated HTML entry with its own title, description, canonical and sharing metadata. Navigation works with direct links and page refresh on GitHub Pages, without a router rewrite dependency.

Original source media are preserved. The journal now presents a curated selection with no more than six images per chapter. Eight 30-second edits (including the homepage) use distinct original instrumental scores selected for each scene; source audio is removed. The promotional film retains its original picture and watermark; its soundtrack now uses the same calm, cheerful country/electronic direction as the story films. The untouched original remains archived. See `story-media-editing.md` for the edit plan and provenance.

The new product illustrations are WebP copies of the supplied renders, preserving their appearance and keeping the originals untouched. `docs/product-assets.json` maps the files. `public/product/kit.webp` comes from `渲染导出/散图/1.png`, the exact kit image selected by the user. One AI-generated cabin photograph provides a lifestyle banner and is labelled as an illustrative scene; it is not customer evidence. Its provenance and exact prompt are in `docs/image-generation.md`.

## Evidence used

Source folder: the Desktop folder beginning with `AiTDG-260730002`.

- `FCC-2BWMS-L5-5B-2006,Grant-B2W.pdf`: authorization ID, legal grantee and grant date, August 19, 2026. Copied without modification to `public/fcc/fcc-grant.pdf`.
- `AiTDG-260730002FW1_FCC Test Report_Part 20.pdf`, p. 6: fixed booster classification, 5V adapter and supported frequency ranges.
- Same report, p. 18: listed amplifier gain measurements span 61.27–64.69 dB across tested bands, signal types and directions. The page reports this range and identifies its source; it does not describe 70 dB as an FCC-measured system gain.
- Full 85-page report copied without modification to `public/fcc/fcc-test-report.pdf` (approximately 29.5 MiB), loaded only when its link is opened.
- Existing project content: built-in antenna, external/dual modes, USB-C input, aluminum prototypes, injection-molding plans and approximately $275 target price.

Home coverage and RSRP/speed improvements are not inferred from laboratory compliance tests. The old 2,500 sq. ft. headline and broad half-price comparison were removed. Carrier compatibility is qualified by local band usage.

## Content to finalize before the campaign

- Actual home before/after measurements, with phone, carrier, band, placement and test conditions.
- Final kit contents, accessory options, campaign price, delivery estimates and warranty terms.
- Public support email: set `VITE_CONTACT_EMAIL` locally and as a repository Actions variable. Contact links appear only when an address is supplied.
- Replace the promotional film when the final version is ready. Its embedded gain, carrier and coverage statements should be reviewed along with the replacement video.
- The supplied manual contains legacy references to another brand/site and inconsistent antenna separation wording. It is not published as the customer-facing installation guide. Confirm the final instructions with the certification provider. The grant's notes use “Mobile” while the test report classifies the device as “Fixed”; the page conservatively stays with fixed home/cabin installations pending clarification.

## Validation

Build and lint checks; production Chromium layout checks for all four pages at 320, 390, 768, 860, 900, 960, 1024 and 1440px; consistent hero colors; Home and FCC navigation from all subpages on desktop and mobile; direct-page loads, refresh, metadata and anchors; full media counts and video playback; product galleries and all three antenna modes; all three mounting sequences; photo viewer and keyboard controls; privacy dialog and Escape; document URLs; mocked Formspree error/retry/success. No test emails submitted to the live endpoint. No browser page errors or missing assets were observed.

Screenshots and a verification summary are stored outside the repository in `~/Desktop/plidepli-preview/`. The existing GitHub Actions workflow deploys when pushed to `main`.
