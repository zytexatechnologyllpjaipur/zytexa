from PIL import Image, ImageChops
import os
src='public/client/hos videoooooooooooooooooooooooooooo.png'
im=Image.open(src).convert('RGBA'); bg=Image.new('RGBA',im.size,im.getpixel((2,2)))
box=ImageChops.difference(im.convert('RGB'),bg.convert('RGB')).point(lambda v:255 if v>12 else 0).getbbox()
print('content bbox',box)
m=14; x0,y0,x1,y1=box; box=(max(0,x0-m),max(0,y0-m),min(im.width,x1+m),min(im.height,y1+m))
os.makedirs('public/client-derived',exist_ok=True)
im.crop(box).save('public/client-derived/house-of-sukrit-cropped.png',optimize=True); print('crop',box)
