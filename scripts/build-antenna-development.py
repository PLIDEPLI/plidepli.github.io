"""Original 30-second geometry explainer + the team's actual copper-foil footage.

The first three scenes are qualitative diagrams, not simulated/measured VSWR.
The fourth uses the verified antenna-tuning clip, without its original audio.
"""
from pathlib import Path
import importlib.util
import subprocess
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/story-edits/revision-sep22'
TMP = Path('/tmp/plidepli-antenna-development')
TMP.mkdir(exist_ok=True)
OUT.mkdir(exist_ok=True, parents=True)
spec = importlib.util.spec_from_file_location('geometry', ROOT / 'scripts/build-process-animation.py')
geometry = importlib.util.module_from_spec(spec)
spec.loader.exec_module(geometry)
W, H, FPS = 1280, 720, 24
TITLES = ['Start without a ground plate', 'Add the ground structure', 'Bring the height down', 'Refine the copper and ground']
SUBS = [
    ['The first antenna had high VSWR: a poor match.', 'The ground structure became part of the design.'],
    ['Adding a ground plate improved VSWR.', 'The antenna and its surroundings work together.'],
    ['A thinner enclosure meant lowering the antenna.', 'That changed the geometry — and worsened the match.'],
    ['Copper-foil adjustment and ground-topology tuning.', 'A good match restored in a thinner profile.'],
]

def diagram(t):
    index = min(2, int(t / 6))
    local = t % 6
    s = geometry.Scene()
    s.cx = 390
    s.cy = 430
    s.text((64,38), 'Plidépli / Antenna development', 23, geometry.INK, True)
    s.text((1216,42), 'Simplified geometry · Not measured data', 17, '#a8c2d1', anchor='ra')
    s.text((64,102), TITLES[index], 42, geometry.INK, True)
    # The PCB and radiating element are deliberately schematic, not product CAD.
    s.box(-120,-70,20,240,140,7, geometry.GREEN)
    height = 105 if index < 2 else 105 - 60 * geometry.ease(local / 2)
    if index >= 1:
        s.box(-135,-85,5,270,170,5, geometry.SILVER)
    s.box(-45,-35,height,90,70,3, geometry.COPPER)
    s.line([s.point(0,0,27),s.point(0,0,height)], '#cde5eb', 4)
    # Dimension arrows show relative height only; no fabricated dimensions.
    a, b = s.point(145,0,27), s.point(145,0,height)
    s.line([a,b], geometry.MINT, 2)
    for x,y in [a,b]: s.line([(x-7,y),(x+7,y)], geometry.MINT, 2)
    s.text((740,287), ['INITIAL DESIGN', 'A BETTER MATCH', 'A NEW TRADE-OFF'][index], 19, geometry.MINT, True)
    lines = SUBS[index]
    # Short fixed lines preserve readable captions on mobile.
    details = [
        ['No ground plate.', 'Poor antenna matching.', 'Time to revisit the structure.'],
        ['Ground plate added.', 'Matching improved.', 'One step closer to the goal.'],
        ['Less room above the board.', 'A lower antenna changed the match.', 'Thickness and RF must be tuned together.'],
    ][index]
    for j,line in enumerate(details): s.text((740,337+j*42),line,21,'#d5e6ee')
    s.text((64,537), lines[0], 25, geometry.INK)
    s.text((64,574), lines[1], 23, '#a8c2d1')
    for i,label in enumerate(['No ground plate','Add ground','Lower the antenna','Copper-foil tuning']):
        x=64+i*296
        s.rect((x,640,x+264,644),geometry.MINT if i<=index else '#284a5d',2)
        s.text((x,661),f'0{i+1}  {label}',17,geometry.INK if i==index else '#a8c2d1')
    return s.im.resize((W,H),Image.Resampling.LANCZOS)

def run(*args): subprocess.run([str(a) for a in args], check=True)

# Burned-in captions make the design logic visible without enabling a subtitle track.
process = subprocess.Popen(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s','1280x720','-r',str(FPS),'-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p',str(TMP/'diagrams.mp4')], stdin=subprocess.PIPE)
try:
    for i in range(18*FPS):
        process.stdin.write(diagram(i/FPS).tobytes())
        if i % (6*FPS) == 0: print(f'Animation stage {i//(6*FPS)+1}/3', flush=True)
finally: process.stdin.close()
if process.wait(): raise RuntimeError('Diagram encoding failed')
diagram(9).save(OUT/'antenna-poster.webp',quality=88)
for i in range(3): diagram(i*6+3).save(TMP/f'stage-{i+1}.png')

# Transparent text overlay: no retouching of the original test equipment or hardware.
overlay = Image.new('RGBA',(W,H),(0,0,0,0))
d=ImageDraw.Draw(overlay)
font_path='/System/Library/Fonts/Supplemental/Arial.ttf'
bold_path='/System/Library/Fonts/Supplemental/Arial Bold.ttf'
d.rectangle((0,0,W,100),fill=(7,30,45,235))
d.text((40,24),'04 / Refine the copper and ground',font=ImageFont.truetype(bold_path,34),fill='white')
d.text((40,67),'Real antenna-tuning footage from our workshop',font=ImageFont.truetype(font_path,18),fill='#bcd8e4')
d.rectangle((0,604,W,H),fill=(7,30,45,242))
d.text((40,627),SUBS[3][0],font=ImageFont.truetype(font_path,27),fill='white')
d.text((40,670),SUBS[3][1],font=ImageFont.truetype(font_path,24),fill='#bcd8e4')
overlay.save(TMP/'captions.png')
source=Path('/Users/galaxy/Desktop/plidepli_growth/素材/07_制作过程/微信视频2026-09-13_094737_747.mp4')
run('ffmpeg','-hide_banner','-loglevel','error','-y','-ss','1','-i',source,'-loop','1','-i',TMP/'captions.png','-filter_complex','[0:v]transpose=cclock,scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24,setsar=1[v];[v][1:v]overlay=0:0[out]','-map','[out]','-an','-t','12','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p',TMP/'tuning.mp4')
(TMP/'concat.txt').write_text("file 'diagrams.mp4'\nfile 'tuning.mp4'\n")
run('ffmpeg','-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',TMP/'concat.txt','-i',ROOT/'public/story-edits/antenna/score.m4a','-map','0:v','-map','1:a','-c:v','copy','-c:a','aac','-b:a','160k','-af','afade=t=in:d=0.5,afade=t=out:st=28.5:d=1.5','-t','30','-movflags','+faststart','-map_metadata','-1',OUT/'antenna-development.mp4')
print('Antenna film complete: 18s explanation + 12s real tuning, original country/technology score.',flush=True)
