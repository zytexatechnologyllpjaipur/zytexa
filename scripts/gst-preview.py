import shutil, subprocess, os
src='src/data/registrations.js'; bak='shots/registrations.preview.bak'; sample='public/__sample-preview.html'
shutil.copy(src,bak)
try:
    open(sample,'w',encoding='utf-8').write('''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>SAMPLE - NOT A REAL CERTIFICATE</title>
<style>body{margin:0;display:grid;place-items:center;min-height:100vh;font-family:Inter,Arial,sans-serif;background:#f4f7fb;color:#0b1f4d}main{max-width:560px;margin:24px;padding:40px;background:#fff;border:3px dashed #d33;border-radius:16px;text-align:center}h1{color:#c00;font-size:1.6rem;margin:0 0 12px}p{line-height:1.6;color:#334}</style></head>
<body><main><h1>SAMPLE &mdash; NOT A REAL CERTIFICATE</h1><p>This page exists only to preview how the &ldquo;View Certificate&rdquo; button behaves on the registration card.</p><p>It is not Zytexa Technology LLP&rsquo;s GST certificate and contains no registration details.</p></main></body></html>''')
    s=open(src,encoding='utf-8').read()
    old="numberLabel: 'Reg. No.', number: '', status: '', since: '', confirmed: true, soonText: 'Certificate unavailable', documentUrl: ''"
    assert old in s
    s=s.replace(old,"numberLabel: 'Reg. No.', number: '', status: 'Design preview only', since: '', confirmed: true, soonText: 'Certificate unavailable', documentUrl: '/__sample-preview.html'")
    open(src,'w',encoding='utf-8').write(s)
    r=subprocess.run(['node','scripts/gst-preview.mjs'],capture_output=True,text=True,timeout=150); print(r.stdout, r.stderr[-400:])
finally:
    shutil.copy(bak,src)
    if os.path.exists(sample): os.remove(sample)
    t=open(src,encoding='utf-8').read(); print('restored; documentUrl empty:',t.count("documentUrl: ''"),'| preview refs left:',t.count('__sample')+t.count('Design preview'),'| sample file exists:',os.path.exists(sample))
