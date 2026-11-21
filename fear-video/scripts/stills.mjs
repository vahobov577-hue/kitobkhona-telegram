// Usage: node scripts/stills.mjs 75 300 570 ...   → out/stills/f<frame>.jpg
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const frames = process.argv.slice(2).map(Number);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), rspack: true});
const browserExecutable = fs.existsSync('/opt/pw-browsers') ? path.resolve('scripts/chrome-proxy.sh') : null;
const composition = await selectComposition({serveUrl, id: 'Fear', inputProps: {audio: false}, browserExecutable});
fs.mkdirSync('out/stills', {recursive: true});
for (const frame of frames) {
  const output = `out/stills/f${String(frame).padStart(4, '0')}.jpg`;
  await renderStill({serveUrl, composition, frame, output, imageFormat: 'jpeg', jpegQuality: 80, scale: 0.5, inputProps: {audio: false}, browserExecutable});
  console.log('wrote', output);
}
