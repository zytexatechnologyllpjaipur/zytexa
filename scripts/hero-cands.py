import io, json, sys, time, urllib.parse, urllib.request
from PIL import Image, ImageDraw
UA = {'User-Agent': 'ZytexaSiteBuild/1.0'}
Q = {
 'website-development': ['web developer coding laptop', 'website design laptop screen', 'programmer code monitors'],
 'mobile-app-development': ['smartphone app hands', 'mobile app development', 'phone apps screen'],
 'ui-ux-web-design': ['ux design wireframes sketch', 'designer wireframe tablet', 'web design layout'],
 'e-commerce-solutions': ['online store', 'shopping online', 'ecommerce', 'woman shopping laptop', 'packages boxes', 'shop checkout'],
 'digital-marketing': ['digital marketing laptop analytics', 'social media marketing', 'seo analytics'],
 'google-my-business': ['google maps phone location', 'map pin', 'customer reviews stars', 'shop sign open'],
 'branding-creative': ['graphic designer color swatches', 'color palette swatches', 'logo design sketch', 'brand design desk'],
 'photography-videography': ['product photography studio', 'videographer camera', 'camera lens photography'],
 'crm-erp-solutions': ['sales team meeting', 'business meeting laptop charts', 'office team computers', 'customer service', 'spreadsheet business'],
 'data-analytics-ai': ['data analytics dashboard', 'charts analytics screen', 'artificial intelligence data'],
 'business-automation': ['robot', 'automation', 'workflow', 'artificial intelligence robot', 'technology circuit'],
 'cybersecurity-maintenance': ['cyber security', 'padlock security', 'hacker', 'data protection', 'server'],
 'business-growth-strategy': ['business strategy', 'business planning meeting', 'growth chart', 'team planning whiteboard', 'startup'],
 'it-consultancy-support': ['it support', 'server room', 'technician computer', 'consultant meeting', 'data center'],
}
def search(q):
    url = 'https://api.openverse.org/v1/images/?' + urllib.parse.urlencode({'q': q, 'license': 'cc0,pdm', 'category': 'photograph', 'extension': 'jpg', 'size': 'large', 'page_size': 20})
    return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40))['results']
keys = sys.argv[1:] or list(Q)
rows = []
for k in keys:
    seen = {}
    for q in Q[k]:
        try:
            for r in search(q): seen.setdefault(r['id'], r)
        except Exception as e: print('ERR', k, q, e)
        time.sleep(0.3)
    items = [r for r in seen.values() if r['width'] >= 1100 and r['width'] / r['height'] > 1.15][:6]
    json.dump([{x: r.get(x) for x in ('id', 'title', 'url', 'thumbnail', 'creator', 'license', 'source', 'foreign_landing_url', 'width', 'height')} for r in items], open(f'shots/cand/h-{k}.json', 'w'))
    rows.append((k, items)); print(k, len(items))
W, H = 215, 140
sheet = Image.new('RGB', (6 * W, len(rows) * (H + 18)), 'white'); d = ImageDraw.Draw(sheet)
for ri, (k, items) in enumerate(rows):
    d.text((4, ri * (H + 18) + 2), k, fill='black')
    for i, r in enumerate(items):
        try:
            im = Image.open(io.BytesIO(urllib.request.urlopen(urllib.request.Request(r['thumbnail'], headers=UA), timeout=40).read())).convert('RGB'); im.thumbnail((W - 4, H - 14))
            sheet.paste(im, (i * W, ri * (H + 18) + 16))
        except Exception: pass
        d.text((i * W + 4, ri * (H + 18) + 16), f'#{i}', fill='red')
sheet.save('shots/cand/hero-sheet-' + keys[0] + '.png'); print('sheet', sheet.size)
