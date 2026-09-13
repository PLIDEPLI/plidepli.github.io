"""Original instrumental scene scores, synthesized locally without external recordings."""
from pathlib import Path
import json, math, subprocess, wave
import numpy as np

SCENES = {
 'bench': dict(title='Open windows', mood='Warm, spacious workshop introduction', bpm=72, instrument='keys', rhythm='ambient', step=1.5, notes=[0,2,1,3,1,2], chords=[[48,55,59,62],[53,60,64,67],[45,52,55,59],[43,50,55,57]], pad=.08, melody=.08, bass=.075, seed=11),
 'debugging': dict(title='Measure and refine', mood='Focused electronic pulse for repeated adjustments', bpm=112, instrument='pluck', rhythm='pulse', step=.5, notes=[0,1,2,1,3,2,1,2], chords=[[50,57,60,64],[46,53,57,60],[53,60,64,67],[48,55,58,62]], pad=.035, melody=.067, bass=.13, seed=23),
 'enclosure': dict(title='Form and light', mood='Airy electric keys and soft chimes for shape and detail', bpm=90, instrument='bell', rhythm='shimmer', step=1, notes=[0,3,2,1,2,3,1,2], chords=[[50,57,61,64],[45,52,57,59],[47,54,57,61],[43,50,54,57]], pad=.05, melody=.09, bass=.065, seed=37),
 'pcb': dict(title='Traces', mood='Precise arpeggios that echo a circuit layout', bpm=104, instrument='digital', rhythm='ticks', step=.5, notes=[0,2,1,3,2,0,3,1], chords=[[45,52,55,59],[41,48,52,55],[48,55,59,62],[43,50,55,57]], pad=.025, melody=.075, bass=.10, seed=41),
 'antenna': dict(title='Resonance', mood='Slow ambient layers and rounded resonant tones', bpm=80, instrument='bell', rhythm='ambient', step=2, notes=[0,2,3,1,2,0], chords=[[40,47,50,54],[48,55,59,62],[43,50,54,57],[38,45,50,52]], pad=.105, melody=.075, bass=.05, seed=59),
 'onoff': dict(title='Careful steps', mood='Sparse, restrained keys for testing still in progress', bpm=68, instrument='felt', rhythm='minimal', step=2, notes=[0,1,3,2,1,0], chords=[[50,57,60,64],[43,50,53,57],[46,53,57,60],[45,52,57,59]], pad=.025, melody=.11, bass=.055, seed=67),
 'manufacturing': dict(title='The next batch', mood='Steady forward rhythm for printing and assembly', bpm=120, instrument='pluck', rhythm='drive', step=.5, notes=[0,0,2,1,0,3,2,1], chords=[[43,50,53,57],[39,46,50,53],[46,53,57,60],[41,48,53,55]], pad=.035, melody=.06, bass=.15, seed=79),
 'home': dict(title='Starting something', mood='Warm, optimistic melodic introduction to the team', bpm=100, instrument='keys', rhythm='warm', step=.75, notes=[0,2,3,2,1,3,2,1], chords=[[52,59,63,66],[49,56,59,63],[45,52,56,59],[47,54,59,61]], pad=.06, melody=.09, bass=.105, seed=83),
}

