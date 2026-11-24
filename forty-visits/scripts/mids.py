# python3 scripts/mids.py S01 S12  -> prints mid frames of every shot in the scene range
import re, sys
s = open('src/timeline.ts').read()
rows = re.findall(r"\['(S\d+)', (\d+), \[(.*?)\]\],\n", s)
a, b = sys.argv[1], sys.argv[2]
out = []
for sid, start, shots in rows:
    if not (a <= sid <= b):
        continue
    pos = int(start)
    for d, t in re.findall(r"\[(\d+), '(\w)'\]", shots):
        out.append(str(pos + int(d) // 2))
        pos += int(d)
print(' '.join(out))
