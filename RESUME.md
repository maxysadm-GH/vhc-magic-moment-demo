# Resume — Magic Moment v3 (LIVE, 4-motion)

**Last session:** 2026-05-07
**Live demo:** https://maxysadm-gh.github.io/vhc-magic-moment-demo/

---

## What's LIVE right now

The demo shows a **4-motion Netflix bake-off** end-to-end:

| Stage | Asset | Cost | Status |
|---|---|---|---|
| 3 — Gemini scene-edit | `images/v3/scene-very-berry-netflix.jpg` | $0.04 | live (1.1MB JPG, every Vosges branding surface replaced with NETFLIX wordmark in 24k-gold foil emboss) |
| 5a — Higgsfield Garden Bloom | `videos/v3/bloom.mp4` | $0.56 | live |
| 5b — Higgsfield Agent Reveal | `videos/v3/reveal.mp4` | $0.56 | live |
| 5c — Higgsfield Push To Glass | `videos/v3/push-glass.mp4` | $0.56 | live |
| 5d — Higgsfield Crash Zoom In | `videos/v3/crash-zoom.mp4` | $0.56 | live |
| | **A/B/C/D bake-off total** | **$2.28** | |
| | **Production cost / customer** | **$0.60** (1 motion) | |

The page now shows the scene + a 2×2 cinematic gallery side-by-side. Footer reflects the real cost. **No fabricated numbers.**

## Reference run (this session)

- Product: `very-berry-cake-and-chocolate-tower`
- Brand: `Netflix` (NETFLIX wordmark, recognizable)
- Output dir: `mbacio-gift-customizer/.planning/variants/2026-05-07-v3/very-berry-cake-and-chocolate-tower__netflix/`
- Artifacts: `scene.jpg`, `bloom.mp4`, `reveal.mp4`, `push-glass.mp4`, `crash-zoom.mp4`, `hf-bakeoff-manifest.json`

## Run commands

Generate scene:
```
cd mbacio-gift-customizer
npx tsx scripts/scene-edit-pipeline.ts \
  --product=very-berry-cake-and-chocolate-tower \
  --brand="Netflix" \
  --logo-file=.planning/netflix-logo.png \
  --model=kling --force-video
```
(`--model=kling` is intentional — Replicate is at 402; the call fails after the
Gemini scene-edit lands `scene.jpg`. We pivot to Higgsfield for video.)

4-motion bake-off (parallel):
```
SCENE_URL=https://raw.githubusercontent.com/maxysadm-GH/vhc-magic-moment-demo/main/images/v3/scene-very-berry-netflix.jpg \
BRAND=Netflix \
npx tsx scripts/hf-bakeoff-from-scene.ts
```

Single-motion retry:
```
SHOTS_FILTER=bloom npx tsx scripts/hf-bakeoff-from-scene.ts
```

QA the live demo:
```
NODE_PATH="$(cygpath -w "$(pwd)/../mbacio-gift-customizer/node_modules")" \
  node scripts/qa-live-demo.mjs
```

## What worked / what didn't (this session)

| Attempt | Outcome |
|---|---|
| Clearbit `logo.clearbit.com/netflix.com` | DNS ENOTFOUND on Windows (transient) |
| Wikipedia thumbnail PNG | 400/429 — wikimedia thumb steps deprecated |
| icons8 `img.icons8.com/color/512/netflix.png` | 200 OK, used as logo source |
| Gemini scene-edit (Netflix wordmark) | first try, ~12s, 1.1MB JPG |
| Higgsfield Garden Bloom | timed out at 8min in parallel run; retried single-shot |
| Higgsfield Agent Reveal | 119s, 12.5MB |
| Higgsfield Push To Glass | 336s, 11.9MB |
| Higgsfield Crash Zoom In | 384s, 6.5MB |

## Spend ledger (entire project)

- Round 1 (single-shot model bake-off): $19.20 — bad outputs, deleted
- v3 reference run (History Channel, prior session): $0.60
- v3 Netflix 4-motion bake-off (this session): ~$2.28
- **Total: ~$22.08 of $30 ceiling**, ~$7.92 headroom

## Next moves

1. Wire n8n to call the live pipeline (Gemini → Higgsfield) on demo button click
2. Replace customizer's `AiHeroReveal` with the v3 pipeline
3. Generate 4 more products to populate gallery (1 per archetype × $0.60 = $2.40)
4. Top up Replicate to add Kling 3.0 omni multi-shot for true 5-cuts-in-one-call
5. Once live pipeline is wired, fold the GH Pages demo back to a single chosen motion (drop the bake-off gallery to one cinematic loop)

## Self-QA standing rule

Every web deliverable must be hit with Playwright/Puppeteer/browser-MCP before
reporting done. See `~/.claude/projects/C--Users-maxys/memory/feedback_self-qa-via-browser-control.md`.
QA script lives at `scripts/qa-live-demo.mjs`. It checks page status, scene
image dimensions, all 4 video HEAD + duration, drives the form, screenshots
the gallery, and emits a PASS/FAIL.
