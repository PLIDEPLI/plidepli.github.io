"""Build documentary story edits from untouched source files using FFmpeg.
Photo files are only selected, resized and converted with cwebp; editorial crops live in CSS.
All video source audio is discarded. The soundtrack is synthesized from the score below.
"""
from pathlib import Path
import argparse, json, math, os, subprocess, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[1]
WORK=Path('/tmp/plidepli-media-review')
OUT=ROOT/'public/story-edits'
WORK.mkdir(exist_ok=True)
SOURCE_ROOT=Path(os.environ.get('PLIDEPLI_MEDIA_ROOT',str(Path.home()/'Desktop/plidepli_growth/素材')))
CHAPTER_NAMES={'01':'bench','02':'debugging','03':'enclosure','04':'pcb','05':'antenna','06':'onoff','07':'manufacturing'}
SOURCES={CHAPTER_NAMES[folder.name[:2]]:{'photos':[str(p) for p in sorted(folder.glob('*.jpg'))], 'videos':[{'path':str(p)} for p in sorted(folder.glob('*.mp4'))]} for folder in sorted(SOURCE_ROOT.iterdir()) if folder.is_dir() and folder.name[:2] in CHAPTER_NAMES}
OUT.mkdir(exist_ok=True)
FONT='/System/Library/Fonts/Supplemental/Arial.ttf'
BOLD='/System/Library/Fonts/Supplemental/Arial Bold.ttf'

def run(args):
 subprocess.run(args,check=True,stdout=subprocess.DEVNULL)

def photo(c,n,caption,position='50% 50%'):
 return {'source':SOURCES[c]['photos'][n-1],'caption':caption,'kind':'Workshop photograph','position':position}
def still(c,n,t,caption):
 return {'source':SOURCES[c]['videos'][n-1]['path'],'time':t,'caption':caption,'kind':'Frame from workshop footage','position':'50% 50%'}
def render(name,caption):
 return {'source':str(ROOT/f'public/product/{name}.webp'),'caption':caption,'kind':'Product rendering','position':'50% 50%'}
def v(c,n,start,duration,label,rotate=False):
 return {'source':SOURCES[c]['videos'][n-1]['path'],'start':start,'duration':duration,'label':label,'rotate':rotate,'kind':'video'}
def p(chapter,n,duration,label):
 return {'photo':n,'duration':duration,'label':label,'kind':'photo','chapter':chapter}

