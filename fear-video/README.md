# FEAR — animated short (Remotion)

150 s · 1920×1080 · 30 fps · 4500 frames. Hand-drawn style SVG animation about
a guy whose dream is blocked by his own shadow — until he walks through it.

```bash
npm install
npm run audio      # synthesises public/audio/music.wav + sfx/*.wav
npm run dev        # Remotion Studio
npm run render     # → out/fear.mp4 (H.264, CRF 18, AAC)
npm run stills -- 300 1500 3600   # quick stills → out/stills/
```

* `src/theme.ts` — palette, fonts (Patrick Hand, Comic Neue Bold via `@remotion/google-fonts`), scene table
* `src/components/` — `Hero`, `Shadow` (shared skeleton in `rig.ts`), props, `Stage.tsx`
  (camera with parallax layers, narrator / shadow text, DAY counter, SFX)
* `src/scenes/Scene01..18.tsx` — one `<Sequence>` per scene (see `src/Video.tsx`)
* `scripts/make-audio.mjs` — the music + SFX synthesiser (pure Node, no deps)
* `STORYBOARD.md` — storyboard with alternatives per scene

Own music: drop `public/audio/music.mp3`. No audio: `npm run render:silent`
(or set the `audio` prop to `false`).

`scripts/chrome-proxy.sh` is only used inside the Claude cloud sandbox
(see `remotion.config.ts`); on a normal machine Remotion uses its own browser.
