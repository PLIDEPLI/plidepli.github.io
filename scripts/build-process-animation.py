"""Render an original 30-second isometric manufacturing explainer. No stock imagery.

All geometry is illustrative, not CAD or a simulation. Process references and
the distinction between planned production and workshop footage are documented
in docs/manufacturing-animation.md. Pillow draws original vector-like scenes;
no customer photographs are altered by this renderer.
"""
from pathlib import Path
import argparse, math, subprocess
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/story-edits/manufacturing'
WORK = Path('/tmp/plidepli-process-review')
S = 2
W, H = 1280, 720
BG, INK, MINT = '#071e2d', '#eaf3f7', '#30d8b7'
SILVER = ('#d6e2e9', '#8ba3b4', '#657f92')
WHITE = ('#f3f7f9', '#b9ccd7', '#8ba3b4')
STEEL = ('#496679', '#27475d', '#1b364b')
GREEN = ('#258c79', '#176152', '#10483e')
COPPER = ('#eba45a', '#bf763a', '#94532b')
TITLES = ['Die-cast the lower housing', 'Mold the upper cover', 'Fabricate the circuit board', 'Bring the parts together', 'Connect. Check. Refine.', 'Pack the complete kit']
SUBS = ['Molten metal. Reusable steel tooling. A solid foundation.', 'Plastic pellets become the protective upper shell.', 'Layers, holes, copper traces, and a protective solder mask.', 'Populate the board, fit the antenna, and close the housing.', 'RF and functional checks before the unit leaves the bench.', 'The booster, outdoor antenna, cable, and power supply.']
STEPS = ['Die casting', 'Injection molding', 'PCB fabrication', 'Assembly', 'Testing', 'Packaging']
FONTS = {}

def font(size, bold=False):
    key = (size, bold)
    if key not in FONTS:
        name = 'Arial Bold.ttf' if bold else 'Arial.ttf'
        FONTS[key] = ImageFont.truetype('/System/Library/Fonts/Supplemental/' + name, int(size*S))
    return FONTS[key]

def ease(t):
    t = max(0, min(1, t))
    return t*t*(3-2*t)

