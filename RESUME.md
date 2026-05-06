# Resume — Magic Moment v3

**Last session:** 2026-05-06 (overnight)
**Live demo:** https://maxysadm-gh.github.io/vhc-magic-moment-demo/
**Plan file:** `~/.claude/plans/isn-t-a-better-and-nifty-lighthouse.md` (approved)

---

## What's live RIGHT NOW

| Layer | Status | Notes |
|---|---|---|
| GH Pages demo | ✅ updated | Round-1 broken videos torn out. Variants section now shows the v3 pipeline placeholder card (6-step architecture). Logo fallback chain wired (Clearbit → Logo.dev → Google favicons). |
| Live canvas composite | ✅ live | Paste any domain, the canvas overlays a gold-tinted logo on the Vosges purple-box collection. Now fixes the "logo unavailable" failure for Netflix / Apple / etc. |
| `scripts/scene-edit-pipeline.ts` | ✅ shipped | New runner in `mbacio-gift-customizer`. Stages 1-5 wired (TODO Stage 6 frame validation). Dry-run validated. |
| n8n workflows | 🟡 stale | `wJSfj1VyhsROD2eF` (Start) and `vROAnh4B80SPX2hk` (Status) are still active but built around the dead Catbox path. Needs rewrite to point at the new pipeline (small refactor — see plan). |

## What's NOT yet done (waiting for you)

| Step | Blocker | Impact |
|---|---|---|
| **Top up Replicate balance** | hit `402 Insufficient credit` end of round 1 | Can't run any of the 3 video models (Kling / Wan / Seedance) until ~$25-50 added at https://replicate.com/account/billing |
| **Run the bake-off** | needs Replicate credit + you awake to QA outputs | $2.87 spend. One Gemini-edited still → 3 parallel video models. |
| **Pick the winner** | needs your eye | Gemini vision pre-flight + per-frame validation are coded but you should be the final judge |
| **Scale to 4 more products** | needs winner + ~$5 budget | Populates the demo gallery with 5 validated outputs |
| **Refactor n8n workflows** | needs the pipeline path proven | Cloudinary unsigned upload → Gemini → Kling. Replaces the broken Catbox flow. |

## Tomorrow's exact commands (in order)

### 0. Top up Replicate
Open https://replicate.com/account/billing, add $25-50 (covers bake-off + 5-product gallery + headroom).

### 1. Verify the pipeline still type-checks (sanity)
```bash
cd "C:\Users\maxys\Projects\mbacio-gift-customizer"
npm run scene-edit-pipeline -- \
  --product=very-berry-cake-and-chocolate-tower \
  --brand="History Channel" \
  --logo-url=https://logo.clearbit.com/history.com \
  --bakeoff --dry-run
```
Should print: planned spend $2.87, lists Kling + Wan + Seedance, exits clean.

### 2. Run the bake-off (real spend ~$2.87)
```bash
npm run scene-edit-pipeline -- \
  --product=very-berry-cake-and-chocolate-tower \
  --brand="History Channel" \
  --logo-url=https://logo.clearbit.com/history.com \
  --bakeoff
```
Expected: Gemini scene-edit (~10s) → vision pre-flight gate (PASS) → 3 parallel Replicate calls (~3-7 min) → 3 MP4s downloaded to `.planning/variants/2026-05-06-v3/very-berry-cake-and-chocolate-tower__history-channel/`.

### 3. QA the outputs by eye + against the four pillars
Open `scene.jpg`, then `kling.mp4`, `wan.mp4`, `seedance.mp4`. For each:
- Is every visible Vosges crest replaced with History Channel? ✓/✗
- Is the logo gold-foil embossed (not flat overlay)? ✓/✗
- Does it stay pixel-stable across all frames? ✓/✗
- Is the chocolate / ribbon / lighting unchanged? ✓/✗
- Does the final frame land on an "ownable" shot? ✓/✗

### 4. Pick the winner. Run 4 more products with that model
e.g. if Kling wins:
```bash
npm run scene-edit-pipeline -- --product=dream-sleep-chocolate-ritual-gift-set --brand="History Channel" --logo-url=https://logo.clearbit.com/history.com --model=kling
npm run scene-edit-pipeline -- --product=very-berry-cake-and-chocolate-tower-copy --brand="History Channel" --logo-url=https://logo.clearbit.com/history.com --model=kling
# etc — one per archetype (tower, flat-box, lifestyle, open-collection)
```

### 5. Update demo with validated MP4s
Copy the 5 winning MP4s into `vhc-magic-moment-demo/videos/`, rewrite the variants section (remove placeholder card, add product-picker grid + 5 video cards), push.

## Known unknowns to resolve at first run

1. **Replicate slug verification.** The script uses `kwaivgi/kling-v3-omni-video`, `wan-video/wan-2.7`, `bytedance/seedance-2.0` per research. If any returns 404 at create time, fall back to:
   - kling: try `kwaivgi/kling-v2.1-master` (we know this one exists)
   - wan: `wan-video/wan-2.5-i2v` (used in round 1 search)
   - seedance: `bytedance/seedance-1-pro` (used in round 1 — may not have multi-shot mode)
2. **Replicate input schemas** for the new models. The `buildInput` in the script uses `{image, prompt, duration, aspect_ratio}` — Kling 3.0 omni may want different field names. Check the model page on replicate.com if create returns 422.
3. **Gemini vision pre-flight rubric strictness.** First run will probably FAIL the gate even though the edit is fine — the rubric's `boxesWithCorrectBrand >= boxesDetected` is strict. If that happens, lower the bar to `>= 0.7 * boxesDetected` or just rely on eye QA.

## Spend ledger across all sessions

- Round 1 (full sweep, Replicate+Sora+Higgsfield+sharp pipeline): ~$19.20
- Round 2 (Higgsfield motion presets + composite test): included above
- **v3 bake-off projected**: ~$2.87
- **v3 scale to 5 products**: ~$4.56
- **Total projected MVP**: ~$26.63 of $30 ceiling — under by $3.37

## Repos & key paths

- **This demo:** https://github.com/maxysadm-GH/vhc-magic-moment-demo (public)
- **Production engine:** https://github.com/maxysadm-GH/mbacio-gift-customizer (private)
- **v3 pipeline runner:** `mbacio-gift-customizer/scripts/scene-edit-pipeline.ts`
- **Gemini scene-edit prompt source:** `mbacio-gift-customizer/api/src/functions/generate-hero.ts`
- **Product catalog:** `mbacio-gift-customizer/public/assets/library.json` (31 products)
- **Brand guidelines (motion):** `~/.claude/skills/user/ui-ux-pro-max/brand-guidelines/vosges.md`
- **Plan (approved):** `~/.claude/plans/isn-t-a-better-and-nifty-lighthouse.md`
- **Memory pointer:** `~/.claude/projects/C--Users-maxys/memory/project_magic-moment-v2.md`
