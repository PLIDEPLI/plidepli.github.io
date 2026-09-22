"""Extract original embedded artwork from the supplied September brochure.

No redraw or retouching: the website colors the original logo alpha mask in CSS.
"""
from pathlib import Path
import base64
import fitz

ROOT = Path(__file__).resolve().parents[1]
document = fitz.open(ROOT / '画册 2026-9-22.pdf')

def extract(page_index, xref, filename):
    info = next(image for image in document[page_index].get_images() if image[0] == xref)
    pixmap = fitz.Pixmap(document, xref)
    if info[1]:
        pixmap = fitz.Pixmap(pixmap, fitz.Pixmap(document, info[1]))
    path = ROOT / 'public' / filename
    path.parent.mkdir(parents=True, exist_ok=True)
    pixmap.save(path)

extract(0, 1146, 'brand/plidepli-logo.png')
for xref, name in [(123, 'coaxial-cable'), (127, 'omni-antenna'), (131, 'panel-antenna'),
                   (135, 'ceiling-antenna'), (139, 'whip-antenna'),
                   (143, 'low-profile-antenna'), (147, 'outdoor-mast')]:
    extract(2, xref, f'brochure/{name}.png')
extract(11, 209, 'brochure/mode-selector.png')

# Use the orbit from the original mark as the small browser icon.
encoded = base64.b64encode((ROOT / 'public/brand/plidepli-logo.png').read_bytes()).decode()
(ROOT / 'public/favicon.svg').write_text(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#071e2d"/>
  <defs><filter id="mint"><feFlood flood-color="#30d8b7"/><feComposite in2="SourceAlpha" operator="in"/></filter></defs>
  <svg x="7" y="19" width="50" height="26" viewBox="230 24 185 79" overflow="hidden">
    <image width="754" height="195" href="data:image/png;base64,{encoded}" filter="url(#mint)"/>
  </svg>
</svg>\n''')
print('Extracted the original logo, seven accessory images and the mode-selector illustration.')
