import io, json, sys, time, urllib.parse, urllib.request
from PIL import Image, ImageDraw
UA = {'User-Agent': 'ZytexaSiteBuild/1.0'}
Q = {
 'retail': ['shopping bags', 'online shopping', 'retail store', 'package delivery boxes', 'shop customer'],
 'health': ['doctor stethoscope hospital', 'nurse patient hospital', 'medical team clinic'],
 'edu': ['students classroom learning', 'graduation cap university', 'school children teacher'],
 'real': ['modern apartment building', 'real estate house keys', 'city skyline buildings'],
 'startup': ['startup team laptops office', 'developers coding laptop team', 'coworking space team meeting'],
 'local': ['coffee shop barista', 'bakery shop', 'barber shop', 'grocery shop owner', 'small shop entrance open sign', 'market stall vendor'],
 'hosp': ['hotel pool resort', 'hotel lobby', 'hotel reception desk', 'resort beach hotel', 'restaurant dining hotel'],
 'mfg': ['factory worker machine', 'manufacturing industrial production', 'industrial plant welding workers'],
 'prof': ['business meeting', 'office team discussion', 'consultant client meeting', 'businessmen handshake', 'accountant office desk'],
}
def search(q):
    url = 'https://api.openverse.org/v1/images/?' + urllib.parse.urlencode({'q': q, 'license': 'cc0,pdm', 'category': 'photograph', 'extension': 'jpg', 'size': 'large', 'page_size': 12})
    return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40))['results']
for k in (sys.argv[1:] or Q):
    seen = {}
    for q in Q[k]:
        try:
            for r in search(q): seen.setdefault(r['id'], r)
        except Exception as e: print('ERR', k, q, e)
        time.sleep(0.4)
    items = [r for r in seen.values() if r['width'] >= 1200][:16]
    json.dump([{k2: r.get(k2) for k2 in ('id', 'title', 'url', 'thumbnail', 'creator', 'license', 'source', 'foreign_landing_url', 'width', 'height')} for r in items], open(f'shots/cand/{k}.json', 'w'))
    W, H, cols = 300, 200, 4; rows = (len(items) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * W, max(1, rows) * (H + 16)), 'white'); d = ImageDraw.Draw(sheet)
    for i, r in enumerate(items):
        try:
            im = Image.open(io.BytesIO(urllib.request.urlopen(urllib.request.Request(r['thumbnail'], headers=UA), timeout=40).read())).convert('RGB'); im.thumbnail((W, H))
            sheet.paste(im, ((i % cols) * W, (i // cols) * (H + 16)))
        except Exception: pass
        d.text(((i % cols) * W + 4, (i // cols) * (H + 16) + H + 2), f"#{i} {r['title'][:34]}", fill='black')
    sheet.save(f'shots/cand/{k}.png'); print(k, len(items))
