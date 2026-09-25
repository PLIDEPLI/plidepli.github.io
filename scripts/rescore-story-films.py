"""Replace each film's music without re-encoding or changing its video stream."""
from pathlib import Path
import argparse,json,subprocess
from story_scores import SCENES,compose
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'public/story-edits';WORK=Path('/tmp/plidepli-scene-scores');WORK.mkdir(exist_ok=True)
def stream_hash(path,kind):
 return subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-map',f'0:{kind}:0','-c','copy','-f','hash','-hash','sha256','-']).decode().strip()
parser=argparse.ArgumentParser();parser.add_argument('--only',nargs='*');args=parser.parse_args()
report_path=ROOT/'docs/scene-scores.json'
report=json.loads(report_path.read_text()) if report_path.exists() else {}
for chapter in SCENES:
 if args.only and chapter not in args.only:continue
 source=ROOT/'public/video/promo-country-tech.mp4' if chapter=='promo' else OUT/chapter/'film.mp4'
 film=ROOT/'public/video/promo-country-tech.mp4' if chapter=='promo' else source
 score=ROOT/'public/video/promo-score.m4a' if chapter=='promo' else OUT/chapter/'score.m4a'
 duration=44.2 if chapter=='promo' else 30
 before=stream_hash(source,'v');cfg=compose(chapter,score,WORK,duration)
 temp=WORK/f'{chapter}-scored.mp4'
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(source),'-i',str(score),'-map','0:v:0','-map','1:a:0','-c','copy','-t',str(duration),'-movflags','+faststart','-map_metadata','-1',str(temp)],check=True)
 assert stream_hash(temp,'v')==before,chapter+' picture changed'
 assert stream_hash(temp,'a')==stream_hash(score,'a'),chapter+' unexpected audio'
 data=json.loads(subprocess.check_output(['ffprobe','-v','quiet','-show_streams','-show_format','-of','json',str(temp)]))
 assert abs(float(data['format']['duration'])-duration)<.05
 assert len([s for s in data['streams'] if s['codec_type']=='audio'])==1
 film.write_bytes(temp.read_bytes())
 report[chapter]={**cfg,'file':str(score.relative_to(ROOT)),'duration':duration,'video_unchanged':True,'video_sha256':before,'audio_sha256':stream_hash(film,'a')}
 print('Scored',chapter,cfg['title'],cfg['bpm'],'BPM; picture unchanged',flush=True)
assert len({r['audio_sha256'] for r in report.values()})==len(report)
(ROOT/'docs/scene-scores.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