def compose(chapter, destination, work):
 cfg=SCENES[chapter];sr=48000;duration=30;count=sr*duration
 mix=np.zeros((count,2),dtype=np.float64);rng=np.random.default_rng(cfg['seed']);beat=60/cfg['bpm']
 def hz(midi):return 440*2**((midi-69)/12)
 def place(start, signal, pan=0):
  a=max(0,int(start*sr));n=min(len(signal),count-a)
  if n<=0:return
  mix[a:a+n,0]+=signal[:n]*math.sqrt((1-pan)/2);mix[a:a+n,1]+=signal[:n]*math.sqrt((1+pan)/2)
 def tone(start,length,midi,amp,kind,pan=0):
  if start>=duration:return
  x=np.arange(min(int(length*sr),count-int(start*sr)))/sr;f=hz(midi);phase=2*np.pi*f*x
  attack=1-np.exp(-x*(18 if kind=='pad' else 130))
  if kind=='pad':
   env=np.minimum(x/.65,1)*np.minimum((length-x)/.95,1)
   sig=(np.sin(phase)+.18*np.sin(phase*2)+.12*np.sin(phase*1.002))*env
  elif kind=='bass':sig=(np.sin(phase)+.13*np.sin(phase*2))*attack*np.exp(-x*3)
  elif kind=='bell':sig=np.sin(phase+1.7*np.sin(phase*2)*np.exp(-x*3.3))*attack*np.exp(-x*2.2)
  elif kind=='digital':sig=(np.sin(phase)+.32*np.sin(phase*2)+.12*np.sin(phase*4))*attack*np.exp(-x*7)
  elif kind=='pluck':sig=(np.sin(phase)+.26*np.sin(phase*2)+.10*np.sin(phase*3))*attack*np.exp(-x*5.5)
  elif kind=='felt':sig=(np.sin(phase)+.10*np.sin(phase*2)+.025*np.sin(phase*3))*attack*np.exp(-x*2.5)
  else:sig=(np.sin(phase+.35*np.sin(phase*2)*np.exp(-x*4))+.12*np.sin(phase*3))*attack*np.exp(-x*2.7)
  place(start,sig*amp,pan)
 def drum(start,kind,amp,pan=0):
  n=int((.25 if kind=='kick' else .12)*sr);x=np.arange(n)/sr
  if kind=='kick':sig=np.sin(2*np.pi*(46*x+1.3*(1-np.exp(-x*35))))*np.exp(-x*23)
  else:
   noise=rng.normal(0,1,n);noise=np.r_[0,np.diff(noise)]
   sig=noise*np.exp(-x*(65 if kind=='hat' else 35))
   if kind=='snare':sig=.45*sig+.3*np.sin(2*np.pi*180*x)*np.exp(-x*32)
  place(start,sig*amp,pan)
 bars=math.ceil(duration/(4*beat))
 for bar in range(bars):
  start=bar*4*beat;chord=cfg['chords'][bar%4] if start<25 else cfg['chords'][0]
  for i,note in enumerate(chord):tone(start,4*beat+.8,note+12,cfg['pad']/3,'pad',(i-1.5)*.12)
  bass_beats=[0,1.5,2,3.5] if cfg['rhythm']=='drive' else ([0,2] if cfg['rhythm'] in ['pulse','ticks','warm'] else [0])
  for offset in bass_beats:tone(start+offset*beat,1.25,chord[0]-12,cfg['bass'],'bass')
  offsets=np.arange(0,4,cfg['step'])
  for k,offset in enumerate(offsets):
   index=cfg['notes'][(k+bar*len(offsets))%len(cfg['notes'])]
   register=12 if cfg['instrument']=='felt' else 24
   tone(start+offset*beat,1.8,chord[index]+register,cfg['melody']*(.85 if k%2 else 1),cfg['instrument'],(-.3 if k%2 else .3))
  # The home cue has a separate upper melody rather than only an arpeggio.
  if chapter=='home':
   for k,note in enumerate([chord[0]+24,chord[2]+12,chord[1]+24,chord[3]+12]):tone(start+k*beat+.15,1.3,note,.047,'bell',.1)
  if bar==0:continue
  rhythm=cfg['rhythm']
  if rhythm in ['pulse','drive','warm']:
   for offset in ([0,1,2,3] if rhythm=='drive' else [0,2]):drum(start+offset*beat,'kick',.11 if rhythm=='drive' else .07)
   for offset in [1,3]:drum(start+offset*beat,'snare',.018 if rhythm=='drive' else .009)
  if rhythm in ['pulse','drive','ticks','warm','shimmer']:
   for k,offset in enumerate(np.arange(.5,4,.5 if rhythm!='shimmer' else 1)):
    drum(start+offset*beat,'hat',(.009 if rhythm=='drive' else .005)*(.6 if k%2 else 1),.2)
 t=np.arange(count)/sr;mix*=np.minimum(t/.9,1)[:,None]*np.clip((duration-t)/2.2,0,1)[:,None]
 mix=np.tanh(mix)*.85
 wav=work/f'{chapter}-scene-score.wav'
 with wave.open(str(wav),'wb') as f:f.setnchannels(2);f.setsampwidth(2);f.setframerate(sr);f.writeframes((np.clip(mix,-1,1)*32767).astype('<i2').tobytes())
 destination.parent.mkdir(parents=True,exist_ok=True)
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(wav),'-af','loudnorm=I=-20:TP=-2:LRA=8','-ar','48000','-c:a','aac','-b:a','160k','-map_metadata','-1',str(destination)],check=True)
 return cfg
