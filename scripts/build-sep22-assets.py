"""Prepare the supplied September 22 stills; no generated product or test imagery."""
from pathlib import Path
import subprocess
import zipfile
import fitz

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path('/Users/galaxy/Desktop/plidepli_growth/素材')
OUT = ROOT / 'public/story-edits/revision-sep22'
OUT.mkdir(parents=True, exist_ok=True)

def run(*args):
    subprocess.run([str(a) for a in args], check=True, stdout=subprocess.DEVNULL)

def photo(folder, filename, target):
    source = next(SOURCE.glob(folder + '*')) / filename
    run('cwebp', '-quiet', '-q', '88', '-resize', '1600', '0', source, '-o', OUT / target)

photo('03_', '微信图片_2026-09-13_094438_282.jpg', 'enclosure-side.webp')
photo('04_', '微信图片_2026-09-13_094508_632.jpg', 'board-evolution.webp')
photo('04_', '微信图片_2026-09-13_094651_082.jpg', 'populated-board.webp')
photo('05_', '微信图片_2026-09-13_094733_481.jpg', 'open-assembly.webp')
photo('01_', '微信图片_2026-09-13_094211_851.jpg', 'engineer.webp')

with zipfile.ZipFile(ROOT / '网站修改 2026-9-22.pptx') as deck:
    reference = Path('/tmp/plidepli-internal-reference.png')
    reference.write_bytes(deck.read('ppt/media/image21.png'))
    run('cwebp', '-quiet', '-q', '90', reference, '-o', ROOT / 'public/product/mode-internal.webp')

for mode, timestamp in [('external', 22), ('dual', 24.5)]:
    run('ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-ss', timestamp,
        '-i', ROOT / 'public/video/promo.mp4', '-frames:v', '1',
        '-vf', 'crop=iw:ih*0.8:0:0,scale=1280:-1', '/tmp/plidepli-mode.png')
    run('cwebp', '-quiet', '-q', '88', '/tmp/plidepli-mode.png', '-o', ROOT / f'public/product/mode-{mode}.webp')

run('ffmpeg', '-hide_banner', '-loglevel', 'error', '-y',
    '-i', ROOT / 'public/product/kit.webp', '-frames:v', '1',
    '-vf', 'crop=250:98:175:600,pad=340:240:45:71:white', '/tmp/plidepli-cable.png')
run('cwebp', '-quiet', '-q', '92', '/tmp/plidepli-cable.png', '-o', ROOT / 'public/product/outdoor-cable.webp')

run('ffmpeg', '-hide_banner', '-loglevel', 'error', '-y',
    '-i', next(SOURCE.glob('03_*')) / '微信图片_2026-09-13_094442_083.jpg',
    '-vf', 'crop=1712:1000:3940:3200,scale=1200:-1', '-frames:v', '1', '/tmp/plidepli-closed.png')
run('cwebp', '-quiet', '-q', '90', '/tmp/plidepli-closed.png', '-o', OUT / 'closed-prototype.webp')

grant = fitz.open(ROOT / 'public/fcc/fcc-grant.pdf')
grant[0].get_pixmap(matrix=fitz.Matrix(1.25, 1.25)).save('/tmp/plidepli-grant-preview.png')
run('cwebp', '-quiet', '-q', '90', '/tmp/plidepli-grant-preview.png', '-o', ROOT / 'public/fcc/grant-preview.webp')
