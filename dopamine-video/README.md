# DOPAMINE — animated short film (Remotion)

270 s · 1920×1080 · 30 fps · 8100 frames · 32 scenes in 5 acts (cold open → hook → cost → fight → climax/loop).

```bash
npm install
npm run audio       # synthesises public/audio/music.wav + 45 SFX (pure Node)
npm run dev         # Remotion Studio
npm run render      # → out/dopamine.mp4 (H.264 CRF 18, AAC, exactly 270.000 s)
npm run thumbnail   # → out/thumbnail.png (1280×720)
npm run stills -- 300 2000 6774   # quick stills → out/stills/
```

* `src/Root.tsx` — compositions `Dopamine` (8100 frames) and `Thumbnail` (1280×720)
* `src/theme.ts` — palette, fonts (Patrick Hand / Comic Neue Bold via `@remotion/google-fonts`), scene table, music sync points
* `src/scenes/Scene01..32.tsx` — one `<Sequence>` each; `Showdown.tsx` is shared by scenes 1, 2, 3, 27, 28 (27 is the same frame as 1)
* `src/components/` — `Hero` (12 poses, 9 emotions, `saturation`, `age`, headband), `PhoneMonster` + `Chain` + `DopamineSpark`, props, camera/parallax `Stage`
* `src/effects/` — `VhsRewind`, `FreezeFrame`, `Glitch`, `CameraShake`, `SlowMo`, `Particles`
* `scripts/make-audio.mjs` — music + SFX synthesiser
* `STORYBOARD.md` — storyboard with alternatives, shot plan, hooks and sync points

Own music: `public/audio/music.mp3` (silences at 0:39 and 2:00 are kept). No sound: `npm run render:silent`.
`scripts/chrome-proxy.sh` is only used inside the Claude cloud sandbox (see `remotion.config.ts`).
