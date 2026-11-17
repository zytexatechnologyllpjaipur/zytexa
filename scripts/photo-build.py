import io, json, urllib.request
from PIL import Image
UA = {'User-Agent': 'ZytexaSiteBuild/1.0'}
PICK = {  # key: (candidate index, file name, focus y 0..1)
 'retail': (3, 'retail', .45), 'health': (2, 'healthcare', .30), 'edu': (10, 'education', .40), 'real': (10, 'real-estate', .50),
 'startup': (1, 'startups', .50), 'local': (13, 'local-business', .55), 'hosp': (2, 'hospitality', .60),
 'mfg': (10, 'manufacturing', .55), 'prof': (2, 'professional-services', .40),
}
credits = {}
for k, (i, name, fy) in PICK.items():
    r = json.load(open(f'shots/cand/{k}.json'))[i]
    data = urllib.request.urlopen(urllib.request.Request(r['url'], headers=UA), timeout=90).read()
    im = Image.open(io.BytesIO(data)).convert('RGB')
    W, H = im.size; ar = 1.85
    if W / H > ar: nw, nh = int(H * ar), H; x0, y0 = (W - nw) // 2, 0
    else: nw, nh = W, int(W / ar); x0, y0 = 0, int((H - nh) * fy)
    im = im.crop((x0, y0, x0 + nw, y0 + nh)).resize((800, 432), Image.LANCZOS)
    im.save(f'public/industries/{name}.webp', 'WEBP', quality=78, method=6)
    import os; sz = os.path.getsize(f'public/industries/{name}.webp')
    credits[name] = {'title': r['title'], 'creator': r['creator'], 'license': r['license'].upper(), 'source': r['source'], 'url': r['foreign_landing_url']}
    print(k, name, f'{W}x{H}', r['license'], r['source'], f'{sz//1024}KB', '|', r['title'][:40], '|', r['creator'])
json.dump(credits, open('shots/credits.json', 'w'), indent=1)