class Scene:
    def __init__(self):
        self.im = Image.new('RGB', (W*S, H*S), BG)
        self.d = ImageDraw.Draw(self.im)
        self.cx, self.cy = 660, 440

    def point(self, x, y, z=0):
        return (660 + .78*(self.cx + .91*(x-y)-660), 410 + .78*(self.cy + .43*(x+y)-z-400))

    def poly(self, pts, fill, outline=None, width=1):
        pts = [(round(x*S), round(y*S)) for x,y in pts]
        self.d.polygon(pts, fill=fill)
        if outline: self.d.line(pts+[pts[0]], fill=outline, width=width*S, joint='curve')

    def line(self, pts, fill=MINT, width=2):
        self.d.line([(round(x*S),round(y*S)) for x,y in pts], fill=fill, width=max(1,round(width*S)), joint='curve')

    def text(self, xy, text, size=20, color=INK, bold=False, anchor=None):
        self.d.text((xy[0]*S, xy[1]*S), text, font=font(size,bold), fill=color, anchor=anchor)

    def dot(self, xy, r, color):
        x,y=xy;self.d.ellipse(((x-r)*S,(y-r)*S,(x+r)*S,(y+r)*S),fill=color)

    def rect(self, bounds, fill, radius=0, outline=None):
        self.d.rounded_rectangle(tuple(round(v*S) for v in bounds),radius=round(radius*S),fill=fill,outline=outline,width=S)

    def face(self, x,y,z,w,d,fill,outline=None):
        self.poly([self.point(x,y,z),self.point(x+w,y,z),self.point(x+w,y+d,z),self.point(x,y+d,z)],fill,outline)

    def box(self,x,y,z,w,d,h,colors=SILVER):
        p=self.point
        self.poly([p(x,y+d,z),p(x+w,y+d,z),p(x+w,y+d,z+h),p(x,y+d,z+h)],colors[1])
        self.poly([p(x+w,y,z),p(x+w,y+d,z),p(x+w,y+d,z+h),p(x+w,y,z+h)],colors[2])
        self.face(x,y,z+h,w,d,colors[0], '#698697')

    def tray(self,z=12,x=-105,y=-80):
        self.box(x,y,z,210,160,12)
        self.face(x+13,y+13,z+12.2,184,134,'#728d9e')
        for xx,yy,ww,dd in [(x,y,210,10),(x,y,10,160),(x,y+150,210,10),(x+200,y,10,160)]:
            self.box(xx,yy,z+12,ww,dd,20)
        for xx in [x+20,x+190]:
            for yy in [y+20,y+140]:self.box(xx-4,yy-4,z+12,8,8,16)

    def cover(self,z=60,x=-105,y=-80):
        self.box(x,y,z,210,160,15,WHITE)
        # Raised ribs echo the geometry of the supplied product, without claiming CAD fidelity.
        self.face(x+15,y+15,z+15.5,180,130,'#e3edf2','#c0d0da')
        p=self.point
        for yy in [y+20,y+140]:
            self.line([p(x+18,yy,z+16),p(x+48,yy+(-20 if yy>y+80 else 20),z+16),p(x+162,yy+(-20 if yy>y+80 else 20),z+16),p(x+192,yy,z+16)],'#a6bccb',2)
        for xx in [x+6,x+194]:
            for yy in [y+6,y+144]:self.box(xx,yy,z+15,10,10,3,WHITE)

    def board(self,z=45,components=True,reveal=1,x=-87,y=-62):
        self.box(x,y,z,174,124,5,GREEN)
        p=self.point
        traces=[]
        for i in range(7):
            yy=y+13+i*15
            traces.append([p(x+8,yy,z+5.5),p(x+36+i*8,yy,z+5.5),p(x+47+i*8,yy-8,z+5.5),p(x+158,yy-8,z+5.5)])
        for pts in traces[:int(7*reveal)]:self.line(pts,'#e7b571',1.6)
        for xx in [x+9,x+164]:
            for yy in [y+9,y+114]:self.dot(p(xx,yy,z+6),3,'#cbdbe2')
        if components:
            for i in range(3):
                for j in range(2):
                    self.box(x+23+i*46,y+18+j*48,z+6,29,24,8,('#263d4b','#142a39','#071e2d'))
                    self.line([p(x+27+i*46,y+21+j*48,z+14),p(x+45+i*46,y+21+j*48,z+14)],'#7b97aa',1)
            for i in range(7):self.box(x+14+i*20,y+103,z+6,7,10,4,SILVER)

    def unit(self,z=15):
        self.tray(z)
        self.cover(z+33)
        self.box(-120,-8,z+16,15,16,14,COPPER)
        self.box(105,-8,z+16,15,16,14,COPPER)

    def stage(self):
        # Quiet isometric construction grid; it establishes the work surface.
        for i in range(-400,401,50):
            self.line([self.point(i,-200,-15),self.point(i,200,-15)],'#112e40',1)
        for j in range(-200,201,50):
            self.line([self.point(-400,j,-15),self.point(400,j,-15)],'#112e40',1)
        self.box(-270,-165,-10,540,330,10,('#102f42','#0c2638','#0a2333'))

    def mold(self,t,plastic=False):
        self.stage()
        opening=1-ease(t/.9) if t<1 else ease((t-2.9)/1.1)
        self.box(-140,-105,0,280,210,32,STEEL)
        self.face(-108,-82,32.5,216,164,'#0c2434')
        for xx in [-125,120]:
            for yy in [-92,87]:self.box(xx,yy,32,6,6,160,STEEL)
        if t>1:
            fill=ease((t-1)/1.1)
            col=WHITE if plastic else COPPER if t<2.9 else SILVER
            self.box(-105,-80,33,210*fill,160,14,col)
        self.box(-140,-105,50+125*opening,280,210,35,STEEL)
        # An exposed schematic runner shows injection into the closed tool.
        self.box(-295,-12,26,155,24,20,STEEL)
        if 1<t<2.9:
            p=self.point
            self.line([p(-285,-1,47),p(-145,-1,47),p(-95,-1,47)],MINT if plastic else '#efa75f',5)
            for i in range(4):
                xx=-285+((t*120+i*35)%185)
                self.dot(p(xx,-1,48),3,INK)
        if plastic:
            p=self.point
            self.poly([p(-290,-30,125),p(-215,-30,125),p(-240,-18,75),p(-265,-18,75)],'#a8becb','#d6e2e9')
            for i in range(8):
                self.dot(p(-276+(i%4)*13,-25,130-(t*23+i*7)%28),3,'#eaf3f7')
        if t>3.65:
            # Ejected part is shown separately so the housing silhouette remains legible.
            self.cx+=280;self.cy+=18
            if plastic:self.cover(15+ease((t-3.65)/.6)*25)
            else:self.tray(15+ease((t-3.65)/.6)*25)
            self.cx-=280;self.cy-=18
        self.text((70,535),'Close the tool  /  Inject  /  Cool  /  Release',21,'#a8c2d1')

    def pcb(self,t):
        self.stage()
        settle=ease(t/1.1)
        for i in range(4):
            self.box(-115,-83,12+i*(6+22*(1-settle)),230,166,5,COPPER if i%2 else ('#728b7a','#425d4c','#304639'))
        if t>1.1:
            self.board(37,False,ease((t-2.2)/1.1),-87,-62)
            if t<2.8:
                xx=-70+140*ease((t-1.1)/1.7);yy=-48
                drop=20*abs(math.sin((t-1.1)*8))
                self.box(xx-11,yy-11,86+drop,22,22,58,STEEL)
                self.box(xx-2,yy-2,47+drop,4,4,40,SILVER)
            if t>2.8:
                p=self.point;scan=-87+174*ease((t-2.8)/1.5)
                self.line([p(scan,-62,44),p(scan,62,44)],'#8affe2',3)
        self.text((70,535),'Laminate  /  Drill & plate  /  Pattern copper  /  Mask & finish',21,'#a8c2d1')

    def assembly(self,t):
        self.stage();self.tray(14)
        self.box(-120,-8,32,15,16,14,COPPER)
        board_z=47+100*(1-ease((t-.3)/1.2))
        self.board(board_z,t>1.3)
        if t>1.3:
            # Copper antenna element is a simplified placement illustration.
            self.box(-70,35,board_z+16,130,16,3,COPPER)
        lid_z=230-166*ease((t-2)/1.5)
        self.cover(lid_z)
        if t<3.3:
            for x,y in [(-97,-72),(97,72)]:
                self.line([self.point(x,y,42),self.point(x,y,lid_z)],'#4b6f84',1)
        self.box(105,-8,32,15,16,14,COPPER)
        if t>3.4:
            for x,y in [(-94,-69),(94,-69),(-94,69),(94,69)]:
                self.dot(self.point(x,y,80+30*(1-ease((t-3.4)/.8))),3,'#e9f1f5')
        self.text((70,535),'Populate the PCB  /  Fit board & antenna  /  Fasten the housing',21,'#a8c2d1')

    def testing(self,t):
        self.cx=830;self.cy=422;self.stage();self.unit(22)
        self.rect((165,248,510,435),'#365569',14,'#688b9f')
        self.rect((184,268,458,407),'#061823',7)
        for xx in range(195,450,35):self.line([(xx,280),(xx,393)],'#143747',1)
        for yy in range(280,405,28):self.line([(194,yy),(448,yy)],'#143747',1)
        limit=240*ease(t/3.4)
        pts=[]
        for i in range(int(limit)):
            yy=324+23*math.sin(i*.025)+35*math.exp(-((i-143)/29)**2)
            pts.append((199+i,yy))
        if len(pts)>1:self.line(pts,MINT,2.5)
        for y in [295,332,370]:self.dot((482,y),8,'#90adbe')
        self.text((203,376),'Illustrative RF trace',14,'#7da4b9')
        p=self.point(-120,0,45)
        self.line([(480,435),(510,475),(650,475),p], '#6d94aa',5)
        travel=ease((t-.5)/3)
        self.dot((510+travel*140,475),5,MINT)
        self.text((70,535),'Connect the unit  /  Check RF behavior  /  Check function',21,'#a8c2d1')

    def packaging(self,t):
        self.stage()
        cardboard=('#d7b68a','#ae885c','#87603d')
        self.box(-160,-112,5,320,224,65,cardboard)
        self.face(-150,-102,70.5,300,204,'#234252')
        drop=100*(1-ease(t/1.7))
        self.cx-=55;self.cy-=5
        self.cover(72+drop,-65,-48)
        self.cx+=55;self.cy+=5
        # Kit accessories occupy distinct fitted recesses.
        self.box(90,-80,74+drop,45,93,10,WHITE)
        self.box(78,38,74+drop,45,35,17,STEEL)
        p=self.point
        for i in range(5):
            pts=[p(18+(27+i*2)*math.cos(a*math.pi/24),57+(14+i)*math.sin(a*math.pi/24),79+drop) for a in range(49)]
            self.line(pts,'#091f2e',3)
        # Close the upper lid only after the components have settled into the tray.
        if t>2.3:
            z=210-138*ease((t-2.3)/1.2)
            self.box(-162,-114,z,324,228,9,WHITE)
            a=p(-95,-50,z+10);b=p(90,-50,z+10)
            self.line([a,b],MINT,9)
            if t>3.5:
                self.text((593,403),'PLIDEPLI',27,'#123044',True)
        self.text((70,535),'Protect the parts  /  Check kit contents  /  Close the box',21,'#a8c2d1')

