from PIL import Image
import glob, os
old={'BR-Logo.webp','Orbit Ad 1 (1).png','Untitled-design-20.webp','Wedding India English.png','euoinia ads 1 .png','murlit post  (1).png'}
fs=[f for f in sorted(glob.glob('public/client/*')) if os.path.basename(f) not in old]
sheet=Image.new('RGB',(1230,960),'white')
for i,f in enumerate(fs):
    im=Image.open(f).convert('RGBA'); bg=Image.new('RGBA',im.size,(255,255,255,255)); bg.alpha_composite(im); im=bg.convert('RGB'); im.thumbnail((400,300)); sheet.paste(im,((i%3)*410,(i//3)*320)); print(i,f)
sheet.save('shots/clients-new.png')
