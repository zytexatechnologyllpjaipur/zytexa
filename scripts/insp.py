from PIL import Image
def flat(f, bg=(255,255,255)):
    im=Image.open('public/client/'+f).convert('RGBA'); b=Image.new('RGBA',im.size,bg+(255,)); b.alpha_composite(im); return b.convert('RGB')
a=flat('pixination.png').resize((640,640),Image.LANCZOS); a.save('shots/i-pix.png')
b=flat('hos videoooooooooooooooooooooooooooo.png'); print('hos',b.size, b.getpixel((2,2)), b.getpixel((75,75)), Image.open('public/client/hos videoooooooooooooooooooooooooooo.png').getchannel('A').getextrema())
b.resize((604,604),Image.LANCZOS).save('shots/i-hos.png')
c=flat('Wedding India English.png'); c.resize((786,246),Image.LANCZOS).save('shots/i-mel.png')
