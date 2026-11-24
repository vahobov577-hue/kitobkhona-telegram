import re
s = open('src/timeline.ts').read()
rows = re.findall(r"\['(S\d+)', (\d+), \[(.*?)\]\],\n", s)
brief = [0,4,9,14,18,20,28,33,40,47,54,64,80,88,96,104,114,122,130,138,146,170,180,192,200,210,220,230,240,248,254,264,272,280,288,294]
pos = 0; types = []; bad = []
for i, (sid, st, sh) in enumerate(rows):
    if int(st) != pos or pos != brief[i] * 30: bad.append((sid, st, pos, brief[i] * 30))
    for d, t in re.findall(r"\[(\d+), '(\w)'\]", sh):
        assert int(d) <= 150, (sid, d)
        pos += int(d); types.append(t)
run = 1; runs = 0
for i in range(1, len(types)):
    run = run + 1 if types[i] == types[i - 1] else 1
    if run > 2: runs += 1; print('3 in a row at shot', i)
print('end', pos, 'shots', len(types), 'start mismatches', bad, 'runs', runs)
