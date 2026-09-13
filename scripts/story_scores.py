"""Original country/electronic instrumental scores, synthesized without recordings.

Warm plucked-string harmonics, gently sliding lead, alternating bass and brushed
percussion establish the country feel. Soft pads and short electronic arpeggios
add a restrained technology texture. These are synthesized instruments, not live
acoustic recordings. No third-party melodies, samples, or music are used.
"""
from pathlib import Path
import math, subprocess, wave
import numpy as np

MUSIC_VERSION = 'country-tech-4'
SCENES = {
 'bench': dict(title='A sunny workbench', mood='Calm, cheerful country picking with soft electronic air', bpm=80, root=43, progression=[0,5,0,7], picking=True, tech=.014, steel=.052, swing=.035, seed=111),
 'debugging': dict(title='Small steps, bright ideas', mood='Easy country rhythm and a light electronic pulse', bpm=92, root=50, progression=[0,5,7,0], picking=False, tech=.026, steel=.044, swing=.025, seed=123),
 'enclosure': dict(title='Shape of a good day', mood='Warm strummed strings with clear, gentle digital chimes', bpm=84, root=48, progression=[0,5,0,7], picking=False, tech=.018, steel=.050, swing=.04, seed=137),
 'pcb': dict(title='Little trails', mood='Country fingerpicking threaded with delicate electronic arpeggios', bpm=88, root=45, progression=[0,7,5,0], picking=True, tech=.028, steel=.041, swing=.025, seed=141),
 'antenna': dict(title='Across the open air', mood='Relaxed country strings, soft sliding lead, spacious synth', bpm=80, root=50, progression=[0,5,7,0], picking=True, tech=.017, steel=.055, swing=.04, seed=159),
 'onoff': dict(title='A little closer', mood='Quiet, positive country picking with a restrained electronic glow', bpm=80, root=48, progression=[0,5,0,7], picking=True, tech=.012, steel=.040, swing=.035, seed=167),
 'manufacturing': dict(title='Made with a smile', mood='Lighthearted country strumming and a steady, gentle electronic rhythm', bpm=96, root=43, progression=[0,5,7,0], picking=False, tech=.025, steel=.046, swing=.025, seed=179),
 'home': dict(title='Welcome to our workbench', mood='Welcoming country melody and warm, optimistic electronic textures', bpm=88, root=43, progression=[0,5,7,0], picking=False, tech=.017, steel=.061, swing=.035, seed=183),
 'promo': dict(title='A connection worth making', mood='Calm, cheerful country/electronic theme for the product introduction', bpm=88, root=50, progression=[0,5,7,0], picking=False, tech=.024, steel=.053, swing=.03, seed=197),
}

