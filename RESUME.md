# Resume — Magic Moment v4 (PICK UP TOMORROW FROM THE OFFICE)

**Last session:** 2026-05-07 (evening, M51) — saved + pushed
**Live demo:** https://maxysadm-gh.github.io/vhc-magic-moment-demo/

---

## First thing tomorrow morning

1. **Top up Replicate** at https://replicate.com/account/billing (~$25–$50)
2. **Read the v4 plan**: `mbacio-gift-customizer/.planning/RESUME-2026-05-08.md`
   - Full audit of what was stripped over the past 2 days (logo upload, product picker, ribbon/foil/card variations, etc.)
   - The 12 cinematic concepts × 5-brand variants Max asked for
   - Budget breakdown ($50 ceiling, ~$48 spend after trim)
   - Restored UI features (logo upload via `LogoCapture.tsx`, product picker via `ProductPicker.tsx`)
3. **Greenlight or edit the 12 concepts** in the plan
4. **Then ~5 hours of render + ship** before tomorrow's presentation:
   - 12 hero cinematics (Netflix flagship across all concepts) via Kling 3.0 omni
   - 5-brand showcase of 1 winning concept
   - Restore logo upload + product picker on the demo
   - Playwright self-QA + ffmpeg per-frame audit before reporting done

## What's currently on the live demo

- **25-sec luxury cinematic hero** (commit `ef7be7c`): 5 hard cuts on the 9-PC truffle Vosges scene with NETFLIX gold-foil. Rejected by Max as "shaking, not multi-angle" — fundamental Ken Burns / Higgsfield image2video tool wall.
- **Today's 3 concept cards** (Unfurl bloom, Texture Tilt-Down, Texture Push-To-Glass — Ken Burns)
- **Yesterday's 9-variant compare** with verdict chips (green / gold / red / gray)
- **5 sample brand chip-driven scene preview** (Netflix, Apple, Microsoft, Google, Spotify)

## What's been stripped from the original v1 spec (need restoration)

- Logo upload form (file picker + drag-drop)
- Brand name + domain text input with Clearbit/Brandfetch/Logo.dev fallback
- Product picker grid (31 Vosges Shopify products)
- Ribbon/foil/marker-card variations driving the cinematic
- n8n live regeneration pipeline (currently still on dead Catbox+Higgsfield path)

## Why we kept failing for 2 days (root cause)

**Replicate has been at 402 the entire time** and I kept routing around it with Higgsfield + Ken Burns. Higgsfield is generative (truffles morph). Ken Burns is camera-on-still (looks like shaking). Real luxury car-reveal cinematics need Veo 3 / Sora 2 / Kling 3.0 omni — all on Replicate. **Top-up is the work.**

## Spend ledger

- Round 1 + 2 (yesterday): ~$19
- Round 3 (today's iterations): ~$4.50
- **Total spent: ~$23.50**
- Budget bump for tomorrow: **$30 → $50 ceiling**
- ~$48 of that earmarked for the v4 deliverable

## Repos + commits

- Demo: https://github.com/maxysadm-GH/vhc-magic-moment-demo — `main` at `ef7be7c`
- Engine: https://github.com/maxysadm-GH/mbacio-gift-customizer (private) — `main` at `d277f9b`
- v4 plan: `mbacio-gift-customizer/.planning/RESUME-2026-05-08.md`
- Concept locks: `mbacio-gift-customizer/.planning/concept-locks.json`

## Tomorrow's first command from the office

```
cd ~/Projects/mbacio-gift-customizer
git pull
cat .planning/RESUME-2026-05-08.md
```

Ready when Replicate is funded.
