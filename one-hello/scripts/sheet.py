# python3 scripts/sheet.py out.jpg img1 img2 ... (2 columns, labelled)
import sys
from PIL import Image, ImageDraw
out, files = sys.argv[1], sys.argv[2:]
ims = [Image.open(f).convert('RGB') for f in files]
w, h = ims[0].size
cols = 2
rows = (len(ims) + 1) // 2
sheet = Image.new('RGB', (w * cols + 10, h * rows + 10 * (rows - 1)), (80, 80, 80))
for i, im in enumerate(ims):
    x, y = (i % cols) * (w + 10), (i // cols) * (h + 10)
    sheet.paste(im, (x, y))
    ImageDraw.Draw(sheet).text((x + 8, y + h - 18), files[i].split('/')[-1], fill=(0, 255, 0))
sheet.save(out, quality=85)
