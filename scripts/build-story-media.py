"""Build documentary story edits from untouched source files using FFmpeg.
Photo files are only selected, resized and converted with cwebp; editorial crops live in CSS.
All video source audio is discarded. Scene soundtracks are synthesized by story_scores.py.
"""
from pathlib import Path
import argparse, json, subprocess, sys
from story_scores import compose, MUSIC_VERSION
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[1]
WORK=Path('/tmp/plidepli-media-review')
OUT=ROOT/'public/story-edits'
WORK.mkdir(exist_ok=True)
OUT.mkdir(exist_ok=True)
FONT='/System/Library/Fonts/Supplemental/Arial.ttf'
BOLD='/System/Library/Fonts/Supplemental/Arial Bold.ttf'

def run(args):
 subprocess.run(args,check=True,stdout=subprocess.DEVNULL)

def export_photos(chapter,entry):
 dest=OUT/chapter;dest.mkdir(exist_ok=True)
 for i,item in enumerate(entry['photos'],1):
  src=Path(item['source'])
  if 'time' in item:
   src=WORK/f'{chapter}-photo-{i}.png'
   run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',str(item['time']),'-i',item['source'],*(['-vf','transpose=2'] if item.get('rotate') else []),'-frames:v','1',str(src)])
  with Image.open(src) as im:w,h=im.size
  scale=min(1,1600/max(w,h));ww,hh=round(w*scale),round(h*scale)
  target=dest/f'photo-{i}.webp'
  run(['cwebp','-quiet','-q','86','-resize',str(ww),str(hh),str(src),'-o',str(target)])
  item.update({'src':str(target.relative_to(ROOT/'public'))+('?v='+item['revision'] if item.get('revision') else '?v=frame-2' if chapter=='enclosure' and i==3 else ''),'width':ww,'height':hh})

def lower_third(chapter,title,label):
 image=Image.new('RGBA',(1280,720),(0,0,0,0));d=ImageDraw.Draw(image)
 d.rectangle((0,640,1280,720),fill='#071e2d');d.rectangle((36,664,39,698),fill='#30d8b7')
 d.text((55,652),title,font=ImageFont.truetype(BOLD,22),fill='#ffffff')
 d.text((55,682),label,font=ImageFont.truetype(FONT,17),fill='#b7ced8')
 d.text((1110,665),'PLIDEPLI',font=ImageFont.truetype(BOLD,23),fill='#ffffff')
 target=WORK/f'{chapter}-overlay-{abs(hash(label))}.png';image.save(target);return target

def film(chapter,entry):
 if entry.get('kind')=='animation':
  run([sys.executable,str(ROOT/entry['renderer'])]);return
 dest=OUT/chapter;dest.mkdir(exist_ok=True);parts=[]
 assert abs(sum(x['duration'] for x in entry['shots'])-30)<.001,chapter
 for i,shot in enumerate(entry['shots']):
  photo=shot['kind']=='photo'
  src=OUT/shot.get('chapter',chapter)/f"photo-{shot['photo']}.webp" if photo else Path(shot['source'])
  args=['ffmpeg','-hide_banner','-loglevel','error','-y']
  if photo:args+=['-loop','1','-framerate','30']
  else:args+=['-ss',str(shot['start'])]
  args+=['-i',str(src),'-i',str(lower_third(chapter,entry['title'],shot['label']))]
  rotate='transpose=2,' if shot.get('rotate') else ''
  filters=f'[0:v]{rotate}scale=1280:640:force_original_aspect_ratio=decrease:force_divisible_by=2,pad=1280:720:(ow-iw)/2:0:color=0x071e2d,setsar=1,fps=30,format=yuv420p[footage];[footage][1:v]overlay=0:0:format=auto,format=yuv420p[out]'
  target=WORK/f'{chapter}-part-{i}.mp4'
  args+=['-filter_complex',filters,'-filter_complex_threads','1','-map','[out]','-an','-t',str(shot['duration']),'-c:v','libx264','-preset','fast','-crf','23','-threads','2','-map_metadata','-1',str(target)]
  run(args);parts.append(target)
 listing=WORK/f'{chapter}-concat.txt';listing.write_text(''.join(f"file '{x}'\n" for x in parts))
 target=dest/'film.mp4'
 run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',str(listing),'-i',str(OUT/chapter/'score.m4a'),'-map','0:v:0','-map','1:a:0','-c:v','libx264','-preset','fast','-crf','23','-threads','2','-vf','fade=t=in:st=0:d=0.3,fade=t=out:st=29.5:d=0.5','-c:a','copy','-t','30','-movflags','+faststart','-map_metadata','-1',str(target)])
 png=WORK/f'{chapter}-poster.png'
 run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss','1','-i',str(target),'-frames:v','1',str(png)])
 run(['cwebp','-quiet','-q','84',str(png),'-o',str(dest/'poster.webp')])
 print('Rendered',chapter,flush=True)

if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--only',nargs='*');args=parser.parse_args()
 plan_file=ROOT/'docs/story-edit-plan.json'
 PLAN=json.loads(plan_file.read_text())
 for c in PLAN:
  if not (OUT/c/'score.m4a').exists():compose(c,OUT/c/'score.m4a',WORK)
 for c,e in PLAN.items():export_photos(c,e)
 plan_file.write_text(json.dumps(PLAN,ensure_ascii=False,indent=2)+'\n')
 media={c:{'photos':[{'src':p['src'],'alt':p['caption'],'kind':p['kind'],'width':p['width'],'height':p['height'],'position':p['position']} for p in e['photos']], 'film':{'src':f"story-edits/{c}/film.mp4?v={e.get('revision', 'scene-2')}&music={MUSIC_VERSION}",'poster':f"story-edits/{c}/poster.webp?v={e.get('revision', 'scene-2')}"}} for c,e in PLAN.items() if c!='home'}
 types='export type StoryPhoto = { src: string; alt: string; kind: string; width: number; height: number; position: string }\nexport type StoryFilm = { src: string; poster: string }\n'
 (ROOT/'src/story-media.ts').write_text(types+'export const STORY_MEDIA: Record<string, { photos: StoryPhoto[]; film: StoryFilm }> = '+json.dumps(media,ensure_ascii=False,indent=2)+'\n')
 import concurrent.futures
 jobs=[(c,e) for c,e in PLAN.items() if not args.only or c in args.only]
 with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:list(pool.map(lambda pair:film(*pair),jobs))