def compose(chapter, destination, work, duration=30):
 cfg=SCENES[chapter];sr=48000;count=round(sr*duration);beat=60/cfg['bpm']
 rng=np.random.default_rng(cfg['seed']);mix=np.zeros((count,2),dtype=np.float64)
 def hz(midi):return 440*2**((midi-69)/12)
 def place(start,signal,amp=1,pan=0):
  a=max(0,round(start*sr));n=min(len(signal),count-a)
  if n<=0:return
  mix[a:a+n,0]+=signal[:n]*amp*math.sqrt((1-pan)/2)
  mix[a:a+n,1]+=signal[:n]*amp*math.sqrt((1+pan)/2)
 def tone(start,length,midi,amp,kind='guitar',pan=0,slide=False):
  if start<0 or start>=duration-.5:return
  x=np.arange(min(round(length*sr),count-round(start*sr)))/sr
  f=hz(midi);phase=2*np.pi*f*x
  if kind=='guitar':
   # Inharmonic upper partials and frequency-dependent damping suggest plucked strings.
   sig=np.zeros_like(x)
   for h in range(1,16):
    strength=math.sin(math.pi*h*.21)/(h**1.15)
    sig+=strength*np.sin(phase*h*math.sqrt(1+.000018*h*h)+.04*h)*np.exp(-x*(1.3+.36*h))
   sig+=(.11*np.sin(2*np.pi*112*x)+.055*np.sin(2*np.pi*218*x))*np.exp(-x*18)
   sig*=1-np.exp(-x*800)
  elif kind=='steel':
   # Small portamento and slow vibrato soften the sustained, country-style lead.
   freq=f*(1-(.08 if slide else 0)*np.exp(-x*18))*(1+.0018*np.sin(2*np.pi*4.6*x)*np.minimum(x/.3,1))
   phase=2*np.pi*np.cumsum(freq)/sr
   sig=(np.sin(phase)+.24*np.sin(2*phase)+.08*np.sin(3*phase))*(1-np.exp(-x*25))*np.exp(-x*1.6)
  elif kind=='pad':
   env=np.minimum(x/.65,1)*np.clip((length-x)/.8,0,1)
   sig=(np.sin(phase)+.14*np.sin(phase*1.002)+.09*np.sin(phase*2))*env
  elif kind=='bass':
   sig=(np.sin(phase)+.19*np.sin(phase*2)+.04*np.sin(phase*3))*(1-np.exp(-x*100))*np.exp(-x*3.2)
  else:
   sig=np.sin(phase+.32*np.sin(phase*2)*np.exp(-x*7))*(1-np.exp(-x*200))*np.exp(-x*5)
  # Every individual voice releases smoothly, even before the master fade.
  sig*=np.clip((length-x)/.08,0,1)
  place(start,sig,amp,pan)
 def percussion(start,kind,amp,pan=0):
  length=.17 if kind=='brush' else .095;x=np.arange(round(length*sr))/sr
  noise=rng.normal(0,1,len(x))
  # Smooth the noise to keep the rhythm soft rather than metallic or hissy.
  soft=(noise+np.roll(noise,1)+np.roll(noise,2))/3
  if kind=='brush':sig=(soft*.8+.13*np.sin(2*np.pi*170*x))*np.exp(-x*28)*(1-np.exp(-x*800))
  else:sig=(noise-soft)*np.exp(-x*55)*(1-np.exp(-x*800))
  place(start,sig,amp,pan)
 motif=[2,1,2,3,2,1,0,1] if cfg['picking'] else [0,1,2,1,3,2,1,0]
 for bar in range(math.ceil((duration-2.5)/(4*beat))):
  start=bar*4*beat
  if start>duration-3:break
  root=cfg['root']+cfg['progression'][bar%4]
  if start>duration-7:root=cfg['root']+(7 if start<duration-4.5 else 0)
  chord=[root,root+7,root+12,root+16,root+19]
  for i,n in enumerate(chord[1:]):tone(start,4*beat+.6,n,.009,'pad',(i-1.5)*.18)
  for k in [0,2]:tone(start+k*beat,1.3,root-12+(7 if k==2 else 0),.12,'bass')
  # Alternating bass and a relaxed backbeat strum: the country rhythm foundation.
  for k in [1,3]:
   for i,n in enumerate(chord):
    tone(start+k*beat+i*.014+rng.uniform(-.006,.006),1.8,n,.061 if cfg['picking'] else .079,'guitar',-.23+i*.07)
   if bar>0:percussion(start+k*beat+.025,'brush',.017 if chapter!='onoff' else .010,-.1)
  for k in range(8):
   off=k*.5+(cfg['swing'] if k%2 else 0)
   n=chord[[2,3,4,3,1,3,4,2][(k+bar)%8]]
   tone(start+off*beat,1.5,n,.085 if cfg['picking'] else .040,'guitar',.24)
   if bar>0 and k%2:percussion(start+off*beat,'shaker',.009,.32)
  # Sparse digital notes share the harmony; they never dominate the acoustic part.
  for k in [1,3,5,7]:
   tone(start+k*.5*beat,1.2,chord[2+(k+bar)%3]+12,cfg['tech'],'digital',-.32)
  if bar%2==1 or chapter in ['home','promo']:
   melody=[root+12,root+16,root+19,root+21]
   for k in range(4):
    n=melody[motif[(bar*4+k)%len(motif)]]
    tone(start+(k+.1)*beat,1.4,n,cfg['steel'],'steel',.06,slide=k==0)
 # Resolve to the tonic, leave a short natural tail, and fade gently to silence.
 end=duration-2.7
 for i,n in enumerate([cfg['root'],cfg['root']+7,cfg['root']+12,cfg['root']+16,cfg['root']+19]):
  tone(end+i*.018,2.7,n,.085,'guitar',-.2+i*.08)
 tone(end+.12,2.4,cfg['root']+12,.045,'steel',0)
 # Short stereo reflections create space without a long, muddy reverberation.
 dry=mix.copy()
 for seconds,gain in [(.083,.10),(.137,.07),(.211,.045)]:
  shift=round(seconds*sr);mix[shift:]+=dry[:-shift,::-1]*gain
 t=np.arange(count)/sr
 mix*=np.minimum(t/.7,1)[:,None]*np.clip((duration-t)/1.4,0,1)[:,None]
 mix=np.tanh(mix)*.85
 work=Path(work);work.mkdir(parents=True,exist_ok=True)
 wav=work/f'{chapter}-{MUSIC_VERSION}.wav'
 with wave.open(str(wav),'wb') as f:
  f.setnchannels(2);f.setsampwidth(2);f.setframerate(sr)
  f.writeframes((np.clip(mix,-1,1)*32767).astype('<i2').tobytes())
 destination=Path(destination);destination.parent.mkdir(parents=True,exist_ok=True)
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(wav),'-af','loudnorm=I=-20:TP=-2:LRA=7','-ar','48000','-c:a','aac','-b:a','160k','-map_metadata','-1',str(destination)],check=True)
 return {**cfg,'style':'Calm, cheerful country + soft electronic','music_version':MUSIC_VERSION,'instrumentation':'Synthesized plucked strings, sliding lead, alternating bass, brushed percussion, soft pads and digital arpeggios'}