PLAN={
 'bench': {'title':'The bench','photos':[
  photo('bench',15,'The workspace we are making our own.'),photo('bench',8,'An engineer at the RF workbench.'),photo('bench',7,'The instruments behind the daily work.'),photo('bench',3,'Another view of the workshop.'),photo('bench',12,'Parts and prototypes between revisions.'),photo('bench',2,'Components kept within reach.')],
  'shots':[v('bench',1,2,10,'A walk through our workspace'),v('bench',1,12,10,'The instruments we work with'),v('bench',1,22,10,'Where PLIDEPLI takes shape')]},
 'debugging': {'title':'Debugging','photos':[
  photo('debugging',3,'Checking the board at the bench.'),photo('debugging',5,'A component adjustment in progress.'),photo('debugging',2,'The prototype connected to the test setup.')],
  'shots':[v('debugging',7,2,5,'Start at the bench'),v('debugging',6,1,7,'Make the adjustment'),v('debugging',5,1,6,'Check the setup'),v('debugging',5,13,6,'Return to the board'),v('debugging',5,22,6,'Back to the instruments')]},
 'enclosure': {'title':'The enclosure','photos':[
  photo('enclosure',3,'Enclosure prototypes compared side by side.'),photo('enclosure',7,'Comparing the shape and mechanical details.'),render('booster','The intended production design. Product rendering.')],
  'shots':[p('enclosure',1,5,'Several versions, one evolving design'),v('enclosure',2,.1,7,'Comparing the prototypes'),v('enclosure',3,.2,8,'Looking at the form and fit',True),v('enclosure',4,.1,4,'The enclosure alongside the board',True),p('enclosure',3,6,'The production design | rendering')]},
 'pcb': {'title':'The boards','photos':[
  photo('pcb',3,'Circuit board panels before assembly.'),photo('pcb',6,'A board fitted inside its metal frame.'),photo('pcb',7,'Inside the prototype, with shielding and antenna components.')],
  'shots':[p('pcb',1,6,'Board panels | workshop photograph'),v('debugging',9,.1,6,'Boards and prototypes on the bench',True),v('debugging',10,0,3,'Another stage of the build',True),p('pcb',2,7,'The assembled board | workshop photograph'),p('pcb',3,8,'Inside the prototype | workshop photograph')]},
 'antenna': {'title':'The antenna','photos':[
  photo('antenna',6,'The antenna and RF test setup.'),photo('antenna',4,'Antenna components alongside the prototype.'),photo('antenna',9,'The integrated antenna inside the housing.'),photo('antenna',3,'A network-analyzer reading from development.'),photo('antenna',7,'A closer look at the matching measurements.'),photo('antenna',8,'Another measurement from the tuning process.')],
  'shots':[p('antenna',2,5,'Start with the antenna'),v('antenna',1,7,7,'Connect it to the RF setup'),v('antenna',1,17,6,'Adjust and inspect'),v('antenna',2,0,3,'Read the instruments'),p('antenna',4,4,'Matching study | workshop photograph'),p('antenna',5,5,'Antenna development continues')]},
 'onoff': {'title':'Testing in progress','photos':[
  still('onoff',1,8,'Working on the prototype at the test bench.'),still('onoff',2,7,'Adjusting the test setup.'),still('onoff',4,118,'Checking the instruments during development.')],
  'shots':[v('onoff',1,3,7,'Bench checks in progress'),v('onoff',2,2,7,'Adjusting the setup'),v('onoff',4,108,8,'Returning to the instruments'),v('onoff',4,177,8,'Controlled home comparisons come next')]},
 'manufacturing': {'title':'Making the next batch','photos':[
  still('manufacturing',4,3,'Working with a solder-paste printing stencil.'),still('manufacturing',5,8,'Assembling the board and shielding.'),photo('manufacturing',1,'Formed metal parts from the development work.')],
  'shots':[v('manufacturing',4,.1,6.5,'Solder-paste printing'),v('manufacturing',1,5,6,'Work at the assembly bench'),v('manufacturing',5,1,8,'Fitting the board and shielding',True),v('manufacturing',2,.1,4.5,'Inspecting the assembly',True),p('manufacturing',3,5,'Mechanical parts | workshop photograph')]},
 'home': {'title':'At the tuning bench','photos':[],
  'shots':[v('debugging',6,1,8,'A component adjustment'),v('debugging',5,0,7,'Checking the setup'),v('debugging',5,10,7,'A closer look at the board'),v('debugging',5,21,8,'Back to the instruments')]},
}

def soundtrack():
 """An original 96 BPM, 12-bar instrumental score: pads, bass, plucks and soft percussion."""
 sr=48000;dur=30;beat=60/96;t=np.arange(sr*dur)/sr
 mix=np.zeros((len(t),2));rng=np.random.default_rng(719)
 def add(start,length,freq,amp,style='pluck',pan=0):
  a=int(start*sr);b=min(len(t),a+int(length*sr));x=np.arange(b-a)/sr
  if b<=a:return
  if style=='pad':
   env=np.minimum(x/.55,1)*np.minimum((length-x)/.8,1)
   sig=(np.sin(2*np.pi*freq*x)+.23*np.sin(2*np.pi*freq*2*x)+.12*np.sin(2*np.pi*(freq*1.003)*x))*env
  elif style=='bass':sig=np.sin(2*np.pi*freq*x)*(1-np.exp(-x*45))*np.exp(-x*2.8)
  else:sig=(np.sin(2*np.pi*freq*x)+.22*np.sin(2*np.pi*freq*2*x)+.08*np.sin(2*np.pi*freq*3*x))*(1-np.exp(-x*180))*np.exp(-x*5.5)
  mix[a:b,0]+=sig*amp*math.sqrt((1-pan)/2);mix[a:b,1]+=sig*amp*math.sqrt((1+pan)/2)
 def hz(m):return 440*2**((m-69)/12)
 chords=[[48,55,59,64],[45,52,55,60],[41,48,52,57],[43,50,57,62]]
 for bar in range(12):
  chord=chords[bar%4];start=bar*4*beat
  for note in chord:add(start,2.9,hz(note+12),.048,'pad')
  for k in [0,2]:add(start+k*beat,1.0,hz(chord[0]-12),.13,'bass')
  for k in range(8):
   note=chord[[0,2,1,3,2,1,3,2][k]]+24
   add(start+k*beat/2,.9,hz(note),.067,'pluck',(-.25 if k%2 else .25))
  if bar>0:
   for k in range(4):
    a=int((start+k*beat)*sr);n=min(int(.23*sr),len(t)-a);x=np.arange(n)/sr
    kick=np.sin(2*np.pi*(48*x+1.2*(1-np.exp(-x*35))))*np.exp(-x*24)*.055
    mix[a:a+n]+=kick[:,None]
   for k in range(8):
    a=int((start+k*beat/2)*sr);n=min(int(.07*sr),len(t)-a);x=np.arange(n)/sr
    noise=rng.normal(0,1,n);noise=np.r_[0,np.diff(noise)]*.006*np.exp(-x*65)
    mix[a:a+n]+=noise[:,None]
 fade=np.minimum(t/1.2,1)*np.minimum((dur-t)/2.2,1)
 mix*=fade[:,None];mix=np.tanh(mix)*.8
 wav=WORK/'workbench-score.wav'
 with wave.open(str(wav),'wb') as f:f.setnchannels(2);f.setsampwidth(2);f.setframerate(sr);f.writeframes((np.clip(mix,-1,1)*32767).astype('<i2').tobytes())
 run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(wav),'-af','loudnorm=I=-20:TP=-2:LRA=7','-ar','48000','-c:a','aac','-b:a','160k',str(OUT/'workbench-score.m4a')])

