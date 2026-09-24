"""Extract original embedded artwork from the supplied September 24 brochure.

No redraw or retouching: the website colors the original logo alpha mask in CSS.
"""
from pathlib import Path
import base64
import shutil
import fitz

ROOT = Path(__file__).resolve().parents[1]
document = fitz.open(ROOT / '画册 2026-9-24.pdf')

def extract(page_index, xref, filename):
    info = next(image for image in document[page_index].get_images() if image[0] == xref)
    pixmap = fitz.Pixmap(document, xref)
    if info[1]:
        pixmap = fitz.Pixmap(pixmap, fitz.Pixmap(document, info[1]))
    path = ROOT / 'public' / filename
    path.parent.mkdir(parents=True, exist_ok=True)
    pixmap.save(path)

extract(0, 1114, 'brand/plidepli-logo.png')
for xref, name in [(123, 'coaxial-cable'), (127, 'omni-antenna'), (131, 'panel-antenna'),
                   (135, 'ceiling-antenna'), (139, 'whip-antenna'),
                   (143, 'low-profile-antenna'), (147, 'outdoor-mast')]:
    extract(2, xref, f'brochure/{name}.png')
extract(12, 204, 'brochure/mode-selector.png')

# Installation references from the revised brochure.
extract(4, 156, 'brochure/before-getting-started.png')
extract(8, 166, 'brochure/omni-antenna-outline.png')
extract(8, 168, 'brochure/omni-antenna-install.png')
extract(8, 170, 'brochure/directional-antenna-outline.png')
extract(9, 174, 'brochure/outdoor-antenna-location.png')
extract(9, 176, 'brochure/directional-antenna-install.png')
extract(12, 202, 'brochure/indoor-antenna-options.png')
extract(13, 208, 'brochure/whip-antenna-install.png')
extract(14, 212, 'brochure/panel-antenna-install.png')

mounting_steps = {
    10: {
        185: 'wall-mark', 181: 'wall-anchor', 182: 'wall-bracket',
        183: 'wall-align', 184: 'wall-finished', 186: 'pole-bracket',
        188: 'pole-align', 190: 'pole-finished',
    },
    11: {
        194: 'ceiling-mark', 195: 'ceiling-anchor', 196: 'ceiling-bracket',
        197: 'ceiling-align', 198: 'ceiling-finished',
    },
}
for page_index, images in mounting_steps.items():
    for xref, name in images.items():
        extract(page_index, xref, f'product/{name}.png')

# The client supplied these two clean replacement images separately.
shutil.copyfile(ROOT / '网站更换图片' / 'The booster页面.png',
                ROOT / 'public/product/built-in-antenna-switch.png')
shutil.copyfile(ROOT / '网站更换图片' / 'installation页面.jpg',
                ROOT / 'public/brochure/selector-switch.jpg')

# Use the orbit from the original mark as the small browser icon.
encoded = base64.b64encode((ROOT / 'public/brand/plidepli-logo.png').read_bytes()).decode()
(ROOT / 'public/favicon.svg').write_text(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#071e2d"/>
  <defs><filter id="mint"><feFlood flood-color="#30d8b7"/><feComposite in2="SourceAlpha" operator="in"/></filter></defs>
  <svg x="7" y="19" width="50" height="26" viewBox="230 24 185 79" overflow="hidden">
    <image width="754" height="195" href="data:image/png;base64,{encoded}" filter="url(#mint)"/>
  </svg>
</svg>\n''')
print('Extracted revised brochure artwork and copied the two client replacement images.')
