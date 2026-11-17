import io, json, os, urllib.request
from PIL import Image
UA = {'User-Agent': 'ZytexaSiteBuild/1.0'}
# (json file, candidate index, output slug, vertical focus 0..1)
SERVICES = {
    'website-development': ('h-website-development', 3, .35), 'mobile-app-development': ('h-mobile-app-development', 4, .5),
    'ui-ux-web-design': ('h-ui-ux-web-design', 2, .5), 'e-commerce-solutions': ('h-e-commerce-solutions', 1, .5),
    'digital-marketing': ('h-digital-marketing', 5, .5), 'google-my-business': ('h-google-my-business', 1, .5),
    'branding-creative': ('h-branding-creative', 0, .5), 'photography-videography': ('h-photography-videography', 0, .5),
    'crm-erp-solutions': ('h-crm-erp-solutions', 3, .5), 'data-analytics-ai': ('h-data-analytics-ai', 0, .5),
    'business-automation': ('h-business-automation', 0, .4), 'cybersecurity-maintenance': ('h-cybersecurity-maintenance', 5, .5),
    'business-growth-strategy': ('h-business-growth-strategy', 4, .5), 'it-consultancy-support': ('h-it-consultancy-support', 0, .5),
}
INDUSTRIES = {  # same photos already chosen for the homepage cards (indices from the earlier selection)
    'retail-ecommerce': ('retail', 3, .45), 'healthcare': ('health', 2, .3), 'education': ('edu', 10, .4),
    'real-estate': ('real', 10, .5), 'manufacturing-exports': ('mfg', 10, .55), 'hospitality-travel': ('hosp', 2, .6),
}
os.makedirs('public/heroes', exist_ok=True)
credits = {}
def build(slug, jf, i, fy, prefix=''):
    r = json.load(open(f'shots/cand/{jf}.json'))[i]
    im = Image.open(io.BytesIO(urllib.request.urlopen(urllib.request.Request(r['url'], headers=UA), timeout=90).read())).convert('RGB')
    W, H = im.size; target_w = min(W, 1600); ar = 1600 / 560
    if W / H > ar: nh = H; nw = int(H * ar); x0 = (W - nw) // 2; y0 = 0
    else: nw = W; nh = int(W / ar); x0 = 0; y0 = int((H - nh) * fy)
    im = im.crop((x0, y0, x0 + nw, y0 + nh))
    if nw > 1600: im = im.resize((1600, int(1600 / ar)), Image.LANCZOS)
    out = f'public/heroes/{prefix}{slug}.webp'; im.save(out, 'WEBP', quality=74, method=6)
    credits[prefix + slug] = {'title': r['title'], 'creator': r['creator'], 'license': r['license'].upper(), 'source': r['source'], 'url': r['foreign_landing_url']}
    print(prefix + slug, f'{W}x{H} -> {im.size}', r['license'], f'{os.path.getsize(out)//1024}KB')
for slug, (jf, i, fy) in SERVICES.items(): build(slug, jf, i, fy)
for slug, (jf, i, fy) in INDUSTRIES.items(): build(slug, jf, i, fy, 'industry-')
lines = ['# Hero images - sources and licences\n', 'All images are CC0 1.0 / public domain (no attribution required), found via Openverse (https://openverse.org), cropped to a wide banner and compressed to WebP.\n', '| File | Photo | Creator | Licence | Origin |', '|---|---|---|---|---|']
for k, v in credits.items(): lines.append(f"| {k}.webp | {v['title']} | {v['creator'] or 'unknown'} | {v['license']} | {v['source']} - {v['url']} |")
open('public/heroes/CREDITS.md', 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
