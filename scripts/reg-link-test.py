import shutil, subprocess
src = 'src/data/registrations.js'
bak = 'shots/registrations.links.bak'
shutil.copy(src, bak)
try:
    s = open(src, encoding='utf-8').read()
    # TEST-ONLY URLs (reserved .invalid domain), restored right after the run. ISO stays confirmed:false to prove it never links.
    for label, url in (('View Registration', 'https://example.invalid/gst'), ('View Incorporation Certificate', 'https://example.invalid/llp'), ('View Udyam Certificate', 'https://example.invalid/udyam'), ('View Certificate', 'https://example.invalid/iso')):
        s = s.replace("documentUrl: '', linkLabel: '%s'" % label, "documentUrl: '%s', linkLabel: '%s'" % (url, label))
    open(src, 'w', encoding='utf-8').write(s)
    r = subprocess.run(['node', 'scripts/reg-link-render.mjs', 'withurls'], capture_output=True, text=True, timeout=120)
    print(r.stdout, r.stderr[-300:])
finally:
    shutil.copy(bak, src)
    print('restored; documentUrl empty count (expect 4):', open(src, encoding='utf-8').read().count("documentUrl: ''"))
