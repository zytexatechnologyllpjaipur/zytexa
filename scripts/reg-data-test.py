import shutil, subprocess, sys
src = 'src/data/registrations.js'
bak = 'shots/registrations.js.bak'
shutil.copy(src, bak)
try:
    s = open(src, encoding='utf-8').read()
    # TEST-ONLY sample values, restored right after this run. Never published.
    s = s.replace("numberLabel: 'Reg. No.', number: '', status: '', since: ''", "numberLabel: 'Reg. No.', number: 'TEST-0000', status: 'Active', since: '2000'")
    s = s.replace("numberLabel: 'LLP ID', number: '', status: '', since: '', confirmed: true, primary: true", "numberLabel: 'LLP ID', number: '', status: 'Verified', since: '', confirmed: true, primary: true")
    s = s.replace("{ key: 'iso', title: 'ISO Certification', authority: [], standard: '', numberLabel: 'Cert. No.', number: '', status: '', since: '', confirmed: false }", "{ key: 'iso', title: 'ISO Certification', authority: [], standard: 'ISO TEST:0000', numberLabel: 'Cert. No.', number: 'CERT-TEST', status: 'Certified', since: '2001', confirmed: true }")
    open(src, 'w', encoding='utf-8').write(s)
    r = subprocess.run(['node', 'scripts/reg-data-render.mjs'], capture_output=True, text=True, timeout=120)
    print(r.stdout, r.stderr[-300:])
finally:
    shutil.copy(bak, src)
    print('restored:', open(src, encoding='utf-8').read().count("number: ''"), "empty number fields (expect 4)")
