import json
from PIL import Image
ref=Image.open('public/references/Zytexa-Website-Reference.png').convert('RGB')
ref=ref.resize((ref.width*2, ref.height*2), Image.LANCZOS)
mine=Image.open('shots/full-1448.png').convert('RGB')
R={n:(y,h) for n,y,h in json.load(open('shots/rects.json'))}
# reference ranges (2x px), measured from the zoomed strips
REF={'header-hero':(0,595),'clients':(595,705),'strength':(705,1085),'services':(1085,1930),'process':(1930,2200),'why':(2200,2525),
     'industries':(2525,2745),'hub':(2745,3005),'roof':(3005,3290),'reviews':(3290,3490),'ai':(3490,3695),'faq-contact':(3695,3965),'cta':(3965,4090),'footer':(4090,4344)}
MINE={'header-hero':[('header',),('hero',)],'clients':[('clients',)],'strength':[('strength',)],'services':[('services',)],'process':[('process',)],'why':[('why',)],
      'industries':[('industries',)],'hub':[('hub',)],'roof':[('roof',)],'reviews':[('reviews',)],'ai':[('ai',)],'faq-contact':[('faq',),('contact',)],'cta':[('cta',)],'footer':[('footer',)]}
for k,(r0,r1) in REF.items():
    names=[x[0] for x in MINE[k]]
    m0=R[names[0]][0]; m1=R[names[-1]][0]+R[names[-1]][1]
    a=ref.crop((0,r0,ref.width,min(r1,ref.height))); b=mine.crop((0,m0,mine.width,min(m1,mine.height)))
    s=Image.new('RGB',(1448,a.height+b.height+16),(255,80,80)); s.paste(a,(0,0)); s.paste(b,(0,a.height+16)); s.save(f'shots/pair2-{k}.png'); print(k,'ref',r1-r0,'mine',m1-m0)