def export_photos(chapter,entry):
 dest=OUT/chapter;dest.mkdir(exist_ok=True)
 for i,item in enumerate(entry['photos'],1):
  src=Path(item['source'])
  if 'time' in item:
   src=WORK/f'{chapter}-photo-{i}.png'
   run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',str(item['time']),'-i',item['source'],'-frames:v','1',str(src)])
  with Image.open(src) as im:w,h=im.size
  scale=min(1,1600/max(w,h));ww,hh=round(w*scale),round(h*scale)
  target=dest/f'photo-{i}.webp'
  run(['cwebp','-quiet','-q','86','-resize',str(ww),str(hh),str(src),'-o',str(target)])
  item.update({'src':str(target.relative_to(ROOT/'public')),'width':ww,'height':hh})

def lower_third(chapter,title,label):
 image=Image.new('RGBA',(1280,720),(0,0,0,0));d=ImageDraw.Draw(image)
 d.rectangle((0,640,1280,720),fill='#071e2d');d.rectangle((36,664,39,698),fill='#30d8b7')
 d.text((55,652),title,font=ImageFont.truetype(BOLD,22),fill='#ffffff')
 d.text((55,682),label,font=ImageFont.truetype(FONT,17),fill='#b7ced8')
 d.text((1110,665),'PLIDEPLI',font=ImageFont.truetype(BOLD,23),fill='#ffffff')
 target=WORK/f'{chapter}-overlay-{abs(hash(label))}.png';image.save(target);return target

def film(chapter,entry):
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
 run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',str(listing),'-i',str(OUT/'workbench-score.m4a'),'-map','0:v:0','-map','1:a:0','-c:v','libx264','-preset','fast','-crf','23','-threads','2','-vf','fade=t=in:st=0:d=0.3,fade=t=out:st=29.5:d=0.5','-c:a','copy','-t','30','-movflags','+faststart','-map_metadata','-1',str(target)])
 png=WORK/f'{chapter}-poster.png'
 run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss','1','-i',str(target),'-frames:v','1',str(png)])
 run(['cwebp','-quiet','-q','84',str(png),'-o',str(dest/'poster.webp')])
 print('Rendered',chapter,flush=True)

if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--only',nargs='*');args=parser.parse_args()
 plan_file=ROOT/'docs/story-edit-plan.json'
 if plan_file.exists():PLAN=json.loads(plan_file.read_text())
 if not (OUT/'workbench-score.m4a').exists():soundtrack()
 for c,e in PLAN.items():export_photos(c,e)
 plan_file.write_text(json.dumps(PLAN,ensure_ascii=False,indent=2)+'\n')
 media={c:{'photos':[{'src':p['src'],'alt':p['caption'],'kind':p['kind'],'width':p['width'],'height':p['height'],'position':p['position']} for p in e['photos']], 'film':{'src':f'story-edits/{c}/film.mp4','poster':f'story-edits/{c}/poster.webp'}} for c,e in PLAN.items() if c!='home'}
 types='export type StoryPhoto = { src: string; alt: string; kind: string; width: number; height: number; position: string }\nexport type StoryFilm = { src: string; poster: string }\n'
 (ROOT/'src/story-media.ts').write_text(types+'export const STORY_MEDIA: Record<string, { photos: StoryPhoto[]; film: StoryFilm }> = '+json.dumps(media,ensure_ascii=False,indent=2)+'\n')
 import concurrent.futures
 jobs=[(c,e) for c,e in PLAN.items() if not args.only or c in args.only]
 with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:list(pool.map(lambda pair:film(*pair),jobs))