def render(t):
    index=min(5,int(t/5));local=t-index*5
    s=Scene()
    [s.mold,lambda t:s.mold(t,True),s.pcb,s.assembly,s.testing,s.packaging][index](local)
    s.text((64,40),'PLIDEPLI',24,INK,True)
    s.text((1216,45),'Production workflow · Animation',18,'#8caebe',anchor='ra')
    s.text((64,94),TITLES[index],43,INK,True)
    s.text((66,157),SUBS[index],22,'#a8c2d1')
    s.line([(64,603),(1216,603)],'#284a5d',1)
    for i,name in enumerate(STEPS):
        x=64+i*196
        s.rect((x,602,x+172,606),MINT if i<index else '#284a5d',2)
        if i==index:s.rect((x,602,x+max(1,172*local/5),606),MINT,2)
        s.text((x,623),f'{i+1:02}',17,MINT if i==index else '#668a9f',True)
        s.text((x,649),name,18,INK if i==index else '#7e9fae')
    s.text((64,699),'Planned workflow. Simplified geometry and displays; not factory footage.',14,'#7093a6')
    # Brief fades make hard changes in machinery readable without flashy transitions.
    opacity=min(1,local/.2) if index else min(1,t/.3)
    opacity*=min(1,(30-t)/.4)
    if opacity<1:s.im=Image.blend(Image.new('RGB',s.im.size,BG),s.im,max(0,opacity))
    return s.im.resize((W,H),Image.Resampling.LANCZOS)

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--stills',action='store_true');args=parser.parse_args()
    OUT.mkdir(exist_ok=True,parents=True);WORK.mkdir(exist_ok=True,parents=True)
    for i in range(6):render(i*5+3.9).save(WORK/f'process-stage-{i+1}.png')
    if args.stills:return
    cmd=['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r','30','-i','pipe:0','-i',str(OUT/'score.m4a'),'-map','0:v','-map','1:a','-c:v','libx264','-preset','fast','-crf','20','-threads','2','-pix_fmt','yuv420p','-c:a','copy','-t','30','-movflags','+faststart','-map_metadata','-1',str(OUT/'film.mp4')]
    process=subprocess.Popen(cmd,stdin=subprocess.PIPE)
    try:
        for i in range(900):
            process.stdin.write(render(i/30).tobytes())
            if i%150==0:print(f'Rendered stage {i//150+1}/6',flush=True)
    finally:process.stdin.close()
    if process.wait():raise RuntimeError('Animation encoding failed')
    render(18.5).save(OUT/'poster.webp',quality=88)
    print('Rendered manufacturing animation: 30 seconds, six stages.',flush=True)

if __name__=='__main__':main()
